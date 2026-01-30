import React from 'react';
import { Search, LayoutGrid, List, Plus, Bell } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddOverlay: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  onAddOverlay
}) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 md:ml-64">
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Suchen nach Titel, Tags..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 ml-6">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => onViewModeChange(ViewMode.GRID)}
            className={`p-2 rounded-md transition-all ${viewMode === ViewMode.GRID ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => onViewModeChange(ViewMode.LIST)}
            className={`p-2 rounded-md transition-all ${viewMode === ViewMode.LIST ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={20} />
          </button>
        </div>

        <button 
          onClick={onAddOverlay}
          className="flex items-center space-x-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Neu</span>
        </button>
      </div>
    </header>
  );
};

export default Header;