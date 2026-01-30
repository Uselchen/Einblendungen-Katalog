import React from 'react';
import { Overlay } from '../types';
import { MoreVertical, Heart, Clock, Tag } from 'lucide-react';

interface OverlayCardProps {
  overlay: Overlay;
  onEdit: (overlay: Overlay) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onPreview: (overlay: Overlay) => void;
}

const OverlayCard: React.FC<OverlayCardProps> = ({ overlay, onEdit, onDelete, onToggleFavorite, onPreview }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(overlay.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowMenu(false);
      onEdit(overlay);
  };

  return (
    <div 
        onClick={() => onPreview(overlay)}
        className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative cursor-pointer ${showMenu ? 'z-30' : 'z-0'}`}
    >
      {/* Preview Image Area - 16:9 Aspect Ratio enforced */}
      <div className="relative w-full bg-slate-100 overflow-hidden rounded-t-xl" style={{ aspectRatio: '16/9' }}>
        <img 
          src={overlay.previewUrl} 
          alt={overlay.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(overlay.id); }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${overlay.isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/80 text-slate-400 hover:text-red-500'}`}
            >
                <Heart size={16} className={overlay.isFavorite ? 'fill-current' : ''} />
            </button>
        </div>
        {/* Category Badge removed from here */}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-slate-900 line-clamp-1" title={overlay.title}>{overlay.title}</h3>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className={`p-1 rounded transition-colors ${showMenu ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
               <>
                {/* Fixed backdrop to close menu on outside click */}
                <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                ></div>
                {/* Menu Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 py-1 text-sm overflow-hidden">
                    <button 
                        onClick={handleEdit}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Bearbeiten
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Löschen
                    </button>
                </div>
               </>
            )}
          </div>
        </div>

        {/* Category displayed here now */}
        <div className="mb-3">
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md uppercase tracking-wide">
             {overlay.category}
          </span>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {overlay.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap mb-4">
            {overlay.tags.slice(0, 3).map(tag => (
                <span key={tag} className="flex items-center text-[10px] uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    <Tag size={10} className="mr-1" /> {tag}
                </span>
            ))}
             {overlay.tags.length > 3 && (
                <span className="text-[10px] text-slate-400">+{overlay.tags.length - 3}</span>
            )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center text-xs text-slate-400">
          <Clock size={12} className="mr-1.5" />
          <span>Zuletzt geändert: {new Date(overlay.lastModified).toLocaleDateString('de-DE')}</span>
        </div>
      </div>
    </div>
  );
};

export default OverlayCard;