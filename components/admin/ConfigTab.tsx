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