import React, { useState } from 'react';
import { LogoEditor, ImageArrayEditor, IconPicker } from './AdminShared';
import { AppConfig } from '../../context/ConfigContext';

interface ConfigTabProps {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
    userEmail: string;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ localConfig, setLocalConfig, userEmail }) => {
    const [activeSubTab, setActiveSubTab] = useState('global');
    const [showImageHelp, setShowImageHelp] = useState(false);

    // Helper to update specific nested parts of config
    const updateConfig = (section: keyof AppConfig, key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [key]: value
            }
        }));
    };

    // Helper for nested objects inside a section (e.g. gastronomy.card1)
    const updateNestedConfig = (section: keyof AppConfig, objectKey: string, key: string, value: any) => {
         setLocalConfig(prev => {
             const sectionData = prev[section] as any;
             return {
                ...prev,
                [section]: {
                    ...sectionData,
                    [objectKey]: {
                        ...sectionData[objectKey],
                        [key]: value
                    }
                }
             };
         });
    };

    // Helper to update items in an array (e.g. specialties.items)
    const updateItemInArray = (section: keyof AppConfig, arrayKey: string, index: number, field: string, value: any) => {
        setLocalConfig(prev => {
            const sectionData = prev[section] as any;
            const newArray = [...(sectionData[arrayKey] || [])];
            newArray[index] = {
                ...newArray[index],
                [field]: value
            };
            return {
                ...prev,
                [section]: {
                    ...sectionData,
                    [arrayKey]: newArray
                }
            };
        });
    };

    // Helper to auto-update label/icon when footer link target changes
    const handleFooterLinkChange = (index: number, targetTab: string) => {
        let label = '';
        let icon = 'link'; // Default

        // Logic to extract title/icon based on targetTab
        if (targetTab === 'daily') {
            label = localConfig.dailyMenu?.title || 'Menú Diari';
            icon = localConfig.dailyMenu?.icon || 'lunch_dining';
        } else if (targetTab === 'food') {
            const title = !Array.isArray(localConfig.foodMenu) ? localConfig.foodMenu?.title : 'Carta de Menjar';
            const ico = !Array.isArray(localConfig.foodMenu) ? localConfig.foodMenu?.icon : 'restaurant_menu';
            label = title || 'Carta de Menjar';
            icon = ico || 'restaurant_menu';
        } else if (targetTab === 'wine') {
            const title = !Array.isArray(localConfig.wineMenu) ? localConfig.wineMenu?.title : 'Carta de Vins';
            const ico = !Array.isArray(localConfig.wineMenu) ? localConfig.wineMenu?.icon : 'wine_bar';
            label = title || 'Carta de Vins';
            icon = ico || 'wine_bar';
        } else if (targetTab === 'group') {
            label = localConfig.groupMenu?.title || 'Menú de Grup';
            icon = localConfig.groupMenu?.icon || 'diversity_3';
        } else if (targetTab.startsWith('extra_')) {
            const i = parseInt(targetTab.replace('extra_', ''));
            const extra = (localConfig.extraMenus || [])[i];
            if (extra) {
                label = extra.title;
                icon = extra.icon || 'restaurant';
            }
        }

        const newLinks = [...(localConfig.gastronomy.footerLinks || [])];
        // Ensure array has size if needed (though it should be initialized)
        while (newLinks.length <= index) {
            newLinks.push({ label: '', icon: 'link', targetTab: '' });
        }
        
        newLinks[index] = { targetTab, label, icon };
        updateConfig('gastronomy', 'footerLinks', newLinks);
    };

    // Helper component for Visibility Toggles (Standardized)
    const VisibilityToggle = ({ 
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

    const subTabs = [
        { id: 'global', label: 'Marca i Portada', icon: 'verified' },
        { id: 'reservations', label: 'Botó Reserva', icon: 'calendar_month' },
        { id: 'intro', label: 'Intro', icon: 'edit_note' },
        { id: 'gastronomy', label: 'Gastronomia', icon: 'restaurant_menu' },
        { id: 'specialties', label: 'Especialitats', icon: 'stars' },
        { id: 'philosophy', label: 'Filosofia / Història', icon: 'spa' },
        { id: 'contact', label: 'Contacte', icon: 'contact_mail' },
    ];

    return (
        <div className="animate-[fadeIn_0.3s_ease-out] pb-32">
            
            {/* SUB-NAVIGATION BAR */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-20">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                            ${activeSubTab === tab.id 
                                ? 'bg-[#2c241b] text-white shadow-md transform scale-105' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                
                {/* --- GLOBAL (MARCA I PORTADA) TAB --- */}
                {activeSubTab === 'global' && (
                    <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-orange-50/50 p-6 rounded-xl shadow-sm border-l-4 border-orange-400 border-t border-r border-b border-orange-100">
                            <h4 className="font-serif text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined bg-orange-200 p-1 rounded text-orange-800">branding_watermark</span> 
                                Identitat (Logo) i Textos Portada
                            </h4>
                            
                            <div className="bg-white p-6 rounded-lg border border-orange-100 shadow-sm space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Logo Principal</label>
                                    <LogoEditor 
                                        value={localConfig.brand?.logoUrl || ''} 
                                        onChange={(val) => setLocalConfig(prev => ({...prev, brand: {...prev.brand, logoUrl: val}}))} 
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció (Sota el logo)</label>
                                        <textarea 
                                            value={localConfig.hero.heroDescription || ''}
                                            onChange={(e) => updateConfig('hero', 'heroDescription', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Horari (Portada)</label>
                                        <input 
                                            type="text"
                                            value={localConfig.hero.heroSchedule || ''}
                                            onChange={(e) => updateConfig('hero', 'heroSchedule', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-4 py-3 text-sm font-serif italic text-gray-600 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IMATGES DE FONS (MOVED FROM OLD HERO TAB) */}
                        <div className="bg-yellow-50/50 p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 border-t border-r border-b border-yellow-100">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-serif text-xl font-bold text-yellow-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined bg-yellow-200 p-1 rounded text-yellow-800">image</span> 
                                    Imatges de Fons (Portada)
                                </h4>
                                <span className="text-[10px] font-bold uppercase bg-red-50 text-red-500 px-3 py-1 rounded-full border border-red-100">
                                    Imatges: {localConfig.hero.backgroundImages?.length || 0} / {localConfig.adminSettings?.maxHeroImages || 5}
                                </span>
                            </div>

                            {/* --- HELP DROPDOWN --- */}
                            <div className="mb-6 border border-blue-200 rounded-lg overflow-hidden transition-all duration-300">
                                {/* Header Toggle */}
                                <button 
                                    onClick={() => setShowImageHelp(!showImageHelp)}
                                    className="w-full flex items-center justify-between p-4 bg-blue-100/50 hover:bg-blue-100 text-blue-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500 text-white rounded-full p-1"><span className="material-symbols-outlined text-lg block">help</span></div>
                                        <div className="text-left">
                                            <p className="font-bold text-xs uppercase text-blue-900">AJUDA: COM PUJAR IMATGES CORRECTAMENT?</p>
                                            <p className="text-xs opacity-70">Guia ràpida per obtenir enllaços vàlids (Postimages)</p>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined text-blue-400 transition-transform duration-300 ${showImageHelp ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>

                                {/* Content Body */}
                                {showImageHelp && (
                                    <div className="bg-blue-50/30 p-6 animate-[fadeIn_0.2s_ease-out]">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* LEFT COLUMN */}
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <h5 className="font-bold text-sm text-blue-900 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-blue-500 text-lg">info</span> 
                                                        Important: No pugem fitxers
                                                    </h5>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        Aquest web funciona amb <strong>enllaços externs (URL)</strong> per mantenir-la ràpida i lleugera. No pots pujar l'arxiu directament des del teu ordinador al panell; primer l'has de pujar a internet.
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">L'enllaç correcte <strong>sempre ha d'acabar</strong> en una extensió d'imatge:</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded text-[10px] font-mono">.jpg</span>
                                                        <span className="bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded text-[10px] font-mono">.png</span>
                                                        <span className="bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded text-[10px] font-mono">.webp</span>
                                                    </div>
                                                </div>

                                                <div className="bg-[#fffde7] border border-[#fbc02d] rounded-lg p-4">
                                                    <h6 className="font-bold text-xs uppercase text-[#854d0e] flex items-center gap-2 mb-2">
                                                        <span className="material-symbols-outlined text-base">public</span> 
                                                        Nota sobre Privacitat
                                                    </h6>
                                                    <p className="text-[11px] text-[#a16207] leading-relaxed mb-2">
                                                        Recorda que Postimages és un servei públic. Les imatges que hi pugis seran accessibles per a qualsevol persona que tingui l'enllaç.
                                                    </p>
                                                    <p className="text-[11px] text-[#a16207] leading-relaxed">
                                                        Això és <strong>perfecte i segur per a fotos del restaurant</strong> (plats, local, equip...), però evita utilitzar-ho per pujar documents privats o dades sensibles.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN */}
                                            <div className="bg-white border border-blue-100 rounded-lg p-5 shadow-sm">
                                                <h5 className="font-bold text-sm text-blue-900 flex items-center gap-2 mb-4">
                                                    <span className="material-symbols-outlined text-blue-500 text-lg">rocket_launch</span> 
                                                    Pas a pas (Recomanat: Postimages)
                                                </h5>
                                                
                                                <ol className="space-y-4 text-xs text-gray-600">
                                                    <li className="flex gap-3">
                                                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">1</span>
                                                        <div className="mt-0.5">Entra a <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">postimages.org</a> (no cal registre).</div>
                                                    </li>
                                                    
                                                    <li className="flex gap-3">
                                                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">2</span>
                                                        <div className="w-full mt-0.5">
                                                            <div className="bg-blue-50 border border-blue-100 rounded p-2 mb-1">
                                                                <p className="text-[10px] font-bold text-blue-800 uppercase mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-xs">settings</span> CONFIGURACIÓ OBLIGATÒRIA</p>
                                                                <p>Abans de prémer el botó de pujar, selecciona:</p>
                                                                <ul className="list-disc pl-4 mt-1 text-gray-500">
                                                                    <li>"No cambiar el tamaño de mi imagen" (per evitar que es vegi borrosa).</li>
                                                                    <li>"Sin caducidad" (perquè no s'esborri mai de la web).</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li className="flex gap-3">
                                                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">3</span>
                                                        <div className="mt-0.5">Prem el botó blau "<strong>Tria les imatges</strong>" i puja la teva foto.</div>
                                                    </li>

                                                    <li className="flex gap-3">
                                                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">4</span>
                                                        <div className="mt-0.5">Un cop carregada, apareixerà una llista de codis. <br/> Busca la fila que diu: <strong>Enllaç directe (Direct Link)</strong>.</div>
                                                    </li>

                                                    <li className="flex gap-3">
                                                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">5</span>
                                                        <div className="mt-0.5">Copia aquell enllaç i enganxa'l a la casella del panell.</div>
                                                    </li>
                                                </ol>

                                                <p className="text-[10px] text-gray-400 italic mt-4 border-t pt-2">
                                                    * Aquest sistema és el mateix per a qualsevol foto que vulguis canviar a tota la web.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-lg border border-yellow-100 shadow-sm">
                                <ImageArrayEditor 
                                    images={localConfig.hero.backgroundImages || []} 
                                    onChange={(newImages) => updateConfig('hero', 'backgroundImages', newImages)}
                                    labelPrefix="Slide"
                                    maxLimit={localConfig.adminSettings?.maxHeroImages || 5}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- RESERVATION BUTTON TAB (BROWN) --- */}
                {activeSubTab === 'reservations' && (
                    <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-[#fffcf5] p-8 rounded-b-xl rounded-tr-xl shadow-sm border-l-4 border-[#8D6E63] border-t border-r border-b border-[#eecfc3]">
                            
                            {/* VISIBILITY BUTTON INSIDE CONTAINER */}
                            <VisibilityToggle 
                                isVisible={localConfig.hero.reservationVisible !== false} 
                                onToggle={() => updateConfig('hero', 'reservationVisible', !(localConfig.hero.reservationVisible !== false))}
                                labelVisible="RESERVES VISIBLES"
                                labelHidden="RESERVES OCULTES"
                                colorClass="bg-[#8D6E63] border-[#8D6E63]"
                            />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#5D4037] rounded-lg flex items-center justify-center text-white shadow-md">
                                    <span className="material-symbols-outlined text-2xl">restaurant</span>
                                </div>
                                <div>
                                    <h4 className="font-serif text-3xl font-bold text-[#2c241b]">Configuració Reserves</h4>
                                    <p className="text-[#8D6E63] text-xs font-bold uppercase tracking-widest mt-1">FORMULARI I HORARIS</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Left Column: Texts */}
                                <div className="space-y-6">
                                    <h5 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Textos i Comunicació</h5>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                                            <input value={localConfig.hero.reservationFormTitle} onChange={(e) => updateConfig('hero', 'reservationFormTitle', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label>
                                            <input value={localConfig.hero.reservationFormSubtitle} onChange={(e) => updateConfig('hero', 'reservationFormSubtitle', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telèfon (Visible al formulari)</label>
                                        <div className="flex items-center gap-2 relative">
                                            <div className="absolute left-3 text-gray-400"><span className="material-symbols-outlined text-lg">call</span></div>
                                            <input value={localConfig.hero.reservationPhoneNumber} onChange={(e) => updateConfig('hero', 'reservationPhoneNumber', e.target.value)} className="w-full border border-gray-300 rounded pl-10 pr-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Acció</label>
                                        <input value={localConfig.hero.reservationButtonText} onChange={(e) => updateConfig('hero', 'reservationButtonText', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm font-bold text-[#8D6E63] outline-none focus:border-[#8D6E63]" />
                                    </div>
                                </div>

                                {/* Right Column: Logic */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                                    <h5 className="font-bold text-xs uppercase text-gray-400 flex items-center gap-2"><span className="material-symbols-outlined text-base">schedule</span> Lògica de Reserva</h5>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Inici</label>
                                            <div className="relative">
                                                <input type="time" value={localConfig.hero.reservationTimeStart} onChange={(e) => updateConfig('hero', 'reservationTimeStart', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-center outline-none focus:border-[#8D6E63]" />
                                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-400">schedule</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Fi</label>
                                            <div className="relative">
                                                <input type="time" value={localConfig.hero.reservationTimeEnd} onChange={(e) => updateConfig('hero', 'reservationTimeEnd', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-center outline-none focus:border-[#8D6E63]" />
                                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-400">schedule</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Interval (Minuts)</label>
                                        <div className="flex items-center gap-3">
                                            <input type="number" value={localConfig.hero.reservationTimeInterval} onChange={(e) => updateConfig('hero', 'reservationTimeInterval', parseInt(e.target.value))} className="w-20 border border-gray-300 rounded px-3 py-2 text-sm text-center outline-none focus:border-[#8D6E63]" />
                                            <span className="text-xs text-gray-500">entre taules</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Missatge Error (Text previ)</label>
                                        <input value={localConfig.hero.reservationErrorMessage} onChange={(e) => updateConfig('hero', 'reservationErrorMessage', e.target.value)} className="w-full border border-red-200 bg-red-50 text-red-600 rounded px-3 py-2 text-xs outline-none focus:border-red-400" />
                                    </div>
                                    
                                    <div className="bg-red-100/50 border border-red-200 border-dashed rounded p-3 text-red-800">
                                        <p className="text-[9px] font-bold uppercase mb-1 text-red-400">Així es veurà el missatge:</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium">{localConfig.hero.reservationErrorMessage} {localConfig.hero.reservationTimeStart} a {localConfig.hero.reservationTimeEnd}</p>
                                            <span className="material-symbols-outlined text-red-300">confirmation_number</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-[#d7ccc8] my-8"></div>

                            {/* Field Labels */}
                            <h5 className="font-bold text-xs uppercase text-gray-400 mb-6 tracking-wider">Etiquetes dels camps (Personalització)</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Camp Nom</label><input value={localConfig.hero.formNameLabel} onChange={(e) => updateConfig('hero', 'formNameLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Camp Telèfon</label><input value={localConfig.hero.formPhoneLabel} onChange={(e) => updateConfig('hero', 'formPhoneLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Camp Data/Hora</label><input value={localConfig.hero.formDateLabel} onChange={(e) => updateConfig('hero', 'formDateLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Camp Persones</label><input value={localConfig.hero.formPaxLabel} onChange={(e) => updateConfig('hero', 'formPaxLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Camp Notes</label><input value={localConfig.hero.formNotesLabel} onChange={(e) => updateConfig('hero', 'formNotesLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Privacitat</label><input value={localConfig.hero.formPrivacyLabel} onChange={(e) => updateConfig('hero', 'formPrivacyLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text "O truca'ns"</label><input value={localConfig.hero.formCallUsLabel} onChange={(e) => updateConfig('hero', 'formCallUsLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" /></div>
                            </div>

                            {/* Sticky Note Redesign */}
                            <div className="bg-[#fff9c4] border border-[#fbc02d] p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6 mt-8">
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="w-14 h-14 bg-[#fdd835] rounded-lg shadow-md border border-[#fbc02d] flex items-center justify-center transform -rotate-2">
                                        <span className="material-symbols-outlined text-[#854d0e] text-3xl">sticky_note_2</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase text-[#854d0e] tracking-wider">Nota Adhesiva (Post-it)</p>
                                        <p className="text-[11px] text-[#a16207] italic mt-1 max-w-[200px] leading-tight">Un missatge curt i informal per als clients (ex: "Obert tot l'any!")</p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 w-full relative group">
                                    <input 
                                        value={localConfig.hero.stickyNoteText} 
                                        onChange={(e) => updateConfig('hero', 'stickyNoteText', e.target.value)} 
                                        maxLength={45}
                                        className="w-full bg-[#fefce8] border-2 border-[#fbc02d]/50 rounded-lg px-5 py-4 pr-16 text-lg font-hand font-bold text-[#854d0e] outline-none focus:border-[#fbc02d] focus:bg-white focus:ring-4 focus:ring-[#fbc02d]/20 transition-all placeholder-[#854d0e]/30 shadow-inner"
                                        placeholder="Escriu el missatge aquí..."
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#a16207] bg-[#fdd835]/20 px-2 py-1 rounded-md border border-[#fbc02d]/30">
                                        {localConfig.hero.stickyNoteText.length}/45
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- INTRO TAB (LIME GREEN) --- */}
                {activeSubTab === 'intro' && (
                    <div className="animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-[#f7fee7] p-8 rounded-b-xl rounded-tr-xl shadow-sm border-l-4 border-[#65a30d] border-t border-r border-b border-[#d9f99d]">
                            
                            {/* VISIBILITY BUTTON INSIDE CONTAINER */}
                            <VisibilityToggle 
                                isVisible={localConfig.intro.visible !== false} 
                                onToggle={() => updateConfig('intro', 'visible', !(localConfig.intro.visible !== false))}
                                colorClass="bg-[#65a30d] border-[#65a30d]"
                            />

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#d9f99d] rounded-lg flex items-center justify-center text-[#365314] shadow-sm border border-[#bef264]">
                                    <span className="material-symbols-outlined text-2xl">description</span>
                                </div>
                                <div>
                                    <h4 className="font-serif text-3xl font-bold text-[#365314]">Intro (Frase Inicial)</h4>
                                </div>
                            </div>

                            <div className="bg-white/50 p-6 rounded-xl border border-[#d9f99d] shadow-sm space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">TÍTOL PRINCIPAL (GRAN H2)</label>
                                        <input 
                                            value={localConfig.intro.mainTitle} 
                                            onChange={(e) => updateConfig('intro', 'mainTitle', e.target.value)} 
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#bef264] transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">TÍTOL PETIT</label>
                                        <input 
                                            value={localConfig.intro.smallTitle} 
                                            onChange={(e) => updateConfig('intro', 'smallTitle', e.target.value)} 
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#bef264] transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">DESCRIPCIÓ (CITA)</label>
                                        <span className={`text-[10px] font-bold ${localConfig.intro.description.length > 350 ? 'text-red-500' : 'text-gray-300'}`}>
                                            {localConfig.intro.description.length}/350
                                        </span>
                                    </div>
                                    <textarea 
                                        value={localConfig.intro.description} 
                                        onChange={(e) => updateConfig('intro', 'description', e.target.value)} 
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#bef264] transition-all" 
                                        rows={4}
                                    />
                                    <span className="material-symbols-outlined absolute bottom-2 right-2 text-gray-300 text-xs pointer-events-none">
                                        format_quote
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- GASTRONOMY TAB (TEAL) --- */}
                {activeSubTab === 'gastronomy' && (
                    <div className="bg-[#f0fdf9] p-6 rounded-xl shadow-sm border-l-4 border-teal-500 border-t border-r border-b border-teal-100 animate-[fadeIn_0.2s_ease-out]">
                        
                        {/* VISIBILITY BUTTON INSIDE CONTAINER */}
                        <VisibilityToggle 
                            isVisible={localConfig.gastronomy.visible !== false} 
                            onToggle={() => updateConfig('gastronomy', 'visible', !(localConfig.gastronomy.visible !== false))}
                            colorClass="bg-teal-600 border-teal-600"
                        />

                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-serif text-xl font-bold text-teal-900 flex items-center gap-2">
                                <span className="material-symbols-outlined bg-teal-200 p-1 rounded text-teal-800">restaurant_menu</span> 
                                Gastronomia
                            </h4>
                        </div>
                        
                        <div className="bg-white border border-teal-100 p-6 rounded-lg mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Principal (Gran H2)</label><input value={localConfig.gastronomy.mainTitle} onChange={(e) => updateConfig('gastronomy', 'mainTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold" /></div>
                                {/* Removed 'Top Title' input as requested */}
                            </div>
                            <div className="mt-4"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció</label><textarea value={localConfig.gastronomy.description} onChange={(e) => updateConfig('gastronomy', 'description', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} /></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {['card1', 'card2'].map((cardKey, idx) => {
                                const cardData = (localConfig.gastronomy as any)[cardKey];
                                return (
                                    <div key={cardKey} className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm relative">
                                        <h5 className="font-bold text-sm uppercase text-teal-700 flex items-center gap-2 mb-4">
                                            {/* Updated Icon Logic: Always 'menu_book' for both cards as requested */}
                                            <span className="material-symbols-outlined">menu_book</span> Targeta {idx + 1}
                                        </h5>
                                        <div className="space-y-3">
                                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol</label><input value={cardData.title} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'title', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Subtítol</label><input value={cardData.subtitle} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'subtitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció</label><textarea value={cardData.description} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'description', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={2} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Preu</label><input value={cardData.price} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'price', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Nota al peu</label><input value={cardData.footerText} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'footerText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded border border-gray-100">
                                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Text Botó</label><input value={cardData.buttonText} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'buttonText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white" /></div>
                                                <div>
                                                    <label className="block text-[9px] font-bold uppercase text-gray-400">Enllaç (Destí)</label>
                                                    <select value={cardData.targetTab} onChange={(e) => updateNestedConfig('gastronomy', cardKey, 'targetTab', e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white outline-none">
                                                        <option value="daily">Menú Diari</option>
                                                        <option value="food">Carta Menjar</option>
                                                        <option value="wine">Carta Vins</option>
                                                        <option value="group">Menú Grup</option>
                                                        {(localConfig.extraMenus || []).map((m:any, i:number) => <option key={i} value={`extra_${i}`}>{m.title}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Imatge</label><LogoEditor value={cardData.image} onChange={(val) => updateNestedConfig('gastronomy', cardKey, 'image', val)} /></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* FOOTER LINKS CONFIG - UPDATED COMPACT LAYOUT */}
                        <div className="bg-[#f0fdf9] p-4 rounded-xl border border-teal-100 mt-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                                {/* 1. Toggle on Left */}
                                <button
                                    onClick={() => updateConfig('gastronomy', 'footerVisible', !(localConfig.gastronomy.footerVisible !== false))}
                                    className={`shrink-0 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 
                                    ${localConfig.gastronomy.footerVisible !== false ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white text-gray-400 border-gray-200'}`}
                                >
                                    <span className="material-symbols-outlined text-xs">{localConfig.gastronomy.footerVisible !== false ? 'visibility' : 'visibility_off'}</span>
                                    {localConfig.gastronomy.footerVisible !== false ? 'LINKS VISIBLES' : 'LINKS OCULTS'}
                                </button>

                                <div className="h-4 w-px bg-teal-200 hidden md:block"></div> {/* Separator */}

                                <h5 className="font-bold text-xs uppercase text-teal-800 shrink-0 pt-1">
                                    Enllaços Peu de Pàgina
                                </h5>

                                {/* 2. Title Input Inline */}
                                <div className="flex-1 w-full md:w-auto relative group">
                                    <span className="absolute top-1/2 -translate-y-1/2 left-3 text-teal-400 material-symbols-outlined text-sm">title</span>
                                    <input
                                        value={localConfig.gastronomy.footerTitle || ''}
                                        onChange={(e) => updateConfig('gastronomy', 'footerTitle', e.target.value)}
                                        className="w-full bg-white border border-teal-100 rounded-md py-1.5 pl-9 pr-3 text-xs font-bold text-teal-900 outline-none focus:border-teal-400 placeholder-teal-300/50"
                                        placeholder="Títol Secció (ex: TAMBÉ DISPONIBLE)"
                                    />
                                </div>
                            </div>

                            {/* 3. Compact Links Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {localConfig.gastronomy.footerLinks?.map((link, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-teal-100 shadow-sm hover:border-teal-300 transition-colors">
                                        <div className="w-8 h-8 bg-teal-50 rounded flex items-center justify-center text-teal-600 shrink-0">
                                            <span className="material-symbols-outlined text-base">{link.icon || 'link'}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <select
                                                value={link.targetTab || ''}
                                                onChange={(e) => handleFooterLinkChange(idx, e.target.value)}
                                                className="w-full text-xs font-bold text-gray-700 bg-transparent outline-none cursor-pointer truncate"
                                            >
                                                <option value="" className="text-gray-400">Selecciona...</option>
                                                <option value="daily">Menú Diari</option>
                                                <option value="food">Carta Menjar</option>
                                                <option value="wine">Carta Vins</option>
                                                <option value="group">Menú Grup</option>
                                                {(localConfig.extraMenus || []).map((m: any, i: number) => (
                                                    <option key={i} value={`extra_${i}`}>{m.title}</option>
                                                ))}
                                            </select>
                                            {/* Display Label Preview */}
                                            <p className="text-[9px] text-gray-400 truncate">{link.label || 'Sense destí'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SPECIALTIES TAB (NEW: AMBER/ORANGE) --- */}
                {activeSubTab === 'specialties' && (
                    <div className="bg-[#fff8e1] p-6 rounded-xl shadow-sm border-l-4 border-orange-500 border-t border-r border-b border-orange-100 animate-[fadeIn_0.2s_ease-out]">
                        
                        {/* VISIBILITY BUTTON INSIDE CONTAINER */}
                        <VisibilityToggle 
                            isVisible={localConfig.specialties.visible !== false} 
                            onToggle={() => updateConfig('specialties', 'visible', !(localConfig.specialties.visible !== false))}
                            colorClass="bg-orange-600 border-orange-600"
                        />

                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-serif text-xl font-bold text-orange-900 flex items-center gap-2">
                                <span className="material-symbols-outlined bg-orange-200 p-1 rounded text-orange-800">stars</span> 
                                Especialitats (Targetes Destacades)
                            </h4>
                        </div>
                        
                        {/* HEADER & TEXTS */}
                        <div className="bg-white border border-orange-100 p-6 rounded-lg mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Secció (Petit)</label><input value={localConfig.specialties.sectionTitle} onChange={(e) => updateConfig('specialties', 'sectionTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
                                <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Principal (Gran H2)</label><input value={localConfig.specialties.mainTitle} onChange={(e) => updateConfig('specialties', 'mainTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold" /></div>
                            </div>
                            <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció</label><textarea value={localConfig.specialties.description} onChange={(e) => updateConfig('specialties', 'description', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} /></div>
                        </div>

                        {/* CARDS LIST (FIXES) */}
                        <h5 className="font-bold text-xs uppercase text-orange-800 mb-4 tracking-widest">TARGETES DESTACADES (FIXES)</h5>
                        <div className="space-y-6">
                            {(localConfig.specialties.items || []).map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm relative">
                                    <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-400">star</span>
                                            <h5 className="font-bold text-sm uppercase text-gray-700">Targeta {idx + 1}</h5>
                                        </div>
                                        <button 
                                            onClick={() => updateItemInArray('specialties', 'items', idx, 'visible', !(item.visible !== false))}
                                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors flex items-center gap-1 ${item.visible !== false ? 'bg-[#eab308] border-[#ca8a04] text-white' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                                        >
                                            <span className="material-symbols-outlined text-xs">{item.visible !== false ? 'visibility' : 'visibility_off'}</span>
                                            {item.visible !== false ? 'VISIBLE' : 'OCULT'}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol</label><input value={item.title} onChange={(e) => updateItemInArray('specialties', 'items', idx, 'title', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" /></div>
                                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Subtítol</label><input value={item.subtitle} onChange={(e) => updateItemInArray('specialties', 'items', idx, 'subtitle', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" /></div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-[9px] font-bold uppercase text-gray-400">Imatge Targeta</label>
                                                {item.badge && <input value={item.badge} onChange={(e) => updateItemInArray('specialties', 'items', idx, 'badge', e.target.value)} className="border border-orange-200 bg-orange-50 text-orange-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase w-32 text-center placeholder-orange-300" placeholder="ETIQUETA (EX: PROXIMITAT)" />}
                                            </div>
                                            <LogoEditor value={item.image} onChange={(val) => updateItemInArray('specialties', 'items', idx, 'image', val)} />
                                        </div>

                                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció Targeta</label><textarea value={item.description || ''} onChange={(e) => updateItemInArray('specialties', 'items', idx, 'description', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm text-gray-600" rows={2} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- PHILOSOPHY TAB (GRAY) --- */}
                {activeSubTab === 'philosophy' && (
                    <div className="bg-[#fafafa] p-6 rounded-xl shadow-sm border-l-4 border-gray-500 border-t border-r border-b border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                        
                        {/* VISIBILITY BUTTON INSIDE CONTAINER - UPDATED STYLE */}
                        <VisibilityToggle 
                            isVisible={localConfig.philosophy.visible !== false}
                            onToggle={() => updateConfig('philosophy', 'visible', !(localConfig.philosophy.visible !== false))}
                            colorClass="bg-[#2c241b] border-[#2c241b]"
                        />

                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-serif text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="material-symbols-outlined bg-gray-200 p-1 rounded text-gray-700">history_edu</span> 
                                Filosofia i Història
                            </h4>
                        </div>

                        {/* Top General Info */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div><label className="block text-[10px] font-bold uppercase text-gray-400">Títol Secció (Petit)</label><input value={localConfig.philosophy.sectionTitle} onChange={(e) => updateConfig('philosophy', 'sectionTitle', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" /></div>
                                <div><label className="block text-[10px] font-bold uppercase text-gray-400">Títol Principal (Gran H2)</label><input value={localConfig.philosophy.titleLine1} onChange={(e) => updateConfig('philosophy', 'titleLine1', e.target.value)} className="w-full border rounded px-3 py-2 text-sm font-bold" /></div>
                                <div><label className="block text-[10px] font-bold uppercase text-gray-400">Títol Línia 2 (Cursiva)</label><input value={localConfig.philosophy.titleLine2} onChange={(e) => updateConfig('philosophy', 'titleLine2', e.target.value)} className="w-full border rounded px-3 py-2 text-sm italic" /></div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció General</label>
                                <textarea value={localConfig.philosophy.description} onChange={(e) => updateConfig('philosophy', 'description', e.target.value)} className="w-full border rounded px-3 py-2 text-sm h-full" />
                            </div>
                        </div>

                        {/* Two Columns: Product vs History */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left: Product */}
                            <div className="bg-white border border-gray-200 p-6 rounded-lg">
                                <h5 className="font-bold text-xs uppercase text-gray-500 mb-4 border-b pb-2">Columna Producte (Esquerra)</h5>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Producte</label><input value={localConfig.philosophy.productTitle} onChange={(e) => updateConfig('philosophy', 'productTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Etiqueta Nota (Post-it)</label><input value={localConfig.philosophy.cardTag} onChange={(e) => updateConfig('philosophy', 'cardTag', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    </div>
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció Producte</label><textarea value={localConfig.philosophy.productDescription} onChange={(e) => updateConfig('philosophy', 'productDescription', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={3} /></div>
                                    
                                    {/* UPDATED IMAGE SECTION */}
                                    <div className="pt-4 border-t border-dashed mt-2">
                                         <div className="flex justify-between items-center mb-3">
                                            <label className="block text-[10px] font-bold uppercase text-gray-400">IMATGES PRODUCTE (SLIDES)</label>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                                                (localConfig.philosophy.productImages?.length || 0) >= (localConfig.adminSettings?.maxProductImages || 5) 
                                                ? 'bg-red-50 text-red-500 border-red-100' 
                                                : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                                Imatges: {(localConfig.philosophy.productImages || []).length} / {localConfig.adminSettings?.maxProductImages || 5}
                                            </span>
                                        </div>
                                        <ImageArrayEditor 
                                            images={localConfig.philosophy.productImages || []} 
                                            onChange={(imgs) => updateConfig('philosophy', 'productImages', imgs)} 
                                            labelPrefix="Producte" 
                                            maxLimit={localConfig.adminSettings?.maxProductImages || 5} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: History */}
                            <div className="bg-white border border-gray-200 p-6 rounded-lg">
                                <h5 className="font-bold text-xs uppercase text-gray-500 mb-4 border-b pb-2">Columna Història (Dreta)</h5>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Història</label><input value={localConfig.philosophy.historicTitle} onChange={(e) => updateConfig('philosophy', 'historicTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Enllaç Botó</label><input value={localConfig.philosophy.historicLinkUrl} onChange={(e) => updateConfig('philosophy', 'historicLinkUrl', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    </div>
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció Història</label><textarea value={localConfig.philosophy.historicDescription} onChange={(e) => updateConfig('philosophy', 'historicDescription', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={3} /></div>
                                    
                                    {/* UPDATED IMAGE SECTION */}
                                    <div className="pt-4 border-t border-dashed mt-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-[10px] font-bold uppercase text-gray-400">IMATGES HISTÒRIA (SLIDES)</label>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                                                (localConfig.philosophy.historicImages?.length || 0) >= (localConfig.adminSettings?.maxHistoricImages || 5) 
                                                ? 'bg-red-50 text-red-500 border-red-100' 
                                                : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                                Imatges: {(localConfig.philosophy.historicImages || []).length} / {localConfig.adminSettings?.maxHistoricImages || 5}
                                            </span>
                                        </div>
                                        <ImageArrayEditor 
                                            images={localConfig.philosophy.historicImages || []} 
                                            onChange={(imgs) => updateConfig('philosophy', 'historicImages', imgs)} 
                                            labelPrefix="Història" 
                                            maxLimit={localConfig.adminSettings?.maxHistoricImages || 5} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CONTACT TAB (MIXED) --- */}
                {activeSubTab === 'contact' && (
                    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
                        
                        {/* 1. STICKY NOTE (YELLOW) */}
                        <div className="bg-[#fffde7] p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 border-t border-r border-b border-yellow-100">
                            
                            <VisibilityToggle 
                                isVisible={localConfig.contact.importantNoteVisible !== false}
                                onToggle={() => updateConfig('contact', 'importantNoteVisible', !(localConfig.contact.importantNoteVisible !== false))}
                                colorClass="bg-yellow-600 border-yellow-600"
                            />

                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-yellow-800 flex items-center gap-2 text-sm uppercase"><span className="material-symbols-outlined">sticky_note_2</span> Nota Adhesiva (Post-it)</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Nota</label><input value={localConfig.contact.importantNoteTitle} onChange={(e) => updateConfig('contact', 'importantNoteTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-hand text-red-800" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Missatge 1 (Gran)</label><input value={localConfig.contact.importantNoteMessage1} onChange={(e) => updateConfig('contact', 'importantNoteMessage1', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-hand" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Missatge 2 (Petit)</label><input value={localConfig.contact.importantNoteMessage2} onChange={(e) => updateConfig('contact', 'importantNoteMessage2', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-hand" /></div>
                            </div>
                        </div>

                        {/* 2. GENERAL INFO (RED) */}
                        <div className="bg-[#fef2f2] p-6 rounded-xl shadow-sm border-l-4 border-red-600 border-t border-r border-b border-red-100">
                            
                            <VisibilityToggle 
                                isVisible={localConfig.contact.infoVisible !== false}
                                onToggle={() => updateConfig('contact', 'infoVisible', !(localConfig.contact.infoVisible !== false))}
                                colorClass="bg-red-700 border-red-700"
                            />

                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase"><span className="material-symbols-outlined">info</span> Informació General</h4>
                            </div>
                            <div className="bg-white p-4 rounded border border-red-100 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">TÍTOL PRINCIPAL (GRAN H2)</label><input value={localConfig.contact.sectionTitle} onChange={(e) => updateConfig('contact', 'sectionTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-bold" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Localització</label><input value={localConfig.contact.locationTitle} onChange={(e) => updateConfig('contact', 'locationTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Adreça Línia 1</label><input value={localConfig.contact.addressLine1} onChange={(e) => updateConfig('contact', 'addressLine1', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Adreça Línia 2</label><input value={localConfig.contact.addressLine2} onChange={(e) => updateConfig('contact', 'addressLine2', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Horari</label><input value={localConfig.contact.schedule} onChange={(e) => updateConfig('contact', 'schedule', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Telèfons (Separats per coma)</label><input value={localConfig.contact.phoneNumbers.join(', ')} onChange={(e) => updateConfig('contact', 'phoneNumbers', e.target.value.split(',').map(s=>s.trim()))} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                </div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Enllaç Google Maps</label><input value={localConfig.contact.mapUrl} onChange={(e) => updateConfig('contact', 'mapUrl', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 3. SOCIAL (PURPLE) */}
                            <div className="bg-[#f3e8ff] p-6 rounded-xl shadow-sm border-l-4 border-purple-500 border-t border-r border-b border-purple-100">
                                
                                <VisibilityToggle 
                                    isVisible={localConfig.contact.socialVisible !== false}
                                    onToggle={() => updateConfig('contact', 'socialVisible', !(localConfig.contact.socialVisible !== false))}
                                    colorClass="bg-purple-600 border-purple-600"
                                />

                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-purple-800 flex items-center gap-2 text-sm uppercase"><span className="material-symbols-outlined">share</span> Xarxes Socials (Instagram)</h4>
                                </div>
                                <div className="space-y-2">
                                    <div><label className="block text-[9px] font-bold uppercase text-purple-400">Títol Xarxes</label><input value={localConfig.contact.socialTitle} onChange={(e) => updateConfig('contact', 'socialTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-purple-400">Descripció</label><input value={localConfig.contact.socialDescription} onChange={(e) => updateConfig('contact', 'socialDescription', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-purple-400">Text Botó</label><input value={localConfig.contact.socialButtonText} onChange={(e) => updateConfig('contact', 'socialButtonText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-purple-400">URL Instagram</label><input value={localConfig.contact.instagramUrl} onChange={(e) => updateConfig('contact', 'instagramUrl', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                </div>
                            </div>

                            {/* 4. FORM (GRAY -> UPDATED TO WHITE/CLEAN) */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                
                                <div className="flex justify-between items-start mb-6">
                                    <VisibilityToggle 
                                        isVisible={localConfig.contact.formVisible !== false}
                                        onToggle={() => updateConfig('contact', 'formVisible', !(localConfig.contact.formVisible !== false))}
                                        colorClass="bg-gray-700 border-gray-700" // Dark grey as in screenshot
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                                    <span className="material-symbols-outlined text-gray-500">edit_note</span>
                                    <h4 className="font-bold text-gray-600 text-sm uppercase">Formulari de Contacte</h4>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                                        <input 
                                            value={localConfig.contact.formTitle} 
                                            onChange={(e) => updateConfig('contact', 'formTitle', e.target.value)} 
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Nom</label>
                                            <input 
                                                value={localConfig.contact.formNameLabel} 
                                                onChange={(e) => updateConfig('contact', 'formNameLabel', e.target.value)} 
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Email</label>
                                            <input 
                                                value={localConfig.contact.formEmailLabel} 
                                                onChange={(e) => updateConfig('contact', 'formEmailLabel', e.target.value)} 
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Telèfon</label>
                                            <input 
                                                value={localConfig.contact.formPhoneLabel} 
                                                onChange={(e) => updateConfig('contact', 'formPhoneLabel', e.target.value)} 
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Assumpte</label>
                                            <input 
                                                value={localConfig.contact.formSubjectLabel} 
                                                onChange={(e) => updateConfig('contact', 'formSubjectLabel', e.target.value)} 
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Missatge</label>
                                        <input 
                                            value={localConfig.contact.formMessageLabel} 
                                            onChange={(e) => updateConfig('contact', 'formMessageLabel', e.target.value)} 
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Enviar</label>
                                        <input 
                                            value={localConfig.contact.formButtonText} 
                                            onChange={(e) => updateConfig('contact', 'formButtonText', e.target.value)} 
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                                        />
                                    </div>

                                    <p className="text-[10px] text-gray-400 italic mt-4 pt-2 border-t border-gray-100">
                                        * L'estructura dels camps és fixa per motius de programació, però pots editar els textos que veu l'usuari.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};