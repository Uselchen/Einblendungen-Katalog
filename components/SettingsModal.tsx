import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check, AlertCircle, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  categories,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const startEdit = (cat: string) => {
    setEditingCategory(cat);
    setEditValue(cat);
  };

  const saveEdit = () => {
    if (editingCategory && editValue.trim() && editValue !== editingCategory) {
       onRenameCategory(editingCategory, editValue.trim());
    }
    setEditingCategory(null);
    setEditValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Einstellungen</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Categories Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                <Database size={16} className="mr-2 text-primary" />
                Kategorien verwalten
            </h3>
            
            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Neue Kategorie..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button 
                    type="submit"
                    disabled={!newCategory.trim()}
                    className="bg-primary hover:bg-blue-600 text-white px-4 rounded-lg disabled:opacity-50 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                        {editingCategory === cat ? (
                             <div className="flex-1 flex items-center gap-2 mr-2">
                                <input 
                                    type="text" 
                                    value={editValue} 
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:border-primary outline-none"
                                    autoFocus
                                />
                                <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                    <Check size={16} />
                                </button>
                                <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:bg-slate-200 p-1 rounded">
                                    <X size={16} />
                                </button>
                             </div>
                        ) : (
                            <span className="text-slate-700 font-medium">{cat}</span>
                        )}
                        
                        {!editingCategory && (
                             <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => startEdit(cat)}
                                    className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => onDeleteCategory(cat)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-3 text-xs text-slate-500 flex gap-1.5">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <p>Änderungen wirken sich auf alle verknüpften Overlays aus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;