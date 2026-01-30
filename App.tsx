import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverlayCard from './components/OverlayCard';
import OverlayListItem from './components/OverlayListItem';
import Modal from './components/Modal';
import OverlayForm from './components/OverlayForm';
import SettingsModal from './components/SettingsModal';
import ConfirmDialog from './components/ConfirmDialog';
import PreviewModal from './components/PreviewModal';
import { INITIAL_CATEGORIES } from './constants';
import { Overlay, ViewMode } from './types';
import { Inbox, Loader2 } from 'lucide-react';
import { storageService } from './utils/storage';

const App: React.FC = () => {
  // -- State --

  // Overlays (Async loaded)
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Categories (Keep in localStorage as they are small text data)
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('overlay-manager-categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch (e) {
      console.error("Failed to load categories from storage:", e);
      return INITIAL_CATEGORIES;
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  
  // -- Effects --

  // 1. Initial Load of Overlays from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await storageService.getAllOverlays();
        setOverlays(data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Persist Categories to LocalStorage
  useEffect(() => {
    localStorage.setItem('overlay-manager-categories', JSON.stringify(categories));
  }, [categories]);
  
  // Filter State
  const [activeCategory, setActiveCategory] = useState<string | 'ALL'>('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingOverlay, setEditingOverlay] = useState<Overlay | undefined>(undefined);
  
  // Preview State
  const [previewOverlay, setPreviewOverlay] = useState<Overlay | null>(null);
  
  // Delete Confirmation State
  const [overlayToDelete, setOverlayToDelete] = useState<string | null>(null);

  // Computed Data
  const filteredOverlays = useMemo(() => {
    return overlays.filter(overlay => {
      // 1. Category Filter
      if (activeCategory !== 'ALL' && overlay.category !== activeCategory) return false;
      
      // 2. Favorites Filter
      if (showFavoritesOnly && !overlay.isFavorite) return false;

      // 3. Search Filter
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        return (
          overlay.title.toLowerCase().includes(lowerTerm) ||
          overlay.description.toLowerCase().includes(lowerTerm) ||
          overlay.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
        );
      }

      return true;
    });
  }, [overlays, activeCategory, showFavoritesOnly, searchTerm]);

  // Extract all unique tags for autocomplete
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    overlays.forEach(o => o.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [overlays]);

  // Handlers
  const handleAddOverlay = () => {
    setEditingOverlay(undefined);
    setIsModalOpen(true);
  };

  const handleEditOverlay = (overlay: Overlay) => {
    setEditingOverlay(overlay);
    setIsModalOpen(true);
  };

  const handlePreviewOverlay = (overlay: Overlay) => {
    setPreviewOverlay(overlay);
  };

  const handleRequestDelete = (id: string) => {
    setOverlayToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (overlayToDelete) {
      // Optimistic update
      setOverlays(prev => prev.filter(o => o.id !== overlayToDelete));
      
      // Async Delete
      await storageService.deleteOverlay(overlayToDelete);

      setOverlayToDelete(null);
      
      // Also close preview if we deleted the currently viewed overlay
      if (previewOverlay?.id === overlayToDelete) {
        setPreviewOverlay(null);
      }
    }
  };

  const handleToggleFavorite = async (id: string) => {
    // 1. Find the overlay
    const overlay = overlays.find(o => o.id === id);
    if (!overlay) return;

    // 2. Create updated object
    const updatedOverlay = { ...overlay, isFavorite: !overlay.isFavorite };

    // 3. Optimistic UI update
    setOverlays(prev => prev.map(o => o.id === id ? updatedOverlay : o));
    
    // 4. Update preview if needed
    if (previewOverlay?.id === id) {
      setPreviewOverlay(updatedOverlay);
    }

    // 5. Persist
    await storageService.saveOverlay(updatedOverlay);
  };

  const handleSaveOverlay = async (data: Partial<Overlay>) => {
    let savedOverlay: Overlay;

    if (editingOverlay) {
      // Update
      savedOverlay = { ...editingOverlay, ...data, lastModified: Date.now() } as Overlay;
      
      setOverlays(prev => prev.map(o => 
        o.id === editingOverlay.id ? savedOverlay : o
      ));

      if (previewOverlay?.id === editingOverlay.id) {
          setPreviewOverlay(savedOverlay);
      }
    } else {
      // Create
      savedOverlay = {
        id: uuidv4(),
        title: data.title || 'Neues Overlay',
        description: data.description || '',
        category: data.category || categories[0] || 'Sonstiges',
        tags: data.tags || [],
        isFavorite: data.isFavorite || false,
        previewUrl: data.previewUrl || 'https://picsum.photos/400/225',
        createdAt: Date.now(),
        lastModified: Date.now(),
      };
      setOverlays(prev => [savedOverlay, ...prev]);
    }

    // Async Save to DB
    await storageService.saveOverlay(savedOverlay);

    setIsModalOpen(false);
  };

  // Category Management Handlers
  const handleAddCategory = (name: string) => {
    setCategories(prev => [...prev, name]);
  };

  const handleDeleteCategory = (name: string) => {
    if (window.confirm(`Kategorie "${name}" wirklich löschen?`)) {
      setCategories(prev => prev.filter(c => c !== name));
      if (activeCategory === name) setActiveCategory('ALL');
    }
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    
    // Update all overlays using this category in State
    const updatedOverlays = overlays.map(o => 
      o.category === oldName ? { ...o, category: newName } : o
    );
    setOverlays(updatedOverlays);

    // Update in DB (Need to save all changed overlays)
    updatedOverlays.forEach(o => {
        if (o.category === newName) storageService.saveOverlay(o);
    });

    if (activeCategory === oldName) setActiveCategory(newName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-500 font-medium">Lade Bibliothek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeCategory={activeCategory}
        showFavoritesOnly={showFavoritesOnly}
        categories={categories}
        onSelectCategory={setActiveCategory}
        onToggleFavorites={setShowFavoritesOnly}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0">
        
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddOverlay={handleAddOverlay}
        />

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header Stats / Title */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {showFavoritesOnly ? 'Meine Favoriten' : (activeCategory === 'ALL' ? 'Alle Overlays' : activeCategory)}
              </h2>
              <p className="text-slate-500 mt-1">
                {filteredOverlays.length} {filteredOverlays.length === 1 ? 'Element' : 'Elemente'} gefunden
              </p>
            </div>
          </div>

          {/* Grid / List Content */}
          {filteredOverlays.length > 0 ? (
            <div className={viewMode === ViewMode.GRID 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "flex flex-col"
            }>
              {filteredOverlays.map(overlay => (
                viewMode === ViewMode.GRID ? (
                  <OverlayCard 
                    key={overlay.id} 
                    overlay={overlay} 
                    onEdit={handleEditOverlay}
                    onDelete={handleRequestDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onPreview={handlePreviewOverlay}
                  />
                ) : (
                  <OverlayListItem 
                    key={overlay.id} 
                    overlay={overlay} 
                    onEdit={handleEditOverlay}
                    onDelete={handleRequestDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onPreview={handlePreviewOverlay}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                 <Inbox size={48} />
              </div>
              <h3 className="text-lg font-medium text-slate-600">Keine Overlays gefunden</h3>
              <p className="max-w-xs text-center mt-2">Versuchen Sie die Suche anzupassen oder erstellen Sie ein neues Overlay.</p>
              <button onClick={handleAddOverlay} className="mt-6 text-primary hover:underline font-medium">
                Neues Overlay erstellen
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOverlay ? 'Overlay bearbeiten' : 'Neues Overlay erstellen'}
      >
        <OverlayForm 
          initialData={editingOverlay}
          categories={categories}
          availableTags={availableTags}
          onSave={handleSaveOverlay}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onRenameCategory={handleRenameCategory}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={!!overlayToDelete}
        title="Overlay löschen"
        message="Sind Sie sicher, dass Sie dieses Overlay löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        onConfirm={handleConfirmDelete}
        onCancel={() => setOverlayToDelete(null)}
      />

      {/* Preview Modal */}
      <PreviewModal 
        overlay={previewOverlay} 
        onClose={() => setPreviewOverlay(null)}
        onEdit={handleEditOverlay}
      />

    </div>
  );
};

export default App;