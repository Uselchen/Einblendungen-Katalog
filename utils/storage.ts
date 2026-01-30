import { Overlay } from '../types';
import { INITIAL_OVERLAYS } from '../constants';

const DB_NAME = 'OverlayManagerDB';
const DB_VERSION = 2; // Incremented to force upgrade/clean slate if needed
const STORE_NAME = 'overlays';
const INIT_FLAG_KEY = 'overlay-manager-db-initialized';

// Helper to open the database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
      reject('Database error: ' + (event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const storageService = {
  // Load all overlays
  getAllOverlays: async (): Promise<Overlay[]> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const result = request.result;
          
          // Check if we have initialized the DB before using LocalStorage flag
          const hasInitialized = localStorage.getItem(INIT_FLAG_KEY);

          if (!hasInitialized) {
            // First run ever: Seed with demos and mark as initialized
            console.log("Seeding database with initial data...");
            storageService.saveAllOverlays(INITIAL_OVERLAYS)
              .then(() => {
                localStorage.setItem(INIT_FLAG_KEY, 'true');
                resolve(INITIAL_OVERLAYS);
              })
              .catch(err => {
                console.error("Failed to seed initial data", err);
                resolve([]); // Return empty if seeding fails, don't crash
              });
          } else {
            // Normal run: Return what is in DB (even if empty, maybe user deleted everything)
            resolve(result || []);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Failed to load from DB", error);
      // Fallback only on critical failure
      return [];
    }
  },

  // Save a single overlay
  saveOverlay: async (overlay: Overlay): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(overlay);

      // Use transaction.oncomplete to ensure data is fully committed
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => {
          console.error("Transaction error:", transaction.error);
          reject(transaction.error);
      };
    });
  },

  // Save multiple overlays
  saveAllOverlays: async (overlays: Overlay[]): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      overlays.forEach(overlay => store.put(overlay));
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  // Delete an overlay
  deleteOverlay: async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
};