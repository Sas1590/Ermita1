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

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuTab, setMenuTab] = useState<'food' | 'wine' | 'group' | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); 
  const [isAdminMode, setIsAdminMode] = useState(false); // New state to track admin mode

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
    if (isAdminMode) { // Only allow toggling if in admin mode
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
        isAdminMode={isAdminMode} // Pass admin mode status to Navbar
      />
      <Hero />
      <Intro />
      <Menu activeTab={menuTab} onToggleTab={setMenuTab} />
      <Specialties />
      <Philosophy />
      <Contact />
      <Footer onEnableAdmin={enableAdminMode} />

      {showAdminPanel && isAdminMode && <AdminPanel onSaveAndClose={toggleAdminPanel} onClose={toggleAdminPanel} />}
    </div>
  );
};

export default App;