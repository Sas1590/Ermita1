import React, { useState } from 'react';
import { useConfig, FoodMenuItem, MenuSection, WineCategory, GroupMenuSection } from '../context/ConfigContext';

interface MenuProps {
  activeTab: string | null;
  onToggleTab: (tab: string | null) => void;
}

// --- SUB-COMPONENTS FOR CONTENT RENDERING ---

const FoodMenuContent: React.FC<{ menuData: MenuSection[] }> = ({ menuData }) => {
    if (!menuData) return null;
    return (
    <div className="p-8 md:p-16 space-y-16 bg-[#F9F7F2] relative">
        <div className="absolute inset-4 md:inset-6 border-4 border-double border-[#d0bb95] pointer-events-none opacity-50"></div>
        {(menuData || []).map((section, idx) => (
            <div key={idx} className="relative z-10">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="h-px bg-[#8b5a2b] w-12 md:w-24 opacity-30"></div>
                        {section.icon ? (
                            <span className="material-symbols-outlined text-[#8b5a2b] text-2xl bg-[#F9F7F2] px-2">{section.icon}</span>
                        ) : (
                            <div className="w-2 h-2 rotate-45 bg-[#8b5a2b]"></div>
                        )}
                        <div className="h-px bg-[#8b5a2b] w-12 md:w-24 opacity-30"></div>
                    </div>
                    <h4 className="font-serif text-3xl font-bold text-[#2c241b] uppercase tracking-[0.2em]">{section.category}</h4>
                </div>
                <ul className="space-y-6">
                    {(section.items || []).map((item, i) => (
                        <li key={i} className="group">
                            <div className="flex justify-between items-start gap-4 relative">
                                <div className="flex flex-col relative z-10 bg-[#F9F7F2] pr-4">
                                    <span className="font-serif font-bold text-[#2c241b] text-lg md:text-xl">{item.nameCa}</span>
                                    {item.nameEs && (
                                        <span className="font-hand text-gray-500 text-lg leading-none mt-1">{item.nameEs}</span>
                                    )}
                                </div>
                                <div className="grow border-b-2 border-dotted border-[#8b5a2b] relative top-4 opacity-30"></div>
                                <span className="font-sans font-bold text-[#8b5a2b] text-xl relative z-10 bg-[#F9F7F2] pl-4 pt-1">{item.price}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                {section.footer && (
                    <div className="mt-8 text-center border-t border-[#d0bb95] pt-4 mx-12">
                        <p className="font-sans font-bold text-[#8b5a2b] text-xs md:text-sm tracking-widest uppercase">{section.footer}</p>
                    </div>
                )}
            </div>
        ))}
    </div>
    );
};

const WineMenuContent: React.FC<{ menuData: WineCategory[] }> = ({ menuData }) => {
    if (!menuData) return null;
    return (
    <div className="p-8 md:p-16 space-y-16">
        {(menuData || []).map((section, idx) => (
            <div key={idx}>
                <div className="flex items-center justify-center mb-10">
                    <div className="h-px bg-[#8b5a2b] w-12 opacity-50"></div>
                    <h4 className="font-serif text-3xl md:text-4xl font-bold text-[#2c241b] uppercase tracking-[0.2em] px-6">{section.category}</h4>
                    <div className="h-px bg-[#8b5a2b] w-12 opacity-50"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {(section.groups || []).map((group, gIdx) => (
                        <div key={gIdx} className="break-inside-avoid">
                            {group.sub && (
                                <h5 className="font-serif font-bold text-[#556b2f] italic text-xl mb-4 border-b border-[#e5e0d5] pb-2 inline-block">{group.sub}</h5>
                            )}
                            <ul className="space-y-5">
                                {(group.items || []).map((item, i) => (
                                    <li key={i} className="mb-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <span className="font-sans font-bold text-[#2c241b] text-lg block">{item.name}</span>
                                                {item.desc && (
                                                    <span className="font-hand text-gray-500 text-lg leading-none">{item.desc}</span>
                                                )}
                                            </div>
                                            <span className="font-serif font-bold text-[#8b5a2b] text-lg shrink-0">{item.price}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
    );
};

const GroupMenuContent: React.FC<{ menuData: any }> = ({ menuData }) => {
    const [showGroupInfo, setShowGroupInfo] = useState(true);
    if (!menuData) return null;

    return (
        <div className="p-8 md:p-16 flex flex-col items-center bg-[#F9F7F2]">
            <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c241b] uppercase tracking-widest mb-2">{menuData.title}</h2>
                <div className="w-24 h-1 bg-[#8b5a2b] mx-auto rounded-full"></div>
            </div>
            <div className="space-y-12 w-full max-w-3xl">
                {(menuData.sections || []).map((section: GroupMenuSection, idx: number) => (
                    <div key={idx} className="text-center relative">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-px bg-gray-400 w-full opacity-30"></div>
                            <div className="w-2 h-2 rotate-45 bg-[#8b5a2b]"></div>
                            <div className="h-px bg-gray-400 w-full opacity-30"></div>
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-[#556b2f] uppercase tracking-widest mb-6">{section.title}</h4>
                        <ul className="space-y-6">
                            {(section.items || []).map((item, i) => (
                                <li key={i} className="flex flex-col items-center gap-1">
                                    <span className="font-serif text-xl text-[#2c241b] leading-tight font-bold">{item.nameCa}</span>
                                    {item.nameEs && <span className="font-hand text-lg text-gray-500 leading-none">{item.nameEs}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-16 text-center space-y-2 font-serif text-[#2c241b] italic text-lg">
                {(menuData.drinks || []).map((drink: string, idx: number) => (
                    <p key={idx}>{drink}</p>
                ))}
            </div>
            <div className="mt-6 text-red-600 font-hand text-lg font-bold">{menuData.disclaimer}</div>
            <div className="mt-12 text-center border-t-2 border-b-2 border-[#2c241b] py-6 px-12 inline-block">
                <span className="font-serif text-4xl md:text-5xl font-bold text-[#2c241b] tracking-widest block">{menuData.price}</span>
                <span className="font-sans text-sm font-bold text-[#8b5a2b] uppercase tracking-[0.3em]">{menuData.vat}</span>
            </div>
            {showGroupInfo && (
                <div className="relative w-full max-w-4xl mx-auto mt-16 bg-[#F9F7F2] border-l-4 border-[#8b5a2b] shadow-lg p-6 md:p-8 animate-[fadeIn_0.5s_ease-out]">
                    <button onClick={() => setShowGroupInfo(false)} className="absolute top-2 right-2 md:top-4 md:right-4 text-[#8b5a2b]/50 hover:text-[#8b5a2b] transition-colors p-2" title="Tancar avís"><span className="material-symbols-outlined">close</span></button>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="shrink-0 flex justify-center md:block"><span className="material-symbols-outlined text-5xl text-[#8b5a2b] bg-[#e8e4d9] rounded-full p-3">info</span></div>
                        <div className="font-sans text-[#2c241b] space-y-4 text-sm md:text-base leading-relaxed">
                            <p className="font-medium text-lg">{menuData.infoIntro}</p>
                            <p>{menuData.infoAllergy}</p>
                            <p className="italic text-gray-500 text-xs border-t border-gray-200 pt-2">* Recorda que no s’accepten tiquets restaurant ni descomptes en el menú de grup.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN MENU COMPONENT ---

const Menu: React.FC<MenuProps> = ({ activeTab, onToggleTab }) => {
  const { config } = useConfig();

  // Dynamic Menu Data
  const FoodMenuData = config.foodMenu || [];
  const GroupMenuData = config.groupMenu;
  const WineMenuData = config.wineMenu || [];
  const ExtraMenus = config.extraMenus || [];

  const toggleTab = (tab: string) => {
    if (activeTab === tab) {
      onToggleTab(null);
    } else {
      onToggleTab(tab);
      setTimeout(() => {
        const section = document.getElementById('carta');
        if (section) {
           const offset = 100;
           const elementPosition = section.getBoundingClientRect().top + window.scrollY;
           const offsetPosition = elementPosition - offset;
           window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <section id="carta" className="relative py-24 min-h-screen flex items-center bg-[#1d1a15] bg-dark-texture">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1596230529625-7ee541366532?q=80&w=2070&auto=format&fit=crop" alt="Rustic Stone Wall" className="w-full h-full object-cover opacity-40 brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1a15] via-transparent to-[#1d1a15]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl md:text-7xl text-white font-bold tracking-[0.2em] uppercase drop-shadow-lg">La Carta</h2>
          <div className="w-full max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-6 mb-2"></div>
          <span className="font-hand text-primary/80 text-2xl tracking-wider">Sabors de la nostra terra</span>
        </div>

        <div className="space-y-8">
          
          {/* 1. FOOD MENU */}
          <div className="bg-[#fdfbf7] bg-paper-texture shadow-2xl rounded-sm overflow-hidden border border-white/10 scroll-mt-32">
            <button onClick={() => toggleTab('food')} className={`w-full text-left px-8 py-8 flex justify-between items-center transition-colors duration-300 ${activeTab === 'food' ? 'bg-[#1a1816] text-primary' : 'bg-[#e8e4d9] hover:bg-[#dcd6c8] text-[#2c241b]'}`}>
              <div className="flex items-center gap-4">
                 <span className={`material-symbols-outlined text-4xl ${activeTab === 'food' ? 'text-primary' : 'text-[#8b5a2b]'}`}>restaurant_menu</span>
                 <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-widest uppercase">Carta</h3>
              </div>
              <span className="material-symbols-outlined text-4xl transition-transform duration-500" style={{ transform: activeTab === 'food' ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeTab === 'food' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden min-h-0">
                  <FoodMenuContent menuData={FoodMenuData} />
                  <div className="bg-[#e8e4d9] p-4 text-center text-[#5c544d] text-xs font-serif italic tracking-wider">Bon Profit</div>
              </div>
            </div>
          </div>

          {/* 2. GROUP MENU */}
          <div className="bg-[#fdfbf7] bg-paper-texture shadow-2xl rounded-sm overflow-hidden border border-white/10 scroll-mt-32">
            <button onClick={() => toggleTab('group')} className={`w-full text-left px-8 py-8 flex justify-between items-center transition-colors duration-300 ${activeTab === 'group' ? 'bg-[#1a1816] text-primary' : 'bg-[#e8e4d9] hover:bg-[#dcd6c8] text-[#2c241b]'}`}>
              <div className="flex items-center gap-4">
                 <span className={`material-symbols-outlined text-4xl ${activeTab === 'group' ? 'text-primary' : 'text-[#8b5a2b]'}`}>diversity_3</span>
                 <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-widest uppercase">{GroupMenuData?.title || 'Menú de Grup'}</h3>
              </div>
              <span className="material-symbols-outlined text-4xl transition-transform duration-500" style={{ transform: activeTab === 'group' ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeTab === 'group' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden min-h-0">
                  {GroupMenuData && <GroupMenuContent menuData={GroupMenuData} />}
                  <div className="bg-[#e8e4d9] p-4 text-center text-[#5c544d] text-xs font-serif italic tracking-wider">{GroupMenuData?.footerText || "Celebracions amb ànima"}</div>
              </div>
            </div>
          </div>

          {/* 3. WINE MENU */}
          <div className="bg-[#fdfbf7] bg-paper-texture shadow-2xl rounded-sm overflow-hidden border border-white/10 scroll-mt-32">
            <button onClick={() => toggleTab('wine')} className={`w-full text-left px-8 py-8 flex justify-between items-center transition-colors duration-300 ${activeTab === 'wine' ? 'bg-[#1a1816] text-primary' : 'bg-[#e8e4d9] hover:bg-[#dcd6c8] text-[#2c241b]'}`}>
               <div className="flex items-center gap-4">
                 <span className={`material-symbols-outlined text-4xl ${activeTab === 'wine' ? 'text-primary' : 'text-[#8b5a2b]'}`}>wine_bar</span>
                 <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-widest uppercase">Carta de Vins</h3>
              </div>
              <span className="material-symbols-outlined text-4xl transition-transform duration-500" style={{ transform: activeTab === 'wine' ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeTab === 'wine' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden min-h-0">
                  <WineMenuContent menuData={WineMenuData} />
                  <div className="bg-[#e8e4d9] p-4 text-center text-[#5c544d] text-xs font-serif italic tracking-wider">Salut!</div>
              </div>
            </div>
          </div>

          {/* 4. DYNAMIC EXTRA MENUS */}
          {ExtraMenus.map((extraMenu, index) => {
              const tabId = `extra_${index}`;
              let icon = 'restaurant';
              if(extraMenu.type === 'wine') icon = 'wine_bar';
              if(extraMenu.type === 'group') icon = 'diversity_3';

              return (
                <div key={extraMenu.id || index} className="bg-[#fdfbf7] bg-paper-texture shadow-2xl rounded-sm overflow-hidden border border-white/10 scroll-mt-32">
                    <button onClick={() => toggleTab(tabId)} className={`w-full text-left px-8 py-8 flex justify-between items-center transition-colors duration-300 ${activeTab === tabId ? 'bg-[#1a1816] text-primary' : 'bg-[#e8e4d9] hover:bg-[#dcd6c8] text-[#2c241b]'}`}>
                    <div className="flex items-center gap-4">
                        <span className={`material-symbols-outlined text-4xl ${activeTab === tabId ? 'text-primary' : 'text-[#8b5a2b]'}`}>{icon}</span>
                        <h3 className="font-serif text-2xl md:text-4xl font-bold tracking-widest uppercase">{extraMenu.title}</h3>
                    </div>
                    <span className="material-symbols-outlined text-4xl transition-transform duration-500" style={{ transform: activeTab === tabId ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeTab === tabId ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden min-h-0">
                        {extraMenu.type === 'food' && <FoodMenuContent menuData={extraMenu.data} />}
                        {extraMenu.type === 'wine' && <WineMenuContent menuData={extraMenu.data} />}
                        {extraMenu.type === 'group' && <GroupMenuContent menuData={extraMenu.data} />}
                        <div className="bg-[#e8e4d9] p-4 text-center text-[#5c544d] text-xs font-serif italic tracking-wider">Ermita Paret Delgada</div>
                    </div>
                    </div>
                </div>
              );
          })}

        </div>
        
        <div className="text-center mt-12 text-white/50 text-sm font-sans italic">
          * Preus en euros, impostos inclosos. Consultar al·lèrgens al personal de sala.
        </div>

      </div>
    </section>
  );
};

export default Menu;