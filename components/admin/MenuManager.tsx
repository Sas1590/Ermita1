import React from 'react';
import { IconPicker } from './AdminShared';

// --- SHARED COMPONENTS ---

// 0. GENERAL INFO BLOCK (Title, Subtitle, Icon & Recommended)
const GeneralInfoEditor = ({ data, onChange, defaultTitle, defaultIcon }: { data: any, onChange: (d: any) => void, defaultTitle: string, defaultIcon: string }) => {
    const currentTitle = data.title !== undefined ? data.title : defaultTitle;
    const currentSubtitle = data.subtitle !== undefined ? data.subtitle : "";
    const currentIcon = data.icon !== undefined ? data.icon : defaultIcon;
    const isRecommended = data.recommended === true;
    
    const updateField = (field: string, val: any) => {
        onChange({ ...data, [field]: val });
    };

    return (
        <div className={`p-6 rounded shadow-sm border mb-6 transition-colors ${isRecommended ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h4 className={`font-bold flex items-center gap-2 text-sm uppercase ${isRecommended ? 'text-amber-800' : 'text-gray-700'}`}>
                    <span className="material-symbols-outlined text-primary">article</span> Info General
                </h4>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => updateField('recommended', !isRecommended)}
                        className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border transition-all flex items-center gap-1
                            ${isRecommended 
                                ? 'bg-amber-500 text-white border-amber-600 shadow-md transform scale-105' 
                                : 'bg-white text-gray-400 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm">{isRecommended ? 'star' : 'star_outline'}</span>
                        {isRecommended ? 'Recomanat' : 'Normal'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Menú</label>
                    <input 
                        value={currentTitle} 
                        onChange={(e) => updateField('title', e.target.value)} 
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary font-bold text-gray-800" 
                        placeholder="Ex: Carta" 
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol (Opcional)</label>
                    <input 
                        value={currentSubtitle} 
                        onChange={(e) => updateField('subtitle', e.target.value)} 
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-gray-600" 
                        placeholder="Ex: De Dimarts a Divendres" 
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Icona</label>
                <div className="w-full md:w-40">
                    <IconPicker 
                        value={currentIcon} 
                        onChange={(val) => updateField('icon', val)}
                    />
                </div>
            </div>
        </div>
    );
};

// 1. PRICE HEADER EDITOR (Preu i IVA)
const PriceHeaderEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    const showPrice = data.showPrice !== undefined ? data.showPrice : (!!data.price);

    const updateField = (field: string, val: any) => {
        onChange({ ...data, [field]: val });
    };

    return (
        <div className={`bg-emerald-50 p-6 rounded shadow-sm border ${showPrice ? 'border-emerald-200' : 'border-gray-200 bg-gray-50 opacity-60'} mb-6`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-emerald-800 flex items-center gap-2 text-sm uppercase">
                    <span className="material-symbols-outlined">payments</span> Preu Global i Condicions
                </h4>
                <button 
                    onClick={() => updateField('showPrice', !showPrice)}
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${showPrice ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-400 border-gray-300'}`}
                >
                    {showPrice ? 'Visible' : 'Ocult'}
                </button>
            </div>
            {showPrice && (
                <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Preu del Menú</label>
                        <input value={data.price || ''} onChange={(e) => updateField('price', e.target.value)} className="block w-full border border-emerald-200 rounded px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white" placeholder="Ex: 35€" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">Text IVA / Impostos</label>
                        <input value={data.vat || ''} onChange={(e) => updateField('vat', e.target.value)} className="block w-full border border-emerald-200 rounded px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white" placeholder="Ex: IVA INCLÒS" />
                    </div>
                </div>
            )}
        </div>
    );
};

// 2. INFO BLOCK EDITOR (Intro i Al·lèrgens)
const InfoBlockEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    const showInfo = data.showInfo !== undefined ? data.showInfo : (!!data.infoIntro || !!data.infoAllergy);

    const updateField = (field: string, val: any) => {
        onChange({ ...data, [field]: val });
    };

    return (
        <div className={`bg-blue-50 p-6 rounded shadow-sm border ${showInfo ? 'border-blue-200' : 'border-gray-200 bg-gray-50 opacity-60'} mb-6`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 text-sm uppercase">
                    <span className="material-symbols-outlined">info</span> Informació i Al·lèrgens
                </h4>
                <button 
                    onClick={() => updateField('showInfo', !showInfo)}
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${showInfo ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-300'}`}
                >
                    {showInfo ? 'Visible' : 'Ocult'}
                </button>
            </div>
            {showInfo && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-blue-400 mb-1">Text Introducció (Inclou...)</label>
                        <textarea value={data.infoIntro || ''} onChange={(e) => updateField('infoIntro', e.target.value)} rows={2} className="block w-full border border-blue-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" placeholder="Ex: El menú inclou primer, segon, postres..." />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-blue-400 mb-1">Text Al·lèrgens</label>
                        <textarea value={data.infoAllergy || ''} onChange={(e) => updateField('infoAllergy', e.target.value)} rows={2} className="block w-full border border-blue-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white" placeholder="Ex: Si tens alguna al·lèrgia, informa'ns." />
                    </div>
                </div>
            )}
        </div>
    );
};

// --- HELPER FOR ITEM STATUS CONTROLS (NEW ICON BUTTONS) ---
const ItemStatusControls = ({ visible, strikethrough, onToggleVisible, onToggleStrike }: { 
    visible?: boolean; 
    strikethrough?: boolean; 
    onToggleVisible: () => void;
    onToggleStrike: () => void;
}) => {
    // Default to true if undefined
    const isVisible = visible !== false; 
    const isStruck = !!strikethrough;

    return (
        <div className="flex items-center gap-1.5 mr-2">
            <button 
                onClick={onToggleStrike}
                className={`w-6 h-6 flex items-center justify-center rounded transition-all border ${isStruck ? 'bg-gray-700 text-white border-gray-700' : 'bg-white text-gray-300 border-gray-200 hover:border-gray-400 hover:text-gray-500'}`}
                title={isStruck ? "Destachar" : "Tachar (Esgotat)"}
            >
                <span className="material-symbols-outlined text-[14px]">strikethrough_s</span>
            </button>
            <button 
                onClick={onToggleVisible}
                className={`w-6 h-6 flex items-center justify-center rounded transition-all border ${isVisible ? 'bg-white text-green-500 border-gray-200 hover:border-green-400 hover:bg-green-50' : 'bg-red-50 text-red-400 border-red-200'}`}
                title={isVisible ? "Visible" : "Ocult"}
            >
                <span className="material-symbols-outlined text-[14px]">{isVisible ? 'visibility' : 'visibility_off'}</span>
            </button>
        </div>
    );
};

const FoodEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    // Normalizar datos: Si es array (formato antiguo), lo convertimos a objeto con secciones.
    const isLegacy = Array.isArray(data);
    
    // Construct valid object structure
    const sections = isLegacy ? data : (data?.sections || []);
    const title = isLegacy ? "Carta de Menjar" : (data?.title || "Carta de Menjar");
    const icon = isLegacy ? "restaurant_menu" : (data?.icon || "restaurant_menu");
    const subtitle = isLegacy ? "" : (data?.subtitle || "");
    const recommended = isLegacy ? false : (data?.recommended || false);
    const disclaimer = isLegacy ? "" : (data?.disclaimer || "");
    const showDisclaimer = isLegacy ? true : (data?.showDisclaimer !== false);

    // Merge existing data with structure
    const currentData = isLegacy ? { title, subtitle, icon, recommended, sections, disclaimer, showDisclaimer } : data;

    const updateData = (newData: any) => {
        onChange({ ...currentData, ...newData });
    };

    const handleSectionChange = (idx: number, field: string, val: string) => {
        const newSections = sections.map((section: any, i: number) => 
            i === idx ? { ...section, [field]: val } : section
        );
        updateData({ sections: newSections });
    };
    
    const handleItemChange = (sIdx: number, iIdx: number, field: string, val: any) => {
        const newSections = sections.map((section: any, i: number) => {
            if (i !== sIdx) return section;
            const newItems = (section.items || []).map((item: any, j: number) => 
                j === iIdx ? { ...item, [field]: val } : item
            );
            return { ...section, items: newItems };
        });
        updateData({ sections: newSections });
    };
    const addSection = () => updateData({ sections: [...sections, { id: `sec_${Date.now()}`, category: "NOVA SECCIÓ", icon: "restaurant", items: [] }] });
    const removeSection = (idx: number) => {
        const newSections = [...sections];
        newSections.splice(idx, 1);
        updateData({ sections: newSections });
    };
    const addItem = (sIdx: number) => {
        const newSections = sections.map((section: any, i: number) => {
            if (i !== sIdx) return section;
            return { ...section, items: [...(section.items || []), { nameCa: "", nameEs: "", price: "" }] };
        });
        updateData({ sections: newSections });
    };
    const removeItem = (sIdx: number, iIdx: number) => {
        const newSections = sections.map((section: any, i: number) => {
            if (i !== sIdx) return section;
            const newItems = [...(section.items || [])];
            newItems.splice(iIdx, 1);
            return { ...section, items: newItems };
        });
        updateData({ sections: newSections });
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <GeneralInfoEditor 
                data={currentData} 
                onChange={updateData} 
                defaultTitle="Carta de Menjar" 
                defaultIcon="restaurant_menu" 
            />

            <div className="flex justify-end mb-4">
                <button onClick={addSection} className="bg-[#8b5a2b] text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-[#6b4521] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span> Nova Secció
                </button>
            </div>
            
            <PriceHeaderEditor data={currentData} onChange={updateData} />
            <InfoBlockEditor data={currentData} onChange={updateData} />

            {sections.map((section: any, sIdx: number) => (
                <div key={sIdx} className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-gray-100 pb-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Secció</label>
                            <input type="text" value={section.category} onChange={(e) => handleSectionChange(sIdx, 'category', e.target.value)} className="font-serif text-lg font-bold text-[#8b5a2b] border-b border-transparent focus:border-[#8b5a2b] outline-none bg-transparent w-full" />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Icona</label>
                            <IconPicker 
                                value={section.icon || ""} 
                                onChange={(val) => handleSectionChange(sIdx, 'icon', val)}
                            />
                        </div>
                        <button onClick={() => removeSection(sIdx)} className="text-red-400 hover:text-red-600"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                    <div className="space-y-3 pl-0 md:pl-4 border-l-2 border-gray-100">
                        {(section.items || []).map((item: any, iIdx: number) => (
                            <div key={iIdx} className={`grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded ${item.visible === false ? 'opacity-50 grayscale' : ''}`}>
                                {/* ACTION COLUMN */}
                                <div className="md:col-span-2 flex justify-start">
                                    <ItemStatusControls 
                                        visible={item.visible}
                                        strikethrough={item.strikethrough}
                                        onToggleVisible={() => handleItemChange(sIdx, iIdx, 'visible', item.visible === false ? true : false)}
                                        onToggleStrike={() => handleItemChange(sIdx, iIdx, 'strikethrough', !item.strikethrough)}
                                    />
                                </div>
                                <div className="md:col-span-4"><input type="text" value={item.nameCa} onChange={(e) => handleItemChange(sIdx, iIdx, 'nameCa', e.target.value)} className={`w-full bg-transparent border-b border-gray-300 outline-none text-sm font-bold ${item.strikethrough ? 'line-through text-gray-400' : ''}`} placeholder="Nom Català" /></div>
                                <div className="md:col-span-4"><input type="text" value={item.nameEs} onChange={(e) => handleItemChange(sIdx, iIdx, 'nameEs', e.target.value)} className={`w-full bg-transparent border-b border-gray-300 outline-none text-sm text-gray-600 font-hand ${item.strikethrough ? 'line-through' : ''}`} placeholder="Nom Castellà" /></div>
                                <div className="md:col-span-1"><input type="text" value={item.price} onChange={(e) => handleItemChange(sIdx, iIdx, 'price', e.target.value)} className="w-full bg-transparent border-b border-gray-300 outline-none text-sm font-mono text-right" placeholder="€" /></div>
                                <div className="md:col-span-1 flex justify-center"><button onClick={() => removeItem(sIdx, iIdx)} className="text-red-300 hover:text-red-500"><span className="material-symbols-outlined text-lg">remove_circle</span></button></div>
                            </div>
                        ))}
                        <button onClick={() => addItem(sIdx)} className="mt-2 text-xs font-bold text-[#8b5a2b] flex items-center gap-1 uppercase tracking-wider"><span className="material-symbols-outlined text-sm">add_circle</span> Afegir Plat</button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nota al peu (opcional)</label>
                        <input type="text" value={section.footer || ''} onChange={(e) => handleSectionChange(sIdx, 'footer', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none" />
                    </div>
                </div>
            ))}

            <div className={`bg-red-50 p-6 rounded shadow-sm border ${showDisclaimer ? 'border-red-200' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase">
                        <span className="material-symbols-outlined">info</span> Info Final / Disclaimer
                    </h4>
                    <button 
                        onClick={() => updateData({ showDisclaimer: !showDisclaimer })}
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${showDisclaimer ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-300'}`}
                    >
                        {showDisclaimer ? 'Visible' : 'Ocult'}
                    </button>
                </div>
                {showDisclaimer && (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-red-400 mb-1">Text informatiu al final de la carta</label>
                        <input 
                            type="text" 
                            value={disclaimer} 
                            onChange={(e) => updateData({ disclaimer: e.target.value })}
                            className="block w-full border border-red-200 bg-white rounded px-3 py-2 text-sm text-red-600 focus:border-red-400 outline-none"
                            placeholder="Ex: Qualsevol beguda no inclosa es cobrarà a part."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const WineEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    const isLegacy = Array.isArray(data);
    const categories = isLegacy ? data : (data?.categories || data || []); 
    const title = isLegacy ? "Carta de Vins" : (data?.title || "Carta de Vins");
    const icon = isLegacy ? "wine_bar" : (data?.icon || "wine_bar");
    const subtitle = isLegacy ? "" : (data?.subtitle || "");
    const recommended = isLegacy ? false : (data?.recommended || false);
    const disclaimer = isLegacy ? "" : (data?.disclaimer || "");
    const showDisclaimer = isLegacy ? true : (data?.showDisclaimer !== false);

    const currentData = isLegacy ? { title, subtitle, icon, recommended, categories, disclaimer, showDisclaimer } : data;

    const updateData = (newData: any) => {
        onChange({ ...currentData, ...newData });
    };

    const handleCategoryChange = (idx: number, field: string, val: string) => {
        const newCats = categories.map((cat:any, i:number) => i === idx ? {...cat, [field]: val} : cat);
        updateData({ categories: newCats });
    };
    const addCategory = () => updateData({ categories: [...categories, {category:"NOVA", icon: "wine_bar", groups:[]}] });
    const removeCategory = (idx: number) => { 
        const n=[...categories]; n.splice(idx,1); 
        updateData({ categories: n }); 
    };
    
    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <GeneralInfoEditor 
                data={currentData} 
                onChange={updateData} 
                defaultTitle="Carta de Vins" 
                defaultIcon="wine_bar" 
            />

            <div className="flex justify-end"><button onClick={addCategory} className="bg-olive text-white px-3 py-2 rounded text-xs font-bold uppercase">Nova Categoria</button></div>
            
            <PriceHeaderEditor data={currentData} onChange={updateData} />
            <InfoBlockEditor data={currentData} onChange={updateData} />

            {categories.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="bg-white border border-gray-200 rounded p-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4 border-b pb-4">
                        <div className="flex-1">
                            <input value={cat.category} onChange={(e) => handleCategoryChange(cIdx, 'category', e.target.value)} className="font-bold text-xl outline-none w-full" placeholder="Nom Categoria" />
                        </div>
                        <div className="w-full md:w-32">
                            <IconPicker 
                                value={cat.icon || ""} 
                                onChange={(val) => handleCategoryChange(cIdx, 'icon', val)}
                            />
                        </div>
                        <button onClick={() => removeCategory(cIdx)} className="text-red-400"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                    <div className="pl-4 space-y-4">
                        {(cat.groups || []).map((grp:any,gIdx:number)=>(
                            <div key={gIdx} className="border-l-4 border-gray-200 pl-2">
                                <div className="flex justify-between mb-2">
                                    <input value={grp.sub} onChange={(e)=>{
                                        const newCat = {...cat};
                                        newCat.groups = (cat.groups || []).map((g:any, gi:number) => gi === gIdx ? {...g, sub: e.target.value} : g);
                                        const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                        updateData({ categories: newCats });
                                    }} placeholder="Subgrup (ex: D.O. Terra Alta)" className="italic w-full outline-none" />
                                    <button onClick={()=>{
                                        const newCat = {...cat};
                                        newCat.groups = [...(cat.groups || [])];
                                        newCat.groups.splice(gIdx,1);
                                        const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                        updateData({ categories: newCats });
                                    }} className="text-red-300"><span className="material-symbols-outlined text-sm">remove_circle</span></button>
                                </div>
                                {(grp.items || []).map((it:any,iIdx:number)=>(
                                    <div key={iIdx} className={`flex gap-2 mb-2 items-center ${it.visible === false ? 'opacity-50 grayscale' : ''}`}>
                                        <ItemStatusControls 
                                            visible={it.visible}
                                            strikethrough={it.strikethrough}
                                            onToggleVisible={() => {
                                                const newCat = {...cat};
                                                const newGroups = [...(cat.groups || [])];
                                                const newItems = [...(newGroups[gIdx].items || [])];
                                                newItems[iIdx] = {...newItems[iIdx], visible: it.visible === false ? true : false};
                                                newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                                newCat.groups = newGroups;
                                                const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                                updateData({ categories: newCats });
                                            }}
                                            onToggleStrike={() => {
                                                const newCat = {...cat};
                                                const newGroups = [...(cat.groups || [])];
                                                const newItems = [...(newGroups[gIdx].items || [])];
                                                newItems[iIdx] = {...newItems[iIdx], strikethrough: !it.strikethrough};
                                                newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                                newCat.groups = newGroups;
                                                const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                                updateData({ categories: newCats });
                                            }}
                                        />
                                        <input value={it.name} onChange={(e)=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems[iIdx] = {...newItems[iIdx], name: e.target.value};
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            updateData({ categories: newCats });
                                        }} className={`w-1/3 border-b text-sm ${it.strikethrough ? 'line-through text-gray-400' : ''}`} placeholder="Nom" />
                                        <input value={it.desc} onChange={(e)=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems[iIdx] = {...newItems[iIdx], desc: e.target.value};
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            updateData({ categories: newCats });
                                        }} className="w-1/3 border-b text-xs text-gray-500" placeholder="Desc" />
                                        <input value={it.price} onChange={(e)=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems[iIdx] = {...newItems[iIdx], price: e.target.value};
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            updateData({ categories: newCats });
                                        }} className="w-1/6 border-b text-right text-sm" placeholder="€" />
                                        <button onClick={()=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems.splice(iIdx, 1);
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            updateData({ categories: newCats });
                                        }} className="text-red-200"><span className="material-symbols-outlined text-sm">close</span></button>
                                    </div>
                                ))}
                                <button onClick={()=>{
                                    const newCat = {...cat};
                                    const newGroups = [...(cat.groups || [])];
                                    const newItems = [...(newGroups[gIdx].items || []), {name:"",desc:"",price:""}];
                                    newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                    newCat.groups = newGroups;
                                    const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                    updateData({ categories: newCats });
                                }} className="text-xs text-olive font-bold">+ Vi</button>
                            </div>
                        ))}
                        <button onClick={()=>{
                            const newCat = {...cat};
                            newCat.groups = [...(cat.groups || []), {sub:"",items:[]}];
                            const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                            updateData({ categories: newCats });
                        }} className="text-xs font-bold mt-2">+ Grup</button>
                    </div>
                </div>
            ))}

            <div className={`bg-red-50 p-6 rounded shadow-sm border ${showDisclaimer ? 'border-red-200' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase">
                        <span className="material-symbols-outlined">info</span> Info Final / Disclaimer
                    </h4>
                    <button 
                        onClick={() => updateData({ showDisclaimer: !showDisclaimer })}
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${showDisclaimer ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-300'}`}
                    >
                        {showDisclaimer ? 'Visible' : 'Ocult'}
                    </button>
                </div>
                {showDisclaimer && (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-red-400 mb-1">Text informatiu al final de la carta</label>
                        <input 
                            type="text" 
                            value={disclaimer} 
                            onChange={(e) => updateData({ disclaimer: e.target.value })}
                            className="block w-full border border-red-200 bg-white rounded px-3 py-2 text-sm text-red-600 focus:border-red-400 outline-none"
                            placeholder="Ex: I.V.A. Inclòs. Consulteu al·lèrgens."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const GroupEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    if (!data) return <div>Carregant editor...</div>;

    const showDisclaimer = data.showDisclaimer !== false; // Default true

    const updateField = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* GENERAL INFO EDITOR (Title, Subtitle, Icon, Recommended) */}
            <GeneralInfoEditor 
                data={data} 
                onChange={(newData) => onChange({...data, ...newData})} 
                defaultTitle="Menú de Grup" 
                defaultIcon="diversity_3" 
            />
            
            {/* SEPARATED PRICE & INFO EDITORS - Handles Price, VAT, Intro, Allergies */}
            <PriceHeaderEditor data={data} onChange={(newData) => onChange({...data, ...newData})} />
            <InfoBlockEditor data={data} onChange={(newData) => onChange({...data, ...newData})} />

            {(data.sections || []).map((sec:any,sIdx:number)=>(
                <div key={sIdx} className="bg-white p-6 rounded shadow border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 mb-4 border-b pb-4">
                        <div className="flex-1">
                            <input value={sec.title} onChange={(e)=>{
                                const newSections = (data.sections || []).map((s:any, si:number) => si === sIdx ? {...s, title: e.target.value} : s);
                                updateField('sections', newSections);
                            }} className="font-bold outline-none text-lg text-olive w-full" placeholder="Títol Secció" />
                        </div>
                        <div className="w-full md:w-32">
                            <IconPicker 
                                value={sec.icon || ""} 
                                onChange={(val) => {
                                    const newSections = (data.sections || []).map((s:any, si:number) => si === sIdx ? {...s, icon: val} : s);
                                    updateField('sections', newSections);
                                }}
                            />
                        </div>
                        <button onClick={()=>{
                            const newSections = [...(data.sections || [])];
                            newSections.splice(sIdx, 1);
                            updateField('sections', newSections);
                        }} className="text-red-400"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                    <div className="space-y-2">
                        {(sec.items || []).map((it:any,iIdx:number)=>(
                            <div key={iIdx} className={`flex gap-2 items-center bg-gray-50 p-2 rounded ${it.visible === false ? 'opacity-50 grayscale' : ''}`}>
                                <ItemStatusControls 
                                    visible={it.visible}
                                    strikethrough={it.strikethrough}
                                    onToggleVisible={() => {
                                        const newSections = [...(data.sections || [])];
                                        const newItems = [...(newSections[sIdx].items || [])];
                                        newItems[iIdx] = {...newItems[iIdx], visible: it.visible === false ? true : false};
                                        newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                        updateField('sections', newSections);
                                    }}
                                    onToggleStrike={() => {
                                        const newSections = [...(data.sections || [])];
                                        const newItems = [...(newSections[sIdx].items || [])];
                                        newItems[iIdx] = {...newItems[iIdx], strikethrough: !it.strikethrough};
                                        newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                        updateField('sections', newSections);
                                    }}
                                />
                                <input value={it.nameCa} onChange={(e)=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems[iIdx] = {...newItems[iIdx], nameCa: e.target.value};
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    updateField('sections', newSections);
                                }} className={`w-1/2 bg-transparent border-b text-sm font-bold ${it.strikethrough ? 'line-through text-gray-400' : ''}`} placeholder="Plat (Català)" />
                                <input value={it.nameEs} onChange={(e)=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems[iIdx] = {...newItems[iIdx], nameEs: e.target.value};
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    updateField('sections', newSections);
                                }} className={`w-1/2 bg-transparent border-b text-sm text-gray-500 ${it.strikethrough ? 'line-through' : ''}`} placeholder="Plato (Castellano)" />
                                <button onClick={()=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems.splice(iIdx, 1);
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    updateField('sections', newSections);
                                }} className="text-red-300"><span className="material-symbols-outlined text-sm">remove_circle</span></button>
                            </div>
                        ))}
                        <button onClick={()=>{
                            const newSections = [...(data.sections || [])];
                            const newItems = [...(newSections[sIdx].items || []), {nameCa:"",nameEs:""}];
                            newSections[sIdx] = {...newSections[sIdx], items: newItems};
                            updateField('sections', newSections);
                        }} className="text-xs font-bold text-olive flex items-center gap-1 mt-2"><span className="material-symbols-outlined text-sm">add</span> Afegir Plat</button>
                    </div>
                </div>
            ))}
            <button onClick={()=>{
                const newSections = [...(data.sections || []), {title:"NOVA SECCIÓ", icon:"restaurant", items:[]}];
                updateField('sections', newSections);
            }} className="bg-olive text-white px-4 py-2 rounded text-xs font-bold w-full">NOVA SECCIÓ DE PLATS</button>

            <div className={`bg-red-50 p-6 rounded shadow-sm border ${showDisclaimer ? 'border-red-200' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase">
                        <span className="material-symbols-outlined">info</span> Info Final / Disclaimer
                    </h4>
                    <button 
                        onClick={() => updateField('showDisclaimer', !showDisclaimer)}
                        className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${showDisclaimer ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-400 border-gray-300'}`}
                    >
                        {showDisclaimer ? 'Visible' : 'Ocult'}
                    </button>
                </div>
                {showDisclaimer && (
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-red-400 mb-1">Text informatiu al final de la carta</label>
                        <input 
                            type="text" 
                            value={data.disclaimer || ''} 
                            onChange={(e) => updateField('disclaimer', e.target.value)}
                            className="block w-full border border-red-200 bg-white rounded px-3 py-2 text-sm text-red-600 focus:border-red-400 outline-none"
                            placeholder="Ex: Qualsevol beguda no inclosa es cobrarà a part."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export const MenuManager = ({
    localConfig,
    setLocalConfig,
    menuViewState,
    setMenuViewState,
    editingMenuId,
    setEditingMenuId,
    onDeleteCard
}: {
    localConfig: any;
    setLocalConfig: (config: any) => void;
    menuViewState: 'dashboard' | 'type_selection' | 'editor';
    setMenuViewState: (state: 'dashboard' | 'type_selection' | 'editor') => void;
    editingMenuId: string | null;
    setEditingMenuId: (id: string | null) => void;
    onDeleteCard: (id: string) => void;
}) => {

    const MENU_CARDS = [
        { id: 'daily', title: localConfig.dailyMenu?.title || 'Menú Diari', icon: localConfig.dailyMenu?.icon || 'lunch_dining', type: 'daily', visible: localConfig.dailyMenu?.visible !== false },
        { id: 'food', title: localConfig.foodMenu?.title || 'Carta de Menjar', icon: localConfig.foodMenu?.icon || 'restaurant_menu', type: 'food', visible: localConfig.foodMenu?.visible !== false },
        { id: 'wine', title: localConfig.wineMenu?.title || 'Carta de Vins', icon: localConfig.wineMenu?.icon || 'wine_bar', type: 'wine', visible: localConfig.wineMenu?.visible !== false },
        { id: 'group', title: localConfig.groupMenu?.title || 'Menú de Grup', icon: localConfig.groupMenu?.icon || 'diversity_3', type: 'group', visible: localConfig.groupMenu?.visible !== false },
    ];

    const EXTRA_CARDS = (localConfig.extraMenus || []).map((extra: any, idx: number) => ({
        id: `extra_${idx}`,
        title: extra.title || extra.data?.title || 'Menú Extra',
        icon: extra.icon || extra.data?.icon || 'restaurant',
        type: extra.type,
        visible: extra.visible !== false
    }));

    // UPDATED: Allow passing custom title/icon defaults
    const handleCreateMenu = (type: 'food' | 'wine' | 'group', customDefaults?: { title: string, icon: string }) => {
        const defaultTitle = type === 'food' ? 'Nova Carta' : type === 'wine' ? 'Nova Carta Vins' : 'Nou Menú';
        const defaultIcon = type === 'food' ? 'restaurant' : type === 'wine' ? 'wine_bar' : 'diversity_3';
        
        const title = customDefaults?.title || defaultTitle;
        const icon = customDefaults?.icon || defaultIcon;

        const newExtra = {
            id: `extra_${Date.now()}`,
            type: type,
            title: title,
            icon: icon,
            visible: true,
            data: {
                title: title,
                icon: icon,
                // Initialize with minimal structure
                ...(type === 'food' ? { sections: [] } : type === 'wine' ? { categories: [] } : { sections: [], drinks: [], price: '', vat: '' })
            }
        };
        
        setLocalConfig((prev: any) => ({
            ...prev,
            extraMenus: [...(prev.extraMenus || []), newExtra]
        }));

        setEditingMenuId(`extra_${(localConfig.extraMenus || []).length}`); // Index of the new item
        setMenuViewState('editor');
    };

    const handleToggleVisibility = (id: string, currentVisible: boolean) => {
        if (id.startsWith('extra_')) {
            const idx = parseInt(id.replace('extra_', ''));
            const newExtras = [...(localConfig.extraMenus || [])];
            newExtras[idx] = { ...newExtras[idx], visible: !currentVisible };
            setLocalConfig((prev: any) => ({ ...prev, extraMenus: newExtras }));
        } else {
            // Core menus
            const keyMap: any = { daily: 'dailyMenu', food: 'foodMenu', wine: 'wineMenu', group: 'groupMenu' };
            const key = keyMap[id];
            setLocalConfig((prev: any) => ({
                ...prev,
                [key]: { ...prev[key], visible: !currentVisible }
            }));
        }
    };

    // --- RENDER DASHBOARD ---
    if (menuViewState === 'dashboard') {
        return (
            <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">restaurant</span> Gestió de Menús
                        </h3>
                        <p className="text-gray-500 text-sm">Organitza les cartes i menús del restaurant.</p>
                    </div>
                    {/* UPDATED BUTTON: GREEN AND MORE VISIBLE */}
                    <button 
                        onClick={() => setMenuViewState('type_selection')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span> AFEGEIX NOVES CARTES
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* CORE MENUS */}
                    {MENU_CARDS.map(card => (
                        <div key={card.id} className={`bg-white rounded-lg p-6 shadow-sm border transition-all relative group ${!card.visible ? 'border-gray-200 opacity-60 grayscale' : 'border-primary/20 hover:shadow-md'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm ${!card.visible ? 'bg-gray-400' : 'bg-gradient-to-br from-[#8b5a2b] to-[#5d3a1a]'}`}>
                                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleToggleVisibility(card.id, card.visible)}
                                        className={`p-1.5 rounded-full border transition-colors ${card.visible ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                                        title={card.visible ? "Visible" : "Ocult"}
                                    >
                                        <span className="material-symbols-outlined text-lg">{card.visible ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                </div>
                            </div>
                            <h4 className="font-serif text-xl font-bold text-gray-800 mb-1">{card.title}</h4>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Menú Principal (Fix)</p>
                            
                            <button 
                                onClick={() => { setEditingMenuId(card.id); setMenuViewState('editor'); }}
                                className="w-full py-2 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span> Editar Contingut
                            </button>
                        </div>
                    ))}

                    {/* EXTRA MENUS */}
                    {EXTRA_CARDS.map((card: any, idx: number) => (
                        <div key={card.id} className={`bg-white rounded-lg p-6 shadow-sm border transition-all relative group ${!card.visible ? 'border-gray-200 opacity-60 grayscale' : 'border-blue-200 hover:shadow-md'}`}>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onDeleteCard(card.id)} className="text-red-300 hover:text-red-500 p-1 hover:bg-red-50 rounded"><span className="material-symbols-outlined">delete</span></button>
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm ${!card.visible ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                                </div>
                                <div className="flex gap-2 mr-6">
                                    <button 
                                        onClick={() => handleToggleVisibility(card.id, card.visible)}
                                        className={`p-1.5 rounded-full border transition-colors ${card.visible ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                                        title={card.visible ? "Visible" : "Ocult"}
                                    >
                                        <span className="material-symbols-outlined text-lg">{card.visible ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                </div>
                            </div>
                            <h4 className="font-serif text-xl font-bold text-gray-800 mb-1">{card.title}</h4>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-6">Personalitzat ({card.type})</p>
                            
                            <button 
                                onClick={() => { setEditingMenuId(card.id); setMenuViewState('editor'); }}
                                className="w-full py-2 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span> Editar Contingut
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- RENDER TYPE SELECTION ---
    if (menuViewState === 'type_selection') {
        return (
            <div className="animate-[fadeIn_0.3s_ease-out] max-w-5xl mx-auto">
                 <button onClick={() => setMenuViewState('dashboard')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-xs uppercase tracking-wider transition-colors"><span className="material-symbols-outlined text-lg">arrow_back</span> Tornar</button>
                 <h3 className="font-serif text-3xl font-bold text-gray-800 mb-8 text-center">Quin tipus de menú vols crear?</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <button onClick={() => handleCreateMenu('food')} className="bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group text-center flex flex-col items-center">
                         <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-3xl">restaurant_menu</span></div>
                         <h4 className="font-serif text-lg font-bold text-gray-800 mb-2">Carta de Menjar</h4>
                         <p className="text-xs text-gray-500">Tapes, entrants, principals...</p>
                     </button>
                     <button onClick={() => handleCreateMenu('wine')} className="bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group text-center flex flex-col items-center">
                         <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-3xl">wine_bar</span></div>
                         <h4 className="font-serif text-lg font-bold text-gray-800 mb-2">Carta de Vins</h4>
                         <p className="text-xs text-gray-500">Negres, Blancs, D.O...</p>
                     </button>
                     {/* ADDED: SPECIAL DAILY MENU BUTTON */}
                     <button onClick={() => handleCreateMenu('group', { title: 'Menú Diari', icon: 'lunch_dining' })} className="bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group text-center flex flex-col items-center">
                         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-3xl">lunch_dining</span></div>
                         <h4 className="font-serif text-lg font-bold text-gray-800 mb-2">Menú Diari</h4>
                         <p className="text-xs text-gray-500">Estructura de Primer, Segon...</p>
                     </button>
                     <button onClick={() => handleCreateMenu('group')} className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group text-center flex flex-col items-center">
                         <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-3xl">diversity_3</span></div>
                         <h4 className="font-serif text-lg font-bold text-gray-800 mb-2">Menú Grup</h4>
                         <p className="text-xs text-gray-500">Preu tancat i opcions.</p>
                     </button>
                 </div>
            </div>
        );
    }

    // --- RENDER EDITOR ---
    if (menuViewState === 'editor' && editingMenuId) {
        let editorType = 'food';
        let editorData = null;
        let saveHandler = (newData: any) => {};

        if (editingMenuId.startsWith('extra_')) {
            const idx = parseInt(editingMenuId.replace('extra_', ''));
            const extraMenu = localConfig.extraMenus?.[idx];
            if (extraMenu) {
                editorType = extraMenu.type;
                editorData = extraMenu.data;
                saveHandler = (newData: any) => {
                    const newExtras = [...(localConfig.extraMenus || [])];
                    // Also update the wrapper fields if present in newData for consistency
                    newExtras[idx] = { 
                        ...newExtras[idx], 
                        data: newData,
                        title: newData.title || newExtras[idx].title,
                        icon: newData.icon || newExtras[idx].icon
                    };
                    setLocalConfig((prev: any) => ({ ...prev, extraMenus: newExtras }));
                };
            }
        } else {
            // Core menus
            const keyMap: any = { daily: 'dailyMenu', food: 'foodMenu', wine: 'wineMenu', group: 'groupMenu' };
            const key = keyMap[editingMenuId];
            editorData = localConfig[key];
            editorType = editingMenuId === 'wine' ? 'wine' : (editingMenuId === 'group' || editingMenuId === 'daily' ? 'group' : 'food');
            saveHandler = (newData: any) => {
                setLocalConfig((prev: any) => ({ ...prev, [key]: newData }));
            };
        }

        if (!editorData) return <div>Error carregant dades...</div>;

        return (
            <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                     <button onClick={() => setMenuViewState('dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-xs uppercase tracking-wider transition-colors"><span className="material-symbols-outlined text-lg">arrow_back</span> Tornar</button>
                     <div className="text-right">
                         <span className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider">Editant</span>
                         <span className="font-serif text-xl font-bold text-primary">{editorData.title || 'Menú'}</span>
                     </div>
                </div>

                {editorType === 'food' && <FoodEditor data={editorData} onChange={saveHandler} />}
                {editorType === 'wine' && <WineEditor data={editorData} onChange={saveHandler} />}
                {editorType === 'group' && <GroupEditor data={editorData} onChange={saveHandler} />}
            </div>
        );
    }

    return null;
};