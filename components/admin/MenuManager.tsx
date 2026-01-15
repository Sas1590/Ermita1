import React from 'react';
import { IconPicker } from './AdminShared';

// --- SHARED COMPONENTS ---

// 0. GENERAL INFO BLOCK (Title & Icon) - NEW
const GeneralInfoEditor = ({ data, onChange, defaultTitle, defaultIcon }: { data: any, onChange: (d: any) => void, defaultTitle: string, defaultIcon: string }) => {
    // Determine current values or defaults
    const currentTitle = data.title !== undefined ? data.title : defaultTitle;
    const currentIcon = data.icon !== undefined ? data.icon : defaultIcon;

    const updateField = (field: string, val: any) => {
        onChange({ ...data, [field]: val });
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-gray-200 mb-6">
            <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase border-b border-gray-100 pb-2">
                <span className="material-symbols-outlined text-primary">article</span> Info General
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Menú</label>
                    <input 
                        value={currentTitle} 
                        onChange={(e) => updateField('title', e.target.value)} 
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary font-bold text-gray-800" 
                        placeholder="Ex: Carta" 
                    />
                </div>
                <div className="w-full md:w-40">
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Icona</label>
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

const FoodEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    // Normalizar datos: Si es array (formato antiguo), lo convertimos a objeto con secciones.
    // If it's an array, we assume it's just sections.
    const isLegacy = Array.isArray(data);
    
    // Construct valid object structure
    const sections = isLegacy ? data : (data?.sections || []);
    const title = isLegacy ? "Carta de Menjar" : (data?.title || "Carta de Menjar");
    const icon = isLegacy ? "restaurant_menu" : (data?.icon || "restaurant_menu");
    const disclaimer = isLegacy ? "" : (data?.disclaimer || "");
    const showDisclaimer = isLegacy ? true : (data?.showDisclaimer !== false);

    // Merge existing data with structure
    const currentData = isLegacy ? { title, icon, sections, disclaimer, showDisclaimer } : data;

    const updateData = (newData: any) => {
        onChange({ ...currentData, ...newData });
    };

    const handleSectionChange = (idx: number, field: string, val: string) => {
        const newSections = sections.map((section: any, i: number) => 
            i === idx ? { ...section, [field]: val } : section
        );
        updateData({ sections: newSections });
    };
    const handleItemChange = (sIdx: number, iIdx: number, field: string, val: string) => {
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
            {/* GENERAL INFO EDITOR (Title & Icon) */}
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
            
            {/* SEPARATED PRICE & INFO EDITORS */}
            <PriceHeaderEditor data={currentData} onChange={updateData} />
            <InfoBlockEditor data={currentData} onChange={updateData} />

            {/* SECTIONS LOOP */}
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
                            <div key={iIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end bg-gray-50 p-2 rounded">
                                <div className="md:col-span-5"><input type="text" value={item.nameCa} onChange={(e) => handleItemChange(sIdx, iIdx, 'nameCa', e.target.value)} className="w-full bg-transparent border-b border-gray-300 outline-none text-sm font-bold" placeholder="Nom Català" /></div>
                                <div className="md:col-span-5"><input type="text" value={item.nameEs} onChange={(e) => handleItemChange(sIdx, iIdx, 'nameEs', e.target.value)} className="w-full bg-transparent border-b border-gray-300 outline-none text-sm text-gray-600 font-hand" placeholder="Nom Castellà" /></div>
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

            {/* GLOBAL DISCLAIMER SECTION */}
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
    // Normalizar datos para vinos
    const isLegacy = Array.isArray(data);
    
    // Construct valid object structure
    const categories = isLegacy ? data : (data?.categories || data || []); 
    const title = isLegacy ? "Carta de Vins" : (data?.title || "Carta de Vins");
    const icon = isLegacy ? "wine_bar" : (data?.icon || "wine_bar");
    const disclaimer = isLegacy ? "" : (data?.disclaimer || "");
    const showDisclaimer = isLegacy ? true : (data?.showDisclaimer !== false);

    const currentData = isLegacy ? { title, icon, categories, disclaimer, showDisclaimer } : data;

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
            {/* GENERAL INFO EDITOR (Title & Icon) */}
            <GeneralInfoEditor 
                data={currentData} 
                onChange={updateData} 
                defaultTitle="Carta de Vins" 
                defaultIcon="wine_bar" 
            />

            <div className="flex justify-end"><button onClick={addCategory} className="bg-olive text-white px-3 py-2 rounded text-xs font-bold uppercase">Nova Categoria</button></div>
            
            {/* SEPARATED PRICE & INFO EDITORS */}
            <PriceHeaderEditor data={currentData} onChange={updateData} />
            <InfoBlockEditor data={currentData} onChange={updateData} />

            {/* CATEGORIES LOOP */}
            {categories.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="bg-white border border-gray-200 rounded p-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4 border-b pb-4">
                        <div className="flex-1">
                            <input value={cat.category} onChange={(e) => handleCategoryChange(cIdx, 'category', e.target.value)} className="font-bold text-xl outline-none w-full" placeholder="Nom Categoria" />
                        </div>
                        {/* ADDED ICON PICKER FOR WINE CATEGORY */}
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
                                    <div key={iIdx} className="flex gap-2 mb-2 items-center">
                                        <input value={it.name} onChange={(e)=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems[iIdx] = {...newItems[iIdx], name: e.target.value};
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newCats = categories.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            updateData({ categories: newCats });
                                        }} className="w-1/3 border-b text-sm" placeholder="Nom" />
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

            {/* GLOBAL DISCLAIMER SECTION (WINE) */}
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
            {/* GENERAL INFO EDITOR (Title & Icon) - REPLACES OLD TITLE INPUT */}
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
                        {/* ADDED ICON PICKER FOR GROUP/DAILY MENU SECTIONS */}
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
                            <div key={iIdx} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                                <input value={it.nameCa} onChange={(e)=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems[iIdx] = {...newItems[iIdx], nameCa: e.target.value};
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    updateField('sections', newSections);
                                }} className="w-1/2 bg-transparent border-b text-sm font-bold" placeholder="Plat (Català)" />
                                <input value={it.nameEs} onChange={(e)=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems[iIdx] = {...newItems[iIdx], nameEs: e.target.value};
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    updateField('sections', newSections);
                                }} className="w-1/2 bg-transparent border-b text-sm text-gray-500" placeholder="Plato (Castellano)" />
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

            {/* GLOBAL DISCLAIMER SECTION (GROUP) */}
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

// --- DATA TEMPLATES ---
export const getBlankFoodMenu = () => ({
    title: "Nova Carta de Menjar",
    icon: "restaurant",
    sections: [{
      id: `sec_${Date.now()}`,
      category: "NOVA SECCIÓ",
      icon: "restaurant",
      items: [{ nameCa: "", nameEs: "", price: "" }]
    }],
    disclaimer: "",
    showDisclaimer: true,
    showInfo: false,
    showPrice: false
});

export const getBlankWineMenu = () => ({
    title: "Nova Carta de Vins",
    icon: "wine_bar",
    categories: [{
        category: "NOVA CATEGORIA",
        icon: "wine_bar",
        groups: [{ sub: "", items: [{ name: "", desc: "", price: "" }] }]
    }],
    disclaimer: "",
    showDisclaimer: true,
    showInfo: false,
    showPrice: false
});

export const getBlankGroupMenu = () => ({
    title: "NOU MENÚ DE GRUP",
    icon: "diversity_3",
    price: "00 EUROS",
    vat: "IVA INCLÒS",
    disclaimer: "",
    showInfo: true, 
    showPrice: true,
    sections: [{ title: "PRIMERS", icon: "restaurant", items: [{ nameCa: "", nameEs: "" }] }],
    drinks: ["Aigua i Vi"],
    infoIntro: "Informació del menú...",
    infoAllergy: "Informació d'al·lèrgens..."
});

// --- MENU MANAGER COMPONENT ---
interface MenuManagerProps {
    localConfig: any;
    setLocalConfig: (config: any) => void;
    menuViewState: 'dashboard' | 'type_selection' | 'editor';
    setMenuViewState: (view: 'dashboard' | 'type_selection' | 'editor') => void;
    editingMenuId: string | null;
    setEditingMenuId: (id: string | null) => void;
    onDeleteCard: (id?: string) => void; 
}

export const MenuManager: React.FC<MenuManagerProps> = ({
    localConfig, setLocalConfig, menuViewState, setMenuViewState, editingMenuId, setEditingMenuId, onDeleteCard
}) => {

    const getCurrentMenuData = () => {
        if (!editingMenuId) return null;
        if (editingMenuId === 'main_daily') return localConfig.dailyMenu; 
        if (editingMenuId === 'main_food') return localConfig.foodMenu;
        if (editingMenuId === 'main_wine') return localConfig.wineMenu;
        if (editingMenuId === 'main_group') return localConfig.groupMenu;
        
        const extraIndex = parseInt(editingMenuId.replace('extra_', ''));
        if (!isNaN(extraIndex) && localConfig.extraMenus && localConfig.extraMenus[extraIndex]) {
            return localConfig.extraMenus[extraIndex].data;
        }
        return null;
    };

    const updateCurrentMenuData = (newData: any) => {
        if (!editingMenuId) return;
        
        // Handle Sync for Extra Menus: Wrapper Title/Icon should match inner data Title/Icon
        const syncExtraMenu = (data: any, idx: number) => {
            setLocalConfig((prev:any) => {
                const newExtras = [...(prev.extraMenus || [])];
                if(newExtras[idx]) {
                    newExtras[idx] = { 
                        ...newExtras[idx], 
                        data: data,
                        title: data.title || newExtras[idx].title, // Sync title
                        icon: data.icon || newExtras[idx].icon     // Sync icon
                    };
                }
                return { ...prev, extraMenus: newExtras };
            });
        };

        if (editingMenuId === 'main_daily') {
            setLocalConfig((prev:any) => ({ ...prev, dailyMenu: newData })); 
        } else if (editingMenuId === 'main_food') {
            setLocalConfig((prev:any) => ({ ...prev, foodMenu: newData }));
        } else if (editingMenuId === 'main_wine') {
            setLocalConfig((prev:any) => ({ ...prev, wineMenu: newData }));
        } else if (editingMenuId === 'main_group') {
            setLocalConfig((prev:any) => ({ ...prev, groupMenu: newData }));
        } else {
            const extraIndex = parseInt(editingMenuId.replace('extra_', ''));
            if (!isNaN(extraIndex)) {
                syncExtraMenu(newData, extraIndex);
            }
        }
    };

    const handleCreateNewCard = (type: 'food' | 'wine' | 'group') => {
        let newData;
        let title;
        let defaultIcon;

        if (type === 'food') { 
            newData = getBlankFoodMenu(); 
            title = "Nova Carta de Menjar"; 
            defaultIcon = "restaurant";
        } else if (type === 'wine') { 
            newData = getBlankWineMenu(); 
            title = "Nova Carta de Vins"; 
            defaultIcon = "wine_bar";
        } else { 
            newData = getBlankGroupMenu(); 
            title = "Nou Menú de Grup"; 
            defaultIcon = "diversity_3";
        }

        // Initialize object data with title and icon as well
        newData.title = title;
        newData.icon = defaultIcon;

        const newExtraMenu = { id: `menu_${Date.now()}`, type, title, icon: defaultIcon, data: newData };

        setLocalConfig((prev:any) => {
            const updatedExtras = [...(prev.extraMenus || []), newExtraMenu];
            const newIndex = updatedExtras.length - 1;
            setTimeout(() => {
                setEditingMenuId(`extra_${newIndex}`);
                setMenuViewState('editor');
            }, 0);
            return { ...prev, extraMenus: updatedExtras };
        });
    };

    return (
        <div className="animate-[fadeIn_0.3s_ease-out]">
            {menuViewState === 'dashboard' && (
                <div className="space-y-8">
                    {/* TOP ACTION PANEL */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-[#2c241b] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#8b5a2b]">restaurant_menu</span>
                                Gestor de Cartes
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Administra els menús fixes i crea cartes addicionals (temporada, esdeveniments...).</p>
                        </div>
                        <button 
                            onClick={() => setMenuViewState('type_selection')} 
                            className="bg-[#8b5a2b] hover:bg-[#6b4521] text-white px-6 py-3 rounded-lg shadow-md font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-transform transform hover:-translate-y-0.5"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Crear Nova Carta
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* NEW DAILY MENU CARD */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative border-l-4 border-l-primary">
                            <div className="h-24 bg-primary flex items-center justify-center relative overflow-hidden">
                                <span className="material-symbols-outlined text-6xl text-black/10 absolute -right-2 -bottom-2">{localConfig.dailyMenu?.icon || 'lunch_dining'}</span>
                                <span className="text-black font-serif font-bold text-xl relative z-10">{localConfig.dailyMenu?.title || 'Menú Diari'}</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-gray-500 mb-4">Actualitza els primers, segons i postres del dia.</p>
                                <button onClick={() => { setEditingMenuId('main_daily'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                            <div className="h-24 bg-[#2c241b] flex items-center justify-center relative overflow-hidden">
                                <span className="material-symbols-outlined text-6xl text-primary/20 absolute -right-2 -bottom-2">{localConfig.foodMenu?.icon || (!Array.isArray(localConfig.foodMenu) && localConfig.foodMenu?.icon) ? (localConfig.foodMenu?.icon || 'restaurant_menu') : 'restaurant_menu'}</span>
                                <span className="text-white font-serif font-bold text-xl relative z-10">{localConfig.foodMenu?.title || (!Array.isArray(localConfig.foodMenu) && localConfig.foodMenu?.title) ? (localConfig.foodMenu?.title || 'Carta de Menjar') : 'Carta de Menjar'}</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-gray-500 mb-4">Edita els entrants, carns, peixos i postres principals.</p>
                                <button onClick={() => { setEditingMenuId('main_food'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                            <div className="h-24 bg-[#5d3a1a] flex items-center justify-center relative overflow-hidden">
                                <span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">{localConfig.wineMenu?.icon || (!Array.isArray(localConfig.wineMenu) && localConfig.wineMenu?.icon) ? (localConfig.wineMenu?.icon || 'wine_bar') : 'wine_bar'}</span>
                                <span className="text-white font-serif font-bold text-xl relative z-10">{localConfig.wineMenu?.title || (!Array.isArray(localConfig.wineMenu) && localConfig.wineMenu?.title) ? (localConfig.wineMenu?.title || 'Carta de Vins') : 'Carta de Vins'}</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-gray-500 mb-4">Gestiona les referències de vins, D.O. i caves.</p>
                                <button onClick={() => { setEditingMenuId('main_wine'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                            <div className="h-24 bg-[#556b2f] flex items-center justify-center relative overflow-hidden">
                                <span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">{localConfig.groupMenu?.icon || 'diversity_3'}</span>
                                <span className="text-white font-serif font-bold text-xl relative z-10">{localConfig.groupMenu?.title || 'Menú de Grup'}</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-gray-500 mb-4">Configura els plats, preus i condicions del menú de grup.</p>
                                <button onClick={() => { setEditingMenuId('main_group'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                            </div>
                        </div>
                        
                        {(localConfig.extraMenus || []).map((menu:any, idx:number) => { 
                            let headerColor = "bg-gray-700"; 
                            let icon = menu.icon || "restaurant"; // Use Custom icon OR Default
                            if(!menu.icon) {
                                if(menu.type === 'wine') { headerColor = "bg-[#8b5a2b]"; icon = "wine_bar"; } 
                                if(menu.type === 'group') { headerColor = "bg-olive"; icon = "diversity_3"; } 
                            } else {
                                // Keep color logic based on type but icon custom
                                if(menu.type === 'wine') { headerColor = "bg-[#8b5a2b]"; } 
                                if(menu.type === 'group') { headerColor = "bg-olive"; } 
                            }

                            return (
                                <div key={menu.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                                    <div className={`h-24 ${headerColor} flex items-center justify-center relative overflow-hidden`}>
                                        <span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">{icon}</span>
                                        {/* ICON BUTTON REMOVED FROM HEADER */}
                                        <div className="text-center px-2">
                                            <span className="text-white font-serif font-bold text-lg relative z-10 block line-clamp-1">{menu.title}</span>
                                            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest relative z-10 block">{menu.type === 'food' ? 'Carta Extra' : menu.type === 'wine' ? 'Vins Extra' : 'Grup Extra'}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <button onClick={() => { setEditingMenuId(`extra_${idx}`); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors">
                                            <span className="material-symbols-outlined text-sm">edit</span> Editar
                                        </button>
                                        {/* NEW FULL WIDTH DELETE BUTTON IN BODY */}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteCard(`extra_${idx}`); }} 
                                            className="w-full py-1 text-red-300 hover:text-red-500 rounded font-bold uppercase text-[10px] flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span> Esborrar
                                        </button>
                                    </div>
                                </div>
                            ); 
                        })}
                    </div>
                </div>
            )}
            
            {menuViewState === 'type_selection' && (<div className="max-w-2xl mx-auto py-10"><div className="flex items-center gap-2 mb-8"><button onClick={() => setMenuViewState('dashboard')} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">arrow_back</span></button><h3 className="text-2xl font-serif font-bold text-gray-800">Quina mena de carta vols crear?</h3></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><button onClick={() => handleCreateNewCard('food')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-primary hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"><span className="material-symbols-outlined text-5xl text-[#2c241b]">restaurant_menu</span><span className="font-bold text-gray-800">Carta de Menjar</span><span className="text-xs text-gray-500">Per a entrants, plats principals, tapes o postres.</span></button><button onClick={() => handleCreateNewCard('wine')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-[#8b5a2b] hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"><span className="material-symbols-outlined text-5xl text-[#8b5a2b]">wine_bar</span><span className="font-bold text-gray-800">Carta de Vins</span><span className="text-xs text-gray-500">Per a referències de vins, caves i licors.</span></button><button onClick={() => handleCreateNewCard('group')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-olive hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"><span className="material-symbols-outlined text-5xl text-olive">diversity_3</span><span className="font-bold text-gray-800">Menú de Grup</span><span className="text-xs text-gray-500">Menú tancat amb preu fix i seccions.</span></button></div></div>)}
            
            {menuViewState === 'editor' && editingMenuId && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => { setMenuViewState('dashboard'); setEditingMenuId(null); }} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
                            <div>
                                <h3 className="font-serif text-2xl font-bold text-gray-800">
                                    {/* DYNAMIC TITLE IN EDITOR HEADER */}
                                    {editingMenuId.startsWith('extra_') 
                                        ? (localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.title || 'Editant Carta') 
                                        : (
                                            editingMenuId === 'main_daily' ? (localConfig.dailyMenu?.title || 'Menú Diari') :
                                            editingMenuId === 'main_food' ? (localConfig.foodMenu?.title || 'Carta Principal') :
                                            editingMenuId === 'main_wine' ? (localConfig.wineMenu?.title || 'Carta Vins') :
                                            (localConfig.groupMenu?.title || 'Menú Grup')
                                        )
                                    }
                                </h3>
                            </div>
                        </div>
                        {editingMenuId.startsWith('extra_') && (<button onClick={() => onDeleteCard()} className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold uppercase transition-colors"><span className="material-symbols-outlined text-lg">delete</span> Esborrar Carta</button>)}
                    </div>
                    <div className="bg-gray-50/50 p-1 rounded-lg">
                        {/* EDITOR SELECTION LOGIC */}
                        {(editingMenuId === 'main_food' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'food')) && (
                            <FoodEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />
                        )}
                        {(editingMenuId === 'main_wine' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'wine')) && (
                            <WineEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />
                        )}
                        {/* Use GroupEditor for Main Group AND Daily Menu AND Extra Groups */}
                        {(editingMenuId === 'main_group' || editingMenuId === 'main_daily' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'group')) && (
                            <GroupEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};