import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Philosophy from './components/Philosophy';
import Gastronomy from './components/Gastronomy';
import Menu from './components/Menu';
import Specialties from './components/Specialties';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import PrivacyModal from './components/PrivacyModal';
import CookiesModal from './components/CookiesModal';
import LegalModal from './components/LegalModal';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useConfig } from './context/ConfigContext';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuTab, setMenuTab] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<string>('config');
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const { config } = useConfig();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const params = new URLSearchParams(window.location.search);
      if (currentUser && params.get('admin') === 'true') { setShowAdminPanel(true); }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenMenu = (tab: string) => {
    setMenuTab(tab);
    setTimeout(() => {
      const element = document.getElementById('carta');
      if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
    }, 50);
  };

  const handleScrollToSection = (id: string) => {
    let targetId = id;
    if (id === 'reserva' && window.innerWidth < 1024) {
        const formElement = document.getElementById('formulari-reserva');
        if (formElement) { targetId = 'formulari-reserva'; }
    }
    const element = document.getElementById(targetId);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
  };

  const openAdminPanel = (tab: string = 'config') => {
    if (user) { setAdminInitialTab(tab); setShowAdminPanel(true); } else { setShowLoginModal(true); }
  };

  const handleLoginSuccess = () => { setShowLoginModal(false); setShowAdminPanel(true); };
  const handleLogout = async () => { try { await signOut(auth); setShowAdminPanel(false); } catch (error) { console.error("Error signing out", error); } };
  const handleAdminSaveSuccess = () => { setShowAdminPanel(false); setShowSuccessFeedback(true); setTimeout(() => { setShowSuccessFeedback(false); }, 3000); };

  return (
    <div className="font-sans relative overflow-x-hidden">
      <Navbar scrolled={scrolled} onOpenMenu={handleOpenMenu} onScrollToSection={handleScrollToSection} onOpenAdminPanel={openAdminPanel} isAdminMode={!!user} onLogout={handleLogout} />
      <Hero onRedirectToMenu={handleOpenMenu} />
      {config.intro?.visible !== false && <Intro />}
      {config.gastronomy?.visible !== false && <Gastronomy onRedirectToMenu={handleOpenMenu} />}
      <Menu activeTab={menuTab} onToggleTab={setMenuTab} />
      {config.specialties?.visible !== false && <Specialties />}
      {config.philosophy?.visible !== false && <Philosophy />}
      <Contact onOpenPrivacy={() => setShowPrivacyModal(true)} />
      <Footer onEnableAdmin={() => openAdminPanel('config')} onOpenPrivacy={() => setShowPrivacyModal(true)} onOpenCookies={() => setShowCookiesModal(true)} onOpenLegal={() => setShowLegalModal(true)} isLoggedIn={!!user} />
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showCookiesModal && <CookiesModal onClose={() => setShowCookiesModal(false)} />}
      {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
      {showLoginModal && ( <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} /> )}
      {showSuccessFeedback && ( <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"><div className="bg-white/90 backdrop-blur-md border-2 border-green-500 px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center gap-3 animate-[fadeIn_0.5s_ease-out] transform scale-110"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2"><span className="material-symbols-outlined text-4xl text-green-600">check_circle</span></div><h3 className="font-serif text-2xl font-bold text-gray-800">Canvis Guardats!</h3><p className="text-gray-500 text-sm font-sans">La web s'ha actualitzat correctament.</p></div></div> )}
      {showAdminPanel && user && ( <AdminPanel initialTab={adminInitialTab} onSaveSuccess={handleAdminSaveSuccess} onClose={() => setShowAdminPanel(false)} /> )}
    </div>
  );
};

export default App;