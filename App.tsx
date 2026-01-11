import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Philosophy from './components/Philosophy';
import Menu from './components/Menu';
import Specialties from './components/Specialties';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import PrivacyModal from './components/PrivacyModal';
import CookiesModal from './components/CookiesModal';
import LegalModal from './components/LegalModal';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuTab, setMenuTab] = useState<'food' | 'wine' | 'group' | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); 
  const [isAdminMode, setIsAdminMode] = useState(false);
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

  // Check for admin query parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  const handleOpenMenu = (tab: 'food' | 'wine' | 'group') => {
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

  const toggleAdminPanel = () => {
    if (isAdminMode) {
      setShowAdminPanel(prev => !prev);
    }
  };

  const enableAdminMode = () => {
    setIsAdminMode(true);
    setShowAdminPanel(true);
  };

  return (
    <div className="font-sans relative overflow-x-hidden">
      <Navbar 
        scrolled={scrolled} 
        onOpenMenu={handleOpenMenu} 
        onScrollToSection={handleScrollToSection}
        onToggleAdminPanel={toggleAdminPanel} 
        isAdminMode={isAdminMode} 
      />
      <Hero />
      <Intro />
      <Menu activeTab={menuTab} onToggleTab={setMenuTab} />
      <Specialties />
      <Philosophy />
      <Contact onOpenPrivacy={() => setShowPrivacyModal(true)} />
      <Footer 
        onEnableAdmin={enableAdminMode} 
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenCookies={() => setShowCookiesModal(true)}
        onOpenLegal={() => setShowLegalModal(true)}
      />

      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showCookiesModal && <CookiesModal onClose={() => setShowCookiesModal(false)} />}
      {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
      
      {showAdminPanel && isAdminMode && (
        <AdminPanel onSaveAndClose={toggleAdminPanel} onClose={toggleAdminPanel} />
      )}
    </div>
  );
};

export default App;