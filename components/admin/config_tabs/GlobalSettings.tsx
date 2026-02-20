import React, { useState } from 'react';
import { AppConfig } from '../../../context/ConfigContext';
import { LogoEditor, ImageArrayEditor } from '../AdminShared';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const GlobalSettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    const [showImageHelp, setShowImageHelp] = useState(false);

    // Update helpers specific for Global tab
    const updateHero = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            hero: { ...prev.hero, [key]: value }
        }));
    };

    return (
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
                                onChange={(e) => updateHero('heroDescription', e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Text Horari (Portada)</label>
                            <input 
                                type="text"
                                value={localConfig.hero.heroSchedule || ''}
                                onChange={(e) => updateHero('heroSchedule', e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm font-serif italic text-gray-600 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* IMATGES DE FONS */}
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
                                        <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">1</span><div className="mt-0.5">Entra a <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">postimages.org</a> (no cal registre).</div></li>
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
                                        <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">3</span><div className="mt-0.5">Prem el botó blau "<strong>Tria les imatges</strong>" i puja la teva foto.</div></li>
                                        <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">4</span><div className="mt-0.5">Un cop carregada, apareixerà una llista de codis. <br/> Busca la fila que diu: <strong>Enllaç directe (Direct Link)</strong>.</div></li>
                                        <li className="flex gap-3"><span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold">5</span><div className="mt-0.5">Copia aquell enllaç i enganxa'l a la casella del panell.</div></li>
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
                        onChange={(newImages) => updateHero('backgroundImages', newImages)}
                        labelPrefix="Slide"
                        maxLimit={localConfig.adminSettings?.maxHeroImages || 5}
                    />
                </div>
            </div>
        </div>
    );
};