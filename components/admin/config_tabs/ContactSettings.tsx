import React from 'react';
import { AppConfig } from '../../../context/ConfigContext';
import { VisibilityToggle } from '../AdminShared';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const ContactSettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    
    const updateContact = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            contact: { ...prev.contact, [key]: value }
        }));
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* 1. STICKY NOTE (YELLOW) */}
            <div className="bg-[#fffde7] p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 border-t border-r border-b border-yellow-100">
                <VisibilityToggle 
                    isVisible={localConfig.contact.importantNoteVisible !== false}
                    onToggle={() => updateContact('importantNoteVisible', !(localConfig.contact.importantNoteVisible !== false))}
                    colorClass="bg-yellow-600 border-yellow-600"
                />
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-yellow-800 flex items-center gap-2 text-sm uppercase"><span className="material-symbols-outlined">sticky_note_2</span> Nota Adhesiva (Post-it)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Nota</label><input value={localConfig.contact.importantNoteTitle} onChange={(e) => updateContact('importantNoteTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-hand text-red-800" /></div>
                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Missatge 1 (Gran)</label><input value={localConfig.contact.importantNoteMessage1} onChange={(e) => updateContact('importantNoteMessage1', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-hand" /></div>
                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Missatge 2 (Petit)</label><input value={localConfig.contact.importantNoteMessage2} onChange={(e) => updateContact('importantNoteMessage2', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-hand" /></div>
                </div>
            </div>

            {/* 2. GENERAL INFO (RED) */}
            <div className="bg-[#fef2f2] p-6 rounded-xl shadow-sm border-l-4 border-red-600 border-t border-r border-b border-red-100">
                <VisibilityToggle 
                    isVisible={localConfig.contact.infoVisible !== false}
                    onToggle={() => updateContact('infoVisible', !(localConfig.contact.infoVisible !== false))}
                    colorClass="bg-red-700 border-red-700"
                />
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase"><span className="material-symbols-outlined">info</span> Informació General</h4>
                </div>
                <div className="bg-white p-4 rounded border border-red-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">TÍTOL PRINCIPAL (GRAN H2)</label><input value={localConfig.contact.sectionTitle} onChange={(e) => updateContact('sectionTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-bold" /></div>
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Localització</label><input value={localConfig.contact.locationTitle} onChange={(e) => updateContact('locationTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Adreça Línia 1</label><input value={localConfig.contact.addressLine1} onChange={(e) => updateContact('addressLine1', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Adreça Línia 2</label><input value={localConfig.contact.addressLine2} onChange={(e) => updateContact('addressLine2', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Horari</label><input value={localConfig.contact.schedule} onChange={(e) => updateContact('schedule', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Telèfons (Separats per coma)</label><input value={localConfig.contact.phoneNumbers.join(', ')} onChange={(e) => updateContact('phoneNumbers', e.target.value.split(',').map(s=>s.trim()))} className="w-full border rounded px-2 py-1 text-sm" /></div>
                    </div>
                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Enllaç Google Maps</label><input value={localConfig.contact.mapUrl} onChange={(e) => updateContact('mapUrl', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* 3. SOCIAL (PURPLE) */}
                <div className="bg-[#f3e8ff] p-6 rounded-xl shadow-sm border-l-4 border-purple-500 border-t border-r border-b border-purple-100">
                    <VisibilityToggle 
                        isVisible={localConfig.contact.socialVisible !== false}
                        onToggle={() => updateContact('socialVisible', !(localConfig.contact.socialVisible !== false))}
                        colorClass="bg-purple-600 border-purple-600"
                    />
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-purple-800 flex items-center gap-2 text-sm uppercase"><span className="material-symbols-outlined">share</span> Xarxes Socials (Instagram)</h4>
                    </div>
                    <div className="space-y-2">
                        <div><label className="block text-[9px] font-bold uppercase text-purple-400">Títol Xarxes</label><input value={localConfig.contact.socialTitle} onChange={(e) => updateContact('socialTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        <div><label className="block text-[9px] font-bold uppercase text-purple-400">Descripció</label><input value={localConfig.contact.socialDescription} onChange={(e) => updateContact('socialDescription', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        <div><label className="block text-[9px] font-bold uppercase text-purple-400">Text Botó</label><input value={localConfig.contact.socialButtonText} onChange={(e) => updateContact('socialButtonText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        <div><label className="block text-[9px] font-bold uppercase text-purple-400">URL Instagram</label><input value={localConfig.contact.instagramUrl} onChange={(e) => updateContact('instagramUrl', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                    </div>
                </div>

                {/* 4. FORM (GRAY) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <VisibilityToggle 
                            isVisible={localConfig.contact.formVisible !== false}
                            onToggle={() => updateContact('formVisible', !(localConfig.contact.formVisible !== false))}
                            colorClass="bg-gray-700 border-gray-700" 
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                        <span className="material-symbols-outlined text-gray-500">edit_note</span>
                        <h4 className="font-bold text-gray-600 text-sm uppercase">Formulari de Contacte (Inferior)</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Formulari</label>
                            <input value={localConfig.contact.formTitle} onChange={(e) => updateContact('formTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>

                        {/* GRID FOR INPUTS + PLACEHOLDERS */}
                        <div className="grid grid-cols-1 gap-4">
                            
                            {/* NAME */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Nom</label>
                                    <input value={localConfig.contact.formNameLabel} onChange={(e) => updateContact('formNameLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.contact.formNamePlaceholder} onChange={(e) => updateContact('formNamePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600" />
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Email</label>
                                    <input value={localConfig.contact.formEmailLabel} onChange={(e) => updateContact('formEmailLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.contact.formEmailPlaceholder} onChange={(e) => updateContact('formEmailPlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600" />
                                </div>
                            </div>

                            {/* PHONE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Telèfon</label>
                                    <input value={localConfig.contact.formPhoneLabel} onChange={(e) => updateContact('formPhoneLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.contact.formPhonePlaceholder} onChange={(e) => updateContact('formPhonePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600" />
                                </div>
                            </div>

                            {/* SUBJECT */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Assumpte</label>
                                    <input value={localConfig.contact.formSubjectLabel} onChange={(e) => updateContact('formSubjectLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.contact.formSubjectPlaceholder} onChange={(e) => updateContact('formSubjectPlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600" />
                                </div>
                            </div>

                            {/* MESSAGE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Etiqueta Missatge</label>
                                    <input value={localConfig.contact.formMessageLabel} onChange={(e) => updateContact('formMessageLabel', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Text Interior (Placeholder)</label>
                                    <input value={localConfig.contact.formMessagePlaceholder} onChange={(e) => updateContact('formMessagePlaceholder', e.target.value)} className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Botó Enviar</label>
                            <input value={localConfig.contact.formButtonText} onChange={(e) => updateContact('formButtonText', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};