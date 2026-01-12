import React, { useState, useEffect } from 'react';
import { useConfig, MenuSection, MenuItem } from '../context/ConfigContext';
import { db, auth } from '../firebase';
import { ref, onValue, update, remove } from 'firebase/database';

interface AdminPanelProps {
  onSaveAndClose: () => void;
  onClose: () => void;
  initialTab?: 'config' | 'food_menu' | 'specialties' | 'inbox'; // Nueva prop opcional
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

const AVAILABLE_ICONS = [
    { label: "Plat", value: "restaurant_menu" },
    { label: "Sopa/Olla", value: "soup_kitchen" },
    { label: "Tapes", value: "tapas" },
    { label: "Paella/Arros", value: "skillet" },
    { label: "Graella", value: "outdoor_grill" },
    { label: "Peix", value: "set_meal" },
    { label: "Burger", value: "lunch_dining" },
    { label: "Infantil", value: "child_care" },
    { label: "Postre/Gelat", value: "icecream" },
    { label: "Eco", value: "eco" },
    { label: "Pizza", value: "local_pizza" },
    { label: "Beguda", value: "local_bar" },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ onSaveAndClose, onClose, initialTab = 'config' }) => {
  const { config, updateConfig } = useConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  
  // Tab State: initialized with the prop
  const [activeTab, setActiveTab] = useState<'config' | 'food_menu' | 'specialties' | 'inbox'>(initialTab);
  
  // Menu Editor State
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
      if(window.confirm("Segur que vols esborrar aquest missatge?")) {
        try {
            await remove(ref(db, `contactMessages/${messageId}`));
        } catch (e) {
            console.error("Error deleting message", e);
        }
      }
  };

  // Update local config if global config changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (section: keyof typeof localConfig, key: string, value: string) => {
    if (section === 'contact' && key === 'phoneNumbers') {
      setLocalConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          // @ts-ignore
          [key]: value.split(',').map(s => s.trim()), 
        },
      }));
    } else if (section === 'hero' && key === 'backgroundImages') {
       setLocalConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          // @ts-ignore
          [key]: value.split('\n').map(s => s.trim()).filter(s => s !== ''), 
        },
      }));
    } else {
      // @ts-ignore
      setLocalConfig(prev => ({
        ...prev,
        [section]: {
          // @ts-ignore
          ...prev[section],
          [key]: value,
        },
      }));
    }
  };

  // Handler específico para las 5 imágenes de filosofía
  const handleHistoricImageChange = (index: number, value: string) => {
      const currentImages = localConfig.philosophy.historicImages ? [...localConfig.philosophy.historicImages] : [];
      // Asegurar que el array tenga tamaño suficiente
      while(currentImages.length <= index) {
          currentImages.push("");
      }
      currentImages[index] = value;
      
      setLocalConfig(prev => ({
          ...prev,
          philosophy: {
              ...prev.philosophy,
              historicImages: currentImages
          }
      }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateConfig(localConfig);
    setIsSaving(false);
    onSaveAndClose();
  };

  // --- SPECIALTIES HANDLERS ---
  const handleSpecialtyChange = (index: number, field: string, value: string) => {
    const newItems = [...localConfig.specialties.items];
    // @ts-ignore
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalConfig(prev => ({
      ...prev,
      specialties: {
        ...prev.specialties,
        items: newItems
      }
    }));
  };

  // --- MENU MANAGEMENT HANDLERS ---
  const handleAddSection = () => {
      const newSection: MenuSection = {
          id: `sec_${Date.now()}`,
          category: "NOVA CATEGORIA",
          icon: "restaurant_menu",
          items: []
      };
      setLocalConfig(prev => ({
          ...prev,
          foodMenu: [...(prev.foodMenu || []), newSection]
      }));
      setExpandedSection(newSection.id);
  };

  const handleDeleteSection = (sectionId: string) => {
      if(window.confirm("Estàs segur d'esborrar tota la secció?")) {
        setLocalConfig(prev => ({
            ...prev,
            foodMenu: prev.foodMenu.filter(s => s.id !== sectionId)
        }));
      }
  };

  const handleUpdateSection = (sectionId: string, field: keyof MenuSection, value: string) => {
      setLocalConfig(prev => ({
          ...prev,
          foodMenu: prev.foodMenu.map(s => s.id === sectionId ? { ...s, [field]: value } : s)
      }));
  };

  const handleAddItem = (sectionId: string) => {
      setLocalConfig(prev => ({
          ...prev,
          foodMenu: prev.foodMenu.map(s => {
              if (s.id === sectionId) {
                  return {
                      ...s,
                      items: [...(s.items || []), { name: "Nou Plat", price: "0.00" }]
                  }
              }
              return s;
          })
      }));
  };

  const handleUpdateItem = (sectionId: string, itemIndex: number, field: keyof MenuItem, value: string) => {
      setLocalConfig(prev => ({
          ...prev,
          foodMenu: prev.foodMenu.map(s => {
              if (s.id === sectionId) {
                  const newItems = [...s.items];
                  newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
                  return { ...s, items: newItems };
              }
              return s;
          })
      }));
  };

  const handleDeleteItem = (sectionId: string, itemIndex: number) => {
      setLocalConfig(prev => ({
          ...prev,
          foodMenu: prev.foodMenu.map(s => {
              if (s.id === sectionId) {
                  const newItems = [...s.items];
                  newItems.splice(itemIndex, 1);
                  return { ...s, items: newItems };
              }
              return s;
          })
      }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4 overflow-auto">
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
              <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
                <button 
                  onClick={() => setActiveTab('config')}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'config' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Configuració
                </button>
                <button 
                  onClick={() => setActiveTab('specialties')}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'specialties' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Especialitats
                  <span className="material-symbols-outlined text-sm">stars</span>
                </button>
                <button 
                  onClick={() => setActiveTab('food_menu')}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'food_menu' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Carta Menjar
                  <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                </button>
              </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-beige/50">
          
          {/* ... INBOX TAB ... */}
          {activeTab === 'inbox' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  {/* ... (Existing Inbox Code) ... */}
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
                              <div 
                                key={msg.id} 
                                className={`rounded-lg p-6 border transition-all duration-300 relative overflow-hidden group
                                    ${msg.read 
                                        ? 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100' 
                                        : 'bg-white border-primary shadow-lg border-l-[6px] border-l-primary scale-[1.01]'
                                    }`}
                                onClick={() => !msg.read && handleMarkAsRead(msg.id)}
                              >
                                  {/* Read/Unread Indicator Visuals */}
                                  {!msg.read && (
                                      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg shadow-sm">
                                          Nou Missatge
                                      </div>
                                  )}

                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 pr-16">
                                      <div className="flex items-center gap-3">
                                          <h4 className={`text-lg ${msg.read ? 'font-medium text-gray-600' : 'font-bold text-black'}`}>
                                            {msg.subject || '(Sense assumpte)'}
                                          </h4>
                                      </div>
                                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                          <span className="material-symbols-outlined text-sm">schedule</span>
                                          {new Date(msg.timestamp).toLocaleString('ca-ES')}
                                      </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 text-sm">
                                      <div className={`p-3 rounded border ${msg.read ? 'bg-gray-100 border-transparent' : 'bg-primary/5 border-primary/10'}`}>
                                          <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">person</span> Nom
                                          </span>
                                          <span className="font-semibold text-secondary">{msg.name}</span>
                                      </div>
                                      <div className={`p-3 rounded border ${msg.read ? 'bg-gray-100 border-transparent' : 'bg-primary/5 border-primary/10'}`}>
                                          <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">alternate_email</span> Email
                                          </span>
                                          <a href={`mailto:${msg.email}`} className="text-primary hover:underline font-semibold">{msg.email}</a>
                                      </div>
                                      <div className={`p-3 rounded border ${msg.read ? 'bg-gray-100 border-transparent' : 'bg-primary/5 border-primary/10'}`}>
                                          <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">call</span> Telèfon
                                          </span>
                                          <a href={`tel:${msg.phone}`} className="text-secondary hover:underline font-semibold">{msg.phone}</a>
                                      </div>
                                  </div>

                                  <div className={`p-5 rounded border mb-4 ${msg.read ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200'}`}>
                                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                  </div>

                                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!msg.read && (
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }}
                                            className="px-3 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                                          >
                                              <span className="material-symbols-outlined text-sm">mark_email_read</span>
                                              Marcar llegit
                                          </button>
                                      )}
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                                        className="px-3 py-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                                      >
                                          <span className="material-symbols-outlined text-sm">delete</span>
                                          Esborrar
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* --- CONFIGURATION TAB --- */}
          {activeTab === 'config' && (
             <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
               
                {/* Brand Section (LOGO) */}
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

                {/* Hero Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <h3 className="font-serif text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">home</span>
                    Hero (Reserva)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Formulari</label>
                      <input
                        type="text"
                        value={localConfig.hero.reservationFormTitle}
                        onChange={(e) => handleChange('hero', 'reservationFormTitle', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtítol</label>
                      <input
                        type="text"
                        value={localConfig.hero.reservationFormSubtitle}
                        onChange={(e) => handleChange('hero', 'reservationFormSubtitle', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telèfon</label>
                      <input
                        type="text"
                        value={localConfig.hero.reservationPhoneNumber}
                        onChange={(e) => handleChange('hero', 'reservationPhoneNumber', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó</label>
                      <input
                        type="text"
                        value={localConfig.hero.reservationButtonText}
                        onChange={(e) => handleChange('hero', 'reservationButtonText', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    
                    {/* NEW: Reservation Limits Config */}
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                       <h4 className="text-sm font-bold uppercase text-gray-600 mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          Restriccions de Reserva
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                           <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Hora Inici (ex: 13:00)</label>
                              <input
                                type="time"
                                value={localConfig.hero.reservationTimeStart || "13:00"}
                                onChange={(e) => handleChange('hero', 'reservationTimeStart', e.target.value)}
                                className="block w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-primary outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Hora Fi (ex: 15:30)</label>
                              <input
                                type="time"
                                value={localConfig.hero.reservationTimeEnd || "15:30"}
                                onChange={(e) => handleChange('hero', 'reservationTimeEnd', e.target.value)}
                                className="block w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-primary outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Interval (min)</label>
                              <input
                                type="number"
                                step="5"
                                value={localConfig.hero.reservationTimeInterval || 15}
                                onChange={(e) => handleChange('hero', 'reservationTimeInterval', e.target.value)}
                                className="block w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-primary outline-none"
                              />
                           </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Missatge d'error (Fora d'horari)</label>
                          <input
                             type="text"
                             value={localConfig.hero.reservationErrorMessage || "Ho sentim, la cuina està tancada."}
                             onChange={(e) => handleChange('hero', 'reservationErrorMessage', e.target.value)}
                             className="block w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-primary outline-none"
                          />
                       </div>
                    </div>

                    {/* Sticky Note */}
                    <div className="md:col-span-2 mt-2">
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-xs font-bold uppercase text-gray-500">Text Nota Enganxada (Post-it)</label>
                        <span className={`text-[10px] font-bold ${localConfig.hero.stickyNoteText.length >= 45 ? 'text-red-500' : 'text-gray-400'}`}>
                            {localConfig.hero.stickyNoteText.length}/45
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={45}
                        value={localConfig.hero.stickyNoteText}
                        onChange={(e) => handleChange('hero', 'stickyNoteText', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Màxim 45 caràcters"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Limitat a 45 caràcters per mantenir el disseny.</p>
                    </div>

                    {/* Background Images Editor */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Imatges de Fons (Slides) - Una URL per línia</label>
                      <textarea
                        value={localConfig.hero.backgroundImages.join('\n')}
                        onChange={(e) => handleChange('hero', 'backgroundImages', e.target.value)}
                        rows={4}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-xs whitespace-pre"
                        placeholder="https://exemple.com/imatge1.jpg"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* ... Rest of sections (Intro, Philosophy, Contact) ... */}
                {/* INTRO Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5A2B]"></div>
                  <h3 className="font-serif text-xl font-semibold text-[#8B5A2B] mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined">short_text</span>
                      Intro (Filosofia Breu)
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol 1 (Petit/Superior)</label>
                        <input
                          type="text"
                          value={localConfig.intro.smallTitle}
                          onChange={(e) => handleChange('intro', 'smallTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol 2 (Principal)</label>
                        <input
                          type="text"
                          value={localConfig.intro.mainTitle}
                          onChange={(e) => handleChange('intro', 'mainTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció</label>
                        <textarea
                          value={localConfig.intro.description}
                          onChange={(e) => handleChange('intro', 'description', e.target.value)}
                          rows={3}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        ></textarea>
                      </div>
                  </div>
                </div>

                {/* Philosophy Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#556b2f]"></div>
                  <h3 className="font-serif text-xl font-semibold text-[#556b2f] mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined">history_edu</span>
                      Filosofia i Entorn
                  </h3>
                  
                  {/* General Config */}
                  <div className="grid grid-cols-1 gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label>
                        <input
                          type="text"
                          value={localConfig.philosophy.sectionTitle}
                          onChange={(e) => handleChange('philosophy', 'sectionTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Línia 1</label>
                            <input
                            type="text"
                            value={localConfig.philosophy.titleLine1}
                            onChange={(e) => handleChange('philosophy', 'titleLine1', e.target.value)}
                            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Línia 2</label>
                            <input
                            type="text"
                            value={localConfig.philosophy.titleLine2}
                            onChange={(e) => handleChange('philosophy', 'titleLine2', e.target.value)}
                            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                            />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció General</label>
                        <textarea
                          value={localConfig.philosophy.description}
                          onChange={(e) => handleChange('philosophy', 'description', e.target.value)}
                          rows={2}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none resize-none"
                        ></textarea>
                      </div>
                  </div>

                  {/* Product Config */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Producte</label>
                        <input
                          type="text"
                          value={localConfig.philosophy.productTitle}
                          onChange={(e) => handleChange('philosophy', 'productTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Etiqueta Foto Producte</label>
                        <input
                          type="text"
                          value={localConfig.philosophy.cardTag}
                          onChange={(e) => handleChange('philosophy', 'cardTag', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Producte</label>
                        <textarea
                          value={localConfig.philosophy.productDescription}
                          onChange={(e) => handleChange('philosophy', 'productDescription', e.target.value)}
                          rows={2}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none resize-none"
                        ></textarea>
                      </div>
                  </div>

                  {/* Historic Config */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Històric</label>
                        <input
                          type="text"
                          value={localConfig.philosophy.historicTitle}
                          onChange={(e) => handleChange('philosophy', 'historicTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Botó (URL)</label>
                        <input
                          type="text"
                          value={localConfig.philosophy.historicLinkUrl}
                          onChange={(e) => handleChange('philosophy', 'historicLinkUrl', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Històrica</label>
                        <textarea
                          value={localConfig.philosophy.historicDescription}
                          onChange={(e) => handleChange('philosophy', 'historicDescription', e.target.value)}
                          rows={2}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#556b2f] outline-none resize-none"
                        ></textarea>
                      </div>
                  </div>

                  {/* Historic Images Slider Config */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <h4 className="text-sm font-bold uppercase text-gray-600 mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">imagesmode</span>
                          Imatges Històriques (Slider)
                      </h4>
                      <p className="text-xs text-gray-400 mb-4">Afegeix fins a 5 enllaços d'imatges per a la secció "Un entorn històric". Es reproduiran automàticament.</p>
                      
                      <div className="space-y-3">
                          {[0, 1, 2, 3, 4].map((index) => (
                              <div key={index}>
                                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Imatge {index + 1} (URL)</label>
                                  <input
                                      type="text"
                                      value={localConfig.philosophy.historicImages?.[index] || ''}
                                      onChange={(e) => handleHistoricImageChange(index, e.target.value)}
                                      placeholder="https://..."
                                      className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:border-[#556b2f] outline-none"
                                  />
                              </div>
                          ))}
                      </div>
                  </div>

                </div>

                {/* Contact Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                  <h3 className="font-serif text-xl font-semibold text-red-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined">mail</span>
                      Contacte i Formulari
                  </h3>
                  
                  {/* Nota Adhesiva */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">Nota Adhesiva (Post-it)</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Nota</label>
                        <input
                          type="text"
                          value={localConfig.contact.importantNoteTitle}
                          onChange={(e) => handleChange('contact', 'importantNoteTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Missatge 1</label>
                        <input
                          type="text"
                          value={localConfig.contact.importantNoteMessage1}
                          onChange={(e) => handleChange('contact', 'importantNoteMessage1', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Missatge 2</label>
                        <input
                          type="text"
                          value={localConfig.contact.importantNoteMessage2}
                          onChange={(e) => handleChange('contact', 'importantNoteMessage2', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Ubicació i Horaris */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                     <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">Ubicació i Horaris</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horari Text</label>
                         <input
                           type="text"
                           value={localConfig.contact.schedule}
                           onChange={(e) => handleChange('contact', 'schedule', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                     </div>
                  </div>

                  {/* Teléfonos */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telèfons (Separats per coma)</label>
                     <input
                        type="text"
                        value={localConfig.contact.phoneNumbers.join(', ')}
                        onChange={(e) => handleChange('contact', 'phoneNumbers', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                     />
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
              onClick={handleSave}
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

export default AdminPanel;