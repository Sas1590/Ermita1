import React from 'react';
import { AppConfig } from '../../../context/ConfigContext';
import { VisibilityToggle, LogoEditor } from '../AdminShared';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const SpecialtiesSettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    
    const updateSpecialties = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            specialties: { ...prev.specialties, [key]: value }
        }));
    };

    const updateItemInArray = (index: number, field: string, value: any) => {
        setLocalConfig(prev => {
            const newArray = [...(prev.specialties.items || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return {
                ...prev,
                specialties: { ...prev.specialties, items: newArray }
            };
        });
    };

    return (
        <div className="bg-[#fff8e1] p-6 rounded-xl shadow-sm border-l-4 border-orange-500 border-t border-r border-b border-orange-100 animate-[fadeIn_0.2s_ease-out]">
            <VisibilityToggle 
                isVisible={localConfig.specialties.visible !== false} 
                onToggle={() => updateSpecialties('visible', !(localConfig.specialties.visible !== false))}
                colorClass="bg-orange-600 border-orange-600"
            />

            <div className="flex justify-between items-center mb-6">
                <h4 className="font-serif text-xl font-bold text-orange-900 flex items-center gap-2">
                    <span className="material-symbols-outlined bg-orange-200 p-1 rounded text-orange-800">stars</span> 
                    Especialitats (Targetes Destacades)
                </h4>
            </div>
            
            <div className="bg-white border border-orange-100 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Secció (Petit)</label><input value={localConfig.specialties.sectionTitle} onChange={(e) => updateSpecialties('sectionTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
                    <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Principal (Gran H2)</label><input value={localConfig.specialties.mainTitle} onChange={(e) => updateSpecialties('mainTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold" /></div>
                </div>
                <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció</label><textarea value={localConfig.specialties.description} onChange={(e) => updateSpecialties('description', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} /></div>
            </div>

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
                                onClick={() => updateItemInArray(idx, 'visible', !(item.visible !== false))}
                                className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors flex items-center gap-1 ${item.visible !== false ? 'bg-[#eab308] border-[#ca8a04] text-white' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                            >
                                <span className="material-symbols-outlined text-xs">{item.visible !== false ? 'visibility' : 'visibility_off'}</span>
                                {item.visible !== false ? 'VISIBLE' : 'OCULT'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol</label><input value={item.title} onChange={(e) => updateItemInArray(idx, 'title', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Subtítol</label><input value={item.subtitle} onChange={(e) => updateItemInArray(idx, 'subtitle', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm" /></div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[9px] font-bold uppercase text-gray-400">Imatge Targeta</label>
                                    {item.badge && <input value={item.badge} onChange={(e) => updateItemInArray(idx, 'badge', e.target.value)} className="border border-orange-200 bg-orange-50 text-orange-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase w-32 text-center placeholder-orange-300" placeholder="ETIQUETA" />}
                                </div>
                                <LogoEditor value={item.image} onChange={(val) => updateItemInArray(idx, 'image', val)} />
                            </div>

                            <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció Targeta</label><textarea value={item.description || ''} onChange={(e) => updateItemInArray(idx, 'description', e.target.value)} className="w-full border rounded px-2 py-1.5 text-sm text-gray-600" rows={2} /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};