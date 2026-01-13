import React, { useState, useEffect, useRef } from 'react';

// --- CURATED LIST OF ICONS FOR RESTAURANT ---
export const AVAILABLE_ICONS = [
    "restaurant", "restaurant_menu", "soup_kitchen", "skillet", "outdoor_grill",
    "tapas", "set_meal", "lunch_dining", "dinner_dining", "breakfast_dining",
    "brunch_dining", "ramen_dining", "pizza", "bakery_dining", "egg",
    "rice_bowl", "kebab_dining", "wine_bar", "liquor", "local_bar",
    "local_cafe", "coffee", "icecream", "cake", "cookie",
    "eco", "nutrition", "local_florist", "child_care", "star",
    "favorite", "celebration", "fastfood", "local_pizza", "sports_bar",
    "water_drop", "menu_book", "checkroom", "flatware", "local_fire_department"
];

// --- LOGO EDITOR COMPONENT ---
export const LogoEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [imgError, setImgError] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const isBase64 = value?.trim().startsWith('data:');

    useEffect(() => { setImgError(false); }, [value]);

    return (
        <div className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
            {/* 1. Small Thumbnail (Dark Background) */}
            <div className="w-24 h-24 shrink-0 bg-gray-800 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative group">
                {value && !imgError ? (
                    <img 
                        src={value} 
                        alt="Logo Preview" 
                        className="max-w-full max-h-full object-contain p-1"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <span className="material-symbols-outlined text-2xl opacity-50">
                            {imgError ? 'broken_image' : 'branding_watermark'}
                        </span>
                    </div>
                )}
            </div>

            {/* 2. Input Controls */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase text-gray-500">
                        Origen de la imatge (URL o Base64)
                    </label>
                </div>

                {isBase64 && !showCode ? (
                    <div 
                        onClick={() => setShowCode(true)}
                        className="w-full border border-orange-200 bg-orange-50/50 rounded px-3 py-2 cursor-pointer hover:bg-orange-50 transition-all flex items-center gap-3 group"
                    >
                        <div className="bg-orange-100 text-orange-600 rounded p-1 shrink-0">
                            <span className="material-symbols-outlined text-lg">data_object</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">Codi Base64 Ocult</p>
                            <p className="text-[9px] text-orange-600/70 truncate font-mono">
                                {value.substring(0, 40)}...
                            </p>
                        </div>
                        <div className="text-[10px] font-bold text-orange-500 uppercase bg-white border border-orange-100 px-2 py-0.5 rounded shadow-sm group-hover:text-orange-700 transition-colors">
                            Editar
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            rows={isBase64 ? 6 : 2}
                            className={`block w-full border rounded-lg px-3 py-2 text-xs font-mono outline-none transition-colors resize-y custom-scrollbar ${imgError ? 'border-red-300 focus:border-red-500 bg-red-50 text-red-700' : 'border-gray-300 focus:border-accent text-gray-600 bg-white'}`}
                            placeholder="Enganxa aquí la URL (https://...) o el codi Base64"
                        />
                        {isBase64 && (
                            <button 
                                onClick={() => setShowCode(false)}
                                className="absolute top-1 right-1 text-[9px] bg-gray-100 hover:bg-gray-200 border border-gray-200 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-wider transition-colors"
                            >
                                Ocultar Codi
                            </button>
                        )}
                    </div>
                )}
                
                {imgError && (
                    <div className="flex items-center gap-2 text-red-500">
                        <span className="material-symbols-outlined text-sm">error</span>
                        <span className="text-[10px] font-medium">Error al carregar la imatge.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- IMAGE ARRAY EDITOR COMPONENT ---
export const ImageArrayEditor = ({ 
    images, 
    onChange, 
    labelPrefix = "Imatge" 
}: { 
    images: string[]; 
    onChange: (newImages: string[]) => void; 
    labelPrefix?: string; 
}) => {
    const safeImages = Array.isArray(images) ? images : [];

    const handleChange = (index: number, val: string) => {
        const newArr = [...safeImages];
        newArr[index] = val;
        onChange(newArr);
    };

    const handleRemove = (index: number) => {
        const newArr = [...safeImages];
        newArr.splice(index, 1);
        onChange(newArr);
    };

    const handleAdd = () => {
        onChange([...safeImages, ""]);
    };

    return (
        <div className="space-y-3">
            {safeImages.map((url, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-gray-300 group">
                    {/* Thumbnail Preview */}
                    <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-300 flex items-center justify-center bg-white relative">
                        {url ? (
                            <img 
                                src={url} 
                                alt={`Preview ${idx}`} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const sibling = (e.target as HTMLImageElement).parentElement?.querySelector('span');
                                    if (sibling) sibling.classList.remove('hidden');
                                }} 
                            />
                        ) : null}
                        <span className={`material-symbols-outlined text-gray-400 absolute ${url ? 'hidden' : ''}`}>image</span>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold uppercase text-gray-500">{labelPrefix} {idx + 1}</label>
                            <button onClick={() => handleRemove(idx)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-red-50 px-2 py-0.5 rounded transition-colors opacity-50 group-hover:opacity-100">
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                        <input 
                            type="text" 
                            value={url} 
                            onChange={(e) => handleChange(idx, e.target.value)} 
                            className="block w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white font-mono text-gray-600 placeholder-gray-300"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            ))}

            <button 
                onClick={handleAdd} 
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 font-bold text-xs uppercase hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                Afegir Nova Imatge
            </button>
        </div>
    );
};

// --- ICON PICKER COMPONENT ---
export const IconPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1.5 hover:border-[#8b5a2b] transition-colors bg-white w-full text-left"
                title="Canviar icona"
            >
                <div className="w-6 h-6 flex items-center justify-center bg-[#8b5a2b]/10 rounded shrink-0">
                    <span className="material-symbols-outlined text-[#8b5a2b] text-lg">
                        {value || 'restaurant'}
                    </span>
                </div>
                <span className="text-xs text-gray-500 font-mono flex-1 truncate">
                    {value || 'Seleccionar'}
                </span>
                <span className="material-symbols-outlined text-gray-400 text-sm">arrow_drop_down</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-3">
                    <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {AVAILABLE_ICONS.map((icon) => (
                            <button
                                key={icon}
                                onClick={() => { onChange(icon); setIsOpen(false); }}
                                className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center transition-colors aspect-square border ${value === icon ? 'bg-[#8b5a2b]/20 border-[#8b5a2b] text-[#8b5a2b]' : 'border-transparent text-gray-600'}`}
                                title={icon}
                            >
                                <span className="material-symbols-outlined text-xl">{icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};