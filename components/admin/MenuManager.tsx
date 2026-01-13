import React from 'react';
import { IconPicker } from './AdminShared';

// --- ISOLATED EDITOR COMPONENTS ---

const FoodEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    const safeData = Array.isArray(data) ? data : [];

    const handleSectionChange = (idx: number, field: string, val: string) => {
        const newData = safeData.map((section: any, i: number) => 
            i === idx ? { ...section, [field]: val } : section
        );
        onChange(newData);
    };
    const handleItemChange = (sIdx: number, iIdx: number, field: string, val: string) => {
        const newData = safeData.map((section: any, i: number) => {
            if (i !== sIdx) return section;
            const newItems = (section.items || []).map((item: any, j: number) => 
                j === iIdx ? { ...item, [field]: val } : item
            );
            return { ...section, items: newItems };
        });
        onChange(newData);
    };
    const addSection = () => onChange([...safeData, { id: `sec_${Date.now()}`, category: "NOVA SECCIÓ", icon: "restaurant", items: [] }]);
    const removeSection = (idx: number) => {
        const newData = [...safeData];
        newData.splice(idx, 1);
        onChange(newData);
    };
    const addItem = (sIdx: number) => {
        const newData = safeData.map((section: any, i: number) => {
            if (i !== sIdx) return section;
            return { ...section, items: [...(section.items || []), { nameCa: "", nameEs: "", price: "" }] };
        });
        onChange(newData);
    };
    const removeItem = (sIdx: number, iIdx: number) => {
        const newData = safeData.map((section: any, i: number) => {
            if (i !== sIdx) return section;
            const newItems = [...(section.items || [])];
            newItems.splice(iIdx, 1);
            return { ...section, items: newItems };
        });
        onChange(newData);
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-end mb-4">
                <button onClick={addSection} className="bg-[#8b5a2b] text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-[#6b4521] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span> Nova Secció
                </button>
            </div>
            {safeData.map((section: any, sIdx: number) => (
                <div key={sIdx} className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 border-b border-gray-100 pb-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Secció</label>
                            <input type="text" value={section.category} onChange={(e) => handleSectionChange(sIdx, 'category', e.target.value)} className="font-serif text-lg font-bold text-[#8b5a2b] border-b border-transparent focus:border-[#8b5a2b] outline-none bg-transparent w-full" />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Icona</label>
                            <IconPicker 
                                value={section.icon || 'restaurant'} 
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
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nota al peu</label>
                        <input type="text" value={section.footer || ''} onChange={(e) => handleSectionChange(sIdx, 'footer', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const WineEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    const safeData = Array.isArray(data) ? data : [];

    const handleCategoryChange = (idx: number, val: string) => {
        const newData = safeData.map((cat:any, i:number) => i === idx ? {...cat, category: val} : cat);
        onChange(newData);
    };
    const addCategory = () => onChange([...safeData, {category:"NOVA", groups:[]}]);
    const removeCategory = (idx: number) => { 
        const n=[...safeData]; n.splice(idx,1); onChange(n); 
    };
    
    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-end"><button onClick={addCategory} className="bg-olive text-white px-3 py-2 rounded text-xs font-bold uppercase">Nova Categoria</button></div>
            {safeData.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="bg-white border border-gray-200 rounded p-4">
                    <div className="flex justify-between mb-4 border-b pb-2">
                        <input value={cat.category} onChange={(e) => handleCategoryChange(cIdx, e.target.value)} className="font-bold text-xl outline-none w-full" placeholder="Nom Categoria" />
                        <button onClick={() => removeCategory(cIdx)} className="text-red-400"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                    <div className="pl-4 space-y-4">
                        {(cat.groups || []).map((grp:any,gIdx:number)=>(
                            <div key={gIdx} className="border-l-4 border-gray-200 pl-2">
                                <div className="flex justify-between mb-2">
                                    <input value={grp.sub} onChange={(e)=>{
                                        const newCat = {...cat};
                                        newCat.groups = (cat.groups || []).map((g:any, gi:number) => gi === gIdx ? {...g, sub: e.target.value} : g);
                                        const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                        onChange(newData);
                                    }} placeholder="Subgrup (ex: D.O. Terra Alta)" className="italic w-full outline-none" />
                                    <button onClick={()=>{
                                        const newCat = {...cat};
                                        newCat.groups = [...(cat.groups || [])];
                                        newCat.groups.splice(gIdx,1);
                                        const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                        onChange(newData);
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
                                            const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            onChange(newData);
                                        }} className="w-1/3 border-b text-sm" placeholder="Nom" />
                                        <input value={it.desc} onChange={(e)=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems[iIdx] = {...newItems[iIdx], desc: e.target.value};
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            onChange(newData);
                                        }} className="w-1/3 border-b text-xs text-gray-500" placeholder="Desc" />
                                        <input value={it.price} onChange={(e)=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems[iIdx] = {...newItems[iIdx], price: e.target.value};
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            onChange(newData);
                                        }} className="w-1/6 border-b text-right text-sm" placeholder="€" />
                                        <button onClick={()=>{
                                            const newCat = {...cat};
                                            const newGroups = [...(cat.groups || [])];
                                            const newItems = [...(newGroups[gIdx].items || [])];
                                            newItems.splice(iIdx, 1);
                                            newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                            newCat.groups = newGroups;
                                            const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                            onChange(newData);
                                        }} className="text-red-200"><span className="material-symbols-outlined text-sm">close</span></button>
                                    </div>
                                ))}
                                <button onClick={()=>{
                                    const newCat = {...cat};
                                    const newGroups = [...(cat.groups || [])];
                                    const newItems = [...(newGroups[gIdx].items || []), {name:"",desc:"",price:""}];
                                    newGroups[gIdx] = {...newGroups[gIdx], items: newItems};
                                    newCat.groups = newGroups;
                                    const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                                    onChange(newData);
                                }} className="text-xs text-olive font-bold">+ Vi</button>
                            </div>
                        ))}
                        <button onClick={()=>{
                            const newCat = {...cat};
                            newCat.groups = [...(cat.groups || []), {sub:"",items:[]}];
                            const newData = safeData.map((c:any, ci:number) => ci === cIdx ? newCat : c);
                            onChange(newData);
                        }} className="text-xs font-bold mt-2">+ Grup</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const GroupEditor = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
    if (!data) return <div>Carregant editor...</div>;
    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white p-6 rounded shadow border-gray-200">
                <h4 className="font-bold mb-4 text-[#8b5a2b]">Info General</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs text-gray-400 font-bold mb-1">Preu</label><input value={data.price} onChange={(e)=>{onChange({...data, price:e.target.value})}} className="border p-2 rounded w-full" placeholder="Ex: 35€" /></div>
                    <div><label className="block text-xs text-gray-400 font-bold mb-1">Títol Menú</label><input value={data.title} onChange={(e)=>{onChange({...data, title:e.target.value})}} className="border p-2 rounded w-full" placeholder="Títol" /></div>
                    <div className="md:col-span-2"><label className="block text-xs text-red-400 font-bold mb-1">Disclaimer</label><input value={data.disclaimer} onChange={(e)=>{onChange({...data, disclaimer:e.target.value})}} className="border border-red-100 bg-red-50 p-2 rounded w-full text-red-600 text-sm" /></div>
                </div>
            </div>
            {(data.sections || []).map((sec:any,sIdx:number)=>(
                <div key={sIdx} className="bg-white p-6 rounded shadow border-gray-200">
                    <div className="flex justify-between mb-4 border-b pb-2">
                        <input value={sec.title} onChange={(e)=>{
                            const newSections = (data.sections || []).map((s:any, si:number) => si === sIdx ? {...s, title: e.target.value} : s);
                            onChange({...data, sections: newSections});
                        }} className="font-bold outline-none text-lg text-olive w-full" placeholder="Títol Secció" />
                        <button onClick={()=>{
                            const newSections = [...(data.sections || [])];
                            newSections.splice(sIdx, 1);
                            onChange({...data, sections: newSections});
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
                                    onChange({...data, sections: newSections});
                                }} className="w-1/2 bg-transparent border-b text-sm font-bold" placeholder="Plat (Català)" />
                                <input value={it.nameEs} onChange={(e)=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems[iIdx] = {...newItems[iIdx], nameEs: e.target.value};
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    onChange({...data, sections: newSections});
                                }} className="w-1/2 bg-transparent border-b text-sm text-gray-500" placeholder="Plato (Castellano)" />
                                <button onClick={()=>{
                                    const newSections = [...(data.sections || [])];
                                    const newItems = [...(newSections[sIdx].items || [])];
                                    newItems.splice(iIdx, 1);
                                    newSections[sIdx] = {...newSections[sIdx], items: newItems};
                                    onChange({...data, sections: newSections});
                                }} className="text-red-300"><span className="material-symbols-outlined text-sm">remove_circle</span></button>
                            </div>
                        ))}
                        <button onClick={()=>{
                            const newSections = [...(data.sections || [])];
                            const newItems = [...(newSections[sIdx].items || []), {nameCa:"",nameEs:""}];
                            newSections[sIdx] = {...newSections[sIdx], items: newItems};
                            onChange({...data, sections: newSections});
                        }} className="text-xs font-bold text-olive flex items-center gap-1 mt-2"><span className="material-symbols-outlined text-sm">add</span> Afegir Plat</button>
                    </div>
                </div>
            ))}
            <button onClick={()=>{
                const newSections = [...(data.sections || []), {title:"NOVA SECCIÓ",items:[]}];
                onChange({...data, sections: newSections});
            }} className="bg-olive text-white px-4 py-2 rounded text-xs font-bold w-full">NOVA SECCIÓ DE PLATS</button>
        </div>
    );
};

// --- DATA TEMPLATES ---
export const getBlankFoodMenu = () => ([
    {
      id: `sec_${Date.now()}`,
      category: "NOVA SECCIÓ",
      icon: "restaurant",
      items: [{ nameCa: "", nameEs: "", price: "" }]
    }
]);

export const getBlankWineMenu = () => ([
    {
        category: "NOVA CATEGORIA",
        groups: [{ sub: "", items: [{ name: "", desc: "", price: "" }] }]
    }
]);

export const getBlankGroupMenu = () => ({
    title: "NOU MENÚ DE GRUP",
    price: "00 EUROS",
    vat: "IVA INCLÒS",
    disclaimer: "",
    sections: [{ title: "PRIMERS", items: [{ nameCa: "", nameEs: "" }] }],
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
    onDeleteCard: () => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
    localConfig, setLocalConfig, menuViewState, setMenuViewState, editingMenuId, setEditingMenuId, onDeleteCard
}) => {

    const getCurrentMenuData = () => {
        if (!editingMenuId) return null;
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
        if (editingMenuId === 'main_food') {
            setLocalConfig((prev:any) => ({ ...prev, foodMenu: newData }));
        } else if (editingMenuId === 'main_wine') {
            setLocalConfig((prev:any) => ({ ...prev, wineMenu: newData }));
        } else if (editingMenuId === 'main_group') {
            setLocalConfig((prev:any) => ({ ...prev, groupMenu: newData }));
        } else {
            const extraIndex = parseInt(editingMenuId.replace('extra_', ''));
            if (!isNaN(extraIndex)) {
                setLocalConfig((prev:any) => {
                    const newExtras = [...(prev.extraMenus || [])];
                    if(newExtras[extraIndex]) {
                        newExtras[extraIndex] = { ...newExtras[extraIndex], data: newData };
                    }
                    return { ...prev, extraMenus: newExtras };
                });
            }
        }
    };

    const handleCreateNewCard = (type: 'food' | 'wine' | 'group') => {
        let newData;
        let title;
        if (type === 'food') { newData = getBlankFoodMenu(); title = "Nova Carta de Menjar"; } 
        else if (type === 'wine') { newData = getBlankWineMenu(); title = "Nova Carta de Vins"; } 
        else { newData = getBlankGroupMenu(); title = "Nou Menú de Grup"; }

        const newExtraMenu = { id: `menu_${Date.now()}`, type, title, data: newData };

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
            {menuViewState === 'dashboard' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative"><div className="h-24 bg-[#2c241b] flex items-center justify-center relative overflow-hidden"><span className="material-symbols-outlined text-6xl text-primary/20 absolute -right-2 -bottom-2">restaurant_menu</span><span className="text-white font-serif font-bold text-xl relative z-10">Carta de Menjar</span></div><div className="p-6"><p className="text-xs text-gray-500 mb-4">Edita els entrants, carns, peixos i postres principals.</p><button onClick={() => { setEditingMenuId('main_food'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"><span className="material-symbols-outlined text-sm">edit</span> Editar</button></div></div><div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative"><div className="h-24 bg-[#5d3a1a] flex items-center justify-center relative overflow-hidden"><span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">wine_bar</span><span className="text-white font-serif font-bold text-xl relative z-10">Carta de Vins</span></div><div className="p-6"><p className="text-xs text-gray-500 mb-4">Gestiona les referències de vins, D.O. i caves.</p><button onClick={() => { setEditingMenuId('main_wine'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"><span className="material-symbols-outlined text-sm">edit</span> Editar</button></div></div><div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative"><div className="h-24 bg-[#556b2f] flex items-center justify-center relative overflow-hidden"><span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">diversity_3</span><span className="text-white font-serif font-bold text-xl relative z-10">Menú de Grup</span></div><div className="p-6"><p className="text-xs text-gray-500 mb-4">Configura els plats, preus i condicions del menú de grup.</p><button onClick={() => { setEditingMenuId('main_group'); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"><span className="material-symbols-outlined text-sm">edit</span> Editar</button></div></div>{(localConfig.extraMenus || []).map((menu:any, idx:number) => { let headerColor = "bg-gray-700"; let icon = "restaurant"; if(menu.type === 'wine') { headerColor = "bg-[#8b5a2b]"; icon = "wine_bar"; } if(menu.type === 'group') { headerColor = "bg-olive"; icon = "diversity_3"; } return (<div key={menu.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative"><div className={`h-24 ${headerColor} flex items-center justify-center relative overflow-hidden`}><span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">{icon}</span><div className="text-center px-2"><span className="text-white font-serif font-bold text-lg relative z-10 block line-clamp-1">{menu.title}</span><span className="text-white/60 text-[10px] uppercase font-bold tracking-widest relative z-10 block">{menu.type === 'food' ? 'Carta Extra' : menu.type === 'wine' ? 'Vins Extra' : 'Grup Extra'}</span></div></div><div className="p-6"><button onClick={() => { setEditingMenuId(`extra_${idx}`); setMenuViewState('editor'); }} className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"><span className="material-symbols-outlined text-sm">edit</span> Editar</button></div></div>); })}<button onClick={() => setMenuViewState('type_selection')} className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group min-h-[200px]"><div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm"><span className="material-symbols-outlined text-3xl">add</span></div><span className="font-bold uppercase text-xs tracking-widest">Crear Nova Carta</span></button></div>)}
            {menuViewState === 'type_selection' && (<div className="max-w-2xl mx-auto py-10"><div className="flex items-center gap-2 mb-8"><button onClick={() => setMenuViewState('dashboard')} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">arrow_back</span></button><h3 className="text-2xl font-serif font-bold text-gray-800">Quina mena de carta vols crear?</h3></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><button onClick={() => handleCreateNewCard('food')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-primary hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"><span className="material-symbols-outlined text-5xl text-[#2c241b]">restaurant_menu</span><span className="font-bold text-gray-800">Carta de Menjar</span><span className="text-xs text-gray-500">Per a entrants, plats principals, tapes o postres.</span></button><button onClick={() => handleCreateNewCard('wine')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-[#8b5a2b] hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"><span className="material-symbols-outlined text-5xl text-[#8b5a2b]">wine_bar</span><span className="font-bold text-gray-800">Carta de Vins</span><span className="text-xs text-gray-500">Per a referències de vins, caves i licors.</span></button><button onClick={() => handleCreateNewCard('group')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-olive hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4"><span className="material-symbols-outlined text-5xl text-olive">diversity_3</span><span className="font-bold text-gray-800">Menú de Grup</span><span className="text-xs text-gray-500">Menú tancat amb preu fix i seccions.</span></button></div></div>)}
            {menuViewState === 'editor' && editingMenuId && (<div className="space-y-6"><div className="flex items-center justify-between border-b border-gray-200 pb-4"><div className="flex items-center gap-3"><button onClick={() => { setMenuViewState('dashboard'); setEditingMenuId(null); }} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button><div><h3 className="font-serif text-2xl font-bold text-gray-800">{editingMenuId.startsWith('extra_') ? (localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.title || 'Editant Carta') : (editingMenuId === 'main_food' ? 'Carta Principal' : editingMenuId === 'main_wine' ? 'Carta Vins' : 'Menú Grup')}</h3>{editingMenuId.startsWith('extra_') && (<input type="text" className="mt-1 border-b border-gray-300 focus:border-primary outline-none text-sm text-gray-500 w-64 bg-transparent" value={localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.title || ''} onChange={(e) => { const idx = parseInt(editingMenuId.replace('extra_','')); const newExtras = [...localConfig.extraMenus]; newExtras[idx].title = e.target.value; setLocalConfig((prev:any) => ({ ...prev, extraMenus: newExtras })); }} placeholder="Nom de la carta (Ex: Menú Calçotada)" />)}</div></div>{editingMenuId.startsWith('extra_') && (<button onClick={onDeleteCard} className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold uppercase transition-colors"><span className="material-symbols-outlined text-lg">delete</span> Esborrar Carta</button>)}</div><div className="bg-gray-50/50 p-1 rounded-lg">{(editingMenuId === 'main_food' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'food')) && (<FoodEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />)}{(editingMenuId === 'main_wine' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'wine')) && (<WineEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />)}{(editingMenuId === 'main_group' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'group')) && (<GroupEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />)}</div></div>)}
        </div>
    );
};