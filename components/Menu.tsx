import React, { useState } from 'react';
import { useConfig, FoodMenuItem, MenuSection, WineCategory, GroupMenuSection } from '../context/ConfigContext';

interface MenuProps { activeTab: string | null; onToggleTab: (tab: string | null) => void; }

const MenuInfoBlock: React.FC<{ menuData: any }> = ({ menuData }) => {
    const [showInfoBox, setShowInfoBox] = useState(true);
    const shouldShowPrice = (menuData.showPrice !== false) && !!menuData.price;
    const shouldShowInfo = (menuData.showInfo !== false) && (!!menuData.infoIntro || !!menuData.infoAllergy);
    if (!shouldShowPrice && !shouldShowInfo) return null;
    return (
        <div className="flex flex-col items-center mt-12 mb-8">
            {shouldShowPrice && (<div className="text-center border-t-2 border-b-2 border-[#2c241b] py-6 px-12 inline-block mb-10"><span className="font-serif text-4xl md:text-5xl font-bold text-[#2c241b] tracking-widest block">{menuData.price}</span>{menuData.vat && <span className="font-sans text-sm font-bold text-[#8b5a2b] uppercase tracking-[0.3em]">{menuData.vat}</span>}</div>)}
            {shouldShowInfo && showInfoBox && (<div className="relative w-full max-w-4xl mx-auto bg-[#F9F7F2] border-l-4 border-[#8b5a2b] shadow-lg p-6 md:p-8 animate-[fadeIn_0.5s_ease-out]"><button onClick={() => setShowInfoBox(false)} className="absolute top-2 right-2 md:top-4 md:right-4 text-[#8b5a2b]/50 hover:text-[#8b5a2b] transition-colors p-2" title="Tancar avís"><span className="material-symbols-outlined">close</span></button><div className="flex flex-col md:flex-row gap-6"><div className="shrink-0 flex justify-center md:block"><span className="material-symbols-outlined text-5xl text-[#8b5a2b] bg-[#e8e4d9] rounded-full p-3">info</span></div><div className="font-sans text-[#2c241b] space-y-4 text-sm md:text-base leading-relaxed w-full">{menuData.infoIntro && <p className="font-medium text-lg border-b border-gray-200 pb-2">{menuData.infoIntro}</p>}{menuData.infoAllergy && <p>{menuData.infoAllergy}</p>}<p className="italic text-gray-500 text-xs pt-2">* Recorda que no s’accepten tiquets restaurant ni descomptes en el menú de grup.</p></div></div></div>)}
        </div>
    );
};

const FoodMenuContent: React.FC<{ menuData: any }> = ({ menuData }) => {
    if (!menuData) return null;
    const isLegacy = Array.isArray(menuData);
    const sections: MenuSection[] = isLegacy ? menuData : (menuData.sections || []);
    const disclaimer = isLegacy ? null : (menuData.showDisclaimer !== false ? menuData.disclaimer : null);
    return (
    <div className="p-8 md:p-16 space-y-16 bg-[#F9F7F2] relative">
        <div className="absolute inset-4 md:inset-6 border-4 border-double border-[#d0bb95] pointer-events-none opacity-50"></div>
        {sections.map((section, idx) => (
            <div key={idx} className="relative z-10">
                <div className="text-center mb-10"><div className="flex items-center justify-center gap-4 mb-3"><div className="h-px bg-[#8b5a2b] w-12 md:w-24 opacity-30"></div>{section.icon ? (section.icon === 'mini_rhombus' ? (<div className="w-2 h-2 rotate-45 bg-[#8b5a2b]"></div>) : (<span className="material-symbols-outlined text-[#8b5a2b] text-2xl bg-[#F9F7F2] px-2">{section.icon}</span>)) : (<div className="w-2 h-2 rotate-45 bg-[#8b5a2b]"></div>)}<div className="h-px bg-[#8b5a2b] w-12 md:w-24 opacity-30"></div></div><h4 className="font-serif text-3xl font-bold text-[#2c241b] uppercase tracking-[0.2em]">{section.category}</h4></div>
                <ul className="space-y-6">{(section.items || []).filter(item => item.visible !== false).map((item, i) => (<li key={i} className={`group ${item.strikethrough ? 'opacity-60' : ''}`}><div className="flex justify-between items-start gap-4 relative"><div className="flex flex-col relative z-10 bg-[#F9F7F2] pr-4"><span className={`font-serif font-bold text-[#2c241b] text-lg md:text-xl ${item.strikethrough ? 'line-through decoration-[#8b5a2b] decoration-2' : ''}`}>{item.nameCa}</span>{item.nameEs && (<span className={`font-hand text-gray-500 text-2xl leading-none mt-1 ${item.strikethrough ? 'line-through decoration-gray-400' : ''}`}>{item.nameEs}</span>)}</div><div className="grow border-b-2 border-dotted border-[#8b5a2b] relative top-4 opacity-30"></div><span className="font-sans font-bold text-[#8b5a2b] text-xl relative z-10 bg-[#F9F7F2] pl-4 pt-1">{item.price}</span></div></li>))}</ul>
                {section.footer && (<div className="mt-8 text-center border-t border-[#d0bb95] pt-4 mx-12"><p className="font-sans font-bold text-[#8b5a2b] text-xs md:text-sm tracking-widest uppercase">{section.footer}</p></div>)}
            </div>
        ))}
        {!isLegacy && <MenuInfoBlock menuData={menuData} />}
        {disclaimer && (<div className="mt-12 text-center text-red-600 font-hand text-lg font-bold border-t-2 border-red-100 pt-6 relative z-10 max-w-2xl mx-auto">{disclaimer}</div>)}
    </div>
    );
};

const WineMenuContent: React.FC<{ menuData: any }> = ({ menuData }) => {
    if (!menuData) return null;
    const isLegacy = Array.isArray(menuData);
    const categories: WineCategory[] = isLegacy ? menuData : (menuData.categories || []);
    const disclaimer = isLegacy ? null : (menuData.showDisclaimer !== false ? menuData.disclaimer : null);
    if (!Array.isArray(categories)) return null; 
    return (
    <div className="p-8 md:p-16 space-y-16">
        {categories.map((section, idx) => (
            <div key={idx}>
                <div className="flex items-center justify-center mb-10"><div className="h-px bg-[#8b5a2b] w-12 opacity-50"></div>{section.icon ? (section.icon === 'mini_rhombus' ? (<div className="w-4 h-4 rotate-45 bg-[#8b5a2b] mx-4"></div>) : (<span className="material-symbols-outlined text-[#8b5a2b] text-3xl px-4">{section.icon}</span>)) : (<div className="w-4"></div>)}<h4 className="font-serif text-3xl md:text-4xl font-bold text-[#2c241b] uppercase tracking-[0.2em] px-2">{section.category}</h4><div className="h-px bg-[#8b5a2b] w-12 opacity-50"></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">{(section.groups || []).map((group, gIdx) => (<div key={gIdx} className="break-inside-avoid">{group.sub && (<h5 className="font-serif font-bold text-[#556b2f] italic text-xl mb-4 border-b border-[#e5e0d5] pb-2 inline-block">{group.sub}</h5>)}<ul className="space-y-5">{(group.items || []).filter(item => item.visible !== false).map((item, i) => (<li key={i} className={`mb-4 ${item.strikethrough ? 'opacity-60' : ''}`}><div className="flex justify-between items-start gap-4"><div><span className={`font-sans font-bold text-[#2c241b] text-lg block ${item.strikethrough ? 'line-through' : ''}`}>{item.name}</span>{item.desc && (<span className={`font-hand text-gray-500 text-lg leading-none ${item.strikethrough ? 'line-through' : ''}`}>{item.desc}</span>)}</div><span className="font-serif font-bold text-[#8b5a2b] text-lg shrink-0">{item.price}</span></div></li>))}</ul></div>))}</div>
            </div>
        ))}
        {!isLegacy && <MenuInfoBlock menuData={menuData} />}
        {disclaimer && (<div className="mt-12 text-center text-red-600 font-hand text-lg font-bold border-t-2 border-red-100 pt-6 max-w-2xl mx-auto">{disclaimer}</div>)}
    </div>
    );
};

const GroupMenuContent: React.FC<{ menuData: any }> = ({ menuData }) => {
    if (!menuData) return null;
    const showDisclaimer = menuData.showDisclaimer !== false; 
    return (
        <div className="p-8 md:p-16 flex flex-col items-center bg-[#F9F7F2]">
            <div className="text-center mb-12"><h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c241b] uppercase tracking-widest mb-2">{menuData.title}</h2><div className="w-24 h-1 bg-[#8b5a2b] mx-auto rounded-full"></div></div>
            <div className="space-y-12 w-full max-w-3xl">{(menuData.sections || []).map((section: GroupMenuSection, idx: number) => (<div key={idx} className="text-center relative"><div className="flex items-center justify-center gap-4 mb-6"><div className="h-px bg-gray-400 w-full opacity-30"></div>{section.icon ? (section.icon === 'mini_rhombus' ? (<div className="w-2 h-2 rotate-45 bg-[#8b5a2b]"></div>) : (<span className="material-symbols-outlined text-[#8b5a2b] text-2xl">{section.icon}</span>)) : (<div className="w-2 h-2 rotate-45 bg-[#8b5a2b]"></div>)}<div className="h-px bg-gray-400 w-full opacity-30"></div></div><h4 className="font-serif text-2xl font-bold text-[#556b2f] uppercase tracking-widest mb-6">{section.title}</h4><ul className="space-y-6">{(section.items || []).filter(item => item.visible !== false).map((item, i) => (<li key={i} className={`flex flex-col items-center gap-1 ${item.strikethrough ? 'opacity-60' : ''}`}><span className={`font-serif text-xl text-[#2c241b] leading-tight font-bold ${item.strikethrough ? 'line-through decoration-[#2c241b]' : ''}`}>{item.nameCa}</span>{item.nameEs && <span className={`font-hand text-2xl text-gray-500 leading-none ${item.strikethrough ? 'line-through' : ''}`}>{item.nameEs}</span>}</li>))}</ul></div>))}</div>
            <div className="mt-16 text-center space-y-2 font-serif text-[#2c241b] italic text-lg">{(menuData.drinks || []).map((drink: string, idx: number) => (<p key={idx}>{drink}</p>))}</div>
            <MenuInfoBlock menuData={menuData} />
            {showDisclaimer && menuData.disclaimer && (<div className="mt-6 text-red-600 font-hand text-lg font-bold">{menuData.disclaimer}</div>)}
        </div>
    );
};

const Menu: React.FC<MenuProps> = ({ activeTab, onToggleTab }) => {
  const { config } = useConfig();
  
  const getCardClasses = (isRecommended: boolean, isActive: boolean) => {
      let containerClass = "bg-[#fdfbf7] bg-paper-texture shadow-2xl rounded-sm overflow-hidden scroll-mt-32 relative transition-all duration-500 ";
      if (isRecommended) {
          containerClass += "border-2 border-primary/30 z-10 scale-[1.01] "; 
      } else {
          containerClass += "border border-white/10 opacity-95 hover:opacity-100 ";
      }
      
      let headerClass = "w-full text-left px-8 py-8 flex justify-between items-center transition-colors duration-300 ";
      if (isActive) {
          headerClass += "bg-[#1a1816] text-primary "; 
      } else {
          headerClass += isRecommended ? "bg-white hover:bg-[#f0ece6] text-[#2c241b] " : "bg-[#e8e4d9] hover:bg-[#dcd6c8] text-[#2c241b] ";
      }
      return { containerClass, headerClass };
  };

  const renderIcon = (iconName: string, active: boolean) => { if (iconName === 'mini_rhombus') return <div className={`w-3 h-3 rotate-45 mx-1 ${active ? 'bg-primary' : 'bg-[#8b5a2b]'}`}></div>; return <span className={`material-symbols-outlined text-4xl ${active ? 'text-primary' : 'text-[#8b5a2b]'}`}>{iconName}</span>; };
  
  // FIX APPLIED: Improved scroll logic with ID targeting and delay
  const toggleTab = (tab: string) => { 
      if (activeTab === tab) {
          onToggleTab(null); 
      } else { 
          onToggleTab(tab); 
          // Wait 300ms for the accordion animation to start/stabilize
          setTimeout(() => { 
              const element = document.getElementById(`menu-card-${tab}`); 
              if (element) { 
                  // Use scrollIntoView with 'start' block to snap nicely (respecting scroll-margin-top)
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } 
          }, 300); 
      } 
  };

  const extraMenusSafe = Array.isArray(config.extraMenus) ? config.extraMenus.filter(Boolean) : [];
  const allMenus = [ { id: 'daily', type: 'group', data: config.dailyMenu, fallbackTitle: 'Menú Diari', fallbackIcon: 'lunch_dining', fallbackSubtitle: 'De Dimarts a Divendres', isExtra: false, visible: undefined as boolean | undefined }, { id: 'food', type: 'food', data: config.foodMenu, fallbackTitle: 'Carta de Menjar', fallbackIcon: 'restaurant_menu', fallbackSubtitle: '', isExtra: false, visible: undefined as boolean | undefined }, { id: 'group', type: 'group', data: config.groupMenu, fallbackTitle: 'Menú de Grup', fallbackIcon: 'diversity_3', fallbackSubtitle: '', isExtra: false, visible: undefined as boolean | undefined }, { id: 'wine', type: 'wine', data: config.wineMenu, fallbackTitle: 'Carta de Vins', fallbackIcon: 'wine_bar', fallbackSubtitle: '', isExtra: false, visible: undefined as boolean | undefined }, ...extraMenusSafe.map((extra, idx) => ({ id: `extra_${idx}`, type: extra.type, data: extra.data, fallbackTitle: extra.title, fallbackIcon: extra.icon || 'restaurant', fallbackSubtitle: extra.subtitle || '', isExtra: true, visible: extra.visible })) ].filter(item => { if (item.isExtra) return item.visible !== false; const data: any = item.data; if (!data) return false; if (Array.isArray(data)) return true; return data?.visible !== false; });

  return (
    <section id="carta" className="relative py-24 min-h-screen flex items-center bg-[#1d1a15] bg-dark-texture">
      <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1596230529625-7ee541366532?q=80&w=2070&auto=format&fit=crop" alt="Rustic Stone Wall" className="w-full h-full object-cover opacity-40 brightness-75" /><div className="absolute inset-0 bg-gradient-to-b from-[#1d1a15] via-transparent to-[#1d1a15]"></div></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 w-full">
        <div className="text-center mb-16"><h2 className="font-serif text-5xl md:text-7xl text-white font-bold tracking-[0.2em] uppercase drop-shadow-lg">{config.menuHeader?.title || "La Carta"}</h2><div className="w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-6 mb-2"></div><span className="font-hand text-primary/80 text-2xl tracking-wider">{config.menuHeader?.subtitle || "Sabors de la nostra terra"}</span></div>
        <div className="space-y-8">
          {allMenus.map((menuItem) => {
              const data = menuItem.data; if (!data && !menuItem.isExtra) return null;
              const isLegacyArray = Array.isArray(data);
              const title = !isLegacyArray && data?.title ? data.title : menuItem.fallbackTitle;
              const subtitle = !isLegacyArray && data?.subtitle ? data.subtitle : menuItem.fallbackSubtitle;
              const icon = !isLegacyArray && data?.icon ? data.icon : menuItem.fallbackIcon;
              const isRecommended = !isLegacyArray && data?.recommended === true;
              const { containerClass, headerClass } = getCardClasses(isRecommended, activeTab === menuItem.id);
              
              // FIX APPLIED: Added ID here for targeting
              return (
                <div key={menuItem.id} id={`menu-card-${menuItem.id}`} className={containerClass}>
                    {isRecommended && (<div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10 shadow-sm">Recomanat</div>)}
                    <button onClick={() => toggleTab(menuItem.id)} className={headerClass}><div className="flex items-center gap-4">{renderIcon(icon, activeTab === menuItem.id)}<div className="flex flex-col text-left"><h3 className="font-serif text-2xl md:text-4xl font-bold tracking-widest uppercase">{title}</h3>{subtitle && (<span className={`text-xs font-sans uppercase tracking-wider hidden md:block ${activeTab === menuItem.id ? 'text-primary/70' : 'text-gray-500'}`}>{subtitle}</span>)}</div></div><span className="material-symbols-outlined text-4xl transition-transform duration-500" style={{ transform: activeTab === menuItem.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span></button>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeTab === menuItem.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><div className="overflow-hidden min-h-0">{menuItem.type === 'food' && <FoodMenuContent menuData={data} />}{menuItem.type === 'wine' && <WineMenuContent menuData={data} />}{(menuItem.type === 'group' || menuItem.type === 'daily') && <GroupMenuContent menuData={data} />}<div className="bg-[#e8e4d9] p-4 text-center text-[#5c544d] text-xs font-serif italic tracking-wider">{(!isLegacyArray && data?.footerText) ? data.footerText : "Ermita Paret Delgada"}</div></div></div>
                </div>
              );
          })}
        </div>
        <div className="text-center mt-12 text-white/50 text-sm font-sans italic">{config.menuGlobalFooter}</div>
      </div>
    </section>
  );
};

export default Menu;