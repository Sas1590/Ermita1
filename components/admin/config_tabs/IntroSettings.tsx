import React from 'react';
import { AppConfig } from '../../../context/ConfigContext';
import { VisibilityToggle } from '../AdminShared';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const IntroSettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    
    const updateIntro = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            intro: { ...prev.intro, [key]: value }
        }));
    };

    return (
        <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#f7fee7] p-8 rounded-b-xl rounded-tr-xl shadow-sm border-l-4 border-[#65a30d] border-t border-r border-b border-[#d9f99d]">
                
                <VisibilityToggle 
                    isVisible={localConfig.intro.visible !== false} 
                    onToggle={() => updateIntro('visible', !(localConfig.intro.visible !== false))}
                    colorClass="bg-[#65a30d] border-[#65a30d]"
                />

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
                                onChange={(e) => updateIntro('mainTitle', e.target.value)} 
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#65a30d] focus:ring-1 focus:ring-[#bef264] transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">TÍTOL PETIT</label>
                            <input 
                                value={localConfig.intro.smallTitle} 
                                onChange={(e) => updateIntro('smallTitle', e.target.value)} 
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
                            onChange={(e) => updateIntro('description', e.target.value)} 
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
    );
};