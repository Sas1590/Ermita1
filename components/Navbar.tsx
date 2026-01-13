import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface NavbarProps {
  scrolled: boolean;
  onOpenMenu: (tab: string) => void;
  onScrollToSection: (id: string) => void;
  onOpenAdminPanel: (tab?: 'config' | 'inbox' | 'reservations') => void; 
  isAdminMode: boolean; // Means "Is Logged In"
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, onOpenMenu, onScrollToSection, onOpenAdminPanel, isAdminMode, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config, isLoading } = useConfig(); 
  const [totalUnread, setTotalUnread] = useState(0);

  // Listen for unread messages AND pending reservations only if in Admin Mode
  useEffect(() => {
    if (isAdminMode) {
      const messagesRef = ref(db, 'contactMessages');
      const reservationsRef = ref(db, 'reservations');

      let unreadMessages = 0;
      let pendingReservations = 0;

      const updateCount = () => setTotalUnread(unreadMessages + pendingReservations);

      const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          unreadMessages = Object.values(data).filter((msg: any) => !msg.read).length;
        } else {
          unreadMessages = 0;
        }
        updateCount();
      });

      const unsubscribeReservations = onValue(reservationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Count reservations where status is 'pending'
          pendingReservations = Object.values(data).filter((res: any) => res.status === 'pending').length;
        } else {
          pendingReservations = 0;
        }
        updateCount();
      });

      return () => {
        unsubscribeMessages();
        unsubscribeReservations();
      };
    }
  }, [isAdminMode]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 py-3 md:py-4 shadow-lg' : 'bg-transparent py-6 md:py-8'
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
                    <img src={config.brand.logoUrl} alt="Ermita Paret Delgada" className="h-8 md:h-20 w-auto object-contain transition-all duration-300" />
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

          {/* Admin Badge & Notification Bell - Only visible if in Admin Mode */}
          {isAdminMode && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 bg-green-600/90 text-white px-3 py-1 rounded shadow-lg border border-green-400 cursor-default">
                 <span className="material-symbols-outlined text-sm">verified_user</span>
                 {/* REMOVED 'uppercase' CLASS HERE */}
                 <span className="text-[10px] font-bold tracking-widest">
                    {config.adminSettings?.customDisplayName 
                        ? `Hola ${config.adminSettings.customDisplayName}` 
                        : "Hola Admin"}
                 </span>
              </div>
              
              {/* Notification Bell - Opens Reservations (priority) or Inbox */}
              <button 
                onClick={() => onOpenAdminPanel('reservations')}
                className="relative group bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-colors border border-white/10"
                title="Notificacions"
              >
                 <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${totalUnread > 0 ? 'text-primary animate-pulse' : 'text-gray-400'}`}>
                    notifications
                 </span>
                 {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 border border-white text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                 )}
              </button>
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
                   {/* CHANGED ICON HERE FROM ARROW_FORWARD TO RESTAURANT_MENU */}
                   <span className="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">restaurant_menu</span>
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
                 
                 {/* Dynamic Extra Menus Links in Navbar Dropdown (Optional but nice) */}
                 {(config.extraMenus || []).map((menu, idx) => (
                    <button 
                        key={menu.id}
                        onClick={() => onOpenMenu(`extra_${idx}`)} 
                        className="w-full px-6 py-4 text-left hover:bg-white/10 hover:text-primary border-t border-white/5 transition-colors flex items-center justify-between group/item"
                    >
                        {menu.title}
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">add</span>
                    </button>
                 ))}
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

          {/* Admin Panel Toggle Button - Red Styled */}
          {isAdminMode ? (
             <div className="flex items-center gap-2 ml-4">
                 <button 
                  onClick={() => onOpenAdminPanel('config')}
                  className="bg-primary hover:bg-accent text-white px-3 py-1 rounded shadow-lg transition-colors text-[10px] font-bold tracking-widest uppercase"
                >
                  Panell
                </button>
                <button 
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-500 border border-red-400/30 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase transition-colors"
                  title="Tancar Sessió"
                >
                  Sortir
                </button>
             </div>
          ) : null}
        </div>

        {/* Mobile Controls (Menu + Reservation) */}
        <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Reservation Button - Always visible but styled differently when scrolled */}
            <button 
              onClick={() => onScrollToSection('reserva')} 
              className={`uppercase tracking-widest text-[10px] font-bold px-3 py-1.5 border transition-all duration-300 ${
                  scrolled 
                    ? 'border-primary text-primary bg-transparent' 
                    : 'border-white/50 text-white bg-black/20 backdrop-blur-sm'
              }`}
            >
              {config.navbar.reserveButtonText}
            </button>

            {/* Mobile Toggle */}
            <button 
              className="text-3xl flex items-center gap-3 p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {isAdminMode && totalUnread > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
              <span className="material-symbols-outlined">menu</span>
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 text-white py-10 flex flex-col items-center gap-8 md:hidden shadow-xl border-t border-white/10 h-screen overflow-y-auto pb-20 animate-[fadeIn_0.2s_ease-out]">
          
          {/* Mobile Admin Badge */}
          {isAdminMode && (
             <div className="flex flex-col items-center gap-3 mb-2">
               <div className="flex items-center gap-1 text-green-500">
                 <span className="material-symbols-outlined text-sm">verified_user</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest">Sessió Iniciada</span>
               </div>
               {totalUnread > 0 && (
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2" onClick={() => { onOpenAdminPanel('reservations'); setMobileMenuOpen(false); }}>
                    <span className="material-symbols-outlined text-primary text-sm">notifications</span>
                    <span className="text-primary font-bold">{totalUnread} notificacions</span>
                  </div>
               )}
             </div>
          )}

          <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-white/50 text-xs tracking-widest uppercase">La Carta</span>
            <button onClick={() => { onOpenMenu('food'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Carta de Menjar</button>
            <button onClick={() => { onOpenMenu('wine'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Carta de Vins</button>
            <button onClick={() => { onOpenMenu('group'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Menú de Grup</button>
            {/* Dynamic Mobile Links */}
            {(config.extraMenus || []).map((menu, idx) => (
                <button key={menu.id} onClick={() => { onOpenMenu(`extra_${idx}`); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">{menu.title}</button>
            ))}
          </div>
          
          <div className="w-12 h-px bg-white/20"></div>
          
          <button onClick={() => { onScrollToSection('historia'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Història</button>
          <button onClick={() => { onScrollToSection('contacte'); setMobileMenuOpen(false); }} className="uppercase tracking-widest text-sm hover:text-primary">Contacte</button>
          
          {/* Reserve Button inside Menu (Duplicate for ease of access if menu is open) */}
          <button 
            onClick={() => { onScrollToSection('reserva'); setMobileMenuOpen(false); }} 
            className="border border-white/30 px-8 py-3 mt-4 hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
          >
            {config.navbar.reserveButtonText}
          </button>

          {isAdminMode && ( // Also conditional in mobile menu
             <div className="flex flex-col gap-4 mt-4 w-full px-12">
                <button onClick={() => { onOpenAdminPanel('config'); setMobileMenuOpen(false); }} className="bg-primary text-white px-4 py-2 rounded shadow-lg uppercase tracking-widest text-xs font-bold">Obrir Panell</button>
                <button onClick={() => { if(onLogout) onLogout(); setMobileMenuOpen(false); }} className="text-red-400 border border-red-400 px-4 py-2 rounded shadow-lg uppercase tracking-widest text-xs font-bold">Tancar Sessió</button>
             </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;