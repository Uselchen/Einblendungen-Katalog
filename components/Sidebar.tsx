import React from 'react';
import { 
  Layout, 
  Layers, 
  Heart, 
  Settings, 
  MonitorPlay,
} from 'lucide-react';

interface SidebarProps {
  activeCategory: string | 'ALL';
  showFavoritesOnly: boolean;
  categories: string[];
  onSelectCategory: (cat: string | 'ALL') => void;
  onToggleFavorites: (show: boolean) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  showFavoritesOnly, 
  categories,
  onSelectCategory, 
  onToggleFavorites,
  onOpenSettings
}) => {
  
  const navItemClass = (isActive: boolean) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
    ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 hover:bg-slate-100'}
  `;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-20">
      {/* Brand */}
      <div className="flex items-center space-x-2 px-6 py-6 border-b border-slate-100">
        <div className="bg-primary text-white p-2 rounded-lg">
          <Layers size={24} />
        </div>
        <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">OverlayManager</h1>
            <span className="text-xs text-primary font-medium px-1.5 py-0.5 bg-primary/10 rounded">PRO</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div 
          onClick={() => { onSelectCategory('ALL'); onToggleFavorites(false); }}
          className={navItemClass(activeCategory === 'ALL' && !showFavoritesOnly)}
        >
          <Layout size={20} />
          <span>Alle Overlays</span>
        </div>
        
        <div 
          onClick={() => { onToggleFavorites(true); }}
          className={navItemClass(showFavoritesOnly)}
        >
          <Heart size={20} className={showFavoritesOnly ? 'fill-current' : ''} />
          <span>Favoriten</span>
        </div>

        <div className="pt-6 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Kategorien
        </div>

        {categories.map((cat) => (
          <div 
            key={cat}
            onClick={() => { onSelectCategory(cat); onToggleFavorites(false); }}
            className={navItemClass(activeCategory === cat && !showFavoritesOnly)}
          >
            <MonitorPlay size={18} />
            <span>{cat}</span>
          </div>
        ))}
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-200">
        <div 
            onClick={onOpenSettings}
            className={navItemClass(false)}
        >
          <Settings size={20} />
          <span>Einstellungen</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;