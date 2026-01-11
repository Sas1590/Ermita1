import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';

interface NavbarProps {
  scrolled: boolean;
  onOpenMenu: (tab: 'food' | 'wine' | 'group') => void;
  onScrollToSection: (id: string) => void;
  onToggleAdminPanel: () => void; 
  isAdminMode: boolean; // New prop for admin mode status
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, onOpenMenu, onScrollToSection, onToggleAdminPanel, isAdminMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config, isLoading } = useConfig(); 

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 py-4 shadow-lg' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center text-white">
        
        {/* Logo and Admin Badge Container */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
            aria-label="Anar a l'inici"
          >
             {/* Dynamic Logo Logic with Smooth Loading */}
             {isLoading ? (
               // Placeholder for spacing
               <div className="h-10 w-20"></div>
             ) : (
               <div className="animate-fade-in-slow">
                  {config.brand?.logoUrl ? (
                    <img src={config.brand.logoUrl} alt="Ermita Paret Delgada" className="h-10 md:h-20 w-auto object-contain transition-all duration-300" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                      <span className="font-serif font-bold text-xl tracking-wider uppercase">
                        Ermita <span className="text-primary normal-case font-hand text-2xl">Paret Delgada</span>
                      </span>
                    </>
                  )}
               </div>
             )}
          </button>

          {/* Admin Label - Only visible if in Admin Mode */}
          {isAdminMode && (
            <div className="hidden md:flex items-center gap-1 bg-red-600/90 text-white px-3 py-1 rounded shadow-lg border border-red-400">
               <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
               <span className="text-[10px] uppercase font-bold tracking-widest">Panell d'administrador</span>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-[0.2em] uppercase">
          
          {/* Dropdown for LA CARTA */}
          <div className="relative group">
            <button className="hover:text-primary transition-colors flex items-center gap-1 py-4">
              La Carta
              <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:rotate-180">expand_more</span>
            </button>
            {/* Added pt-4 to create a safe hover bridge so dropdown doesn't close easily */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top flex flex-col z-50">
               <div className="bg-black/95 text-white shadow-xl border border-white/10">
                 <button 
                   onClick={() => onOpenMenu('food')} 
                   className="w-full px-6 py-4 text-left hover:bg-white/10 hover:text-primary border-b border-white/5 transition-colors flex items-center justify-between group/item"
                 >
                   Menjar
                   <span className="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">arrow_forward</span>
                 </button>
                 <button 
                   onClick={() => onOpenMenu('wine')} 
                   className="w-full px-6 py-4 text-left hover:bg-white/10 hover:text-primary border-b border-white/5 transition-colors flex items-center justify-between group/item"
                 >
                   Vins
                   <span className="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">wine_bar</span>
                 </button>
                 <button 
                   onClick={() => onOpenMenu('group')} 
                   className="w-full px-6 py-4 text-left hover:bg-white/10 hover:text-primary transition-colors flex items-center justify-between group/item"
                 >
                   Menú de Grup
                   <span className="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">groups</span>
                 </button>
               </div>
            </div>
          </div>

          {/* History link - Programmatic scroll */}
          <button onClick={() => onScrollToSection('historia')} className="hover:text-primary transition-colors uppercase">Història</button>
          
          {/* Contact link - Programmatic scroll */}
          <button onClick={() => onScrollToSection('contacte')} className="hover:text-primary transition-colors uppercase">Contacte</button>

          <button onClick={() => onScrollToSection('reserva')} className="border border-white/30 px-6 py-3 hover:bg-primary hover:border-primary hover:text-black transition-all duration-300">
            {config.navbar.reserveButtonText}
          </button>

          {/* Admin Panel Toggle Button - now conditional */}
          {isAdminMode && (
            <button 
              onClick={onToggleAdminPanel}
              className="text-white/50 hover:text-primary transition-colors text-xs font-bold tracking-widest uppercase ml-4"
            >
              Modificar Contingut
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-3xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 text-white py-10 flex flex-col items-center gap-8 md:hidden shadow-xl border-t border-white/10 h-screen overflow-y-auto pb-20">
          
          {/* Mobile Admin Badge */}
          {isAdminMode && (
             <div className="flex items-center gap-1 text-red-400 mb-2">
               <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
               <span className="text-[10px] uppercase font-bold tracking-widest">Panell d'administrador</span>
             </div>
          )}

          <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-white/50 text-xs tracking-widest uppercase">La Carta</span>
            <button onClick={() => { onOpenMenu('food'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Carta de Menjar</button>
            <button onClick={() => { onOpenMenu('wine'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Carta de Vins</button>
            <button onClick={() => { onOpenMenu('group'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Menú de Grup</button>
          </div>
          
          <div className="w-12 h-px bg-white/20"></div>
          
          <button onClick={() => { onScrollToSection('historia'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Història</button>
          <button onClick={() => { onScrollToSection('contacte'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Contacte</button>
          
          {/* Reserve Button added to Mobile Menu */}
          <button 
            onClick={() => { onScrollToSection('reserva'); setMobileMenuOpen(false); }} 
            className="border border-white/30 px-8 py-3 mt-4 hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
          >
            {config.navbar.reserveButtonText}
          </button>

          {isAdminMode && ( // Also conditional in mobile menu
            <button onClick={() => { onToggleAdminPanel(); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary mt-4 text-white/50">Modificar Contingut</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;