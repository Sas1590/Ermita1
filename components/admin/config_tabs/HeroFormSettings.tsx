import React from 'react';
import { AppConfig } from '../../../context/ConfigContext';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const HeroFormSettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    
    const updateHero = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            hero: { ...prev.hero, [key]: value }
        }));
    };

    const currentFormType = localConfig.hero?.formType || 'reservation';
    const isReservationsEnabled = localConfig.adminSettings?.enableReservations;

    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#fffcf5] p-8 rounded-b-xl rounded-tr-xl shadow-sm border-l-4 border-[#8D6E63] border-t border-r border-b border-[#eecfc3]">
                
                {/* --- FORM TYPE SELECTOR --- */}
                <div className="mb-8">
                    <h5 className="font-bold text-xs uppercase text-[#8D6E63] tracking-wider mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">settings_input_component</span>
                        Tipus de Formulari a Portada
                    </h5>
                    <div className="flex gap-4">
                        
                        {/* RESERVA TAULA BUTTON */}
                        <button 
                            disabled={!isReservationsEnabled}
                            onClick={() => updateHero('formType', 'reservation')}
                            className={`flex-1 py-4 px-2 rounded-lg border-2 text-sm font-bold uppercase tracking-wide flex flex-col items-center gap-2 transition-all group relative overflow-hidden shadow-sm
                                ${!isReservationsEnabled 
                                    ? 'bg-purple-50 border-purple-300 text-purple-300 cursor-not-allowed' 
                                    : currentFormType === 'reservation' ? 'bg-[#5D4037] border-[#5D4037] text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-[#5D4037]/50'
                                }`}
                        >
                            {!isReservationsEnabled && <div className="absolute top-2 right-2 text-purple-400"><span className="material-symbols-outlined text-sm">lock</span></div>}
                            <span className="material-symbols-outlined text-2xl">restaurant</span>
                            Reserva Taula
                            
                            {!isReservationsEnabled && (
                                <div className="absolute inset-0 bg-purple-600/90 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    EN DESENVOLUPAMENT
                                </div>
                            )}
                        </button>

                        <button 
                            onClick={() => updateHero('formType', 'contact')}
                            className={`flex-1 py-4 px-2 rounded-lg border-2 text-sm font-bold uppercase tracking-wide flex flex-col items-center gap-2 transition-all ${currentFormType === 'contact' ? 'bg-[#5D4037] border-[#5D4037] text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-[#5D4037]/50'}`}
                        >
                            <span className="material-symbols-outlined text-2xl">mail</span>
                            Contacte Ràpid
                        </button>
                        <button 
                            onClick={() => updateHero('formType', 'none')}
                            className={`flex-1 py-4 px-2 rounded-lg border-2 text-sm font-bold uppercase tracking-wide flex flex-col items-center gap-2 transition-all ${currentFormType === 'none' ? 'bg-gray-600 border-gray-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-600/50'}`}
                        >
                            <span className="material-symbols-outlined text-2xl">visibility_off</span>
                            Cap (Ocult)
                        </button>
                    </div>
                </div>

                {/* --- RESERVATION SETTINGS --- */}
                {currentFormType === 'reservation' && (
                    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#5D4037] rounded-lg flex items-center justify-center text-white shadow-md">
                                <span className="material-symbols-outlined text-2xl">restaurant</span>
                            </div>
                            <div>
                                <h4 className="font-serif text-3xl font-bold text-[#2c241b]">Configuració Reserves</h4>
                                <p className="text-[#8D6E63] text-xs font-bold uppercase tracking-widest mt-1">FORMULARI I HORARIS</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Texts */}
                            <div className="space-y-6">
                                <h5 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Textos i Comunicació</h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                                        <input value={localConfig.hero.reservationFormTitle} onChange={(e) => updateHero('reservationFormTitle', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label>
                                        <input value={localConfig.hero.reservationFormSubtitle} onChange={(e) => updateHero('reservationFormSubtitle', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telèfon (Visible al formulari)</label>
                                    <div className="flex items-center gap-2 relative">
                                        <div className="absolute left-3 text-gray-400"><span className="material-symbols-outlined text-lg">call</span></div>
                                        <input value={localConfig.hero.reservationPhoneNumber} onChange={(e) => updateHero('reservationPhoneNumber', e.target.value)} className="w-full border border-gray-300 rounded pl-10 pr-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Acció</label>
                                    <input value={localConfig.hero.reservationButtonText} onChange={(e) => updateHero('reservationButtonText', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm font-bold text-[#8D6E63] outline-none focus:border-[#8D6E63]" />
                                </div>
                            </div>

                            {/* Logic */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                                <h5 className="font-bold text-xs uppercase text-gray-400 flex items-center gap-2"><span className="material-symbols-outlined text-base">schedule</span> Lògica de Reserva</h5>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Inici</label>
                                        <div className="relative">
                                            <input type="time" value={localConfig.hero.reservationTimeStart} onChange={(e) => updateHero('reservationTimeStart', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-center outline-none focus:border-[#8D6E63]" />
                                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-400">schedule</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Hora Fi</label>
                                        <div className="relative">
                                            <input type="time" value={localConfig.hero.reservationTimeEnd} onChange={(e) => updateHero('reservationTimeEnd', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-center outline-none focus:border-[#8D6E63]" />
                                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-400">schedule</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Interval (Minuts)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="number" value={localConfig.hero.reservationTimeInterval} onChange={(e) => updateHero('reservationTimeInterval', parseInt(e.target.value))} className="w-20 border border-gray-300 rounded px-3 py-2 text-sm text-center outline-none focus:border-[#8D6E63]" />
                                        <span className="text-xs text-gray-500">entre taules</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Missatge Error (Text previ)</label>
                                    <input value={localConfig.hero.reservationErrorMessage} onChange={(e) => updateHero('reservationErrorMessage', e.target.value)} className="w-full border border-red-200 bg-red-50 text-red-600 rounded px-3 py-2 text-xs outline-none focus:border-red-400" />
                                </div>
                            </div>
                        </div>

                        {/* FIELD LABELS - RESERVATION SPECIFIC */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mt-6">
                            <h5 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-wider">Etiquetes i Textos dels Camps</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* NOM */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Nom</label>
                                    <input value={localConfig.hero.formNameLabel} onChange={(e) => updateHero('formNameLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formNamePlaceholder} onChange={(e) => updateHero('formNamePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* PHONE */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Telèfon</label>
                                    <input value={localConfig.hero.formPhoneLabel} onChange={(e) => updateHero('formPhoneLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formPhonePlaceholder} onChange={(e) => updateHero('formPhonePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* PAX */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Persones</label>
                                    <input value={localConfig.hero.formPaxLabel} onChange={(e) => updateHero('formPaxLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Ex: 2)</label>
                                    <input value={localConfig.hero.formPaxPlaceholder} onChange={(e) => updateHero('formPaxPlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* NOTES */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Notes</label>
                                    <input value={localConfig.hero.formNotesLabel} onChange={(e) => updateHero('formNotesLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formNotesPlaceholder} onChange={(e) => updateHero('formNotesPlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* DATE & PRIVACY */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Data</label>
                                    <input value={localConfig.hero.formDateLabel} onChange={(e) => updateHero('formDateLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Privacitat</label>
                                    <input value={localConfig.hero.formPrivacyLabel} onChange={(e) => updateHero('formPrivacyLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text "O truca'ns"</label>
                                    <input value={localConfig.hero.formCallUsLabel} onChange={(e) => updateHero('formCallUsLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CONTACT SETTINGS --- */}
                {currentFormType === 'contact' && (
                    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#5D4037] rounded-lg flex items-center justify-center text-white shadow-md">
                                <span className="material-symbols-outlined text-2xl">mail</span>
                            </div>
                            <div>
                                <h4 className="font-serif text-3xl font-bold text-[#2c241b]">Configuració Contacte (Hero)</h4>
                                <p className="text-[#8D6E63] text-xs font-bold uppercase tracking-widest mt-1">MISSATGES DIRECTES</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                                    <input value={localConfig.hero.heroContactTitle || "Contacta'ns"} onChange={(e) => updateHero('heroContactTitle', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Subtítol</label>
                                    <input value={localConfig.hero.heroContactSubtitle || "Envia'ns un missatge"} onChange={(e) => updateHero('heroContactSubtitle', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Enviar</label>
                                    <input value={localConfig.hero.heroContactBtnText || "Enviar"} onChange={(e) => updateHero('heroContactBtnText', e.target.value)} className="w-full border border-gray-300 rounded px-4 py-3 text-sm font-bold text-[#8D6E63] outline-none focus:border-[#8D6E63]" />
                                </div>
                            </div>
                            
                            {/* Phone Config Grid */}
                            <div className="pt-4 border-t border-gray-100 mt-2">
                                <h5 className="font-bold text-xs uppercase text-gray-400 mb-3">Configuració Telèfon</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Número de Telèfon</label>
                                        <div className="flex items-center gap-2 relative">
                                            <div className="absolute left-3 text-gray-400"><span className="material-symbols-outlined text-lg">call</span></div>
                                            <input value={localConfig.hero.reservationPhoneNumber} onChange={(e) => updateHero('reservationPhoneNumber', e.target.value)} className="w-full border border-gray-300 rounded pl-10 pr-4 py-3 text-sm text-gray-700 outline-none focus:border-[#8D6E63]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 italic">* Aquest formulari demanarà Nom, Email, Telèfon i Missatge.</p>
                        </div>

                        {/* FIELD LABELS - CONTACT SPECIFIC */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mt-6">
                            <h5 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-wider">Etiquetes i Textos dels Camps</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* NOM */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Nom</label>
                                    <input value={localConfig.hero.formNameLabel} onChange={(e) => updateHero('formNameLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formNamePlaceholder} onChange={(e) => updateHero('formNamePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* EMAIL */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Email</label>
                                    <input value={localConfig.hero.formEmailLabel} onChange={(e) => updateHero('formEmailLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formEmailPlaceholder} onChange={(e) => updateHero('formEmailPlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* PHONE */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Telèfon</label>
                                    <input value={localConfig.hero.formPhoneLabel} onChange={(e) => updateHero('formPhoneLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formPhonePlaceholder} onChange={(e) => updateHero('formPhonePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* MESSAGE */}
                                <div className="lg:col-span-3">
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Missatge</label>
                                    <input value={localConfig.hero.formMessageLabel} onChange={(e) => updateHero('formMessageLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-[#8D6E63]" />
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.hero.formMessagePlaceholder} onChange={(e) => updateHero('formMessagePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8D6E63]" />
                                </div>
                                {/* EXTRAS */}
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Privacitat</label>
                                    <input value={localConfig.hero.formPrivacyLabel} onChange={(e) => updateHero('formPrivacyLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text "O truca'ns"</label>
                                    <input value={localConfig.hero.formCallUsLabel} onChange={(e) => updateHero('formCallUsLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8D6E63]" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Enviar</label>
                            <input 
                                value={localConfig.contact.formButtonText} 
                                onChange={(e) => setLocalConfig(prev => ({...prev, contact: {...prev.contact, formButtonText: e.target.value}}))} 
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:border-gray-400 transition-colors" 
                            />
                        </div>
                    </div>
                )}

                {/* --- STICKY NOTE (SHARED) --- */}
                {currentFormType !== 'none' && (
                    <div className="mt-8 pt-8 border-t border-dashed border-[#d7ccc8]">
                        <div className="bg-[#fff9c4] border border-[#fbc02d] p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6 mt-8">
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="w-14 h-14 bg-[#fdd835] rounded-lg shadow-md border border-[#fbc02d] flex items-center justify-center transform -rotate-2">
                                    <span className="material-symbols-outlined text--[#854d0e] text-3xl">sticky_note_2</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm uppercase text-[#854d0e] tracking-wider">Nota Adhesiva (Post-it)</p>
                                    <p className="text-[11px] text-[#a16207] italic mt-1 max-w-[200px] leading-tight">Un missatge curt i informal per als clients (ex: "Obert tot l'any!")</p>
                                </div>
                            </div>
                            <div className="flex-1 w-full relative group">
                                <input 
                                    value={localConfig.hero.stickyNoteText} 
                                    onChange={(e) => updateHero('stickyNoteText', e.target.value)} 
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
                )}
            </div>
        </div>
    );
};