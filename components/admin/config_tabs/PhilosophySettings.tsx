import React from 'react';
import { AppConfig } from '../../../context/ConfigContext';
import { VisibilityToggle, ImageArrayEditor } from '../AdminShared';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const PhilosophySettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    
    const updatePhilosophy = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            philosophy: { ...prev.philosophy, [key]: value }
        }));
    };

    return (
        <div className="bg-[#fafafa] p-6 rounded-xl shadow-sm border-l-4 border-gray-500 border-t border-r border-b border-gray-200 animate-[fadeIn_0.2s_ease-out]">
            <VisibilityToggle 
                isVisible={localConfig.philosophy.visible !== false}
                onToggle={() => updatePhilosophy('visible', !(localConfig.philosophy.visible !== false))}
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
                    <div><label className="block text-[10px] font-bold uppercase text-gray-400">Títol Secció (Petit)</label><input value={localConfig.philosophy.sectionTitle} onChange={(e) => updatePhilosophy('sectionTitle', e.target.value)} className="w-full border rounded px-3 py-2 text-sm" /></div>
                    <div><label className="block text-[10px] font-bold uppercase text-gray-400">Títol Principal (Gran H2)</label><input value={localConfig.philosophy.titleLine1} onChange={(e) => updatePhilosophy('titleLine1', e.target.value)} className="w-full border rounded px-3 py-2 text-sm font-bold" /></div>
                    <div><label className="block text-[10px] font-bold uppercase text-gray-400">Títol Línia 2 (Cursiva)</label><input value={localConfig.philosophy.titleLine2} onChange={(e) => updatePhilosophy('titleLine2', e.target.value)} className="w-full border rounded px-3 py-2 text-sm italic" /></div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció General</label>
                    <textarea value={localConfig.philosophy.description} onChange={(e) => updatePhilosophy('description', e.target.value)} className="w-full border rounded px-3 py-2 text-sm h-full" />
                </div>
            </div>

            {/* Two Columns: Product vs History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Product */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                    <h5 className="font-bold text-xs uppercase text-gray-500 mb-4 border-b pb-2">Columna Producte (Esquerra)</h5>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Producte</label><input value={localConfig.philosophy.productTitle} onChange={(e) => updatePhilosophy('productTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Etiqueta Nota (Post-it)</label><input value={localConfig.philosophy.cardTag} onChange={(e) => updatePhilosophy('cardTag', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        </div>
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció Producte</label><textarea value={localConfig.philosophy.productDescription} onChange={(e) => updatePhilosophy('productDescription', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={3} /></div>
                        
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
                                onChange={(imgs) => updatePhilosophy('productImages', imgs)} 
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
                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol Història</label><input value={localConfig.philosophy.historicTitle} onChange={(e) => updatePhilosophy('historicTitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Enllaç Botó</label><input value={localConfig.philosophy.historicLinkUrl} onChange={(e) => updatePhilosophy('historicLinkUrl', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                        </div>
                        <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció Història</label><textarea value={localConfig.philosophy.historicDescription} onChange={(e) => updatePhilosophy('historicDescription', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={3} /></div>
                        
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
                                onChange={(imgs) => updatePhilosophy('historicImages', imgs)} 
                                labelPrefix="Història" 
                                maxLimit={localConfig.adminSettings?.maxHistoricImages || 5} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};