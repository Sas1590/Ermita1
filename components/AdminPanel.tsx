import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db, auth } from '../firebase';
import { ref, onValue, update, remove } from 'firebase/database';

interface AdminPanelProps {
  onSaveAndClose: () => void;
  onClose: () => void;
  initialTab?: 'config' | 'inbox'; 
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// --- CURATED LIST OF ICONS FOR RESTAURANT ---
const AVAILABLE_ICONS = [
    "restaurant", "restaurant_menu", "soup_kitchen", "skillet", "outdoor_grill",
    "tapas", "set_meal", "lunch_dining", "dinner_dining", "breakfast_dining",
    "brunch_dining", "ramen_dining", "pizza", "bakery_dining", "egg",
    "rice_bowl", "kebab_dining", "wine_bar", "liquor", "local_bar",
    "local_cafe", "coffee", "icecream", "cake", "cookie",
    "eco", "nutrition", "local_florist", "child_care", "star",
    "favorite", "celebration", "fastfood", "local_pizza", "sports_bar",
    "water_drop", "menu_book", "checkroom", "flatware", "local_fire_department"
];

// --- ICON PICKER COMPONENT ---
const IconPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
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

// --- ISOLATED EDITOR COMPONENTS (Fixes Focus Issues) ---

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

// Helper to get a blank Food Menu template
const getBlankFoodMenu = () => ([
    {
      id: `sec_${Date.now()}`,
      category: "NOVA SECCIÓ",
      icon: "restaurant",
      items: [{ nameCa: "", nameEs: "", price: "" }]
    }
]);

// Helper to get a blank Wine Menu template
const getBlankWineMenu = () => ([
    {
        category: "NOVA CATEGORIA",
        groups: [{ sub: "", items: [{ name: "", desc: "", price: "" }] }]
    }
]);

// Helper to get a blank Group Menu template
const getBlankGroupMenu = () => ({
    title: "NOU MENÚ DE GRUP",
    price: "00 EUROS",
    vat: "IVA INCLÒS",
    disclaimer: "",
    sections: [{ title: "PRIMERS", items: [{ nameCa: "", nameEs: "" }] }],
    drinks: ["Aigua i Vi"],
    infoIntro: "Informació del menú...",
    infoAllergy: "Informació d'al·lèrgens..."
});

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSaveAndClose, onClose, initialTab = 'config' }) => {
  const { config, updateConfig } = useConfig();
  // DEEP CLONE initial config to prevent reference sharing issues with context
  const [localConfig, setLocalConfig] = useState(() => JSON.parse(JSON.stringify(config)));
  const [isSaving, setIsSaving] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'config' | 'inbox' | 'menu'>(
      initialTab === 'inbox' ? 'inbox' : 'config'
  );

  // --- MENU DASHBOARD STATE ---
  // View States: 'dashboard' (grid of cards) | 'type_selection' (3 buttons) | 'editor' (form)
  const [menuViewState, setMenuViewState] = useState<'dashboard' | 'type_selection' | 'editor'>('dashboard');
  
  // Track which menu is being edited
  // ID can be 'main_food', 'main_wine', 'main_group', or an index/id from extraMenus
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  
  // --- CONFIRMATION STATE ---
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDeleteCardConfirmation, setShowDeleteCardConfirmation] = useState(false); // NEW STATE
  const [changedSections, setChangedSections] = useState<string[]>([]);
  const [showNoChangesAlert, setShowNoChangesAlert] = useState(false);

  // --- INBOX STATE ---
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch messages from Firebase
  useEffect(() => {
    const messagesRef = ref(db, 'contactMessages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const messageList: ContactMessage[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest
            
            setMessages(messageList);
            setUnreadCount(messageList.filter(m => !m.read).length);
        } else {
            setMessages([]);
            setUnreadCount(0);
        }
    });
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (messageId: string) => {
    try {
        await update(ref(db, `contactMessages/${messageId}`), { read: true });
    } catch (e) {
        console.error("Error marking as read", e);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
      try {
          await remove(ref(db, `contactMessages/${messageId}`));
      } catch (e) {
          console.error("Error deleting message", e);
      }
  };

  const handleChange = (section: keyof typeof localConfig, key: string, value: string) => {
    if (section === 'contact' && key === 'phoneNumbers') {
      setLocalConfig((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          // @ts-ignore
          [key]: value.split(',').map(s => s.trim()), 
        },
      }));
    } else {
      // @ts-ignore
      setLocalConfig((prev: any) => ({
        ...prev,
        [section]: {
          // @ts-ignore
          ...prev[section],
          [key]: value,
        },
      }));
    }
  };

  // Helper for arrays (images)
  const handleArrayChange = (section: string, key: string, value: string) => {
      // Split by newline and remove empty strings
      const arr = value.split('\n').map(s => s.trim()).filter(s => s !== '');
      setLocalConfig((prev: any) => ({
          ...prev,
          [section]: {
              ...prev[section],
              [key]: arr
          }
      }));
  };

  // --- MENU DATA HANDLERS ---

  // Unified function to get data for the current editing context
  const getCurrentMenuData = () => {
      if (!editingMenuId) return null;
      if (editingMenuId === 'main_food') return localConfig.foodMenu;
      if (editingMenuId === 'main_wine') return localConfig.wineMenu;
      if (editingMenuId === 'main_group') return localConfig.groupMenu;
      
      // Handle extra menus
      const extraIndex = parseInt(editingMenuId.replace('extra_', ''));
      if (!isNaN(extraIndex) && localConfig.extraMenus && localConfig.extraMenus[extraIndex]) {
          return localConfig.extraMenus[extraIndex].data;
      }
      return null;
  };

  // Unified function to update data
  const updateCurrentMenuData = (newData: any) => {
      if (!editingMenuId) return;

      if (editingMenuId === 'main_food') {
          setLocalConfig((prev:any) => ({ ...prev, foodMenu: newData }));
      } else if (editingMenuId === 'main_wine') {
          setLocalConfig((prev:any) => ({ ...prev, wineMenu: newData }));
      } else if (editingMenuId === 'main_group') {
          setLocalConfig((prev:any) => ({ ...prev, groupMenu: newData }));
      } else {
          // Extra menus
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

  // Handler to create a new card
  const handleCreateNewCard = (type: 'food' | 'wine' | 'group') => {
      let newData;
      let title;
      
      if (type === 'food') {
          newData = getBlankFoodMenu();
          title = "Nova Carta de Menjar";
      } else if (type === 'wine') {
          newData = getBlankWineMenu();
          title = "Nova Carta de Vins";
      } else {
          newData = getBlankGroupMenu();
          title = "Nou Menú de Grup";
      }

      const newExtraMenu = {
          id: `menu_${Date.now()}`,
          type,
          title,
          data: newData
      };

      setLocalConfig((prev:any) => {
          const updatedExtras = [...(prev.extraMenus || []), newExtraMenu];
          // Determine the new index for editing
          const newIndex = updatedExtras.length - 1;
          
          // Use setTimeout to ensure state update before switching view
          setTimeout(() => {
              setEditingMenuId(`extra_${newIndex}`);
              setMenuViewState('editor');
          }, 0);

          return { ...prev, extraMenus: updatedExtras };
      });
  };

  // Handler to delete the card currently being edited - MODAL TRIGGER
  const handleDeleteCurrentCard = () => {
      if (!editingMenuId?.startsWith('extra_')) return;
      setShowDeleteCardConfirmation(true);
  };

  // ACTUAL DELETE LOGIC
  const confirmDeleteCard = () => {
      if (!editingMenuId) return;
      const index = parseInt(editingMenuId.replace('extra_', ''));
      
      setLocalConfig((prev:any) => {
          const newExtras = [...(prev.extraMenus || [])];
          if (index >= 0 && index < newExtras.length) {
              newExtras.splice(index, 1);
          }
          return { ...prev, extraMenus: newExtras };
      });
      
      // Close editor and go back to dashboard
      setShowDeleteCardConfirmation(false);
      setMenuViewState('dashboard');
      setEditingMenuId(null);
  };

  // --- SAVE LOGIC ---
  const cleanDataForComparison = (data: typeof config) => {
      return {
          ...data,
          hero: {
              ...data.hero,
              backgroundImages: data.hero.backgroundImages?.filter(i => i && i.trim() !== '') || []
          },
          philosophy: {
              ...data.philosophy,
              historicImages: data.philosophy.historicImages?.filter(i => i && i.trim() !== '') || [],
              productImages: data.philosophy.productImages?.filter(i => i && i.trim() !== '') || []
          },
          // Ensure extraMenus is always an array for robust comparison
          extraMenus: data.extraMenus || []
      };
  };

  const detectChanges = () => {
      const original = cleanDataForComparison(config);
      const current = cleanDataForComparison(localConfig);
      const changes: string[] = [];

      if (JSON.stringify(original.hero) !== JSON.stringify(current.hero)) changes.push("Hero (Portada / Reserva)");
      if (JSON.stringify(original.groupMenu) !== JSON.stringify(current.groupMenu)) changes.push("Menú de Grup");
      if (JSON.stringify(original.foodMenu) !== JSON.stringify(current.foodMenu)) changes.push("Carta Menjar");
      if (JSON.stringify(original.wineMenu) !== JSON.stringify(current.wineMenu)) changes.push("Carta Vins");
      if (JSON.stringify(original.contact) !== JSON.stringify(current.contact)) changes.push("Contacte i Horaris");
      if (JSON.stringify(original.intro) !== JSON.stringify(current.intro)) changes.push("Intro");
      if (JSON.stringify(original.specialties) !== JSON.stringify(current.specialties)) changes.push("Especialitats");
      if (JSON.stringify(original.philosophy) !== JSON.stringify(current.philosophy)) changes.push("Filosofia / Història");
      if (JSON.stringify(original.brand) !== JSON.stringify(current.brand)) changes.push("Identitat (Logo)");
      
      // Explicit array comparison for extraMenus to handle undefined vs empty vs populated
      const origExtras = original.extraMenus || [];
      const currExtras = current.extraMenus || [];
      if (JSON.stringify(origExtras) !== JSON.stringify(currExtras)) changes.push("Cartes Adicionals");

      return changes;
  };

  const handlePreSave = () => {
      const changes = detectChanges();
      
      if (changes.length === 0) {
          setShowNoChangesAlert(true);
      } else {
          setChangedSections(changes);
          setShowSaveConfirmation(true);
      }
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    const cleanConfig = cleanDataForComparison(localConfig);
    await updateConfig(cleanConfig);
    setIsSaving(false);
    setShowSaveConfirmation(false);
    onSaveAndClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4 overflow-auto">
      
      {/* --- CUSTOM DELETE CARD MODAL --- */}
      {showDeleteCardConfirmation && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-[fadeIn_0.2s_ease-out] border-t-4 border-red-500">
                  <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                          <span className="material-symbols-outlined text-2xl text-red-500">delete_forever</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-gray-800">Esborrar Carta?</h3>
                      <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                          Estàs segur que vols eliminar aquesta carta? <br/>
                          <span className="font-bold text-red-500">Aquesta acció no es pot desfer.</span>
                      </p>
                  </div>
                  <div className="flex gap-3">
                      <button 
                          onClick={() => setShowDeleteCardConfirmation(false)}
                          className="flex-1 py-2.5 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors"
                      >
                          Cancel·lar
                      </button>
                      <button 
                          onClick={confirmDeleteCard}
                          className="flex-1 py-2.5 bg-red-500 text-white rounded font-bold uppercase text-xs hover:bg-red-600 shadow-lg transition-colors"
                      >
                          Sí, Esborrar
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- SAVE CONFIRMATION MODAL --- */}
      {showSaveConfirmation && (
          <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-[fadeIn_0.2s_ease-out] border-t-4 border-primary">
                  <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <span className="material-symbols-outlined text-4xl text-primary">save</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-secondary">Confirmar Canvis</h3>
                      <p className="text-gray-500 mt-2">S'han detectat modificacions a les següents seccions:</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded border border-gray-200 p-4 mb-6">
                      <ul className="space-y-2">
                          {changedSections.map((section, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                  <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                  {section}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <p className="text-center text-sm text-gray-400 mb-6 italic">¿Estàs segur que vols guardar aquests canvis permanentment?</p>

                  <div className="flex gap-3">
                      <button 
                          onClick={() => setShowSaveConfirmation(false)}
                          className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors"
                      >
                          Cancel·lar
                      </button>
                      <button 
                          onClick={handleConfirmSave}
                          disabled={isSaving}
                          className="flex-1 py-3 bg-primary text-white rounded font-bold uppercase text-xs hover:bg-accent transition-colors shadow-lg"
                      >
                          {isSaving ? 'Guardant...' : 'Sí, Guardar'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {showNoChangesAlert && (
          <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-[fadeIn_0.2s_ease-out] text-center">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="material-symbols-outlined text-2xl text-gray-400">rule</span>
                   </div>
                   <h3 className="font-bold text-lg text-gray-800 mb-2">Sense canvis</h3>
                   <p className="text-gray-500 text-sm mb-6">No s'ha detectat cap modificació respecte a la versió actual.</p>
                   <button 
                      onClick={() => setShowNoChangesAlert(false)}
                      className="w-full py-2 bg-gray-800 text-white rounded font-bold uppercase text-xs hover:bg-black transition-colors"
                   >
                      Entesos
                   </button>
              </div>
          </div>
      )}

      <div className="bg-beige text-secondary p-0 rounded-lg shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col relative border border-primary/20 overflow-hidden">
        
        {/* Header with Tabs and Notification Bell */}
        <div className="bg-white border-b border-primary/20 px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex flex-col">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">settings_suggest</span>
              Panell d'Administrador
            </h2>
            {auth.currentUser?.email && (
              <span className="text-xs text-gray-400 font-mono mt-1 ml-10">
                Loguejat com: {auth.currentUser.email}
              </span>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Notification Area */}
              <div className="flex items-center gap-2">
                 {/* Mail Inbox Button */}
                 <button 
                    onClick={() => setActiveTab('inbox')}
                    className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${activeTab === 'inbox' ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}
                    title="Bústia de Missatges"
                  >
                      <span className="material-symbols-outlined text-3xl">mail</span>
                      {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                              {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                      )}
                  </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg justify-center md:justify-start">
                <button 
                  onClick={() => setActiveTab('config')}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'config' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  General
                </button>
                <button 
                  onClick={() => { setActiveTab('menu'); setMenuViewState('dashboard'); setEditingMenuId(null); }}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'menu' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Gestió Menú
                </button>
              </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-beige/50">
          
          {/* --- INBOX TAB --- */}
          {activeTab === 'inbox' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  {/* Messages rendering code */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">mail</span>
                        Bústia de Missatges
                    </h3>
                    <div className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">Total: {messages.length}</div>
                  </div>

                  {messages.length === 0 ? (
                      <div className="text-center py-20 opacity-50">
                          <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">drafts</span>
                          <p className="text-lg text-gray-400">No tens cap missatge.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {messages.map((msg) => (
                              <div key={msg.id} className={`rounded-lg p-6 border relative overflow-hidden ${msg.read ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-primary shadow-lg border-l-[6px] border-l-primary'}`}>
                                  {!msg.read && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg shadow-sm">Nou Missatge</div>}
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 pr-16">
                                      <div className="flex items-center gap-3">
                                          <h4 className={`text-lg ${msg.read ? 'font-medium text-gray-600' : 'font-bold text-black'}`}>{msg.subject || '(Sense assumpte)'}</h4>
                                      </div>
                                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{new Date(msg.timestamp).toLocaleString('ca-ES')}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 text-sm">
                                      <div className="p-3 rounded border bg-primary/5 border-primary/10">
                                          <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nom</span><span className="font-semibold text-secondary">{msg.name}</span>
                                      </div>
                                      <div className="p-3 rounded border bg-primary/5 border-primary/10">
                                          <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Email</span><span className="text-primary font-semibold">{msg.email}</span>
                                      </div>
                                      <div className="p-3 rounded border bg-primary/5 border-primary/10">
                                          <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telèfon</span><span className="text-secondary font-semibold">{msg.phone}</span>
                                      </div>
                                  </div>
                                  <div className="p-5 rounded border mb-4 bg-white border-gray-100"><p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p></div>
                                  <div className="flex justify-end gap-3 mt-4">
                                      {!msg.read && <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }} className="px-3 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold uppercase flex items-center gap-1"><span className="material-symbols-outlined text-sm">mark_email_read</span> Marcar llegit</button>}
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="px-3 py-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold uppercase flex items-center gap-1"><span className="material-symbols-outlined text-sm">delete</span> Esborrar</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* --- NEW MENU DASHBOARD (Card Grid) --- */}
          {activeTab === 'menu' && (
              <div className="animate-[fadeIn_0.3s_ease-out] h-full flex flex-col">
                  
                  {/* VIEW 1: DASHBOARD (Grid) */}
                  {menuViewState === 'dashboard' && (
                      <div className="space-y-8">
                          <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                              <h3 className="font-serif text-2xl font-bold text-secondary">Les teves Cartes</h3>
                              <button 
                                  onClick={() => setMenuViewState('type_selection')}
                                  className="bg-primary text-white px-5 py-2.5 rounded shadow-lg hover:bg-accent hover:scale-105 transition-all flex items-center gap-2 font-bold uppercase text-xs tracking-widest"
                              >
                                  <span className="material-symbols-outlined text-lg">add_circle</span>
                                  Afegir Nova Carta
                              </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* MAIN FOOD CARD */}
                              <div onClick={() => { setEditingMenuId('main_food'); setMenuViewState('editor'); }} className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-200 hover:border-primary transition-all p-6 relative overflow-hidden h-48 flex flex-col justify-between">
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="material-symbols-outlined text-8xl text-primary">restaurant</span></div>
                                  <div>
                                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary"><span className="material-symbols-outlined">restaurant</span></div>
                                      <h4 className="font-serif text-xl font-bold text-gray-800">Carta de Menjar</h4>
                                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Principal</p>
                                  </div>
                                  <div className="flex justify-between items-end">
                                      <span className="text-xs font-bold text-primary group-hover:underline">EDITAR CARTA</span>
                                  </div>
                              </div>

                              {/* MAIN WINE CARD */}
                              <div onClick={() => { setEditingMenuId('main_wine'); setMenuViewState('editor'); }} className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-200 hover:border-primary transition-all p-6 relative overflow-hidden h-48 flex flex-col justify-between">
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="material-symbols-outlined text-8xl text-primary">wine_bar</span></div>
                                  <div>
                                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary"><span className="material-symbols-outlined">wine_bar</span></div>
                                      <h4 className="font-serif text-xl font-bold text-gray-800">Carta de Vins</h4>
                                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Principal</p>
                                  </div>
                                  <div className="flex justify-between items-end">
                                      <span className="text-xs font-bold text-primary group-hover:underline">EDITAR CARTA</span>
                                  </div>
                              </div>

                              {/* MAIN GROUP CARD */}
                              <div onClick={() => { setEditingMenuId('main_group'); setMenuViewState('editor'); }} className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl border border-gray-200 hover:border-primary transition-all p-6 relative overflow-hidden h-48 flex flex-col justify-between">
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="material-symbols-outlined text-8xl text-primary">diversity_3</span></div>
                                  <div>
                                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary"><span className="material-symbols-outlined">diversity_3</span></div>
                                      <h4 className="font-serif text-xl font-bold text-gray-800">Menú de Grup</h4>
                                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Principal</p>
                                  </div>
                                  <div className="flex justify-between items-end">
                                      <span className="text-xs font-bold text-primary group-hover:underline">EDITAR CARTA</span>
                                  </div>
                              </div>

                              {/* DYNAMIC CARDS (EXTRAS) */}
                              {(localConfig.extraMenus || []).map((menu: any, index: number) => (
                                  <div key={menu.id} onClick={() => { setEditingMenuId(`extra_${index}`); setMenuViewState('editor'); }} className="group cursor-pointer bg-[#f9f7f2] rounded-lg shadow-sm hover:shadow-xl border border-dashed border-gray-300 hover:border-primary transition-all p-6 relative overflow-hidden h-48 flex flex-col justify-between">
                                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                          <span className="material-symbols-outlined text-8xl text-gray-500">
                                              {menu.type === 'food' ? 'restaurant' : menu.type === 'wine' ? 'wine_bar' : 'diversity_3'}
                                          </span>
                                      </div>
                                      <div>
                                          <div className="w-10 h-10 bg-gray-200 group-hover:bg-primary/20 rounded-full flex items-center justify-center mb-4 text-gray-500 group-hover:text-primary transition-colors">
                                              <span className="material-symbols-outlined">
                                                  {menu.type === 'food' ? 'restaurant' : menu.type === 'wine' ? 'wine_bar' : 'diversity_3'}
                                              </span>
                                          </div>
                                          <h4 className="font-serif text-xl font-bold text-gray-800 line-clamp-1" title={menu.title}>{menu.title || 'Sense Títol'}</h4>
                                          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{menu.type === 'group' ? 'Menú Grup' : `Carta ${menu.type === 'food' ? 'Menjar' : 'Vins'}`}</p>
                                      </div>
                                      <div className="flex justify-between items-end">
                                          <span className="text-xs font-bold text-primary group-hover:underline">EDITAR</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* VIEW 2: TYPE SELECTION */}
                  {menuViewState === 'type_selection' && (
                      <div className="flex flex-col h-full">
                          <button 
                              onClick={() => setMenuViewState('dashboard')}
                              className="self-start flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase text-xs tracking-widest mb-8"
                          >
                              <span className="material-symbols-outlined text-lg">arrow_back</span>
                              Tornar al Tauler
                          </button>

                          <div className="flex flex-col items-center justify-center flex-1">
                              <h3 className="font-serif text-3xl font-bold text-secondary mb-10">Quin tipus de carta vols crear?</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                                  {/* OPTION 1: FOOD */}
                                  <button onClick={() => handleCreateNewCard('food')} className="group bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-primary transition-all flex flex-col items-center text-center gap-4">
                                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                                          <span className="material-symbols-outlined text-5xl text-primary group-hover:text-white">restaurant</span>
                                      </div>
                                      <h4 className="font-serif text-2xl font-bold text-gray-800">Carta de Menjar</h4>
                                      <p className="text-sm text-gray-500">Per a plats, entrants, tapes i postres.</p>
                                  </button>

                                  {/* OPTION 2: WINE */}
                                  <button onClick={() => handleCreateNewCard('wine')} className="group bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-primary transition-all flex flex-col items-center text-center gap-4">
                                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                                          <span className="material-symbols-outlined text-5xl text-primary group-hover:text-white">wine_bar</span>
                                      </div>
                                      <h4 className="font-serif text-2xl font-bold text-gray-800">Carta de Vins</h4>
                                      <p className="text-sm text-gray-500">Per a vins, caves, licors i begudes.</p>
                                  </button>

                                  {/* OPTION 3: GROUP */}
                                  <button onClick={() => handleCreateNewCard('group')} className="group bg-white p-10 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-primary transition-all flex flex-col items-center text-center gap-4">
                                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                                          <span className="material-symbols-outlined text-5xl text-primary group-hover:text-white">diversity_3</span>
                                      </div>
                                      <h4 className="font-serif text-2xl font-bold text-gray-800">Menú de Grup</h4>
                                      <p className="text-sm text-gray-500">Menú tancat amb preu fix i opcions.</p>
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* VIEW 3: EDITOR (Generic Wrapper) */}
                  {menuViewState === 'editor' && editingMenuId && (
                      <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                              <div className="flex items-center gap-4">
                                  <button 
                                      onClick={() => setMenuViewState('dashboard')}
                                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                                      title="Tornar"
                                  >
                                      <span className="material-symbols-outlined text-2xl">arrow_back</span>
                                  </button>
                                  <div>
                                      {/* Allow editing title for Extra Menus */}
                                      {editingMenuId.startsWith('extra_') ? (
                                          <input 
                                              type="text" 
                                              value={localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_', ''))]?.title} 
                                              onChange={(e) => {
                                                  const idx = parseInt(editingMenuId.replace('extra_', ''));
                                                  setLocalConfig((prev:any) => {
                                                      const newExtras = [...prev.extraMenus];
                                                      newExtras[idx] = { ...newExtras[idx], title: e.target.value };
                                                      return { ...prev, extraMenus: newExtras };
                                                  });
                                              }}
                                              className="font-serif text-2xl font-bold text-gray-800 bg-transparent border-b border-transparent focus:border-primary outline-none w-full"
                                          />
                                      ) : (
                                          <h3 className="font-serif text-2xl font-bold text-gray-800">
                                              {editingMenuId === 'main_food' ? 'Carta de Menjar (Principal)' : 
                                               editingMenuId === 'main_wine' ? 'Carta de Vins (Principal)' : 
                                               'Menú de Grup (Principal)'}
                                          </h3>
                                      )}
                                  </div>
                              </div>
                              
                              {/* DELETE BUTTON FOR EXTRA MENUS (Moved here for better UX) */}
                              {editingMenuId.startsWith('extra_') && (
                                  <button 
                                      onClick={handleDeleteCurrentCard}
                                      className="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm group"
                                      title="Esborrar aquesta carta permanentment"
                                  >
                                      <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">delete</span>
                                      <span className="text-xs font-bold uppercase hidden md:inline tracking-wider">Esborrar Carta</span>
                                  </button>
                              )}
                          </div>

                          <div className="flex-1 overflow-y-auto pr-2">
                              {/* RENDER SPECIFIC EDITOR BASED ON TYPE */}
                              {(() => {
                                  const data = getCurrentMenuData();
                                  
                                  // SAFEGUARD: If data is not ready, don't render editor to avoid crashes
                                  if (!data) return <div className="text-center p-10 text-gray-500">Carregant dades...</div>;

                                  let type = 'food';
                                  if (editingMenuId === 'main_wine') type = 'wine';
                                  if (editingMenuId === 'main_group') type = 'group';
                                  if (editingMenuId.startsWith('extra_')) {
                                      const idx = parseInt(editingMenuId.replace('extra_', ''));
                                      if (localConfig.extraMenus && localConfig.extraMenus[idx]) {
                                          type = localConfig.extraMenus[idx].type;
                                      }
                                  }

                                  if (type === 'food') return <FoodEditor data={data} onChange={updateCurrentMenuData} />;
                                  if (type === 'wine') return <WineEditor data={data} onChange={updateCurrentMenuData} />;
                                  if (type === 'group') return <GroupEditor data={data} onChange={updateCurrentMenuData} />;
                                  return null;
                              })()}
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* ... CONFIGURATION TAB ... */}
          {activeTab === 'config' && (
             <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                {/* 1. Brand Section (LOGO) */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                  <h3 className="font-serif text-xl font-semibold text-accent mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">branding_watermark</span>
                    Identitat (Logo)
                  </h3>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Logo URL o Base64</label>
                      <textarea
                        value={localConfig.brand.logoUrl}
                        onChange={(e) => handleChange('brand', 'logoUrl', e.target.value)}
                        rows={2}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-accent outline-none font-mono text-xs"
                        placeholder="Enganxa aquí el codi data:image/png;base64..."
                      ></textarea>
                  </div>
                </div>

                {/* 2. Hero Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <h3 className="font-serif text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">home</span>
                    Hero (Portada i Reserva)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Formulari</label>
                      <input type="text" value={localConfig.hero.reservationFormTitle} onChange={(e) => handleChange('hero', 'reservationFormTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtítol</label>
                      <input type="text" value={localConfig.hero.reservationFormSubtitle} onChange={(e) => handleChange('hero', 'reservationFormSubtitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telèfon (Mostrar)</label>
                      <input type="text" value={localConfig.hero.reservationPhoneNumber} onChange={(e) => handleChange('hero', 'reservationPhoneNumber', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó</label>
                      <input type="text" value={localConfig.hero.reservationButtonText} onChange={(e) => handleChange('hero', 'reservationButtonText', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2">
                      <h4 className="font-bold text-sm text-gray-500 mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-sm">schedule</span> Restriccions de Reserva</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Inici (ex: 13:00)</label>
                              <input type="time" value={localConfig.hero.reservationTimeStart} onChange={(e) => handleChange('hero', 'reservationTimeStart', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none" />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Fi (ex: 15:30)</label>
                              <input type="time" value={localConfig.hero.reservationTimeEnd} onChange={(e) => handleChange('hero', 'reservationTimeEnd', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none" />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Interval (min)</label>
                              <input type="number" value={localConfig.hero.reservationTimeInterval} onChange={(e) => handleChange('hero', 'reservationTimeInterval', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none" />
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Missatge d'error (Fora d'horari)</label>
                          <input type="text" value={localConfig.hero.reservationErrorMessage} onChange={(e) => handleChange('hero', 'reservationErrorMessage', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none" />
                      </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2">
                      <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                              <label className="block text-[10px] font-bold uppercase text-gray-400">Text Nota Enganxada (Post-it)</label>
                              <span className="text-[10px] text-gray-400">{localConfig.hero.stickyNoteText?.length || 0}/45</span>
                          </div>
                          <input 
                              type="text" 
                              maxLength={45}
                              value={localConfig.hero.stickyNoteText} 
                              onChange={(e) => handleChange('hero', 'stickyNoteText', e.target.value)} 
                              className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none" 
                          />
                          <p className="text-[10px] text-gray-400 mt-1 italic">Limitat a 45 caràcters per mantenir el disseny.</p>
                      </div>
                      
                      <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Imatges de Fons (Slides) - Una URL per línia</label>
                          <textarea
                              value={localConfig.hero.backgroundImages?.join('\n')}
                              onChange={(e) => handleArrayChange('hero', 'backgroundImages', e.target.value)}
                              rows={4}
                              className="block w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono focus:border-primary outline-none"
                              placeholder="https://exemple.com/imatge1.jpg"
                          ></textarea>
                      </div>
                  </div>
                </div>

                {/* 3. Intro Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-olive"></div>
                  <h3 className="font-serif text-xl font-semibold text-olive mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">format_quote</span>
                    Intro (Frase Inicial)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Petit</label>
                          <input type="text" value={localConfig.intro.smallTitle} onChange={(e) => handleChange('intro', 'smallTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal</label>
                          <input type="text" value={localConfig.intro.mainTitle} onChange={(e) => handleChange('intro', 'mainTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció (Cita)</label>
                      <textarea value={localConfig.intro.description} onChange={(e) => handleChange('intro', 'description', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none"></textarea>
                  </div>
                </div>

                {/* 4. Specialties Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600"></div>
                  <h3 className="font-serif text-xl font-semibold text-yellow-600 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">stars</span>
                    Especialitats
                  </h3>
                  <div className="mb-4">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label>
                      <input type="text" value={localConfig.specialties.sectionTitle} onChange={(e) => handleChange('specialties', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none" />
                  </div>
                  <div className="mb-4">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal</label>
                      <input type="text" value={localConfig.specialties.mainTitle} onChange={(e) => handleChange('specialties', 'mainTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció</label>
                      <textarea value={localConfig.specialties.description} onChange={(e) => handleChange('specialties', 'description', e.target.value)} rows={2} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none"></textarea>
                  </div>

                  {/* SPECIALTIES ITEMS EDITOR */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Targetes destacades</label>
                      <div className="space-y-4">
                          {(localConfig.specialties.items || []).map((item: any, idx: number) => (
                              <div 
                                  key={idx} 
                                  className={`p-4 rounded border transition-colors relative group ${item.visible === false ? 'bg-gray-200 border-gray-300 opacity-60 grayscale' : 'bg-gray-50 border-gray-200'}`}
                              >
                                  <button
                                      onClick={() => {
                                          const newItems = [...localConfig.specialties.items];
                                          // Toggle visibility (undefined is considered true)
                                          const currentVisibility = newItems[idx].visible !== false;
                                          newItems[idx] = { ...newItems[idx], visible: !currentVisibility };
                                          setLocalConfig((prev:any) => ({
                                              ...prev,
                                              specialties: { ...prev.specialties, items: newItems }
                                          }));
                                      }}
                                      className={`absolute top-2 right-2 rounded-full p-1 shadow-sm transition-colors ${item.visible === false ? 'bg-gray-800 text-white hover:bg-black' : 'bg-white text-gray-400 hover:text-primary'}`}
                                      title={item.visible === false ? "Fer visible" : "Ocultar"}
                                  >
                                      <span className="material-symbols-outlined text-lg">
                                          {item.visible === false ? 'visibility_off' : 'visibility'}
                                      </span>
                                  </button>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                      <div>
                                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol</label>
                                          <input
                                              value={item.title}
                                              onChange={(e) => {
                                                  const newItems = [...localConfig.specialties.items];
                                                  newItems[idx] = { ...newItems[idx], title: e.target.value };
                                                  setLocalConfig((prev:any) => ({
                                                      ...prev,
                                                      specialties: { ...prev.specialties, items: newItems }
                                                  }));
                                              }}
                                              className="block w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-yellow-600 font-bold"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label>
                                          <input
                                              value={item.subtitle}
                                              onChange={(e) => {
                                                  const newItems = [...localConfig.specialties.items];
                                                  newItems[idx] = { ...newItems[idx], subtitle: e.target.value };
                                                  setLocalConfig((prev:any) => ({
                                                      ...prev,
                                                      specialties: { ...prev.specialties, items: newItems }
                                                  }));
                                              }}
                                              className="block w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-yellow-600 font-hand text-gray-600"
                                          />
                                      </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="md:col-span-2">
                                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">URL Imatge</label>
                                          <input
                                              value={item.image}
                                              onChange={(e) => {
                                                  const newItems = [...localConfig.specialties.items];
                                                  newItems[idx] = { ...newItems[idx], image: e.target.value };
                                                  setLocalConfig((prev:any) => ({
                                                      ...prev,
                                                      specialties: { ...prev.specialties, items: newItems }
                                                  }));
                                              }}
                                              className="block w-full border border-gray-300 rounded px-2 py-1 text-xs font-mono outline-none focus:border-yellow-600 text-gray-500"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta (Badge)</label>
                                          <input
                                              value={item.badge || ''}
                                              onChange={(e) => {
                                                  const newItems = [...localConfig.specialties.items];
                                                  newItems[idx] = { ...newItems[idx], badge: e.target.value };
                                                  setLocalConfig((prev:any) => ({
                                                      ...prev,
                                                      specialties: { ...prev.specialties, items: newItems }
                                                  }));
                                              }}
                                              placeholder="Ex: TEMPORADA"
                                              className="block w-full border border-gray-300 rounded px-2 py-1 text-xs font-bold outline-none focus:border-yellow-600 text-center uppercase tracking-wider"
                                          />
                                      </div>
                                  </div>
                              </div>
                          ))}
                          <button
                              onClick={() => {
                                  const newItems = [...(localConfig.specialties.items || []), { title: "Nou Plat", subtitle: "Descripció", image: "", badge: "", visible: true }];
                                  setLocalConfig((prev:any) => ({
                                      ...prev,
                                      specialties: { ...prev.specialties, items: newItems }
                                  }));
                              }}
                              className="text-xs font-bold text-yellow-600 uppercase flex items-center gap-1 hover:underline tracking-wider"
                          >
                              <span className="material-symbols-outlined text-sm">add_circle</span> Afegir Especialitat
                          </button>
                      </div>
                  </div>
                </div>

                {/* 5. Philosophy Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-stone-600"></div>
                  <h3 className="font-serif text-xl font-semibold text-stone-600 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">history_edu</span>
                    Filosofia i Història
                  </h3>
                  
                  {/* General Header */}
                  <div className="mb-6 border-b border-gray-100 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label>
                              <input type="text" value={localConfig.philosophy.sectionTitle} onChange={(e) => handleChange('philosophy', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció General</label>
                              <input type="text" value={localConfig.philosophy.description} onChange={(e) => handleChange('philosophy', 'description', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Línia 1</label>
                              <input type="text" value={localConfig.philosophy.titleLine1} onChange={(e) => handleChange('philosophy', 'titleLine1', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Línia 2</label>
                              <input type="text" value={localConfig.philosophy.titleLine2} onChange={(e) => handleChange('philosophy', 'titleLine2', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                      </div>
                  </div>

                  {/* Product Column */}
                  <div className="mb-6 border-b border-gray-100 pb-4">
                      <h4 className="font-bold text-stone-600 mb-3">Columna Producte (Esquerra)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Producte</label>
                              <input type="text" value={localConfig.philosophy.productTitle} onChange={(e) => handleChange('philosophy', 'productTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Etiqueta Nota (Post-it)</label>
                              <input type="text" value={localConfig.philosophy.cardTag} onChange={(e) => handleChange('philosophy', 'cardTag', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Producte</label>
                          <textarea value={localConfig.philosophy.productDescription} onChange={(e) => handleChange('philosophy', 'productDescription', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none"></textarea>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Imatges Producte (Slides) - Una URL per línia</label>
                          <textarea
                              value={localConfig.philosophy.productImages?.join('\n')}
                              onChange={(e) => handleArrayChange('philosophy', 'productImages', e.target.value)}
                              rows={3}
                              className="block w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono focus:border-stone-600 outline-none"
                          ></textarea>
                      </div>
                  </div>

                  {/* Historic Column */}
                  <div>
                      <h4 className="font-bold text-stone-600 mb-3">Columna Història (Dreta)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Història</label>
                              <input type="text" value={localConfig.philosophy.historicTitle} onChange={(e) => handleChange('philosophy', 'historicTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Botó</label>
                              <input type="text" value={localConfig.philosophy.historicLinkUrl} onChange={(e) => handleChange('philosophy', 'historicLinkUrl', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" />
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Història</label>
                          <textarea value={localConfig.philosophy.historicDescription} onChange={(e) => handleChange('philosophy', 'historicDescription', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none"></textarea>
                      </div>
                      <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Imatges Història (Slides) - Una URL per línia</label>
                          <textarea
                              value={localConfig.philosophy.historicImages?.join('\n')}
                              onChange={(e) => handleArrayChange('philosophy', 'historicImages', e.target.value)}
                              rows={3}
                              className="block w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono focus:border-stone-600 outline-none"
                          ></textarea>
                      </div>
                  </div>
                </div>

                {/* 6. Contact Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                  <h3 className="font-serif text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">call</span>
                    Contacte
                  </h3>
                  
                  {/* Sticky Note */}
                  <div className="mb-6 border-b border-gray-100 pb-4">
                      <h4 className="font-bold text-red-800 mb-3 text-xs uppercase">Nota Important (Post-it)</h4>
                      <div className="mb-3">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Nota</label>
                          <input type="text" value={localConfig.contact.importantNoteTitle} onChange={(e) => handleChange('contact', 'importantNoteTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Missatge 1</label>
                              <input type="text" value={localConfig.contact.importantNoteMessage1} onChange={(e) => handleChange('contact', 'importantNoteMessage1', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Missatge 2</label>
                              <input type="text" value={localConfig.contact.importantNoteMessage2} onChange={(e) => handleChange('contact', 'importantNoteMessage2', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                      </div>
                  </div>

                  {/* General Info */}
                  <div className="mb-6 border-b border-gray-100 pb-4">
                      <h4 className="font-bold text-red-800 mb-3 text-xs uppercase">Informació General</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label>
                              <input type="text" value={localConfig.contact.sectionTitle} onChange={(e) => handleChange('contact', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Localització</label>
                              <input type="text" value={localConfig.contact.locationTitle} onChange={(e) => handleChange('contact', 'locationTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 1</label>
                              <input type="text" value={localConfig.contact.addressLine1} onChange={(e) => handleChange('contact', 'addressLine1', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 2</label>
                              <input type="text" value={localConfig.contact.addressLine2} onChange={(e) => handleChange('contact', 'addressLine2', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horari</label>
                              <input type="text" value={localConfig.contact.schedule} onChange={(e) => handleChange('contact', 'schedule', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telèfons (separats per coma)</label>
                              <input type="text" value={localConfig.contact.phoneNumbers.join(', ')} onChange={(e) => handleChange('contact', 'phoneNumbers', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Google Maps</label>
                          <input type="text" value={localConfig.contact.mapUrl} onChange={(e) => handleChange('contact', 'mapUrl', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                      </div>
                  </div>

                  {/* Social & Form */}
                  <div>
                      <h4 className="font-bold text-red-800 mb-3 text-xs uppercase">Xarxes i Formulari</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Xarxes</label>
                              <input type="text" value={localConfig.contact.socialTitle} onChange={(e) => handleChange('contact', 'socialTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Xarxes</label>
                              <input type="text" value={localConfig.contact.socialDescription} onChange={(e) => handleChange('contact', 'socialDescription', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó Xarxes</label>
                              <input type="text" value={localConfig.contact.socialButtonText} onChange={(e) => handleChange('contact', 'socialButtonText', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">URL Instagram</label>
                              <input type="text" value={localConfig.contact.instagramUrl} onChange={(e) => handleChange('contact', 'instagramUrl', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Formulari</label>
                              <input type="text" value={localConfig.contact.formTitle} onChange={(e) => handleChange('contact', 'formTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" />
                          </div>
                      </div>
                  </div>
                </div>

             </div>
          )}
          
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-beige shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded shadow-sm text-sm font-bold uppercase tracking-wider text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Tancar
          </button>
          {activeTab !== 'inbox' && (
            <button
              onClick={handlePreSave}
              disabled={isSaving}
              className={`px-8 py-3 border border-transparent rounded shadow-lg text-sm font-bold uppercase tracking-wider text-white bg-primary hover:bg-accent transition-all transform hover:-translate-y-1 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSaving ? 'Guardant...' : 'Guardar Canvis'}
              {!isSaving && <span className="material-symbols-outlined text-sm">cloud_upload</span>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};