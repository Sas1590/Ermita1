import React, { useState, useEffect } from 'react';
import { useConfig, MenuSection, MenuItem } from '../context/ConfigContext';

interface AdminPanelProps {
  onSaveAndClose: () => void;
  onClose: () => void;
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

const AdminPanel: React.FC<AdminPanelProps> = ({ onSaveAndClose, onClose }) => {
  const { config, updateConfig } = useConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  
  // Tab State: 'config', 'food_menu'
  const [activeTab, setActiveTab] = useState<'config' | 'food_menu'>('config');
  
  // Menu Editor State
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  const handleSave = async () => {
    setIsSaving(true);
    await updateConfig(localConfig);
    setIsSaving(false);
    onSaveAndClose();
    // alert("Canvis guardats correctament a la base de dades!"); 
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
        
        {/* Header with Tabs */}
        <div className="bg-white border-b border-primary/20 px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">settings_suggest</span>
            Gestió Web
          </h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('config')}
              className={`px-3 md:px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'config' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Configuració
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

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-beige/50">
          
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
                      <p className="text-[10px] text-gray-400 mt-1">Recomanat: Imatge PNG sense fons optimitzada.</p>
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
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Nota Enganxada</label>
                      <input
                        type="text"
                        value={localConfig.hero.stickyNoteText}
                        onChange={(e) => handleChange('hero', 'stickyNoteText', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

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
                  
                  {/* Ubicació i Horaris (New Section) */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                     <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">Ubicació i Horaris</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal (Esquerra)</label>
                         <input
                           type="text"
                           value={localConfig.contact.sectionTitle}
                           onChange={(e) => handleChange('contact', 'sectionTitle', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Localització</label>
                         <input
                           type="text"
                           value={localConfig.contact.locationTitle}
                           onChange={(e) => handleChange('contact', 'locationTitle', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 1</label>
                         <input
                           type="text"
                           value={localConfig.contact.addressLine1}
                           onChange={(e) => handleChange('contact', 'addressLine1', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 2 (CP/Ciutat)</label>
                         <input
                           type="text"
                           value={localConfig.contact.addressLine2}
                           onChange={(e) => handleChange('contact', 'addressLine2', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                       <div className="md:col-span-2">
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horari Text</label>
                         <input
                           type="text"
                           value={localConfig.contact.schedule}
                           onChange={(e) => handleChange('contact', 'schedule', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó Mapa</label>
                         <input
                           type="text"
                           value={localConfig.contact.directionsButtonText}
                           onChange={(e) => handleChange('contact', 'directionsButtonText', e.target.value)}
                           className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Google Maps (Opcional)</label>
                         <input
                           type="text"
                           value={localConfig.contact.mapUrl}
                           onChange={(e) => handleChange('contact', 'mapUrl', e.target.value)}
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

                  {/* Formulario */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">Formulari Web</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Formulari</label>
                        <input
                          type="text"
                          value={localConfig.contact.formTitle}
                          onChange={(e) => handleChange('contact', 'formTitle', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                       <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó Enviar</label>
                        <input
                          type="text"
                          value={localConfig.contact.formButtonText}
                          onChange={(e) => handleChange('contact', 'formButtonText', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                       {/* Labels */}
                       <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label Nom</label>
                        <input
                          type="text"
                          value={localConfig.contact.formNameLabel}
                          onChange={(e) => handleChange('contact', 'formNameLabel', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                       <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label Email</label>
                        <input
                          type="text"
                          value={localConfig.contact.formEmailLabel}
                          onChange={(e) => handleChange('contact', 'formEmailLabel', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                       <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label Telèfon</label>
                        <input
                          type="text"
                          value={localConfig.contact.formPhoneLabel}
                          onChange={(e) => handleChange('contact', 'formPhoneLabel', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                       <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label Assumpte</label>
                        <input
                          type="text"
                          value={localConfig.contact.formSubjectLabel}
                          onChange={(e) => handleChange('contact', 'formSubjectLabel', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                       <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Label Missatge</label>
                        <input
                          type="text"
                          value={localConfig.contact.formMessageLabel}
                          onChange={(e) => handleChange('contact', 'formMessageLabel', e.target.value)}
                          className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none"
                        />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Navbar Section */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
                  <h3 className="font-serif text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">menu</span>
                    Navegació
                  </h3>
                  <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó Reserva</label>
                      <input
                        type="text"
                        value={localConfig.navbar.reserveButtonText}
                        onChange={(e) => handleChange('navbar', 'reserveButtonText', e.target.value)}
                        className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none"
                      />
                  </div>
                </div>
             </div>
          )}

          {/* --- FOOD MENU TAB --- */}
          {activeTab === 'food_menu' && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-2xl font-bold text-gray-800">Categories de la Carta</h3>
                      <button 
                        onClick={handleAddSection}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors text-sm font-bold uppercase tracking-wide"
                      >
                          <span className="material-symbols-outlined text-sm">add</span>
                          Nova Categoria
                      </button>
                  </div>

                  <div className="space-y-4">
                      {localConfig.foodMenu.map((section, index) => (
                          <div key={section.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                              
                              {/* Section Header (Click to expand) */}
                              <div 
                                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                              >
                                  <div className="flex items-center gap-3">
                                      <span className={`material-symbols-outlined text-2xl text-accent transition-transform duration-300 ${expandedSection === section.id ? 'rotate-180' : ''}`}>expand_more</span>
                                      <span className="font-bold text-lg text-secondary">{section.category}</span>
                                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 flex items-center gap-1">
                                          <span className="material-symbols-outlined text-xs">{section.icon || 'restaurant_menu'}</span>
                                          {section.items?.length || 0} plats
                                      </span>
                                  </div>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                                      className="text-red-400 hover:text-red-600 p-2"
                                  >
                                      <span className="material-symbols-outlined">delete</span>
                                  </button>
                              </div>

                              {/* Section Content (Editor) */}
                              {expandedSection === section.id && (
                                  <div className="p-6 border-t border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                                      {/* Header Fields */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-beige/30 p-4 rounded border border-primary/10">
                                          <div>
                                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nom Categoria</label>
                                              <input
                                                  type="text"
                                                  value={section.category}
                                                  onChange={(e) => handleUpdateSection(section.id, 'category', e.target.value)}
                                                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                                              />
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Icona (Logo)</label>
                                              <select
                                                  value={section.icon || 'restaurant_menu'}
                                                  onChange={(e) => handleUpdateSection(section.id, 'icon', e.target.value)}
                                                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none bg-white"
                                              >
                                                  {AVAILABLE_ICONS.map(icon => (
                                                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                                                  ))}
                                              </select>
                                          </div>
                                          <div className="md:col-span-2">
                                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Peu de Pàgina (Opcional - ex: Menú Infantil)</label>
                                              <input
                                                  type="text"
                                                  value={section.footer || ''}
                                                  onChange={(e) => handleUpdateSection(section.id, 'footer', e.target.value)}
                                                  placeholder="Text avís (al·lèrgies, edat, etc)..."
                                                  className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                                              />
                                          </div>
                                      </div>

                                      {/* Items List */}
                                      <div className="space-y-3">
                                          <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Plats de la secció</h4>
                                          {(section.items || []).map((item, idx) => (
                                              <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-3 rounded border border-gray-100 shadow-sm">
                                                  <div className="grow w-full">
                                                      <input
                                                          type="text"
                                                          value={item.name}
                                                          onChange={(e) => handleUpdateItem(section.id, idx, 'name', e.target.value)}
                                                          placeholder="Nom del plat..."
                                                          className="block w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary outline-none"
                                                      />
                                                  </div>
                                                  <div className="w-full md:w-32 flex gap-2">
                                                      <input
                                                          type="text"
                                                          value={item.price}
                                                          onChange={(e) => handleUpdateItem(section.id, idx, 'price', e.target.value)}
                                                          placeholder="Preu"
                                                          className="block w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary outline-none text-right font-mono"
                                                      />
                                                      <button 
                                                          onClick={() => handleDeleteItem(section.id, idx)}
                                                          className="text-red-300 hover:text-red-500 p-2"
                                                      >
                                                          <span className="material-symbols-outlined text-lg">close</span>
                                                      </button>
                                                  </div>
                                              </div>
                                          ))}
                                          
                                          <button 
                                              onClick={() => handleAddItem(section.id)}
                                              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-primary hover:text-primary transition-colors text-xs font-bold uppercase flex justify-center items-center gap-2 mt-4"
                                          >
                                              <span className="material-symbols-outlined text-sm">add_circle</span>
                                              Afegir Plat
                                          </button>
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
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
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 border border-transparent rounded shadow-lg text-sm font-bold uppercase tracking-wider text-white bg-primary hover:bg-accent transition-all transform hover:-translate-y-1 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSaving ? 'Guardant...' : 'Guardar Canvis'}
            {!isSaving && <span className="material-symbols-outlined text-sm">cloud_upload</span>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;