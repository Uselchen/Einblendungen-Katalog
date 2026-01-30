import React from 'react';
import { Overlay } from '../types';
import { X, Calendar, Tag, Folder, Heart, Clock } from 'lucide-react';

interface PreviewModalProps {
  overlay: Overlay | null;
  onClose: () => void;
  onEdit: (overlay: Overlay) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ overlay, onClose, onEdit }) => {
  if (!overlay) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button (Absolute) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Area - Full Width */}
        <div className="w-full bg-slate-100 relative group">
           {/* Aspect Ratio Container to prevent layout shifts, but allow natural height */}
           <div className="w-full flex items-center justify-center bg-slate-900">
             <img 
               src={overlay.previewUrl} 
               alt={overlay.title} 
               className="max-h-[60vh] w-auto object-contain"
             />
           </div>
        </div>

        {/* Details Area */}
        <div className="p-8 overflow-y-auto bg-white flex-1">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-md flex items-center">
                    <Folder size={12} className="mr-1.5" />
                    {overlay.category}
                  </span>
                  {overlay.isFavorite && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-500 rounded-md flex items-center">
                      <Heart size={12} className="mr-1.5 fill-current" />
                      Favorit
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{overlay.title}</h2>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg">
                {overlay.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {overlay.tags.map(tag => (
                  <span key={tag} className="flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                    <Tag size={14} className="mr-1.5 text-slate-400" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Erstellt am</span>
                    <div className="flex items-center text-slate-700">
                        <Calendar size={14} className="mr-2 text-slate-400" />
                        {new Date(overlay.createdAt).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Zuletzt bearbeitet</span>
                    <div className="flex items-center text-slate-700">
                        <Clock size={14} className="mr-2 text-slate-400" />
                        {new Date(overlay.lastModified).toLocaleDateString('de-DE')}
                    </div>
                </div>

                <hr className="border-slate-200" />

                <button 
                  onClick={() => { onClose(); onEdit(overlay); }}
                  className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors shadow-sm"
                >
                  Bearbeiten
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;