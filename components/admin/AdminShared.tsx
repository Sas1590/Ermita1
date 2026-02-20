import React, { useState, useEffect, useRef } from 'react';

// --- CURATED LIST OF ICONS FOR RESTAURANT ---
export const AVAILABLE_ICONS = [
    "mini_rhombus", // Explicit value for the small separator
    "diamond", // Big Diamond Icon (Icona gran)
    "restaurant", "restaurant_menu", "soup_kitchen", "skillet", "outdoor_grill",
    "tapas", "set_meal", "lunch_dining", "dinner_dining", "breakfast_dining",
    "brunch_dining", "ramen_dining", "bakery_dining", "egg",
    "rice_bowl", "kebab_dining", "wine_bar", "liquor", "local_bar",
    "local_cafe", "coffee", "icecream", "cake", "cookie",
    "eco", "nutrition", "local_florist", "child_care", "star",
    "favorite", "celebration", "fastfood", "local_pizza", "sports_bar",
    "water_drop", "menu_book", "checkroom", "flatware", "local_fire_department"
];

// --- VISIBILITY TOGGLE COMPONENT (SHARED) ---
export const VisibilityToggle = ({ 
    isVisible, 
    onToggle, 
    labelVisible = "VISIBLE",
    labelHidden = "OCULT",
    colorClass = "bg-green-600 border-green-600",
    offColorClass = "bg-gray-400 border-gray-400"
}: { 
    isVisible: boolean, 
    onToggle: () => void, 
    labelVisible?: string, 
    labelHidden?: string, 
    colorClass?: string, 
    offColorClass?: string 
}) => (
    <button 
        onClick={onToggle} 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm mb-6
        ${isVisible ? colorClass : offColorClass} hover:opacity-90 hover:shadow-md`}
    >
        <span className="material-symbols-outlined text-sm">
            {isVisible ? 'visibility' : 'visibility_off'}
        </span>
        {isVisible ? labelVisible : labelHidden}
    </button>
);

// --- LOGO EDITOR COMPONENT ---
export const LogoEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [imgError, setImgError] = useState(false);
    const [showCode, setShowCode] = useState(false);
    
    // Clean value to remove accidental whitespace
    const cleanValue = value ? value.trim() : "";
    const isBase64 = cleanValue.startsWith('data:');

    useEffect(() => { setImgError(false); }, [cleanValue]);

    return (
        <div className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
            {/* 1. Small Thumbnail (Dark Background) */}
            <div className="w-24 h-24 shrink-0 bg-gray-800 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative group">
                {cleanValue && !imgError ? (
                    <img 
                        src={cleanValue} 
                        alt="Preview" 
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
                                {cleanValue.substring(0, 40)}...
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
                        <span className="text-[10px] font-medium">Error al carregar la imatge. Revisa l'enllaç.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- IMAGE ARRAY EDITOR COMPONENT (DRAGGABLE) ---
export const ImageArrayEditor = ({ 
    images, 
    onChange, 
    labelPrefix = "Imatge",
    maxLimit = 10 
}: { 
    images: string[]; 
    onChange: (newImages: string[]) => void; 
    labelPrefix?: string; 
    maxLimit?: number;
}) => {
    const safeImages = Array.isArray(images) ? images : [];
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
        if (safeImages.length < maxLimit) {
            onChange([...safeImages, ""]);
        }
    };

    // --- DRAG AND DROP HANDLERS ---
    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        // Required for Firefox
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const onDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            return;
        }

        const newArr = [...safeImages];
        const itemToMove = newArr[draggedIndex];
        
        // Remove from old index
        newArr.splice(draggedIndex, 1);
        // Insert at new index
        newArr.splice(targetIndex, 0, itemToMove);
        
        onChange(newArr);
        setDraggedIndex(null);
    };

    const onDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-3">
            {safeImages.map((url, idx) => (
                <div 
                    key={idx} 
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, idx)}
                    onDragEnd={onDragEnd}
                    className={`flex gap-3 items-center bg-gray-50 p-2 pr-3 rounded-lg border border-gray-200 shadow-sm transition-all group ${
                        draggedIndex === idx ? 'opacity-40 border-dashed border-gray-400 bg-gray-100 scale-95' : 'hover:shadow-md hover:border-gray-300'
                    }`}
                >
                    {/* DRAG HANDLE */}
                    <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 self-stretch flex items-center justify-center border-r border-gray-200 pr-2">
                        <span className="material-symbols-outlined text-lg">drag_indicator</span>
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-300 flex items-center justify-center bg-white relative">
                        {url ? (
                            <img 
                                src={url.trim()} 
                                alt={`Preview ${idx}`} 
                                className="w-full h-full object-cover pointer-events-none" // Prevent image drag interfering with row drag
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
                    <div className="flex-1 space-y-1 py-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[9px] font-bold uppercase text-gray-500 tracking-wide">{labelPrefix} {idx + 1}</label>
                            <button onClick={() => handleRemove(idx)} className="text-red-300 hover:text-red-600 text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-red-50 px-2 py-0.5 rounded transition-colors opacity-50 group-hover:opacity-100">
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                        <input 
                            type="text" 
                            value={url} 
                            onChange={(e) => handleChange(idx, e.target.value)} 
                            className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white font-mono text-gray-600 placeholder-gray-300 transition-colors"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            ))}

            <button 
                onClick={handleAdd} 
                disabled={safeImages.length >= maxLimit}
                className={`w-full py-2 border-2 border-dashed rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all
                    ${safeImages.length >= maxLimit 
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50' 
                        : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer'
                    }`}
            >
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                {safeImages.length >= maxLimit ? `Màxim assolit (${maxLimit})` : 'Afegir Nova Imatge'}
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

    const renderIconVisual = (iconVal: string, sizeClass: string = "text-xl", colorClass: string = "") => {
        if (iconVal === "mini_rhombus" || !iconVal) {
            return (
                <div className="flex items-center justify-center w-6 h-6">
                    <div className={`w-2 h-2 rotate-45 bg-[#8b5a2b] ${colorClass.replace('text-', 'bg-').replace('[#8b5a2b]', 'primary')}`}></div>
                </div>
            );
        }
        return <span className={`material-symbols-outlined ${sizeClass} ${colorClass}`}>{iconVal}</span>;
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 border border-gray-300 rounded-lg p-2 hover:border-[#8b5a2b] transition-colors bg-white w-full h-10"
                title="Canviar icona"
            >
                <div className="flex items-center justify-center w-full gap-2">
                     {renderIconVisual(value, "text-xl", "text-[#8b5a2b]")}
                </div>
                <span className="material-symbols-outlined text-gray-400 text-lg absolute right-2">arrow_drop_down</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-3">
                    <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {AVAILABLE_ICONS.map((icon, idx) => (
                            <button
                                key={idx}
                                onClick={() => { onChange(icon); setIsOpen(false); }}
                                className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center transition-colors aspect-square border ${value === icon ? 'bg-[#8b5a2b]/10 border-[#8b5a2b] text-[#8b5a2b]' : 'border-transparent text-gray-600'}`}
                                title={icon === "mini_rhombus" ? "Separador Petit (Rombe)" : icon}
                            >
                                {renderIconVisual(icon, "text-xl")}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};