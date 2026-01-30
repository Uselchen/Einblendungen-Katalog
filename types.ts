export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}

export interface Overlay {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  previewUrl: string;
  createdAt: number;
  lastModified: number;
}

export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc';

export interface OverlayFilter {
  search: string;
  category: string; // 'ALL' or specific category name
  onlyFavorites: boolean;
}