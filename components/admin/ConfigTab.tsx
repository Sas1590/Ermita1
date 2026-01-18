import React, { useState } from 'react';
import { LogoEditor, ImageArrayEditor, IconPicker } from './AdminShared';

interface ConfigTabProps {
    localConfig: any;
    setLocalConfig: (config: any) => void;
    userEmail: string;
    // Removed personalName props as they are no longer used here
}

// --- HELPER COMPONENT: IMAGE UPLOAD GUIDE ---
const ImageUploadGuide = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden shadow-sm transition-all">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-blue-100/50 hover:bg-blue-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white rounded-full p-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-lg block">help</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide">AJUDA: Com pujar imatges correctament?</h4>
                        <p className="text-xs text-blue-700 mt-0.5">Guia ràpida per obtenir enllaços vàlids (Postimages)</p>
                    </div>
                </div>
                <span className={`material-symbols-outlined text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {isOpen && (
                <div className="px-6 py-6 border-t border-blue-200 bg-white/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: EXPLANATION + PRIVACY NOTE */}
                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <h5 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">info</span>
                                    Important: No pugem fitxers
                                </h5>
                                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                    Aquest web funciona amb <strong>enllaços externs (URL)</strong> per mantenir-la ràpida i lleugera. 
                                    No pots pujar l'arxiu directament des del teu ordinador al panell; primer l'has de pujar a internet.
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    L'enllaç correcte <strong>sempre ha d'acabar</strong> en una extensió d'imatge:<br/>
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500 font-mono">.jpg</code> 
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500 font-mono ml-1">.png</code> 
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500 font-mono ml-1">.webp</code>
                                </p>
                            </div>

                            {/* PRIVACY NOTICE BOX (New) */}
                            <div className="mt-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                                <h5 className="font-bold text-yellow-800 text-xs mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">public</span>
                                    Nota sobre Privacitat
                                </h5>
                                <p className="text-[10px] text-yellow-900/80 leading-relaxed">
                                    Recorda que Postimages és un servei públic. Les imatges que hi pugis seran accessibles per a qualsevol persona que tingui l'enllaç.
                                    <br/><br/>
                                    Això és <strong>perfecte i segur per a fotos del restaurant</strong> (plats, local, equip...), però evita utilitzar-ho per pujar documents privats o dades sensibles.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: STEPS */}
                        <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                            <h5 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">rocket_launch</span>
                                Pas a pas (Recomanat: Postimages)
                            </h5>
                            <ol className="space-y-3">
                                <li className="flex gap-3 text-xs text-gray-700">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                                    <span>
                                        Entra a <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold hover:text-blue-800">postimages.org</a> (no cal registre).
                                    </span>
                                </li>
                                <li className="flex gap-3 text-xs text-gray-700">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                                    <div className="bg-blue-50 p-3 rounded border border-blue-100 w-full">
                                        <span className="block font-bold text-blue-800 mb-1 uppercase text-[10px] tracking-wider flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">settings</span> Configuració Obligatòria
                                        </span>
                                        <span className="block mb-1">Abans de prémer el botó de pujar, selecciona:</span>
                                        <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-600 font-medium">
                                            <li><strong>"No cambiar el tamaño de mi imagen"</strong> (per evitar que es vegi borrosa).</li>
                                            <li><strong>"Sin caducidad"</strong> (perquè no s'esborri mai de la web).</li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="flex gap-3 text-xs text-gray-700">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                                    <span>
                                        Prem el botó blau <strong>"Tria les imatges"</strong> i puja la teva foto.
                                    </span>
                                </li>
                                <li className="flex gap-3 text-xs text-gray-700">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">4</span>
                                    <span>
                                        Un cop carregada, apareixerà una llista de codis.<br/>
                                        Busca la fila que diu: <strong>Enllaç directe (Direct Link)</strong>.
                                    </span>
                                </li>
                                <li className="flex gap-3 text-xs text-gray-700">
                                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">5</span>
                                    <span>
                                        Copia aquell enllaç i enganxa'l a la casella del panell.
                                        <span className="block mt-2 text-gray-500 italic font-medium bg-gray-50 p-2 rounded border border-gray-100">
                                            * Aquest sistema és el mateix per a qualsevol foto que vulguis canviar a tota la web.
                                        </span>
                                    </span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ConfigTab: React.FC<ConfigTabProps> = ({ localConfig, setLocalConfig, userEmail }) => {
    
    // Helper to handle simple key-value changes
    const handleChange = (section: string, key: string, value: string) => {
        if (section === 'contact' && key === 'phoneNumbers') {
            setLocalConfig((prev: any) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value.split(',').map(s => s.trim()), 
                },
            }));
        } else {
            setLocalConfig((prev: any) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value,
                },
            }));
        }
    };

    // Helper for Section Visibility Toggle (Compact Style)
    const renderVisibilityToggle = (isVisible: boolean, onToggle: () => void, labelOn = "Visible", labelOff = "Ocult", activeColorClass = "bg-[#8b5a2b] border-[#6b4521]") => (
        <button 
            onClick={onToggle}
            className={`absolute top-0 left-0 px-4 py-2 flex items-center gap-2 rounded-br-2xl shadow-sm transition-all z-10 cursor-pointer border-b border-r
                ${!isVisible
                    ? 'bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300' 
                    : `${activeColorClass} text-white hover:brightness-110`
                }`} 
            title={!isVisible ? "Mostrar Secció" : "Ocultar Secció"}
        >
            <span className="material-symbols-outlined text-lg">{!isVisible ? 'visibility_off' : 'visibility'}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{!isVisible ? labelOff : labelOn}</span>
        </button>
    );

    // Get max hero images from config, default to 5 if undefined
    const maxHeroImages = localConfig.adminSettings?.maxHeroImages || 5;
    const currentHeroImagesCount = (localConfig.hero.backgroundImages || []).length;
    const isHeroFull = currentHeroImagesCount >= maxHeroImages;

    // Dynamic limits for Philosophy (Default 5)
    const maxProductImages = localConfig.adminSettings?.maxProductImages || 5;
    const maxHistoricImages = localConfig.adminSettings?.maxHistoricImages || 5;
    
    const currentProductCount = (localConfig.philosophy.productImages || []).length;
    const currentHistoricCount = (localConfig.philosophy.historicImages || []).length;
    
    const isProductFull = currentProductCount >= maxProductImages;
    const isHistoricFull = currentHistoricCount >= maxHistoricImages;

    return (
        <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
            {/* 1. Brand Section (LOGO) (Orange Theme) */}
            <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                <h3 className="font-serif text-xl font-bold text-orange-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-200 flex items-center justify-center text-orange-700">
                        <span className="material-symbols-outlined">branding_watermark</span>
                    </div>
                    Identitat (Logo)
                </h3>
                <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Logo Principal</label>
                        <LogoEditor 
                            value={localConfig.brand.logoUrl} 
                            onChange={(val) => handleChange('brand', 'logoUrl', val)} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-orange-100">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Descripció (Sota el logo)</label>
                            <textarea
                                rows={2}
                                value={localConfig.hero.heroDescription || ''}
                                onChange={(e) => handleChange('hero', 'heroDescription', e.target.value)}
                                placeholder="Una experiència gastronòmica..."
                                className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-orange-500 outline-none bg-white resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Text Horari (Portada)</label>
                            <input
                                type="text"
                                value={localConfig.hero.heroSchedule || ''}
                                onChange={(e) => handleChange('hero', 'heroSchedule', e.target.value)}
                                placeholder="De dimarts a diumenge de 11:00 a 17:00 h."
                                className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-orange-500 outline-none bg-white font-serif italic text-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- IMAGE UPLOAD GUIDE (POSTIMAGES) --- */}
            <ImageUploadGuide />

            {/* 2. Portada (Imatges de Fons) (Amber Theme) */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="font-serif text-xl font-bold text-amber-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-amber-200 flex items-center justify-center text-amber-700">
                            <span className="material-symbols-outlined">image</span>
                        </div>
                        Portada (Imatges de Fons)
                    </h3>
                    
                    {/* VISUAL COUNTER (Badge) */}
                    <div className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest border transition-colors shadow-sm flex items-center gap-2 ${
                        isHeroFull
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                        <span className="material-symbols-outlined text-sm">{isHeroFull ? 'block' : 'add_photo_alternate'}</span>
                        <span>Imatges: {currentHeroImagesCount} / {maxHeroImages}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                    <ImageArrayEditor 
                        images={localConfig.hero.backgroundImages}
                        onChange={(newImages) => setLocalConfig((prev:any) => ({
                            ...prev,
                            hero: { ...prev.hero, backgroundImages: newImages }
                        }))}
                        labelPrefix="Slide"
                        maxLimit={maxHeroImages} // Pass dynamic limit here
                    />
                </div>
            </div>

            {/* 2b. Reserva (Experiència Gastronòmica) - KEPT AS IS (Beige/Brown) */}
            <div className={`bg-[#fffcf5] p-8 pt-16 rounded-xl shadow-md border border-[#8b5a2b]/20 relative overflow-hidden transition-all ${localConfig.hero.reservationVisible === false ? 'opacity-60 grayscale' : ''}`}>
                {/* VISIBILITY TOGGLE - RESERVATION FORM */}
                {renderVisibilityToggle(
                    localConfig.hero.reservationVisible !== false, 
                    () => setLocalConfig((prev:any) => ({ ...prev, hero: { ...prev.hero, reservationVisible: !prev.hero.reservationVisible } })),
                    "Reserves Visibles",
                    "Reserves Ocultes"
                )}

                <div className="absolute top-0 right-0 w-16 h-16 bg-[#8b5a2b]/5 rounded-bl-full"></div>
                <div className="flex items-center gap-4 mb-8 border-b-2 border-[#8b5a2b]/10 pb-4"><div className="w-12 h-12 bg-gradient-to-br from-[#8b5a2b] to-[#5d3a1a] text-white rounded-lg shadow-lg flex items-center justify-center transform rotate-3"><span className="material-symbols-outlined text-2xl">restaurant_menu</span></div><div><h3 className="font-serif text-2xl font-bold text-[#2c241b]">Reserva Taula</h3><p className="text-xs text-[#8b5a2b] font-bold uppercase tracking-[0.2em]">Experiència Gastronòmica</p></div></div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Column 1: Texts */}
                    <div className="md:col-span-7 space-y-5">
                        <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Textos i Comunicació</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label><input type="text" value={localConfig.hero.reservationFormTitle} onChange={(e) => handleChange('hero', 'reservationFormTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#8b5a2b] outline-none bg-white shadow-sm" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label><input type="text" value={localConfig.hero.reservationFormSubtitle} onChange={(e) => handleChange('hero', 'reservationFormSubtitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#8b5a2b] outline-none bg-white shadow-sm" /></div></div>
                        <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telèfon (Visible al formulari)</label><div className="flex items-center"><span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 text-gray-500 rounded-l"><span className="material-symbols-outlined text-sm">call</span></span><input type="text" value={localConfig.hero.reservationPhoneNumber} onChange={(e) => handleChange('hero', 'reservationPhoneNumber', e.target.value)} className="block w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:border-[#8b5a2b] outline-none bg-white shadow-sm" /></div></div>
                        <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Acció</label><input type="text" value={localConfig.hero.reservationButtonText} onChange={(e) => handleChange('hero', 'reservationButtonText', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold text-[#8b5a2b] focus:border-[#8b5a2b] outline-none bg-white shadow-sm" /></div>
                    </div>
                    {/* Column 2: Logic & Time */}
                    <div className="md:col-span-5 space-y-5 bg-white p-5 rounded border border-gray-200 shadow-inner">
                        <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> Lògica de Reserva</h4>
                        <div className="grid grid-cols-2 gap-3"><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Inici</label><input type="time" value={localConfig.hero.reservationTimeStart} onChange={(e) => handleChange('hero', 'reservationTimeStart', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#8b5a2b] outline-none bg-gray-50 text-center" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Fi</label><input type="time" value={localConfig.hero.reservationTimeEnd} onChange={(e) => handleChange('hero', 'reservationTimeEnd', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#8b5a2b] outline-none bg-gray-50 text-center" /></div></div>
                        <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Interval (minuts)</label><div className="flex items-center gap-2"><input type="number" value={localConfig.hero.reservationTimeInterval} onChange={(e) => handleChange('hero', 'reservationTimeInterval', e.target.value)} className="block w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#8b5a2b] outline-none bg-gray-50 text-center" /><span className="text-xs text-gray-400">entre taules</span></div></div>
                        <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Missatge Error (Text previ)</label><input type="text" value={localConfig.hero.reservationErrorMessage} onChange={(e) => handleChange('hero', 'reservationErrorMessage', e.target.value)} className="block w-full border border-red-200 rounded px-2 py-1 text-xs focus:border-red-500 outline-none bg-red-50 text-red-600 mb-2" /><div className="bg-red-100 border border-red-300 border-dashed rounded px-3 py-2 flex items-center justify-between shadow-sm"><div className="flex flex-col"><span className="text-[9px] uppercase font-bold text-red-400 tracking-wider">Així es veurà el missatge:</span><div className="text-xs text-red-700 font-medium mt-0.5">{localConfig.hero.reservationErrorMessage} <span className="font-bold">{localConfig.hero.reservationTimeStart}</span> a <span className="font-bold">{localConfig.hero.reservationTimeEnd}</span></div></div><span className="material-symbols-outlined text-red-400 text-lg">confirmation_number</span></div></div>
                    </div>
                </div>
                {/* ... (Form Labels & Sticky Note) ... */}
                <div className="mt-6 pt-6 border-t border-dashed border-[#8b5a2b]/20"><h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">Etiquetes dels Camps (Personalització)</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Nom</label><input type="text" value={localConfig.hero.formNameLabel} onChange={(e) => handleChange('hero', 'formNameLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Telèfon</label><input type="text" value={localConfig.hero.formPhoneLabel} onChange={(e) => handleChange('hero', 'formPhoneLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Data/Hora</label><input type="text" value={localConfig.hero.formDateLabel} onChange={(e) => handleChange('hero', 'formDateLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Persones</label><input type="text" value={localConfig.hero.formPaxLabel} onChange={(e) => handleChange('hero', 'formPaxLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Camp Notes</label><input type="text" value={localConfig.hero.formNotesLabel} onChange={(e) => handleChange('hero', 'formNotesLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Privacitat</label><input type="text" value={localConfig.hero.formPrivacyLabel} onChange={(e) => handleChange('hero', 'formPrivacyLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text "O truca'ns"</label><input type="text" value={localConfig.hero.formCallUsLabel} onChange={(e) => handleChange('hero', 'formCallUsLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:border-[#8b5a2b] outline-none bg-white" /></div></div></div>
                <div className="mt-6 pt-6 border-t border-dashed border-[#8b5a2b]/20 flex items-center justify-between"><div className="flex items-center gap-4"><div className="bg-[#fef08a] text-[#854d0e] w-12 h-12 flex items-center justify-center shadow-md transform -rotate-3 border border-yellow-400/50"><span className="material-symbols-outlined">sticky_note_2</span></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nota Adhesiva (Post-it)</label><p className="text-[10px] text-gray-400 italic">Un missatge curt i informal (ex: "Obert tot l'any!")</p></div></div><div className="flex-1 max-w-sm"><div className="relative"><input type="text" maxLength={45} value={localConfig.hero.stickyNoteText} onChange={(e) => handleChange('hero', 'stickyNoteText', e.target.value)} className="block w-full border border-yellow-300 rounded-r-full rounded-l-lg px-4 py-2 text-sm focus:border-yellow-500 outline-none bg-yellow-50 text-[#854d0e] font-hand font-bold tracking-wide shadow-inner" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-yellow-600/50">{localConfig.hero.stickyNoteText?.length || 0}/45</span></div></div></div>
            </div>

            {/* 3. Intro Section (Lime Theme) */}
            <div className={`bg-lime-50 p-6 pt-16 rounded-xl shadow-sm border border-lime-200 relative overflow-hidden transition-all ${localConfig.intro.visible === false ? 'opacity-60 grayscale' : ''}`}>
                {/* VISIBILITY TOGGLE - INTRO */}
                {renderVisibilityToggle(
                    localConfig.intro.visible !== false, 
                    () => setLocalConfig((prev:any) => ({ ...prev, intro: { ...prev.intro, visible: !prev.intro.visible } })),
                    "Visible", "Ocult", "bg-lime-600 border-lime-700"
                )}

                <div className="absolute top-0 left-0 w-1.5 h-full bg-olive"></div>
                <h3 className="font-serif text-xl font-bold text-olive mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-lime-200 flex items-center justify-center text-olive">
                        {/* CHANGED FROM format_quote (WHICH LOOKS LIKE 99) TO description */}
                        <span className="material-symbols-outlined">description</span>
                    </div>
                    {/* CHANGED FROM 'Intro (Frase Inicial)' TO JUST 'Intro' */}
                    Intro
                </h3>
                <div className="bg-white p-6 rounded-lg border border-lime-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* SWAPPED ORDER: MAIN TITLE FIRST */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal</label>
                            <input 
                                type="text" 
                                value={localConfig.intro.mainTitle} 
                                onChange={(e) => handleChange('intro', 'mainTitle', e.target.value)} 
                                className="block w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold text-olive focus:border-olive outline-none bg-white" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Petit</label>
                            <input type="text" value={localConfig.intro.smallTitle} onChange={(e) => handleChange('intro', 'smallTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none bg-white" />
                        </div>
                    </div>
                    <div>
                        {/* ADDED CHARACTER COUNTER TO DESCRIPTION */}
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold uppercase text-gray-500">Descripció (Cita)</label>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                (localConfig.intro.description?.length || 0) >= 350 
                                ? 'bg-red-50 border-red-200 text-red-600 font-bold' 
                                : 'bg-gray-50 border-gray-200 text-gray-400'
                            }`}>
                                {localConfig.intro.description?.length || 0}/350
                            </span>
                        </div>
                        <textarea 
                            value={localConfig.intro.description} 
                            onChange={(e) => handleChange('intro', 'description', e.target.value)} 
                            rows={3} 
                            maxLength={350} // Added max length attribute
                            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none bg-white"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* 4. NEW GASTRONOMY SECTION (UPDATED: Soft Teal Theme + Editable Title + Char Limit) */}
            <div className={`bg-teal-50 p-6 pt-16 rounded-xl shadow-sm border border-teal-200 relative overflow-hidden transition-all ${localConfig.gastronomy?.visible === false ? 'opacity-60 grayscale' : ''}`}>
                {renderVisibilityToggle(
                    localConfig.gastronomy?.visible !== false, 
                    () => setLocalConfig((prev:any) => ({ ...prev, gastronomy: { ...prev.gastronomy, visible: !prev.gastronomy?.visible } })),
                    "Visible", "Ocult", "bg-teal-600 border-teal-700 text-white"
                )}

                <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600"></div>
                <h3 className="font-serif text-xl font-bold text-teal-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal-200 flex items-center justify-center text-teal-700">
                        <span className="material-symbols-outlined">restaurant</span>
                    </div>
                    {/* CHANGED FROM DYNAMIC TO STATIC 'Gastronomia' */}
                    Gastronomia
                </h3>
                
                {/* Headers */}
                <div className="bg-white p-6 rounded-lg border border-teal-100 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            {/* THIS IS THE EDITABLE "GASTRONOMIA LOCAL" TITLE */}
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal (Gran H2)</label>
                            <input 
                                type="text" 
                                value={localConfig.gastronomy?.mainTitle || ''} 
                                onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, mainTitle: e.target.value}}))} 
                                className="block w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold text-teal-900 focus:border-teal-500 outline-none bg-white" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Superior (Petit)</label>
                            <input 
                                type="text" 
                                value={localConfig.gastronomy?.topTitle || ''} 
                                onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, topTitle: e.target.value}}))} 
                                className="block w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:border-teal-500 outline-none bg-white" 
                            />
                        </div>
                    </div>
                    {/* Description - With Limit */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold uppercase text-gray-500">Descripció</label>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                (localConfig.gastronomy?.description?.length || 0) >= 350 
                                ? 'bg-red-50 border-red-200 text-red-600 font-bold' 
                                : 'bg-gray-50 border-gray-200 text-gray-400'
                            }`}>
                                {localConfig.gastronomy?.description?.length || 0}/350
                            </span>
                        </div>
                        <textarea 
                            rows={3} 
                            maxLength={350} // ADDED LIMIT
                            value={localConfig.gastronomy?.description || ''} 
                            onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, description: e.target.value}}))} 
                            className="block w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:border-teal-500 outline-none resize-y bg-white" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Card 1 (Light Theme) */}
                    <div className="bg-white/50 p-4 rounded-lg border border-teal-100 shadow-sm hover:bg-white transition-colors">
                        <h4 className="font-bold text-teal-700 mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined text-sm">lunch_dining</span> Targeta 1</h4>
                        <div className="space-y-3">
                            <div><label className="block text-[10px] text-gray-400 uppercase">Títol</label><input value={localConfig.gastronomy?.card1.title} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, title: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Subtítol</label><input value={localConfig.gastronomy?.card1.subtitle} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, subtitle: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Descripció</label><textarea rows={2} value={localConfig.gastronomy?.card1.description} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, description: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="block text-[10px] text-gray-400 uppercase">Preu</label><input value={localConfig.gastronomy?.card1.price} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, price: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                                <div className="flex-[2]"><label className="block text-[10px] text-gray-400 uppercase">Nota al Peu</label><input value={localConfig.gastronomy?.card1.footerText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, footerText: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            </div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Text Botó</label><input value={localConfig.gastronomy?.card1.buttonText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, buttonText: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Imatge</label><LogoEditor value={localConfig.gastronomy?.card1.image} onChange={(val) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, image: val}}}))} /></div>
                        </div>
                    </div>
                    {/* Card 2 (Light Theme) */}
                    <div className="bg-white/50 p-4 rounded-lg border border-teal-100 shadow-sm hover:bg-white transition-colors">
                        <h4 className="font-bold text-teal-700 mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined text-sm">restaurant_menu</span> Targeta 2</h4>
                        <div className="space-y-3">
                            <div><label className="block text-[10px] text-gray-400 uppercase">Títol</label><input value={localConfig.gastronomy?.card2.title} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, title: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Subtítol</label><input value={localConfig.gastronomy?.card2.subtitle} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, subtitle: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Descripció</label><textarea rows={2} value={localConfig.gastronomy?.card2.description} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, description: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="block text-[10px] text-gray-400 uppercase">Preu</label><input value={localConfig.gastronomy?.card2.price} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, price: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                                <div className="flex-[2]"><label className="block text-[10px] text-gray-400 uppercase">Nota al Peu</label><input value={localConfig.gastronomy?.card2.footerText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, footerText: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            </div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Text Botó</label><input value={localConfig.gastronomy?.card2.buttonText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, buttonText: e.target.value}}}))} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Imatge</label><LogoEditor value={localConfig.gastronomy?.card2.image} onChange={(val) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, image: val}}}))} /></div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-teal-100 pt-4">
                    <h4 className="font-bold text-teal-700 mb-3 text-sm uppercase">Enllaços Peu de Pàgina</h4>
                    <div className="mb-2"><label className="block text-[10px] text-gray-400 uppercase">Títol Peu</label><input value={localConfig.gastronomy?.footerTitle} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, footerTitle: e.target.value}}))} className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-1/3 bg-white" /></div>
                    <div className="space-y-2">
                        {localConfig.gastronomy?.footerLinks.map((link:any, idx:number) => (
                             <div key={idx} className="flex items-center gap-2 bg-white/50 p-2 rounded border border-gray-200">
                                <div className="w-12"><IconPicker value={link.icon} onChange={(val) => { const newLinks = [...localConfig.gastronomy.footerLinks]; newLinks[idx].icon = val; setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, footerLinks: newLinks}})) }} /></div>
                                <input value={link.label} onChange={(e) => { const newLinks = [...localConfig.gastronomy.footerLinks]; newLinks[idx].label = e.target.value; setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, footerLinks: newLinks}})) }} className="bg-transparent border-b border-gray-300 text-gray-700 text-sm w-full outline-none" placeholder="Nom Enllaç" />
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ... Rest of existing components (Specialties, Philosophy, Contact) ... */}
            {/* These sections remain exactly the same, they are just below the removed profile block */}
            
            {/* 5. Specialties Section (Yellow Theme) */}
            <div className={`bg-yellow-50 p-6 pt-16 rounded-xl shadow-sm border border-yellow-200 relative overflow-hidden transition-all ${localConfig.specialties.visible === false ? 'opacity-60 grayscale' : ''}`}>
                {/* VISIBILITY TOGGLE - WHOLE SPECIALTIES SECTION */}
                {renderVisibilityToggle(
                    localConfig.specialties.visible !== false, 
                    () => setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, visible: !prev.specialties.visible } })),
                    "Visible", "Ocult", "bg-yellow-600 border-yellow-700"
                )}

                <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-600"></div>
                <h3 className="font-serif text-xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-yellow-200 flex items-center justify-center text-yellow-700">
                        <span className="material-symbols-outlined">stars</span>
                    </div>
                    Especialitats
                </h3>
                <div className="bg-white p-6 rounded-lg border border-yellow-100 shadow-sm mb-6">
                    <div className="mb-4"><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label><input type="text" value={localConfig.specialties.sectionTitle} onChange={(e) => handleChange('specialties', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white" /></div>
                    <div className="mb-4"><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal</label><input type="text" value={localConfig.specialties.mainTitle} onChange={(e) => handleChange('specialties', 'mainTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white" /></div>
                    <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció</label><textarea value={localConfig.specialties.description} onChange={(e) => handleChange('specialties', 'description', e.target.value)} rows={2} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white"></textarea></div>
                </div>
                
                <div className="mt-6 pt-4">
                    <label className="block text-xs font-bold uppercase text-yellow-800 mb-3 ml-1">Targetes destacades (Fixes)</label>
                    <div className="space-y-6">
                        {(localConfig.specialties.items || []).map((item: any, idx: number) => (
                            <div key={idx} className={`p-6 pt-12 rounded-lg border transition-colors relative group bg-white border-yellow-100 shadow-sm overflow-hidden ${item.visible === false ? 'opacity-60 grayscale' : ''}`}>
                                
                                {/* VISIBILITY TOGGLE - ITEM LEVEL (Compact & Labeled) */}
                                <button 
                                    onClick={() => { const newItems = [...localConfig.specialties.items]; const currentVisibility = newItems[idx].visible !== false; newItems[idx] = { ...newItems[idx], visible: !currentVisibility }; setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, items: newItems } })); }} 
                                    className={`absolute top-0 left-0 px-4 py-2 flex items-center gap-2 rounded-br-2xl shadow-sm transition-all z-10 cursor-pointer border-b border-r
                                        ${item.visible === false 
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200' 
                                            : 'bg-yellow-600 text-white border-yellow-700 hover:bg-yellow-700'
                                        }`} 
                                    title={item.visible === false ? "Activar Targeta" : "Ocultar Targeta"}
                                >
                                    <span className="material-symbols-outlined text-lg">{item.visible === false ? 'visibility_off' : 'visibility'}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.visible === false ? 'Ocult' : 'Visible'}</span>
                                </button>

                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol</label>
                                        <input value={item.title} onChange={(e) => { const newItems = [...localConfig.specialties.items]; newItems[idx] = { ...newItems[idx], title: e.target.value }; setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, items: newItems } })); }} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-yellow-600 font-bold" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label>
                                        <input value={item.subtitle} onChange={(e) => { const newItems = [...localConfig.specialties.items]; newItems[idx] = { ...newItems[idx], subtitle: e.target.value }; setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, items: newItems } })); }} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-yellow-600 font-hand text-gray-600" />
                                    </div>
                                </div>

                                {/* COMBINED IMAGE & BADGE TAB */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">Imatge Targeta</label>
                                        
                                        {/* Badge Tab - Compact and above image */}
                                        <div className="relative w-36">
                                            <input 
                                                maxLength={15}
                                                value={item.badge || ''} 
                                                onChange={(e) => { const newItems = [...localConfig.specialties.items]; newItems[idx] = { ...newItems[idx], badge: e.target.value }; setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, items: newItems } })); }} 
                                                placeholder="ETIQUETA..." 
                                                className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-t px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-center outline-none focus:border-yellow-500 focus:bg-white transition-colors placeholder-yellow-800/30 border-b-0 shadow-sm relative z-10"
                                            />
                                            {/* Visual indicator dot if badge exists */}
                                            {item.badge && <div className="absolute top-1/2 -translate-y-1/2 right-2 w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse z-20" title="Visible"></div>}
                                        </div>
                                    </div>
                                    <div className="relative z-0">
                                        <LogoEditor 
                                            value={item.image} 
                                            onChange={(val) => { 
                                                const newItems = [...localConfig.specialties.items]; 
                                                newItems[idx] = { ...newItems[idx], image: val }; 
                                                setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, items: newItems } })); 
                                            }} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció Targeta</label>
                                    <textarea value={item.description || ''} onChange={(e) => { const newItems = [...localConfig.specialties.items]; newItems[idx] = { ...newItems[idx], description: e.target.value }; setLocalConfig((prev:any) => ({ ...prev, specialties: { ...prev.specialties, items: newItems } })); }} rows={2} className="block w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-yellow-600 resize-none" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Philosophy Section (Stone/Gray Theme) */}
            <div className={`bg-stone-100 p-6 pt-16 rounded-xl shadow-sm border border-stone-200 relative overflow-hidden transition-all ${localConfig.philosophy.visible === false ? 'opacity-60 grayscale' : ''}`}>
                {renderVisibilityToggle(
                    localConfig.philosophy.visible !== false, 
                    () => setLocalConfig((prev:any) => ({ ...prev, philosophy: { ...prev.philosophy, visible: !prev.philosophy.visible } })),
                    "Visible", "Ocult", "bg-stone-600 border-stone-700"
                )}

                <div className="absolute top-0 left-0 w-1.5 h-full bg-stone-600"></div>
                <h3 className="font-serif text-xl font-bold text-stone-700 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-stone-200 flex items-center justify-center text-stone-600">
                        <span className="material-symbols-outlined">history_edu</span>
                    </div>
                    Filosofia i Història
                </h3>
                
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label><input type="text" value={localConfig.philosophy.sectionTitle} onChange={(e) => handleChange('philosophy', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció General</label><input type="text" value={localConfig.philosophy.description} onChange={(e) => handleChange('philosophy', 'description', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Línia 1</label><input type="text" value={localConfig.philosophy.titleLine1} onChange={(e) => handleChange('philosophy', 'titleLine1', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Línia 2</label><input type="text" value={localConfig.philosophy.titleLine2} onChange={(e) => handleChange('philosophy', 'titleLine2', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                        <h4 className="font-bold text-stone-600 mb-3 border-b pb-2 border-stone-100 uppercase text-xs">Columna Producte (Esquerra)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Producte</label><input type="text" value={localConfig.philosophy.productTitle} onChange={(e) => handleChange('philosophy', 'productTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                            <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Etiqueta Nota (Post-it)</label><input type="text" value={localConfig.philosophy.cardTag} onChange={(e) => handleChange('philosophy', 'cardTag', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Producte</label><textarea value={localConfig.philosophy.productDescription} onChange={(e) => handleChange('philosophy', 'productDescription', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none"></textarea>
                        </div>
                        <div>
                            {/* HEADER WITH BADGE FOR PRODUCT IMAGES */}
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Imatges Producte (Slides)</label>
                                <div className={`px-2 py-1 rounded-full font-bold text-[9px] uppercase tracking-widest border transition-colors shadow-sm flex items-center gap-1 ${
                                    isProductFull
                                    ? 'bg-red-50 text-red-600 border-red-200' 
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }`}>
                                    <span className="material-symbols-outlined text-[10px]">{isProductFull ? 'block' : 'add_photo_alternate'}</span>
                                    <span>Imatges: {currentProductCount} / {maxProductImages}</span>
                                </div>
                            </div>
                            <ImageArrayEditor 
                                images={localConfig.philosophy.productImages}
                                onChange={(newImages) => setLocalConfig((prev:any) => ({
                                    ...prev,
                                    philosophy: { ...prev.philosophy, productImages: newImages }
                                }))}
                                labelPrefix="Producte"
                                maxLimit={maxProductImages}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                        <h4 className="font-bold text-stone-600 mb-3 border-b pb-2 border-stone-100 uppercase text-xs">Columna Història (Dreta)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Història</label><input type="text" value={localConfig.philosophy.historicTitle} onChange={(e) => handleChange('philosophy', 'historicTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                            <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Botó</label><input type="text" value={localConfig.philosophy.historicLinkUrl} onChange={(e) => handleChange('philosophy', 'historicLinkUrl', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" /></div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Història</label><textarea value={localConfig.philosophy.historicDescription} onChange={(e) => handleChange('philosophy', 'historicDescription', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none"></textarea>
                        </div>
                        <div>
                            {/* HEADER WITH BADGE FOR HISTORIC IMAGES */}
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Imatges Història (Slides)</label>
                                <div className={`px-2 py-1 rounded-full font-bold text-[9px] uppercase tracking-widest border transition-colors shadow-sm flex items-center gap-1 ${
                                    isHistoricFull
                                    ? 'bg-red-50 text-red-600 border-red-200' 
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }`}>
                                    <span className="material-symbols-outlined text-[10px]">{isHistoricFull ? 'block' : 'add_photo_alternate'}</span>
                                    <span>Imatges: {currentHistoricCount} / {maxHistoricImages}</span>
                                </div>
                            </div>
                            <ImageArrayEditor 
                                images={localConfig.philosophy.historicImages}
                                onChange={(newImages) => setLocalConfig((prev:any) => ({
                                    ...prev,
                                    philosophy: { ...prev.philosophy, historicImages: newImages }
                                }))}
                                labelPrefix="Història"
                                maxLimit={maxHistoricImages}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. Contact Section (Red Theme Wrapper) */}
            <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-800"></div>
                <h3 className="font-serif text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-red-200 flex items-center justify-center text-red-700">
                        <span className="material-symbols-outlined">call</span>
                    </div>
                    Contacte
                </h3>
                {/* ... Rest of contact section remains identical ... */}
                {/* IMPORTANT: Ensure closing tags match the structure */}
                <div className={`bg-[#fefce8] p-6 pt-16 mb-6 rounded-lg border border-yellow-200 shadow-sm relative transition-all ${localConfig.contact.importantNoteVisible === false ? 'opacity-60 grayscale' : ''}`}>
                    {renderVisibilityToggle(
                        localConfig.contact.importantNoteVisible !== false, 
                        () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, importantNoteVisible: !prev.contact.importantNoteVisible } })),
                        "Visible", "Ocult", "bg-yellow-600 border-yellow-700"
                    )}
                    {/* ... content of sticky note ... */}
                    <div className="flex items-center gap-3 mb-4 border-b border-yellow-200 pb-3">
                        <div className="bg-[#fef08a] text-[#854d0e] w-10 h-10 flex items-center justify-center shadow-sm transform -rotate-3 border border-yellow-400/50 rounded-sm">
                            <span className="material-symbols-outlined">sticky_note_2</span>
                        </div>
                        <h4 className="font-bold text-[#854d0e] text-sm uppercase tracking-wide">Nota Adhesiva (Post-it)</h4>
                    </div>
                    <div className="mb-3"><label className="block text-[10px] font-bold uppercase text-yellow-800/60 mb-1">Títol Nota</label><input type="text" value={localConfig.contact.importantNoteTitle} onChange={(e) => handleChange('contact', 'importantNoteTitle', e.target.value)} className="block w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white text-yellow-900 font-bold font-hand" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-[10px] font-bold uppercase text-yellow-800/60 mb-1">Missatge 1 (Gran)</label><input type="text" value={localConfig.contact.importantNoteMessage1} onChange={(e) => handleChange('contact', 'importantNoteMessage1', e.target.value)} className="block w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white font-hand text-gray-700" /></div><div><label className="block text-[10px] font-bold uppercase text-yellow-800/60 mb-1">Missatge 2 (Petit)</label><input type="text" value={localConfig.contact.importantNoteMessage2} onChange={(e) => handleChange('contact', 'importantNoteMessage2', e.target.value)} className="block w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white font-hand text-gray-700" /></div></div>
                </div>
                
                {/* Simplified remaining sections for XML brevity since they are unchanged logic, just ensuring hierarchy is closed properly */}
                {/* Info Block */}
                <div className={`bg-white p-6 pt-16 mb-6 rounded-lg border border-red-100 shadow-sm relative transition-all ${localConfig.contact.infoVisible === false ? 'opacity-60 grayscale' : ''}`}>
                    {renderVisibilityToggle(localConfig.contact.infoVisible !== false, () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, infoVisible: !prev.contact.infoVisible } })), "Visible", "Ocult", "bg-red-700 border-red-800")}
                    <h4 className="font-bold text-red-800 mb-3 text-xs uppercase">Informació General</h4>
                    {/* ... inputs ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label><input type="text" value={localConfig.contact.sectionTitle} onChange={(e) => handleChange('contact', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Localització</label><input type="text" value={localConfig.contact.locationTitle} onChange={(e) => handleChange('contact', 'locationTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 1</label><input type="text" value={localConfig.contact.addressLine1} onChange={(e) => handleChange('contact', 'addressLine1', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 2</label><input type="text" value={localConfig.contact.addressLine2} onChange={(e) => handleChange('contact', 'addressLine2', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horari</label><input type="text" value={localConfig.contact.schedule} onChange={(e) => handleChange('contact', 'schedule', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telèfons (separats per coma)</label><input type="text" value={localConfig.contact.phoneNumbers.join(', ')} onChange={(e) => handleChange('contact', 'phoneNumbers', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div></div><div className="mb-4"><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Google Maps</label><input type="text" value={localConfig.contact.mapUrl} onChange={(e) => handleChange('contact', 'mapUrl', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div>
                </div>
                {/* Social & Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className={`p-4 pt-16 rounded-xl border border-pink-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 relative overflow-hidden transition-all ${localConfig.contact.socialVisible === false ? 'opacity-60 grayscale' : ''}`}>
                        {renderVisibilityToggle(localConfig.contact.socialVisible !== false, () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, socialVisible: !prev.contact.socialVisible } })), "Visible", "Ocult", "bg-purple-600 border-purple-700")}
                        <div className="absolute top-0 right-0 p-2 opacity-10"><span className="material-symbols-outlined text-6xl text-purple-800">photo_camera</span></div><h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600 mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined text-purple-600">group_work</span> Xarxes Socials (Instagram)</h4><div className="space-y-3"><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Títol Xarxes</label><input type="text" value={localConfig.contact.socialTitle} onChange={(e) => handleChange('contact', 'socialTitle', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" /></div><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Descripció</label><input type="text" value={localConfig.contact.socialDescription} onChange={(e) => handleChange('contact', 'socialDescription', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" /></div><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Text Botó</label><input type="text" value={localConfig.contact.socialButtonText} onChange={(e) => handleChange('contact', 'socialButtonText', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" /></div><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">URL Instagram</label><input type="text" value={localConfig.contact.instagramUrl} onChange={(e) => handleChange('contact', 'instagramUrl', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-xs focus:border-purple-500 outline-none bg-white/80 text-purple-700" /></div></div>
                    </div>
                    <div className={`p-4 pt-16 rounded-xl border border-gray-100 bg-gray-50 relative transition-all ${localConfig.contact.formVisible === false ? 'opacity-60 grayscale' : ''}`}>
                        {renderVisibilityToggle(localConfig.contact.formVisible !== false, () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, formVisible: !prev.contact.formVisible } })), "Visible", "Ocult", "bg-gray-600 border-gray-700")}
                        <h4 className="font-bold text-gray-500 mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined">edit_note</span> Formulari de Contacte</h4>
                        <div className="space-y-3"><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label><input type="text" value={localConfig.contact.formTitle} onChange={(e) => handleChange('contact', 'formTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-gray-500 outline-none bg-white" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 border-t border-dashed border-gray-300 pt-4"><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Nom</label><input type="text" value={localConfig.contact.formNameLabel} onChange={(e) => handleChange('contact', 'formNameLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-gray-500 outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Email</label><input type="text" value={localConfig.contact.formEmailLabel} onChange={(e) => handleChange('contact', 'formEmailLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-gray-500 outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Telèfon</label><input type="text" value={localConfig.contact.formPhoneLabel} onChange={(e) => handleChange('contact', 'formPhoneLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-gray-500 outline-none bg-white" /></div><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Assumpte</label><input type="text" value={localConfig.contact.formSubjectLabel} onChange={(e) => handleChange('contact', 'formSubjectLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-gray-500 outline-none bg-white" /></div><div className="md:col-span-2"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Etiqueta Missatge</label><input type="text" value={localConfig.contact.formMessageLabel} onChange={(e) => handleChange('contact', 'formMessageLabel', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-gray-500 outline-none bg-white" /></div><div className="md:col-span-2"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Enviar</label><input type="text" value={localConfig.contact.formButtonText} onChange={(e) => handleChange('contact', 'formButtonText', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:border-gray-500 outline-none bg-white font-bold text-gray-600" /></div></div><p className="text-[10px] text-gray-400 italic mt-2">* L'estructura dels camps és fixa per motius de programació, però pots editar els textos que veu l'usuari.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};