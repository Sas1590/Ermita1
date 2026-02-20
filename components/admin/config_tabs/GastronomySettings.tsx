import React from 'react';
import { AppConfig } from '../../../context/ConfigContext';
import { VisibilityToggle, LogoEditor } from '../AdminShared';

interface Props {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

export const GastronomySettings: React.FC<Props> = ({ localConfig, setLocalConfig }) => {
    
    const updateGastronomy = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            gastronomy: { ...prev.gastronomy, [key]: value }
        }));
    };

    const updateNestedConfig = (objectKey: string, key: string, value: any) => {
         setLocalConfig(prev => {
             const sectionData = prev.gastronomy as any;
             return {
                ...prev,
                gastronomy: {
                    ...sectionData,
                    [objectKey]: {
                        ...sectionData[objectKey],
                        [key]: value
                    }
                }
             };
         });
    };

    const handleFooterLinkChange = (index: number, targetTab: string) => {
        let label = '';
        let icon = 'link'; 

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
        while (newLinks.length <= index) newLinks.push({ label: '', icon: 'link', targetTab: '' });
        newLinks[index] = { targetTab, label, icon };
        updateGastronomy('footerLinks', newLinks);
    };

    return (
        <div className="bg-[#f0fdf9] p-6 rounded-xl shadow-sm border-l-4 border-teal-500 border-t border-r border-b border-teal-100 animate-[fadeIn_0.2s_ease-out]">
            <VisibilityToggle 
                isVisible={localConfig.gastronomy.visible !== false} 
                onToggle={() => updateGastronomy('visible', !(localConfig.gastronomy.visible !== false))}
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
                    <div><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Títol Principal (Gran H2)</label><input value={localConfig.gastronomy.mainTitle} onChange={(e) => updateGastronomy('mainTitle', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-bold" /></div>
                </div>
                <div className="mt-4"><label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Descripció</label><textarea value={localConfig.gastronomy.description} onChange={(e) => updateGastronomy('description', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={2} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {['card1', 'card2'].map((cardKey, idx) => {
                    const cardData = (localConfig.gastronomy as any)[cardKey];
                    return (
                        <div key={cardKey} className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm relative">
                            <h5 className="font-bold text-sm uppercase text-teal-700 flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined">menu_book</span> Targeta {idx + 1}
                            </h5>
                            <div className="space-y-3">
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Títol</label><input value={cardData.title} onChange={(e) => updateNestedConfig(cardKey, 'title', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Subtítol</label><input value={cardData.subtitle} onChange={(e) => updateNestedConfig(cardKey, 'subtitle', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400">Descripció</label><textarea value={cardData.description} onChange={(e) => updateNestedConfig(cardKey, 'description', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={2} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Preu</label><input value={cardData.price} onChange={(e) => updateNestedConfig(cardKey, 'price', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Nota al peu</label><input value={cardData.footerText} onChange={(e) => updateNestedConfig(cardKey, 'footerText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded border border-gray-100">
                                    <div><label className="block text-[9px] font-bold uppercase text-gray-400">Text Botó</label><input value={cardData.buttonText} onChange={(e) => updateNestedConfig(cardKey, 'buttonText', e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white" /></div>
                                    <div>
                                        <label className="block text-[9px] font-bold uppercase text-gray-400">Enllaç (Destí)</label>
                                        <select value={cardData.targetTab} onChange={(e) => updateNestedConfig(cardKey, 'targetTab', e.target.value)} className="w-full border rounded px-2 py-1 text-sm bg-white outline-none">
                                            <option value="daily">Menú Diari</option>
                                            <option value="food">Carta Menjar</option>
                                            <option value="wine">Carta Vins</option>
                                            <option value="group">Menú Grup</option>
                                            {(localConfig.extraMenus || []).map((m:any, i:number) => <option key={i} value={`extra_${i}`}>{m.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div><label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Imatge</label><LogoEditor value={cardData.image} onChange={(val) => updateNestedConfig(cardKey, 'image', val)} /></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-[#f0fdf9] p-4 rounded-xl border border-teal-100 mt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                    <button
                        onClick={() => updateGastronomy('footerVisible', !(localConfig.gastronomy.footerVisible !== false))}
                        className={`shrink-0 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 
                        ${localConfig.gastronomy.footerVisible !== false ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                        <span className="material-symbols-outlined text-xs">{localConfig.gastronomy.footerVisible !== false ? 'visibility' : 'visibility_off'}</span>
                        {localConfig.gastronomy.footerVisible !== false ? 'LINKS VISIBLES' : 'LINKS OCULTS'}
                    </button>
                    <div className="h-4 w-px bg-teal-200 hidden md:block"></div>
                    <h5 className="font-bold text-xs uppercase text-teal-800 shrink-0 pt-1">Enllaços Peu de Pàgina</h5>
                    <div className="flex-1 w-full md:w-auto relative group">
                        <span className="absolute top-1/2 -translate-y-1/2 left-3 text-teal-400 material-symbols-outlined text-sm">title</span>
                        <input
                            value={localConfig.gastronomy.footerTitle || ''}
                            onChange={(e) => updateGastronomy('footerTitle', e.target.value)}
                            className="w-full bg-white border border-teal-100 rounded-md py-1.5 pl-9 pr-3 text-xs font-bold text-teal-900 outline-none focus:border-teal-400 placeholder-teal-300/50"
                            placeholder="Títol Secció (ex: TAMBÉ DISPONIBLE)"
                        />
                    </div>
                </div>

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
                                <p className="text-[9px] text-gray-400 truncate">{link.label || 'Sense destí'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};