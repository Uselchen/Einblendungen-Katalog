import React, { useState, useEffect, useRef } from 'react';
import { Overlay } from '../types';
import { Sparkles, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { generateOverlayDescription, suggestTags } from '../services/geminiService';

interface OverlayFormProps {
  initialData?: Overlay;
  categories: string[];
  availableTags?: string[];
  onSave: (data: Partial<Overlay>) => void;
  onCancel: () => void;
}

const OverlayForm: React.FC<OverlayFormProps> = ({ initialData, categories, availableTags = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Overlay>>({
    title: '',
    description: '',
    category: categories[0] || 'Sonstiges',
    tags: [],
    previewUrl: 'https://picsum.photos/400/225',
    isFavorite: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          tagInputRef.current && !tagInputRef.current.contains(event.target as Node)) {
        setShowTagSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, previewUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag.trim()] }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
    tagInputRef.current?.focus();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  const handleAiGenerate = async () => {
    if (!formData.title) return;
    
    setIsGenerating(true);
    try {
        const desc = await generateOverlayDescription(formData.title!, formData.category!);
        const tags = await suggestTags(formData.title!, desc);
        
        setFormData(prev => ({
            ...prev,
            description: desc,
            tags: Array.from(new Set([...(prev.tags || []), ...tags]))
        }));
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const filteredTags = availableTags.filter(
      tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags?.includes(tag)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titel</label>
                <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="z.B. Sommerfest 2024"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategorie</label>
                <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                >
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
                </select>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vorschau</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex gap-4 items-start">
                         <div className="w-32 bg-white rounded border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm" style={{ aspectRatio: '16/9' }}>
                            {formData.previewUrl ? (
                                <img src={formData.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={20} className="text-slate-300" />
                            )}
                         </div>
                         <div className="flex-1 space-y-2">
                            <label className="flex items-center justify-center w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-primary cursor-pointer transition-colors shadow-sm">
                                <Upload size={12} className="mr-1.5" />
                                Bild hochladen
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            <input
                                type="text"
                                name="previewUrl"
                                value={formData.previewUrl}
                                onChange={handleChange}
                                placeholder="...oder URL eingeben"
                                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
             <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">Beschreibung</label>
                    <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={isGenerating || !formData.title}
                        className="text-xs flex items-center space-x-1 text-primary hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        <span>AI Autofill</span>
                    </button>
                </div>
                <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                placeholder="Beschreiben Sie den Inhalt des Overlays..."
                />
            </div>

            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-slate-300 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    {formData.tags?.map(tag => (
                        <span key={tag} className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2 py-1 rounded-md flex items-center">
                            #{tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-slate-400 hover:text-red-500">&times;</button>
                        </span>
                    ))}
                    <input 
                        ref={tagInputRef}
                        type="text"
                        value={tagInput}
                        onChange={(e) => {
                            setTagInput(e.target.value);
                            setShowTagSuggestions(true);
                        }}
                        onFocus={() => setShowTagSuggestions(true)}
                        onKeyDown={handleTagKeyDown}
                        className="bg-transparent outline-none text-sm flex-1 min-w-[60px]"
                        placeholder={formData.tags?.length === 0 ? "Tippen zum Hinzufügen..." : ""}
                    />
                </div>
                
                {/* Autocomplete Dropdown */}
                {showTagSuggestions && tagInput && filteredTags.length > 0 && (
                    <div ref={dropdownRef} className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg border border-slate-100 max-h-40 overflow-y-auto">
                        {filteredTags.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => addTag(tag)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <input 
            type="checkbox" 
            id="isFavorite" 
            name="isFavorite"
            checked={formData.isFavorite}
            onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
            className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
        />
        <label htmlFor="isFavorite" className="text-sm text-slate-700">Als Favorit markieren</label>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors"
        >
          {initialData ? 'Speichern' : 'Erstellen'}
        </button>
      </div>
    </form>
  );
};

export default OverlayForm;