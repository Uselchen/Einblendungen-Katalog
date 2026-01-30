import React from 'react';
import { Overlay } from '../types';
import { MoreVertical, Heart, Tag } from 'lucide-react';

interface OverlayListItemProps {
  overlay: Overlay;
  onEdit: (overlay: Overlay) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onPreview: (overlay: Overlay) => void;
}

const OverlayListItem: React.FC<OverlayListItemProps> = ({ overlay, onEdit, onDelete, onToggleFavorite, onPreview }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div 
        onClick={() => onPreview(overlay)}
        className="group bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all flex items-center space-x-4 mb-3 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="h-16 w-28 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden">
         <img src={overlay.previewUrl} alt={overlay.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-medium text-slate-900 truncate">{overlay.title}</h4>
        <p className="text-sm text-slate-500 truncate">{overlay.description}</p>
      </div>

      {/* Meta */}
      <div className="hidden lg:flex items-center space-x-2">
         <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
            {overlay.category}
         </span>
      </div>

       <div className="hidden xl:flex items-center gap-2 max-w-[200px] overflow-hidden">
            {overlay.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                    #{tag}
                </span>
            ))}
        </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 pl-4 border-l border-slate-100">
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(overlay.id); }}
            className={`p-2 rounded-full hover:bg-slate-50 transition-colors ${overlay.isFavorite ? 'text-red-500' : 'text-slate-400'}`}
        >
            <Heart size={18} className={overlay.isFavorite ? 'fill-current' : ''} />
        </button>
        
        <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
               <>
                <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                ></div>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 text-sm">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(overlay); }}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                        Bearbeiten
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(overlay.id); }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                        Löschen
                    </button>
                </div>
               </>
            )}
        </div>
      </div>
    </div>
  );
};

export default OverlayListItem;