import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db, auth } from '../firebase';
import { ref, onValue, update, remove } from 'firebase/database';

interface AdminPanelProps {
  onSaveAndClose: () => void;
  onClose: () => void;
  initialTab?: 'config' | 'inbox' | 'reservations'; 
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

interface Reservation {
  id: string;
  name: string;
  phone: string;
  pax: string;
  notes: string;
  date: string;
  time: string;
  dateTimeIso: string;
  createdAt: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  privacy: boolean;
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
  
  // DEEP CLONE initial config & HYDRATE DEFAULTS
  const [localConfig, setLocalConfig] = useState(() => {
      const initial = JSON.parse(JSON.stringify(config));
      // Patch Specialties Description if missing to match Web Default
      const defaultDesc = "Descobreix els sabors autèntics de la nostra terra, cuinats amb passió i respecte pel producte.";
      if(initial.specialties?.items) {
          initial.specialties.items = initial.specialties.items.map((item: any) => ({
              ...item,
              description: item.description || defaultDesc
          }));
      }
      return initial;
  });

  // Capture initial state string to detect changes
  const initialConfigRef = useRef(JSON.stringify(localConfig));

  const [isSaving, setIsSaving] = useState(false);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'config' | 'inbox' | 'menu' | 'reservations'>(
      initialTab === 'inbox' ? 'inbox' : initialTab === 'reservations' ? 'reservations' : 'config'
  );

  // Reservation Filter State (Trays)
  const [reservationFilter, setReservationFilter] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');

  // --- MENU DASHBOARD STATE ---
  // View States: 'dashboard' (grid of cards) | 'type_selection' (3 buttons) | 'editor' (form)
  const [menuViewState, setMenuViewState] = useState<'dashboard' | 'type_selection' | 'editor'>('dashboard');
  
  // Track which menu is being edited
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  
  // --- CONFIRMATION STATES ---
  const [showDeleteCardConfirmation, setShowDeleteCardConfirmation] = useState(false);
  // Save Confirmation Modal
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  // No Changes Toast
  const [showNoChangesToast, setShowNoChangesToast] = useState(false);
  // Success Toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // --- INBOX STATE ---
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // --- RESERVATIONS STATE ---
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pendingReservationsCount, setPendingReservationsCount] = useState(0);
  const [confirmedReservationsCount, setConfirmedReservationsCount] = useState(0);
  const [cancelledReservationsCount, setCancelledReservationsCount] = useState(0);

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
            setUnreadMessagesCount(messageList.filter(m => !m.read).length);
        } else {
            setMessages([]);
            setUnreadMessagesCount(0);
        }
    });
    return () => unsubscribe();
  }, []);

  // Fetch reservations from Firebase
  useEffect(() => {
    const reservationsRef = ref(db, 'reservations');
    const unsubscribe = onValue(reservationsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const resList: Reservation[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).sort((a, b) => b.createdAt - a.createdAt); // Sort by newest created
            
            setReservations(resList);
            setPendingReservationsCount(resList.filter(r => r.status === 'pending').length);
            setConfirmedReservationsCount(resList.filter(r => r.status === 'confirmed').length);
            setCancelledReservationsCount(resList.filter(r => r.status === 'cancelled').length);
        } else {
            setReservations([]);
            setPendingReservationsCount(0);
            setConfirmedReservationsCount(0);
            setCancelledReservationsCount(0);
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
      if(window.confirm("Estàs segur que vols esborrar aquest missatge?")) {
        try {
            await remove(ref(db, `contactMessages/${messageId}`));
        } catch (e) {
            console.error("Error deleting message", e);
        }
      }
  };

  // --- RESERVATION ACTIONS ---
  const handleUpdateReservationStatus = async (resId: string, newStatus: 'confirmed' | 'cancelled') => {
      try {
          await update(ref(db, `reservations/${resId}`), { status: newStatus });
      } catch (e) {
          console.error("Error updating reservation status", e);
      }
  };

  const handleDeleteReservation = async (resId: string) => {
      if(window.confirm("Segur que vols eliminar aquesta reserva?")) {
          try {
              await remove(ref(db, `reservations/${resId}`));
          } catch (e) {
              console.error("Error deleting reservation", e);
          }
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
  
  // 1. Trigger Modal Logic
  const handleSaveClick = () => {
      const currentConfigString = JSON.stringify(localConfig);
      
      // Compare current stringified state with initial one
      if (currentConfigString === initialConfigRef.current) {
          // NO CHANGES DETECTED: Show Toast
          setShowNoChangesToast(true);
          // Wait 2s then close panel automatically as per user request
          setTimeout(() => {
              setShowNoChangesToast(false);
              onClose(); // Close the admin panel
          }, 2000);
      } else {
          // CHANGES DETECTED: Show Confirmation Modal
          setShowSaveConfirmation(true);
      }
  };

  // 2. Perform Save (Called from Modal)
  const finalSave = async () => {
    setShowSaveConfirmation(false); // Close modal
    try {
        setIsSaving(true);
        // Minimal cleanup for arrays to avoid saving empty strings
        const dataToSave = {
            ...localConfig,
            hero: {
                ...localConfig.hero,
                backgroundImages: localConfig.hero.backgroundImages?.filter((i: string) => i && i.trim() !== '') || []
            },
            philosophy: {
                ...localConfig.philosophy,
                historicImages: localConfig.philosophy.historicImages?.filter((i: string) => i && i.trim() !== '') || [],
                productImages: localConfig.philosophy.productImages?.filter((i: string) => i && i.trim() !== '') || []
            }
        };

        await updateConfig(dataToSave);
        setIsSaving(false);
        
        // Show Success Toast
        setShowSuccessToast(true);
        
        // Wait 2s then close panel
        setTimeout(() => {
            setShowSuccessToast(false);
            onSaveAndClose();
        }, 2000);

    } catch (error) {
        console.error("Error saving:", error);
        setIsSaving(false);
        alert("Error guardant els canvis. Comprova la connexió.");
    }
  };

  // Filter reservations based on active sub-tab
  const filteredReservations = reservations.filter(r => r.status === reservationFilter);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4 overflow-auto">
      
      {/* --- NO CHANGES TOAST (Self Fading & Auto Close) --- */}
      {showNoChangesToast && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center pointer-events-none">
               <div className="bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-[pulse_2s_ease-in-out]">
                  <span className="material-symbols-outlined text-yellow-400">info</span>
                  <span className="font-bold tracking-wide">No s'han realitzat canvis</span>
               </div>
          </div>
      )}

      {/* --- SUCCESS TOAST (Changes Saved & Auto Close) --- */}
      {showSuccessToast && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center pointer-events-none">
               <div className="bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-[pulse_2s_ease-in-out]">
                  <span className="material-symbols-outlined text-green-400">check_circle</span>
                  <span className="font-bold tracking-wide">Canvis realitzats</span>
               </div>
          </div>
      )}

      {/* --- SAVE CONFIRMATION MODAL (High Z-Index) --- */}
      {showSaveConfirmation && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSaveConfirmation(false)}></div>
              <div className="bg-[#fdfbf7] bg-paper-texture p-6 max-w-sm w-full rounded shadow-2xl relative z-10 border border-primary text-center transform rotate-1 animate-[fadeIn_0.2s_ease-out]">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-3xl text-primary">save</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-secondary mb-6">¿Estàs segur de guardar els canvis realitzats?</h3>
                  <div className="flex gap-3 justify-center">
                      <button 
                          onClick={() => setShowSaveConfirmation(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
                      >
                          Rebutjar
                      </button>
                      <button 
                          onClick={finalSave}
                          className="px-4 py-2 bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-accent transition-colors shadow-lg"
                      >
                          Acceptar
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* DELETE CONFIRMATION MODAL (For Menu Cards) */}
      {showDeleteCardConfirmation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteCardConfirmation(false)}></div>
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm relative z-10 border-t-4 border-red-500 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Esborrar Carta?</h3>
            <p className="text-gray-600 mb-6 text-sm">Aquesta acció no es pot desfer. Estàs segur que vols eliminar aquesta carta extra?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteCardConfirmation(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold uppercase text-xs"
              >
                Cancel·lar
              </button>
              <button 
                onClick={confirmDeleteCard}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow font-bold uppercase text-xs"
              >
                Sí, Esborrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-beige text-secondary p-0 rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col relative border border-primary/20 overflow-hidden">
        
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
              
              {/* Navigation Tabs - GENERAL and MENU */}
              <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-lg justify-center md:justify-start">
                <button 
                  onClick={() => setActiveTab('config')}
                  className={`px-3 md:px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'config' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  General
                </button>
                <button 
                  onClick={() => { setActiveTab('menu'); setMenuViewState('dashboard'); setEditingMenuId(null); }}
                  className={`px-3 md:px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'menu' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Gestió Menú
                </button>
              </div>

              {/* RESERVATIONS BUTTON - ISOLATED & RED */}
              <button 
                  onClick={() => setActiveTab('reservations')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap relative flex items-center gap-2 shadow-lg transform hover:scale-105 ${activeTab === 'reservations' ? 'bg-red-700 text-white ring-2 ring-red-300' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  <span className="material-symbols-outlined text-lg">book_online</span>
                  <span>RESERVES</span>
                  {pendingReservationsCount > 0 && (
                      <span className="bg-white text-red-600 text-[10px] px-2 py-0.5 rounded-full font-extrabold animate-pulse shadow-sm">{pendingReservationsCount}</span>
                  )}
              </button>

              {/* Notification Area */}
              <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-2">
                 {/* Mail Inbox Button */}
                 <button 
                    onClick={() => setActiveTab('inbox')}
                    className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${activeTab === 'inbox' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                    title="Bústia de Missatges"
                  >
                      <span className="material-symbols-outlined text-3xl">mail</span>
                      {unreadMessagesCount > 0 && (
                          <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                          </span>
                      )}
                  </button>
              </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 ${activeTab === 'inbox' ? 'bg-slate-50' : 'bg-beige/50'}`}>
          
          {/* --- RESERVATIONS TAB --- */}
          {activeTab === 'reservations' && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-600">book_online</span>
                        Gestió de Reserves
                    </h3>
                  </div>

                  {/* SUB-TABS (TRAYS) */}
                  <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
                      <button 
                        onClick={() => setReservationFilter('pending')}
                        className={`pb-2 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${reservationFilter === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                          Pendents
                          {pendingReservationsCount > 0 && <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px]">{pendingReservationsCount}</span>}
                      </button>
                      <button 
                        onClick={() => setReservationFilter('confirmed')}
                        className={`pb-2 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${reservationFilter === 'confirmed' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                          Confirmades (Aceptades)
                          <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{confirmedReservationsCount}</span>
                      </button>
                      <button 
                        onClick={() => setReservationFilter('cancelled')}
                        className={`pb-2 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${reservationFilter === 'cancelled' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                          Cancel·lades
                          <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{cancelledReservationsCount}</span>
                      </button>
                  </div>

                  {filteredReservations.length === 0 ? (
                      <div className="text-center py-20 opacity-50 bg-white rounded-lg border border-gray-200 border-dashed">
                          <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">event_busy</span>
                          <p className="text-lg text-gray-400">No hi ha reserves en aquesta safata.</p>
                      </div>
                  ) : (
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                  <thead>
                                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                          <th className="p-4">Estat</th>
                                          <th className="p-4">Dia i Hora</th>
                                          <th className="p-4">Pax</th>
                                          <th className="p-4">Nom</th>
                                          <th className="p-4">Telèfon</th>
                                          <th className="p-4">Notes</th>
                                          <th className="p-4 text-right">Accions</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                      {filteredReservations.map((res) => {
                                          let statusColor = "bg-gray-100 text-gray-500";
                                          let statusLabel = "Desconegut";
                                          if (res.status === 'pending') { statusColor = "bg-yellow-100 text-yellow-700 border border-yellow-200"; statusLabel = "PENDENT"; }
                                          else if (res.status === 'confirmed') { statusColor = "bg-green-100 text-green-700 border border-green-200"; statusLabel = "CONFIRMADA"; }
                                          else if (res.status === 'cancelled') { statusColor = "bg-red-50 text-red-400 border border-red-100 decoration-line-through"; statusLabel = "CANCEL·LADA"; }

                                          return (
                                              <tr key={res.id} className={`hover:bg-gray-50 transition-colors ${res.status === 'pending' ? 'bg-yellow-50/10' : ''}`}>
                                                  <td className="p-4">
                                                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor}`}>
                                                          {statusLabel}
                                                      </span>
                                                  </td>
                                                  <td className="p-4">
                                                      <div className="flex flex-col">
                                                          <span className="font-bold text-gray-800">{new Date(res.date).toLocaleDateString('ca-ES')}</span>
                                                          <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded w-fit">{res.time}</span>
                                                      </div>
                                                  </td>
                                                  <td className="p-4 font-bold text-lg text-secondary">
                                                      {res.pax} <span className="text-xs font-normal text-gray-400">pers.</span>
                                                  </td>
                                                  <td className="p-4 font-medium text-gray-700">
                                                      {res.name}
                                                  </td>
                                                  <td className="p-4">
                                                      <a href={`tel:${res.phone}`} className="text-primary hover:underline font-mono text-sm">{res.phone}</a>
                                                  </td>
                                                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={res.notes}>
                                                      {res.notes || '-'}
                                                  </td>
                                                  <td className="p-4 text-right">
                                                      <div className="flex justify-end gap-2">
                                                          {/* Actions for Pending */}
                                                          {res.status === 'pending' && (
                                                              <>
                                                                  <button 
                                                                      onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                                                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"
                                                                      title="Confirmar Reserva"
                                                                  >
                                                                      <span className="material-symbols-outlined text-sm">check</span>
                                                                      <span className="text-xs font-bold uppercase hidden md:inline">Acceptar</span>
                                                                  </button>
                                                                  <button 
                                                                      onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                                                      className="bg-red-400 hover:bg-red-500 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"
                                                                      title="Cancel·lar/Rebutjar"
                                                                  >
                                                                      <span className="material-symbols-outlined text-sm">close</span>
                                                                      <span className="text-xs font-bold uppercase hidden md:inline">Rebutjar</span>
                                                                  </button>
                                                              </>
                                                          )}
                                                          
                                                          {/* Actions for Confirmed */}
                                                          {res.status === 'confirmed' && (
                                                              <button 
                                                                  onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                                                  className="border border-red-300 text-red-400 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-1"
                                                                  title="Cancel·lar Reserva"
                                                              >
                                                                  <span className="material-symbols-outlined text-sm">block</span>
                                                                  <span className="text-xs font-bold uppercase hidden md:inline">Cancel·lar</span>
                                                              </button>
                                                          )}

                                                          {/* Actions for Cancelled */}
                                                          {res.status === 'cancelled' && (
                                                              <button 
                                                                  onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                                                  className="border border-gray-300 text-gray-400 hover:text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
                                                                  title="Recuperar (Confirmar)"
                                                              >
                                                                  <span className="material-symbols-outlined text-sm">restore</span>
                                                              </button>
                                                          )}
                                                          
                                                          {/* Delete button always available but subtle */}
                                                          <button 
                                                              onClick={() => handleDeleteReservation(res.id)}
                                                              className="text-gray-300 hover:text-red-500 p-2 transition-colors ml-2"
                                                              title="Esborrar definitivament"
                                                          >
                                                              <span className="material-symbols-outlined text-sm">delete</span>
                                                          </button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          );
                                      })}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* --- INBOX TAB --- */}
          {activeTab === 'inbox' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">mail</span>
                        Bústia de Missatges
                    </h3>
                    <div className="text-xs font-bold text-blue-600 bg-white px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
                        Total: {messages.length}
                    </div>
                  </div>

                  {messages.length === 0 ? (
                      <div className="text-center py-24 bg-white rounded-xl border border-blue-100 border-dashed shadow-sm">
                          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                             <span className="material-symbols-outlined text-4xl text-blue-300">inbox</span>
                          </div>
                          <p className="text-lg text-gray-400 font-medium">La bústia està buida.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {messages.map((msg) => (
                              <div 
                                key={msg.id} 
                                className={`rounded-xl border transition-all duration-300 group ${
                                    !msg.read 
                                        ? 'bg-white border-blue-300 shadow-md border-l-[6px] border-l-blue-600' 
                                        : 'bg-white/80 border-gray-200 shadow-sm hover:shadow-md'
                                }`}
                              >
                                  {/* HEADER */}
                                  <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 bg-gray-50/30 rounded-t-xl gap-2">
                                      <div className="flex items-center gap-3">
                                          {!msg.read && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                                          <h4 className={`text-lg ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                              {msg.subject || '(Sense assumpte)'}
                                          </h4>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                          <span className="material-symbols-outlined text-sm">schedule</span>
                                          {new Date(msg.timestamp).toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                  </div>

                                  {/* BODY */}
                                  <div className="p-6">
                                      <div className="flex flex-wrap gap-2 mb-4">
                                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                              <span className="material-symbols-outlined text-sm">person</span> {msg.name}
                                          </span>
                                          <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium border border-gray-200">
                                              <span className="material-symbols-outlined text-sm">alternate_email</span> {msg.email}
                                          </a>
                                          {msg.phone && (
                                              <a href={`tel:${msg.phone}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors text-xs font-medium border border-gray-200">
                                                  <span className="material-symbols-outlined text-sm">call</span> {msg.phone}
                                              </a>
                                          )}
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                              {msg.message}
                                          </p>
                                      </div>
                                  </div>

                                  {/* FOOTER ACTIONS */}
                                  <div className="px-6 py-3 bg-gray-50 rounded-b-xl flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                      {!msg.read && (
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }} 
                                            className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                          >
                                              <span className="material-symbols-outlined text-sm">mark_email_read</span> Marcar llegit
                                          </button>
                                      )}
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} 
                                        className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                      >
                                          <span className="material-symbols-outlined text-sm">delete</span> Esborrar
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* ... CONFIG TAB ... */}
          {activeTab === 'config' && (
             <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                
                {/* 0. NEW: ADMIN CUSTOMIZATION */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <h3 className="font-serif text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">person_edit</span>
                    Configuració Usuari (Admin)
                  </h3>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nom a mostrar (Navbar)</label>
                      <div className="relative">
                        <input
                            type="text"
                            maxLength={15} // Added Max Length
                            value={localConfig.adminSettings?.customDisplayName || ''}
                            onChange={(e) => {
                                setLocalConfig((prev: any) => ({
                                    ...prev,
                                    adminSettings: {
                                        ...prev.adminSettings,
                                        customDisplayName: e.target.value
                                    }
                                }));
                            }}
                            className="block w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:border-green-500 outline-none pr-10" // added pr-10 for counter
                            placeholder="Ex: Elena"
                        />
                        {/* Character Counter */}
                        <span className="absolute top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none right-3 md:left-[calc(50%-2.5rem)] md:right-auto">
                             {(localConfig.adminSettings?.customDisplayName || '').length}/15
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 italic">Si escrius "Elena", a dalt posarà "Hola Elena". Si està buit, posarà "Hola Admin".</p>
                  </div>
                </div>

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

                {/* 2. Portada (Imatges de Fons) */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <h3 className="font-serif text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">image</span>
                    Portada (Imatges de Fons)
                  </h3>
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

                {/* 2b. Reserva (Experiència Gastronòmica) */}
                <div className="bg-[#fffcf5] p-8 rounded-xl shadow-md border border-[#8b5a2b]/20 relative overflow-hidden">
                   {/* Decorative Corner */}
                   <div className="absolute top-0 right-0 w-16 h-16 bg-[#8b5a2b]/5 rounded-bl-full"></div>
                   
                   <div className="flex items-center gap-4 mb-8 border-b-2 border-[#8b5a2b]/10 pb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8b5a2b] to-[#5d3a1a] text-white rounded-lg shadow-lg flex items-center justify-center transform rotate-3">
                          <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                      </div>
                      <div>
                          <h3 className="font-serif text-2xl font-bold text-[#2c241b]">Reserva Taula</h3>
                          <p className="text-xs text-[#8b5a2b] font-bold uppercase tracking-[0.2em]">Experiència Gastronòmica</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Column 1: Texts */}
                      <div className="md:col-span-7 space-y-5">
                          <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Textos i Comunicació</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                                <input type="text" value={localConfig.hero.reservationFormTitle} onChange={(e) => handleChange('hero', 'reservationFormTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#8b5a2b] outline-none bg-white shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label>
                                <input type="text" value={localConfig.hero.reservationFormSubtitle} onChange={(e) => handleChange('hero', 'reservationFormSubtitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#8b5a2b] outline-none bg-white shadow-sm" />
                            </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telèfon (Visible al formulari)</label>
                              <div className="flex items-center">
                                <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 text-gray-500 rounded-l"><span className="material-symbols-outlined text-sm">call</span></span>
                                <input type="text" value={localConfig.hero.reservationPhoneNumber} onChange={(e) => handleChange('hero', 'reservationPhoneNumber', e.target.value)} className="block w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:border-[#8b5a2b] outline-none bg-white shadow-sm" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Acció</label>
                              <input type="text" value={localConfig.hero.reservationButtonText} onChange={(e) => handleChange('hero', 'reservationButtonText', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold text-[#8b5a2b] focus:border-[#8b5a2b] outline-none bg-white shadow-sm" />
                          </div>
                      </div>

                      {/* Column 2: Logic & Time */}
                      <div className="md:col-span-5 space-y-5 bg-white p-5 rounded border border-gray-200 shadow-inner">
                          <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> Lògica de Reserva</h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Inici</label>
                                  <input type="time" value={localConfig.hero.reservationTimeStart} onChange={(e) => handleChange('hero', 'reservationTimeStart', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#8b5a2b] outline-none bg-gray-50 text-center" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Fi</label>
                                  <input type="time" value={localConfig.hero.reservationTimeEnd} onChange={(e) => handleChange('hero', 'reservationTimeEnd', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#8b5a2b] outline-none bg-gray-50 text-center" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Interval (minuts)</label>
                              <div className="flex items-center gap-2">
                                <input type="number" value={localConfig.hero.reservationTimeInterval} onChange={(e) => handleChange('hero', 'reservationTimeInterval', e.target.value)} className="block w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#8b5a2b] outline-none bg-gray-50 text-center" />
                                <span className="text-xs text-gray-400">entre taules</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Missatge Error (Text previ)</label>
                              <input type="text" value={localConfig.hero.reservationErrorMessage} onChange={(e) => handleChange('hero', 'reservationErrorMessage', e.target.value)} className="block w-full border border-red-200 rounded px-2 py-1 text-xs focus:border-red-500 outline-none bg-red-50 text-red-600 mb-2" />
                              
                              {/* --- DYNAMIC TICKET PREVIEW --- */}
                              <div className="bg-red-100 border border-red-300 border-dashed rounded px-3 py-2 flex items-center justify-between shadow-sm">
                                  <div className="flex flex-col">
                                      <span className="text-[9px] uppercase font-bold text-red-400 tracking-wider">Així es veurà el missatge:</span>
                                      <div className="text-xs text-red-700 font-medium mt-0.5">
                                          {localConfig.hero.reservationErrorMessage} <span className="bg-white px-1 rounded font-bold border border-red-200">{localConfig.hero.reservationTimeStart}</span> a <span className="bg-white px-1 rounded font-bold border border-red-200">{localConfig.hero.reservationTimeEnd}</span>
                                      </div>
                                  </div>
                                  <span className="material-symbols-outlined text-red-400 text-lg">confirmation_number</span>
                              </div>
                          </div>
                      </div>
                   </div>

                   {/* --- NEW SECTION: FORM LABELS --- */}
                   <div className="mt-6 pt-6 border-t border-dashed border-[#8b5a2b]/20">
                        <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">Etiquetes dels Camps (Personalització)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Nom</label>
                                <input type="text" value={localConfig.hero.formNameLabel} onChange={(e) => handleChange('hero', 'formNameLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Telèfon</label>
                                <input type="text" value={localConfig.hero.formPhoneLabel} onChange={(e) => handleChange('hero', 'formPhoneLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Data/Hora</label>
                                <input type="text" value={localConfig.hero.formDateLabel} onChange={(e) => handleChange('hero', 'formDateLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Persones</label>
                                <input type="text" value={localConfig.hero.formPaxLabel} onChange={(e) => handleChange('hero', 'formPaxLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Notes</label>
                                <input type="text" value={localConfig.hero.formNotesLabel} onChange={(e) => handleChange('hero', 'formNotesLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Privacitat</label>
                                <input type="text" value={localConfig.hero.formPrivacyLabel} onChange={(e) => handleChange('hero', 'formPrivacyLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text "O truca'ns"</label>
                                <input type="text" value={localConfig.hero.formCallUsLabel} onChange={(e) => handleChange('hero', 'formCallUsLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" />
                            </div>
                        </div>
                   </div>

                   {/* Sticky Note Feature */}
                   <div className="mt-6 pt-6 border-t border-dashed border-[#8b5a2b]/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="bg-[#fef08a] text-[#854d0e] w-12 h-12 flex items-center justify-center shadow-md transform -rotate-3 border border-yellow-400/50">
                             <span className="material-symbols-outlined">sticky_note_2</span>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nota Adhesiva (Post-it)</label>
                              <p className="text-[10px] text-gray-400 italic">Un missatge curt i informal (ex: "Obert tot l'any!")</p>
                          </div>
                      </div>
                      <div className="flex-1 max-w-sm">
                          <div className="relative">
                            <input 
                                type="text" 
                                maxLength={45}
                                value={localConfig.hero.stickyNoteText} 
                                onChange={(e) => handleChange('hero', 'stickyNoteText', e.target.value)} 
                                className="block w-full border border-yellow-300 rounded-r-full rounded-l-lg px-4 py-2 text-sm focus:border-yellow-500 outline-none bg-yellow-50 text-[#854d0e] font-hand font-bold tracking-wide shadow-inner" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-yellow-600/50">{localConfig.hero.stickyNoteText?.length || 0}/45</span>
                          </div>
                      </div>
                   </div>
                </div>

                {/* 3. Intro Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-olive"></div>
                  <h3 className="font-serif text-xl font-semibold text-olive mb-4 flex items-center gap-2">
                    {/* Icon removed to eliminate '99' artifact */}
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
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Targetes destacades (Fixes)</label>
                      <div className="space-y-6">
                          {(localConfig.specialties.items || []).map((item: any, idx: number) => (
                              <div 
                                  key={idx} 
                                  className={`p-6 rounded border transition-colors relative group bg-white border-gray-200 shadow-sm ${item.visible === false ? 'opacity-60 grayscale' : ''}`}
                              >
                                  {/* Row 1: Title & Subtitle + Visibility */}
                                  <div className="flex gap-4 mb-4">
                                      <div className="flex-1">
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
                                              className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-yellow-600 font-bold"
                                          />
                                      </div>
                                      <div className="flex-1 relative">
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
                                              className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-yellow-600 font-hand text-gray-600 pr-10"
                                          />
                                          {/* Visibility Toggle inside the row */}
                                          <button
                                              onClick={() => {
                                                  const newItems = [...localConfig.specialties.items];
                                                  const currentVisibility = newItems[idx].visible !== false;
                                                  newItems[idx] = { ...newItems[idx], visible: !currentVisibility };
                                                  setLocalConfig((prev:any) => ({
                                                      ...prev,
                                                      specialties: { ...prev.specialties, items: newItems }
                                                  }));
                                              }}
                                              className={`absolute right-2 top-7 p-1 rounded-full transition-colors ${item.visible === false ? 'text-gray-300 hover:text-gray-500' : 'text-gray-400 hover:text-primary'}`}
                                              title={item.visible === false ? "Fer visible" : "Ocultar"}
                                          >
                                              <span className="material-symbols-outlined text-lg">
                                                  {item.visible === false ? 'visibility_off' : 'visibility'}
                                              </span>
                                          </button>
                                      </div>
                                  </div>
                                  
                                  {/* Row 2: Image & Badge */}
                                  <div className="flex gap-4 mb-4">
                                      <div className="flex-[2]"> {/* Takes up 2/3 space */}
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
                                              className="block w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono outline-none focus:border-yellow-600 text-gray-500 truncate"
                                          />
                                      </div>
                                      <div className="flex-1">
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
                                              className="block w-full border border-gray-300 rounded px-3 py-2 text-xs font-bold outline-none focus:border-yellow-600 text-center uppercase tracking-wider"
                                          />
                                      </div>
                                  </div>

                                  {/* Row 3: Description */}
                                  <div>
                                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció Targeta</label>
                                      <textarea 
                                          value={item.description || ''} 
                                          onChange={(e) => {
                                              const newItems = [...localConfig.specialties.items];
                                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                                              setLocalConfig((prev:any) => ({
                                                  ...prev,
                                                  specialties: { ...prev.specialties, items: newItems }
                                                  }));
                                          }}
                                          rows={2}
                                          className="block w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-yellow-600 resize-none"
                                      />
                                  </div>
                              </div>
                          ))}
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

                  {/* Social & Form - NOW WITH INSTAGRAM STYLING */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      
                      {/* Instagram / Socials Column */}
                      <div className="p-4 rounded-xl border border-pink-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-10">
                              <span className="material-symbols-outlined text-6xl text-purple-800">photo_camera</span>
                          </div>
                          <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600 mb-3 text-sm uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined text-purple-600">group_work</span>
                              Xarxes Socials (Instagram)
                          </h4>
                          <div className="space-y-3">
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Títol Xarxes</label>
                                  <input type="text" value={localConfig.contact.socialTitle} onChange={(e) => handleChange('contact', 'socialTitle', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Descripció</label>
                                  <input type="text" value={localConfig.contact.socialDescription} onChange={(e) => handleChange('contact', 'socialDescription', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Text Botó</label>
                                  <input type="text" value={localConfig.contact.socialButtonText} onChange={(e) => handleChange('contact', 'socialButtonText', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">URL Instagram</label>
                                  <input type="text" value={localConfig.contact.instagramUrl} onChange={(e) => handleChange('contact', 'instagramUrl', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-xs focus:border-purple-500 outline-none bg-white/80 text-purple-700" />
                              </div>
                          </div>
                      </div>

                      {/* Contact Form Column */}
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <h4 className="font-bold text-gray-500 mb-3 text-sm uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined">edit_note</span>
                              Formulari de Contacte
                          </h4>
                          <div className="space-y-3">
                              <div>
                                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                                  <input type="text" value={localConfig.contact.formTitle} onChange={(e) => handleChange('contact', 'formTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-gray-500 outline-none bg-white" />
                              </div>
                              <p className="text-[10px] text-gray-400 italic mt-2">
                                  * Els camps del formulari (nom, email, etc.) són fixes per motius de programació i no es poden editar aquí.
                              </p>
                          </div>
                      </div>
                  </div>
                </div>

             </div>
          )}

          {/* ... MENU TAB RENDERED ABOVE ... */}
          {/* ... */}
          {activeTab === 'menu' && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                  {/* ... logic for menu dashboard view ... */}
                  {menuViewState === 'dashboard' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* CARD 1: MAIN FOOD MENU */}
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                              <div className="h-24 bg-[#2c241b] flex items-center justify-center relative overflow-hidden">
                                  <span className="material-symbols-outlined text-6xl text-primary/20 absolute -right-2 -bottom-2">restaurant_menu</span>
                                  <span className="text-white font-serif font-bold text-xl relative z-10">Carta de Menjar</span>
                              </div>
                              <div className="p-6">
                                  <p className="text-xs text-gray-500 mb-4">Edita els entrants, carns, peixos i postres principals.</p>
                                  <button 
                                      onClick={() => { setEditingMenuId('main_food'); setMenuViewState('editor'); }}
                                      className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"
                                  >
                                      <span className="material-symbols-outlined text-sm">edit</span> Editar
                                  </button>
                              </div>
                          </div>

                          {/* CARD 2: MAIN WINE MENU */}
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                              <div className="h-24 bg-[#5d3a1a] flex items-center justify-center relative overflow-hidden">
                                  <span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">wine_bar</span>
                                  <span className="text-white font-serif font-bold text-xl relative z-10">Carta de Vins</span>
                              </div>
                              <div className="p-6">
                                  <p className="text-xs text-gray-500 mb-4">Gestiona les referències de vins, D.O. i caves.</p>
                                  <button 
                                      onClick={() => { setEditingMenuId('main_wine'); setMenuViewState('editor'); }}
                                      className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"
                                  >
                                      <span className="material-symbols-outlined text-sm">edit</span> Editar
                                  </button>
                              </div>
                          </div>

                          {/* CARD 3: MAIN GROUP MENU */}
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                              <div className="h-24 bg-[#556b2f] flex items-center justify-center relative overflow-hidden">
                                  <span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">diversity_3</span>
                                  <span className="text-white font-serif font-bold text-xl relative z-10">Menú de Grup</span>
                              </div>
                              <div className="p-6">
                                  <p className="text-xs text-gray-500 mb-4">Configura els plats, preus i condicions del menú de grup.</p>
                                  <button 
                                      onClick={() => { setEditingMenuId('main_group'); setMenuViewState('editor'); }}
                                      className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"
                                  >
                                      <span className="material-symbols-outlined text-sm">edit</span> Editar
                                  </button>
                              </div>
                          </div>

                          {/* DYNAMIC EXTRA MENUS */}
                          {(localConfig.extraMenus || []).map((menu, idx) => {
                              let headerColor = "bg-gray-700";
                              let icon = "restaurant";
                              if(menu.type === 'wine') { headerColor = "bg-[#8b5a2b]"; icon = "wine_bar"; }
                              if(menu.type === 'group') { headerColor = "bg-olive"; icon = "diversity_3"; }

                              return (
                                  <div key={menu.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all relative">
                                      <div className={`h-24 ${headerColor} flex items-center justify-center relative overflow-hidden`}>
                                          <span className="material-symbols-outlined text-6xl text-white/10 absolute -right-2 -bottom-2">{icon}</span>
                                          <div className="text-center px-2">
                                              <span className="text-white font-serif font-bold text-lg relative z-10 block line-clamp-1">{menu.title}</span>
                                              <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest relative z-10 block">
                                                  {menu.type === 'food' ? 'Carta Extra' : menu.type === 'wine' ? 'Vins Extra' : 'Grup Extra'}
                                              </span>
                                          </div>
                                      </div>
                                      <div className="p-6">
                                          <button 
                                              onClick={() => { setEditingMenuId(`extra_${idx}`); setMenuViewState('editor'); }}
                                              className="w-full py-2 bg-[#f5f5f0] text-gray-700 rounded font-bold uppercase text-xs hover:bg-[#e8e4d9] flex items-center justify-center gap-2 transition-colors"
                                          >
                                              <span className="material-symbols-outlined text-sm">edit</span> Editar
                                          </button>
                                      </div>
                                  </div>
                              );
                          })}

                          {/* ADD NEW BUTTON */}
                          <button 
                              onClick={() => setMenuViewState('type_selection')}
                              className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group min-h-[200px]"
                          >
                              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                  <span className="material-symbols-outlined text-3xl">add</span>
                              </div>
                              <span className="font-bold uppercase text-xs tracking-widest">Crear Nova Carta</span>
                          </button>
                      </div>
                  )}

                  {/* TYPE SELECTION VIEW */}
                  {menuViewState === 'type_selection' && (
                      <div className="max-w-2xl mx-auto py-10">
                          <div className="flex items-center gap-2 mb-8">
                              <button onClick={() => setMenuViewState('dashboard')} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">arrow_back</span></button>
                              <h3 className="text-2xl font-serif font-bold text-gray-800">Quina mena de carta vols crear?</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <button onClick={() => handleCreateNewCard('food')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-primary hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4">
                                  <span className="material-symbols-outlined text-5xl text-[#2c241b]">restaurant_menu</span>
                                  <span className="font-bold text-gray-800">Carta de Menjar</span>
                                  <span className="text-xs text-gray-500">Per a entrants, plats principals, tapes o postres.</span>
                              </button>
                              <button onClick={() => handleCreateNewCard('wine')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-[#8b5a2b] hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4">
                                  <span className="material-symbols-outlined text-5xl text-[#8b5a2b]">wine_bar</span>
                                  <span className="font-bold text-gray-800">Carta de Vins</span>
                                  <span className="text-xs text-gray-500">Per a referències de vins, caves i licors.</span>
                              </button>
                              <button onClick={() => handleCreateNewCard('group')} className="bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-olive hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-4">
                                  <span className="material-symbols-outlined text-5xl text-olive">diversity_3</span>
                                  <span className="font-bold text-gray-800">Menú de Grup</span>
                                  <span className="text-xs text-gray-500">Menú tancat amb preu fix i seccions.</span>
                              </button>
                          </div>
                      </div>
                  )}

                  {/* EDITOR VIEW */}
                  {menuViewState === 'editor' && editingMenuId && (
                      <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                              <div className="flex items-center gap-3">
                                  <button onClick={() => { setMenuViewState('dashboard'); setEditingMenuId(null); }} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                      <span className="material-symbols-outlined">arrow_back</span>
                                  </button>
                                  <div>
                                      <h3 className="font-serif text-2xl font-bold text-gray-800">
                                          {editingMenuId.startsWith('extra_') 
                                              ? (localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.title || 'Editant Carta') 
                                              : (editingMenuId === 'main_food' ? 'Carta Principal' : editingMenuId === 'main_wine' ? 'Carta Vins' : 'Menú Grup')
                                          }
                                      </h3>
                                      {/* If editing extra menu, allow title change */}
                                      {editingMenuId.startsWith('extra_') && (
                                          <input 
                                              type="text" 
                                              className="mt-1 border-b border-gray-300 focus:border-primary outline-none text-sm text-gray-500 w-64 bg-transparent"
                                              value={localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.title || ''}
                                              onChange={(e) => {
                                                  const idx = parseInt(editingMenuId.replace('extra_',''));
                                                  const newExtras = [...localConfig.extraMenus];
                                                  newExtras[idx].title = e.target.value;
                                                  setLocalConfig((prev:any) => ({ ...prev, extraMenus: newExtras }));
                                              }}
                                              placeholder="Nom de la carta (Ex: Menú Calçotada)"
                                          />
                                      )}
                                  </div>
                              </div>
                              
                              {/* DELETE BUTTON FOR EXTRA MENUS */}
                              {editingMenuId.startsWith('extra_') && (
                                  <button 
                                      onClick={handleDeleteCurrentCard}
                                      className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold uppercase transition-colors"
                                  >
                                      <span className="material-symbols-outlined text-lg">delete</span>
                                      Esborrar Carta
                                  </button>
                              )}
                          </div>

                          {/* RENDER SPECIFIC EDITOR */}
                          <div className="bg-gray-50/50 p-1 rounded-lg">
                              {(editingMenuId === 'main_food' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'food')) && (
                                  <FoodEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />
                              )}
                              {(editingMenuId === 'main_wine' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'wine')) && (
                                  <WineEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />
                              )}
                              {(editingMenuId === 'main_group' || (editingMenuId.startsWith('extra_') && localConfig.extraMenus?.[parseInt(editingMenuId.replace('extra_',''))]?.type === 'group')) && (
                                  <GroupEditor data={getCurrentMenuData()} onChange={updateCurrentMenuData} />
                              )}
                          </div>
                      </div>
                  )}
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
          {activeTab !== 'inbox' && activeTab !== 'reservations' && (
            <button
              onClick={handleSaveClick}
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