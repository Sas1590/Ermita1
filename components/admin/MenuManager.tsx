import React from 'react';
import { IconPicker } from './AdminShared';

// --- SHARED COMPONENTS ---

// 0. GENERAL INFO BLOCK (Title, Subtitle, Icon) - Recommended Removed
const GeneralInfoEditor = ({ data, onChange, defaultTitle, defaultIcon }: { data: any, onChange: (d: any) => void, defaultTitle: string, defaultIcon: string }) => {
    const currentTitle = data.title !== undefined ? data.title : defaultTitle;
    const currentSubtitle = data.subtitle !== undefined ? data.subtitle : "";
    const currentIcon = data.icon !== undefined ? data.icon : defaultIcon;
    
    const updateField = (field: string, val: any) => {
        onChange({ ...data, [field]: val });
    };

    return (
        <div className="p-6 rounded shadow-sm border mb-6 bg-white border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h4 className="font-bold flex items-center gap-2 text-sm uppercase text-gray-700">
                    <span className="material-symbols-outlined text-primary">article</span> Info General
                </h4>
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

            {/* BUTTON MOVED TO TOP RIGHT */}
            <div className="flex justify-end mb-2">
                <button onClick={addSection} className="bg-[#8b5a2b] hover:bg-[#6b4521] text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-sm transition-colors">
                    <span className="material-symbols-outlined text-sm">add_circle</span> NOVA SECCIÓ
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

            {/* BUTTON MOVED TO TOP RIGHT */}
            <div className="flex justify-end mb-2">
                <button onClick={addCategory} className="bg-olive hover:bg-[#455726] text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-sm transition-colors">
                    <span className="material-symbols-outlined text-sm">add_circle</span> NOVA CATEGORIA
                </button>
            </div>
            
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
            
            {/* BUTTON MOVED TO TOP RIGHT - MATCHING THE REQUEST */}
            <div className="flex justify-end mb-2">
                <button onClick={()=>{
                    const newSections = [...(data.sections || []), {title:"NOVA SECCIÓ", icon:"restaurant", items:[]}];
                    updateField('sections', newSections);
                }} className="bg-olive hover:bg-[#455726] text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-sm transition-colors">
                    <span className="material-symbols-outlined text-sm">add_circle</span> NOVA SECCIÓ DE PLATS
                </button>
            </div>

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

export const MenuManager: React.FC<any> = ({ 
    localConfig, 
    setLocalConfig,
    menuViewState,
    setMenuViewState,
    editingMenuId,
    setEditingMenuId,
    onDeleteCard
}) => {
    
    // Helper to get menu data by ID
    const getMenuData = (id: string) => {
        if (id === 'daily') return { type: 'daily', data: localConfig.dailyMenu };
        if (id === 'food') return { type: 'food', data: localConfig.foodMenu };
        if (id === 'wine') return { type: 'wine', data: localConfig.wineMenu };
        if (id === 'group') return { type: 'group', data: localConfig.groupMenu };
        
        if (id && id.startsWith('extra_')) {
            const index = parseInt(id.replace('extra_', ''));
            const extra = localConfig.extraMenus?.[index];
            if (extra) return { type: extra.type, data: extra.data, isExtra: true, index };
        }
        return null;
    };

    const handleUpdateMenu = (id: string, newData: any) => {
        if (id === 'daily') setLocalConfig({...localConfig, dailyMenu: newData});
        else if (id === 'food') setLocalConfig({...localConfig, foodMenu: newData});
        else if (id === 'wine') setLocalConfig({...localConfig, wineMenu: newData});
        else if (id === 'group') setLocalConfig({...localConfig, groupMenu: newData});
        else if (id.startsWith('extra_')) {
            const index = parseInt(id.replace('extra_', ''));
            const newExtras = [...(localConfig.extraMenus || [])];
            newExtras[index] = { 
                ...newExtras[index], 
                data: newData, 
                // Sync wrapper props with data props
                title: newData.title, 
                subtitle: newData.subtitle, 
                icon: newData.icon, 
                visible: newData.visible,
                recommended: newData.recommended 
            };
            setLocalConfig({...localConfig, extraMenus: newExtras});
        }
    };

    const handleToggleVisibility = (id: string, currentVisible: boolean) => {
        if (id.startsWith('extra_')) {
            const idx = parseInt(id.replace('extra_', ''));
            const newExtras = [...(localConfig.extraMenus || [])];
            newExtras[idx] = { ...newExtras[idx], visible: !currentVisible };
            setLocalConfig({ ...localConfig, extraMenus: newExtras });
        } else {
            const keyMap: any = { daily: 'dailyMenu', food: 'foodMenu', wine: 'wineMenu', group: 'groupMenu' };
            const key = keyMap[id];
            
            let currentData = localConfig[key];
            if (Array.isArray(currentData)) {
                 if (id === 'food') currentData = { sections: currentData, visible: !currentVisible };
                 else if (id === 'wine') currentData = { categories: currentData, visible: !currentVisible };
            } else {
                 currentData = { ...currentData, visible: !currentVisible };
            }
            setLocalConfig({ ...localConfig, [key]: currentData });
        }
    };

    const handleToggleRecommended = (id: string, currentRecommended: boolean) => {
        if (id.startsWith('extra_')) {
            const idx = parseInt(id.replace('extra_', ''));
            const newExtras = [...(localConfig.extraMenus || [])];
            if (!newExtras[idx].data) newExtras[idx].data = {};
            
            newExtras[idx] = { 
                ...newExtras[idx], 
                data: { ...newExtras[idx].data, recommended: !currentRecommended },
                recommended: !currentRecommended 
            };
            setLocalConfig({ ...localConfig, extraMenus: newExtras });
        } else {
            const keyMap: any = { daily: 'dailyMenu', food: 'foodMenu', wine: 'wineMenu', group: 'groupMenu' };
            const key = keyMap[id];
            
            let currentData = localConfig[key];
            if (Array.isArray(currentData)) {
                 if (id === 'food') currentData = { sections: currentData, recommended: !currentRecommended };
                 else if (id === 'wine') currentData = { categories: currentData, recommended: !currentRecommended };
            } else {
                 currentData = { ...currentData, recommended: !currentRecommended };
            }
            setLocalConfig({ ...localConfig, [key]: currentData });
        }
    };

    const handleCreateMenu = (type: 'food' | 'wine' | 'group' | 'daily') => {
        const newExtra = {
            id: `extra_${Date.now()}`,
            type: type,
            title: "Nou Menú",
            subtitle: "",
            icon: type === 'wine' ? 'wine_bar' : type === 'group' ? 'diversity_3' : type === 'daily' ? 'lunch_dining' : 'restaurant',
            visible: true,
            data: type === 'wine' ? { categories: [] } : type === 'group' ? { sections: [] } : { sections: [] }
        };
        const newExtras = [...(localConfig.extraMenus || []), newExtra];
        setLocalConfig({...localConfig, extraMenus: newExtras});
        
        setEditingMenuId(`extra_${newExtras.length - 1}`);
        setMenuViewState('editor');
    };

    // RENDER: DASHBOARD
    if (menuViewState === 'dashboard') {
        const coreMenus = [
            { 
                id: 'daily', 
                title: localConfig.dailyMenu?.title || "Menú Diari", 
                subtitle: "Actualitza els primers, segons i postres del dia.",
                icon: 'lunch_dining',
                visible: localConfig.dailyMenu?.visible !== false,
                recommended: localConfig.dailyMenu?.recommended === true,
                theme: 'bg-[#DCCCA3] text-[#5c544d]' // Beige Theme
            },
            { 
                id: 'food', 
                title: Array.isArray(localConfig.foodMenu) ? "Carta de Menjar" : (localConfig.foodMenu?.title || "Carta de Menjar"), 
                subtitle: "Edita els entrants, carns, peixos i postres principals.",
                icon: 'restaurant_menu',
                visible: Array.isArray(localConfig.foodMenu) ? true : localConfig.foodMenu?.visible !== false,
                recommended: !Array.isArray(localConfig.foodMenu) && localConfig.foodMenu?.recommended === true,
                theme: 'bg-[#2C241B] text-white' // Dark Brown Theme
            },
            { 
                id: 'wine', 
                title: Array.isArray(localConfig.wineMenu) ? "Carta de Vins" : (localConfig.wineMenu?.title || "Carta de Vins"), 
                subtitle: "Gestiona les referències de vins, D.O. i caves.",
                icon: 'wine_bar',
                visible: Array.isArray(localConfig.wineMenu) ? true : localConfig.wineMenu?.visible !== false,
                recommended: !Array.isArray(localConfig.wineMenu) && localConfig.wineMenu?.recommended === true,
                theme: 'bg-[#5D4037] text-white' // Brown Theme
            },
            { 
                id: 'group', 
                title: localConfig.groupMenu?.title || "Menú de Grup", 
                subtitle: "Configura els plats, preus i condicions del menú de grup.",
                icon: 'diversity_3',
                visible: localConfig.groupMenu?.visible !== false,
                recommended: localConfig.groupMenu?.recommended === true,
                theme: 'bg-[#556B2F] text-white' // Olive Theme
            },
        ];

        return (
            <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
                
                {/* Main Header Block */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-[#8b5a2b] text-3xl">restaurant</span>
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-[#2c241b]">Gestor de Cartes</h2>
                            <p className="text-gray-500 text-sm mt-1">Administra els menús fixes i crea cartes addicionals (temporada, esdeveniments...).</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMenuViewState('type_selection')}
                        className="bg-[#8b5a2b] hover:bg-[#6b4521] text-white px-6 py-3 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-md transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span> Crear Nova Carta
                    </button>
                </div>

                {/* Core Menus Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {coreMenus.map(m => (
                        <div 
                            key={m.id}
                            className={`rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl ${!m.visible ? 'grayscale opacity-70' : ''}`}
                        >
                            {/* Colored Header Area */}
                            <div className={`${m.theme} p-6 pb-12 relative overflow-hidden`}>
                                {/* Recommended Star (Top Right) */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleToggleRecommended(m.id, m.recommended); }}
                                    className={`absolute top-4 right-4 transition-colors p-1 rounded-full ${m.recommended ? 'text-yellow-400 bg-white/10' : 'text-current opacity-30 hover:opacity-100'}`}
                                    title={m.recommended ? "Destacat" : "Marcar com a destacat"}
                                >
                                    <span className="material-symbols-outlined text-2xl">{m.recommended ? 'star' : 'star_border'}</span>
                                </button>

                                {/* Watermark Icon (Bottom Right) */}
                                <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none transform rotate-12">
                                    <span className="material-symbols-outlined text-8xl">{m.icon}</span>
                                </div>

                                <h3 className="font-serif font-bold text-xl mb-3 relative z-10">{m.title}</h3>
                                <p className="text-[11px] opacity-80 leading-relaxed font-sans relative z-10 pr-4">{m.subtitle}</p>
                            </div>

                            {/* White Action Footer */}
                            <div className="bg-white p-4 flex gap-3 mt-auto">
                                <button 
                                    onClick={() => { setEditingMenuId(m.id); setMenuViewState('editor'); }}
                                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold uppercase text-[10px] py-2.5 rounded flex items-center justify-center gap-2 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleToggleVisibility(m.id, m.visible); }}
                                    className={`px-4 py-2.5 rounded font-bold uppercase text-[10px] flex items-center gap-1 border transition-colors ${m.visible ? 'text-green-600 border-green-200 bg-white hover:bg-green-50' : 'text-gray-400 border-gray-200 bg-gray-50'}`}
                                    title={m.visible ? "Visible" : "Ocult"}
                                >
                                    <span className="material-symbols-outlined text-sm">{m.visible ? 'visibility' : 'visibility_off'}</span>
                                    {m.visible ? 'Visible' : 'Ocult'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Extra Menus Section (If any exist) */}
                {localConfig.extraMenus && localConfig.extraMenus.length > 0 && (
                    <div className="pt-8 border-t border-gray-200">
                        <h3 className="font-serif text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                            Menús Addicionals
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{localConfig.extraMenus.length}</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {localConfig.extraMenus.map((extra: any, idx: number) => {
                                // Determine styling for extras (defaulting to a neutral gray/orange style)
                                const isVisible = extra.visible !== false;
                                const isRec = extra.recommended === true;
                                
                                return (
                                    <div key={idx} className={`rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl bg-white ${!isVisible ? 'grayscale opacity-70' : ''}`}>
                                        {/* Colored Header Area (Lighter/Neutral for Extras) */}
                                        <div className="bg-[#8b5a2b] p-6 pb-12 relative overflow-hidden text-white">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleToggleRecommended(`extra_${idx}`, isRec); }}
                                                className={`absolute top-4 right-4 transition-colors p-1 rounded-full ${isRec ? 'text-yellow-400 bg-white/10' : 'text-white opacity-30 hover:opacity-100'}`}
                                            >
                                                <span className="material-symbols-outlined text-2xl">{isRec ? 'star' : 'star_border'}</span>
                                            </button>

                                            <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none transform rotate-12">
                                                <span className="material-symbols-outlined text-8xl">{extra.icon || 'restaurant'}</span>
                                            </div>

                                            <h3 className="font-serif font-bold text-xl mb-2 relative z-10 truncate pr-6">{extra.title || "Nou Menú"}</h3>
                                            <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold mb-1 relative z-10">{extra.type === 'food' ? 'Carta' : extra.type === 'wine' ? 'Vins' : 'Menú Fix'}</p>
                                        </div>

                                        {/* White Action Footer */}
                                        <div className="bg-white p-4 flex gap-3 mt-auto">
                                            <div className="flex-1 flex gap-2">
                                                <button 
                                                    onClick={() => { setEditingMenuId(`extra_${idx}`); setMenuViewState('editor'); }}
                                                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold uppercase text-[10px] py-2.5 rounded flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onDeleteCard(`extra_${idx}`); }}
                                                    className="w-8 bg-red-50 hover:bg-red-100 text-red-400 rounded flex items-center justify-center transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleToggleVisibility(`extra_${idx}`, isVisible); }}
                                                className={`px-3 py-2.5 rounded font-bold uppercase text-[10px] flex items-center gap-1 border transition-colors ${isVisible ? 'text-green-600 border-green-200 bg-white hover:bg-green-50' : 'text-gray-400 border-gray-200 bg-gray-50'}`}
                                                title={isVisible ? "Visible" : "Ocult"}
                                            >
                                                <span className="material-symbols-outlined text-sm">{isVisible ? 'visibility' : 'visibility_off'}</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // RENDER: TYPE SELECTION
    if (menuViewState === 'type_selection') {
        return (
            <div className="max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                <button onClick={() => setMenuViewState('dashboard')} className="mb-6 text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-bold uppercase"><span className="material-symbols-outlined text-lg">arrow_back</span> Tornar</button>
                <h3 className="font-serif text-2xl font-bold text-gray-800 mb-8 text-center">Quin tipus de menú vols crear?</h3>
                
                {/* 4 COLUMNS LAYOUT FOR SELECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* 1. DAILY MENU */}
                    <button onClick={() => handleCreateMenu('daily')} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary hover:shadow-xl transition-all group text-center flex flex-col items-center h-full">
                        <div className="w-20 h-20 bg-[#f7f3e8] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#DCCCA3] group-hover:text-white transition-colors text-[#DCCCA3]">
                            <span className="material-symbols-outlined text-4xl">lunch_dining</span>
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">Menú Diari</h4>
                        <p className="text-sm text-gray-500">Ideal per a menús de dia laborable, executius o setmanals.</p>
                    </button>

                    {/* 2. FOOD MENU */}
                    <button onClick={() => handleCreateMenu('food')} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary hover:shadow-xl transition-all group text-center flex flex-col items-center h-full">
                        <div className="w-20 h-20 bg-[#f2ede9] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2C241B] group-hover:text-white transition-colors text-[#2C241B]">
                            <span className="material-symbols-outlined text-4xl">restaurant_menu</span>
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">Carta de Menjar</h4>
                        <p className="text-sm text-gray-500">Ideal per a tapes, entrants, plats principals... Estructurat per seccions.</p>
                    </button>

                    {/* 3. WINE MENU */}
                    <button onClick={() => handleCreateMenu('wine')} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary hover:shadow-xl transition-all group text-center flex flex-col items-center h-full">
                        <div className="w-20 h-20 bg-[#f4eceb] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#5D4037] group-hover:text-white transition-colors text-[#5D4037]">
                            <span className="material-symbols-outlined text-4xl">wine_bar</span>
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">Carta de Vins</h4>
                        <p className="text-sm text-gray-500">Específic per a vins, caves i licors. Organitzat per categories i D.O.</p>
                    </button>

                    {/* 4. GROUP MENU */}
                    <button onClick={() => handleCreateMenu('group')} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary hover:shadow-xl transition-all group text-center flex flex-col items-center h-full">
                        <div className="w-20 h-20 bg-[#eff2ea] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#556B2F] group-hover:text-white transition-colors text-[#556B2F]">
                            <span className="material-symbols-outlined text-4xl">diversity_3</span>
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">Menú de Grup / Fix</h4>
                        <p className="text-sm text-gray-500">Per a menús tancats (Calçotada, Nadal, Diari...) amb preu fix i opcions.</p>
                    </button>
                </div>
            </div>
        );
    }

    // RENDER: EDITOR
    const activeMenu = editingMenuId ? getMenuData(editingMenuId) : null;
    
    if (!activeMenu) return <div>Error: Menú no trobat</div>;

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <button onClick={() => setMenuViewState('dashboard')} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-bold uppercase"><span className="material-symbols-outlined text-lg">arrow_back</span> Tornar al llistat</button>
                <div className="flex items-center gap-2">
                    {activeMenu.isExtra && (
                        <button onClick={() => onDeleteCard(editingMenuId!)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold uppercase bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition-colors">
                            <span className="material-symbols-outlined text-sm">delete</span> Eliminar Menú
                        </button>
                    )}
                </div>
            </div>

            {/* Render Specific Editor */}
            {activeMenu.type === 'food' && <FoodEditor data={activeMenu.data} onChange={(d) => handleUpdateMenu(editingMenuId!, d)} />}
            {activeMenu.type === 'wine' && <WineEditor data={activeMenu.data} onChange={(d) => handleUpdateMenu(editingMenuId!, d)} />}
            {(activeMenu.type === 'group' || activeMenu.type === 'daily') && <GroupEditor data={activeMenu.data} onChange={(d) => handleUpdateMenu(editingMenuId!, d)} />}
        </div>
    );
};
