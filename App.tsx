import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Philosophy from './components/Philosophy';
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
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  // Allow string for menuTab to support 'food', 'wine', 'group' AND 'extra_0', 'extra_1', etc.
  const [menuTab, setMenuTab] = useState<string | null>(null);
  
  // Auth & Admin States
  const [user, setUser] = useState<User | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'config' | 'inbox'>('config');

  // Modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Optional: Auto open admin panel on login if URL has ?admin=true
      const params = new URLSearchParams(window.location.search);
      if (currentUser && params.get('admin') === 'true') {
         setShowAdminPanel(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenMenu = (tab: string) => {
    setMenuTab(tab);
    setTimeout(() => {
      const element = document.getElementById('carta');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Logic to open admin panel
  const openAdminPanel = (tab: 'config' | 'inbox' = 'config') => {
    if (user) {
      // If logged in, open the panel
      setAdminInitialTab(tab);
      setShowAdminPanel(true);
    } else {
      // If not logged in, show login modal
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setShowAdminPanel(true); // Auto open panel after successful login
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowAdminPanel(false);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div className="font-sans relative overflow-x-hidden">
      <Navbar 
        scrolled={scrolled} 
        onOpenMenu={handleOpenMenu} 
        onScrollToSection={handleScrollToSection}
        onOpenAdminPanel={openAdminPanel} 
        isAdminMode={!!user} // Pass boolean if user is logged in
        onLogout={handleLogout}
      />
      <Hero onRedirectToMenu={handleOpenMenu} />
      <Intro />
      <Menu activeTab={menuTab} onToggleTab={setMenuTab} />
      <Specialties />
      <Philosophy />
      <Contact onOpenPrivacy={() => setShowPrivacyModal(true)} />
      <Footer 
        onEnableAdmin={() => openAdminPanel('config')} 
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenCookies={() => setShowCookiesModal(true)}
        onOpenLegal={() => setShowLegalModal(true)}
        isLoggedIn={!!user}
      />

      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showCookiesModal && <CookiesModal onClose={() => setShowCookiesModal(false)} />}
      {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {showAdminPanel && user && (
        <AdminPanel 
            initialTab={adminInitialTab}
            onSaveAndClose={() => setShowAdminPanel(false)} 
            onClose={() => setShowAdminPanel(false)} 
        />
      )}
    </div>
  );
};

export default App;