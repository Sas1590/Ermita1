import React from 'react';
import { LogoEditor, ImageArrayEditor, IconPicker } from './AdminShared';

interface ConfigTabProps {
    localConfig: any;
    setLocalConfig: (config: any) => void;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ localConfig, setLocalConfig }) => {
    
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

    return (
        <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
            {/* 0. NEW: ADMIN CUSTOMIZATION (Green Theme) */}
            <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                <h3 className="font-serif text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-green-200 flex items-center justify-center text-green-700">
                        <span className="material-symbols-outlined">person_edit</span>
                    </div>
                    Configuració Usuari (Admin)
                </h3>
                <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nom a mostrar (Navbar)</label>
                    <div className="relative">
                    <input
                        type="text"
                        maxLength={15}
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
                        className="block w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:border-green-500 outline-none pr-10"
                        placeholder="Ex: Elena"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none right-3 md:left-[calc(50%-2.5rem)] md:right-auto">
                            {(localConfig.adminSettings?.customDisplayName || '').length}/15
                    </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 italic">Si escrius "Elena", a dalt posarà "Hola Elena". Si està buit, posarà "Hola Admin".</p>
                </div>
            </div>

            {/* 1. Brand Section (LOGO) (Orange Theme) */}
            <div className="bg-orange-50 p-6 rounded-xl shadow-sm border border-orange-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                <h3 className="font-serif text-xl font-bold text-orange-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-200 flex items-center justify-center text-orange-700">
                        <span className="material-symbols-outlined">branding_watermark</span>
                    </div>
                    Identitat (Logo)
                </h3>
                <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                    <LogoEditor 
                        value={localConfig.brand.logoUrl} 
                        onChange={(val) => handleChange('brand', 'logoUrl', val)} 
                    />
                </div>
            </div>

            {/* 2. Portada (Imatges de Fons) (Amber Theme) */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                <h3 className="font-serif text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-amber-200 flex items-center justify-center text-amber-700">
                        <span className="material-symbols-outlined">image</span>
                    </div>
                    Portada (Imatges de Fons)
                </h3>
                <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                    <ImageArrayEditor 
                        images={localConfig.hero.backgroundImages}
                        onChange={(newImages) => setLocalConfig((prev:any) => ({
                            ...prev,
                            hero: { ...prev.hero, backgroundImages: newImages }
                        }))}
                        labelPrefix="Slide"
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
                    Intro (Frase Inicial)
                </h3>
                <div className="bg-white p-6 rounded-lg border border-lime-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Petit</label><input type="text" value={localConfig.intro.smallTitle} onChange={(e) => handleChange('intro', 'smallTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none bg-white" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Principal</label><input type="text" value={localConfig.intro.mainTitle} onChange={(e) => handleChange('intro', 'mainTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none bg-white" /></div>
                    </div>
                    <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció (Cita)</label><textarea value={localConfig.intro.description} onChange={(e) => handleChange('intro', 'description', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-olive outline-none bg-white"></textarea></div>
                </div>
            </div>

            {/* 4. NEW GASTRONOMY SECTION (Dark Theme Editor) - KEPT DARK BUT STYLE MATCHED */}
            <div className={`bg-[#2c241b] text-white p-6 pt-16 rounded-xl shadow-lg border border-gray-600 relative overflow-hidden transition-all ${localConfig.gastronomy?.visible === false ? 'opacity-60 grayscale' : ''}`}>
                {renderVisibilityToggle(
                    localConfig.gastronomy?.visible !== false, 
                    () => setLocalConfig((prev:any) => ({ ...prev, gastronomy: { ...prev.gastronomy, visible: !prev.gastronomy?.visible } })),
                    "Gastronomia Visible", "Gastronomia Ocult", "bg-[#d0bb95] border-[#a38f6d] text-black"
                )}

                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d0bb95]"></div>
                <h3 className="font-serif text-xl font-bold text-[#d0bb95] mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[#d0bb95]">
                        <span className="material-symbols-outlined">restaurant</span>
                    </div>
                    Gastronomia Local
                </h3>
                
                {/* Headers */}
                <div className="bg-black/20 p-6 rounded-lg border border-white/5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className="block text-xs font-bold uppercase text-gray-400 mb-1">Títol Superior</label><input type="text" value={localConfig.gastronomy?.topTitle || ''} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, topTitle: e.target.value}}))} className="block w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-[#d0bb95] outline-none" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-400 mb-1">Títol Principal</label><input type="text" value={localConfig.gastronomy?.mainTitle || ''} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, mainTitle: e.target.value}}))} className="block w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-[#d0bb95] outline-none" /></div>
                    </div>
                    {/* Description - New Row & Textarea */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Descripció</label>
                        <textarea 
                            rows={3} 
                            value={localConfig.gastronomy?.description || ''} 
                            onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, description: e.target.value}}))} 
                            className="block w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white focus:border-[#d0bb95] outline-none resize-y" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Card 1 */}
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg">
                        <h4 className="font-bold text-[#d0bb95] mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined text-sm">lunch_dining</span> Targeta 1</h4>
                        <div className="space-y-3">
                            <div><label className="block text-[10px] text-gray-400 uppercase">Títol</label><input value={localConfig.gastronomy?.card1.title} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, title: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Subtítol</label><input value={localConfig.gastronomy?.card1.subtitle} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, subtitle: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Descripció</label><textarea rows={2} value={localConfig.gastronomy?.card1.description} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, description: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="block text-[10px] text-gray-400 uppercase">Preu</label><input value={localConfig.gastronomy?.card1.price} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, price: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                                <div className="flex-[2]"><label className="block text-[10px] text-gray-400 uppercase">Nota al Peu</label><input value={localConfig.gastronomy?.card1.footerText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, footerText: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            </div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Text Botó</label><input value={localConfig.gastronomy?.card1.buttonText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, buttonText: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Imatge</label><LogoEditor value={localConfig.gastronomy?.card1.image} onChange={(val) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card1: {...prev.gastronomy.card1, image: val}}}))} /></div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-lg">
                        <h4 className="font-bold text-[#d0bb95] mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined text-sm">restaurant_menu</span> Targeta 2</h4>
                        <div className="space-y-3">
                            <div><label className="block text-[10px] text-gray-400 uppercase">Títol</label><input value={localConfig.gastronomy?.card2.title} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, title: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Subtítol</label><input value={localConfig.gastronomy?.card2.subtitle} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, subtitle: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Descripció</label><textarea rows={2} value={localConfig.gastronomy?.card2.description} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, description: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="block text-[10px] text-gray-400 uppercase">Preu</label><input value={localConfig.gastronomy?.card2.price} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, price: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                                <div className="flex-[2]"><label className="block text-[10px] text-gray-400 uppercase">Nota al Peu</label><input value={localConfig.gastronomy?.card2.footerText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, footerText: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            </div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Text Botó</label><input value={localConfig.gastronomy?.card2.buttonText} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, buttonText: e.target.value}}}))} className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" /></div>
                            <div><label className="block text-[10px] text-gray-400 uppercase">Imatge</label><LogoEditor value={localConfig.gastronomy?.card2.image} onChange={(val) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, card2: {...prev.gastronomy.card2, image: val}}}))} /></div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                    <h4 className="font-bold text-[#d0bb95] mb-3 text-sm uppercase">Enllaços Peu de Pàgina</h4>
                    <div className="mb-2"><label className="block text-[10px] text-gray-400 uppercase">Títol Peu</label><input value={localConfig.gastronomy?.footerTitle} onChange={(e) => setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, footerTitle: e.target.value}}))} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white w-full md:w-1/3" /></div>
                    <div className="space-y-2">
                        {localConfig.gastronomy?.footerLinks.map((link:any, idx:number) => (
                             <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded">
                                <div className="w-12"><IconPicker value={link.icon} onChange={(val) => { const newLinks = [...localConfig.gastronomy.footerLinks]; newLinks[idx].icon = val; setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, footerLinks: newLinks}})) }} /></div>
                                <input value={link.label} onChange={(e) => { const newLinks = [...localConfig.gastronomy.footerLinks]; newLinks[idx].label = e.target.value; setLocalConfig((prev:any) => ({...prev, gastronomy: {...prev.gastronomy, footerLinks: newLinks}})) }} className="bg-transparent border-b border-white/20 text-white text-sm w-full outline-none" placeholder="Nom Enllaç" />
                             </div>
                        ))}
                    </div>
                </div>
            </div>

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
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripció Producte</label>
                            <textarea value={localConfig.philosophy.productDescription} onChange={(e) => handleChange('philosophy', 'productDescription', e.target.value)} rows={3} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none"></textarea>
                        </div>
                        {/* NEW BUTTON TEXT EDITOR */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text Botó Producte</label>
                            <input type="text" value={localConfig.philosophy.productButtonText || ''} onChange={(e) => handleChange('philosophy', 'productButtonText', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-stone-600 outline-none" placeholder="VEURE LA NOSTRA CARTA" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Imatges Producte (Slides)</label>
                            <ImageArrayEditor 
                                images={localConfig.philosophy.productImages}
                                onChange={(newImages) => setLocalConfig((prev:any) => ({
                                    ...prev,
                                    philosophy: { ...prev.philosophy, productImages: newImages }
                                }))}
                                labelPrefix="Producte"
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
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Imatges Història (Slides)</label>
                            <ImageArrayEditor 
                                images={localConfig.philosophy.historicImages}
                                onChange={(newImages) => setLocalConfig((prev:any) => ({
                                    ...prev,
                                    philosophy: { ...prev.philosophy, historicImages: newImages }
                                }))}
                                labelPrefix="Història"
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
                
                {/* Important Note Block (Re-styled as sticky note) */}
                <div className={`bg-[#fefce8] p-6 pt-16 mb-6 rounded-lg border border-yellow-200 shadow-sm relative transition-all ${localConfig.contact.importantNoteVisible === false ? 'opacity-60 grayscale' : ''}`}>
                    {renderVisibilityToggle(
                        localConfig.contact.importantNoteVisible !== false, 
                        () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, importantNoteVisible: !prev.contact.importantNoteVisible } })),
                        "Visible", "Ocult", "bg-yellow-600 border-yellow-700"
                    )}
                    
                    <div className="flex items-center gap-3 mb-4 border-b border-yellow-200 pb-3">
                        <div className="bg-[#fef08a] text-[#854d0e] w-10 h-10 flex items-center justify-center shadow-sm transform -rotate-3 border border-yellow-400/50 rounded-sm">
                            <span className="material-symbols-outlined">sticky_note_2</span>
                        </div>
                        <h4 className="font-bold text-[#854d0e] text-sm uppercase tracking-wide">Nota Adhesiva (Post-it)</h4>
                    </div>

                    <div className="mb-3">
                        <label className="block text-[10px] font-bold uppercase text-yellow-800/60 mb-1">Títol Nota</label>
                        <input 
                            type="text" 
                            value={localConfig.contact.importantNoteTitle} 
                            onChange={(e) => handleChange('contact', 'importantNoteTitle', e.target.value)} 
                            className="block w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white text-yellow-900 font-bold font-hand" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-yellow-800/60 mb-1">Missatge 1 (Gran)</label>
                            <input 
                                type="text" 
                                value={localConfig.contact.importantNoteMessage1} 
                                onChange={(e) => handleChange('contact', 'importantNoteMessage1', e.target.value)} 
                                className="block w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white font-hand text-gray-700" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-yellow-800/60 mb-1">Missatge 2 (Petit)</label>
                            <input 
                                type="text" 
                                value={localConfig.contact.importantNoteMessage2} 
                                onChange={(e) => handleChange('contact', 'importantNoteMessage2', e.target.value)} 
                                className="block w-full border border-yellow-300 rounded px-3 py-2 text-sm focus:border-yellow-600 outline-none bg-white font-hand text-gray-700" 
                            />
                        </div>
                    </div>
                </div>

                {/* Info Block */}
                <div className={`bg-white p-6 pt-16 mb-6 rounded-lg border border-red-100 shadow-sm relative transition-all ${localConfig.contact.infoVisible === false ? 'opacity-60 grayscale' : ''}`}>
                    {renderVisibilityToggle(
                        localConfig.contact.infoVisible !== false, 
                        () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, infoVisible: !prev.contact.infoVisible } })),
                        "Visible", "Ocult", "bg-red-700 border-red-800"
                    )}
                    <h4 className="font-bold text-red-800 mb-3 text-xs uppercase">Informació General</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Secció</label><input type="text" value={localConfig.contact.sectionTitle} onChange={(e) => handleChange('contact', 'sectionTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Títol Localització</label><input type="text" value={localConfig.contact.locationTitle} onChange={(e) => handleChange('contact', 'locationTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 1</label><input type="text" value={localConfig.contact.addressLine1} onChange={(e) => handleChange('contact', 'addressLine1', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Adreça Línia 2</label><input type="text" value={localConfig.contact.addressLine2} onChange={(e) => handleChange('contact', 'addressLine2', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horari</label><input type="text" value={localConfig.contact.schedule} onChange={(e) => handleChange('contact', 'schedule', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div><div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Telèfons (separats per coma)</label><input type="text" value={localConfig.contact.phoneNumbers.join(', ')} onChange={(e) => handleChange('contact', 'phoneNumbers', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div></div><div className="mb-4"><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Enllaç Google Maps</label><input type="text" value={localConfig.contact.mapUrl} onChange={(e) => handleChange('contact', 'mapUrl', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-red-800 outline-none" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Social Block */}
                    <div className={`p-4 pt-16 rounded-xl border border-pink-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 relative overflow-hidden transition-all ${localConfig.contact.socialVisible === false ? 'opacity-60 grayscale' : ''}`}>
                        {renderVisibilityToggle(
                            localConfig.contact.socialVisible !== false, 
                            () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, socialVisible: !prev.contact.socialVisible } })),
                            "Visible", "Ocult", "bg-purple-600 border-purple-700"
                        )}
                        <div className="absolute top-0 right-0 p-2 opacity-10"><span className="material-symbols-outlined text-6xl text-purple-800">photo_camera</span></div><h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600 mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined text-purple-600">group_work</span> Xarxes Socials (Instagram)</h4><div className="space-y-3"><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Títol Xarxes</label><input type="text" value={localConfig.contact.socialTitle} onChange={(e) => handleChange('contact', 'socialTitle', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" /></div><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Descripció</label><input type="text" value={localConfig.contact.socialDescription} onChange={(e) => handleChange('contact', 'socialDescription', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" /></div><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">Text Botó</label><input type="text" value={localConfig.contact.socialButtonText} onChange={(e) => handleChange('contact', 'socialButtonText', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-sm focus:border-purple-500 outline-none bg-white/80" /></div><div><label className="block text-[10px] font-bold uppercase text-purple-400 mb-1">URL Instagram</label><input type="text" value={localConfig.contact.instagramUrl} onChange={(e) => handleChange('contact', 'instagramUrl', e.target.value)} className="block w-full border border-purple-200 rounded px-3 py-1.5 text-xs focus:border-purple-500 outline-none bg-white/80 text-purple-700" /></div></div>
                    </div>
                    {/* Form Block */}
                    <div className={`p-4 pt-16 rounded-xl border border-gray-100 bg-gray-50 relative transition-all ${localConfig.contact.formVisible === false ? 'opacity-60 grayscale' : ''}`}>
                        {renderVisibilityToggle(
                            localConfig.contact.formVisible !== false, 
                            () => setLocalConfig((prev:any) => ({ ...prev, contact: { ...prev.contact, formVisible: !prev.contact.formVisible } })),
                            "Visible", "Ocult", "bg-gray-600 border-gray-700"
                        )}
                        <h4 className="font-bold text-gray-500 mb-3 text-sm uppercase flex items-center gap-2"><span className="material-symbols-outlined">edit_note</span> Formulari de Contacte</h4><div className="space-y-3"><div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label><input type="text" value={localConfig.contact.formTitle} onChange={(e) => handleChange('contact', 'formTitle', e.target.value)} className="block w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-gray-500 outline-none bg-white" /></div><p className="text-[10px] text-gray-400 italic mt-2">* Els camps del formulari (nom, email, etc.) són fixes per motius de programació i no es poden editar aquí.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};