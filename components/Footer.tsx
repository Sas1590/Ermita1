import React from 'react';
import { useConfig } from '../context/ConfigContext';

interface FooterProps {
  onEnableAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenCookies: () => void;
  onOpenLegal: () => void;
  isLoggedIn: boolean;
}

const Footer: React.FC<FooterProps> = ({ onEnableAdmin, onOpenPrivacy, onOpenCookies, onOpenLegal, isLoggedIn }) => {
  const { config } = useConfig();
  
  return (
    <footer className="bg-black text-white/40 py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest gap-6">
        <div className="text-center md:text-left flex flex-col gap-2">
          <div>
            <p className="font-serif italic text-lg text-white/60 mb-1">Ermita Paret Delgada</p>
            <p>© 2023 Tots els drets reservats.</p>
          </div>
          
          {/* Social Icon Mobile/Desktop */}
          <div className="md:hidden mt-2">
            <a 
              href={config.contact.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">photo_camera</span>
              <span className="font-bold">@paret_delgada</span>
            </a>
          </div>
        </div>
        
        <div className="flex gap-8 uppercase font-bold items-center flex-wrap justify-center">
          {/* Social Icon Desktop */}
          <a 
            href={config.contact.instagramUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-white/60 hover:text-primary transition-colors mr-4"
            title="Instagram"
          >
            <span className="material-symbols-outlined text-xl">photo_camera</span>
          </a>

          <button onClick={(e) => { e.preventDefault(); onOpenCookies(); }} className="hover:text-primary transition-colors">Cookies</button>
          <button onClick={(e) => { e.preventDefault(); onOpenLegal(); }} className="hover:text-primary transition-colors">Avís Legal</button>
          <button onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }} className="hover:text-primary transition-colors">Privacitat</button>
          
          <button 
            onClick={(e) => { e.preventDefault(); onEnableAdmin(); }} 
            className={`transition-colors border px-2 py-1 rounded text-[10px] ${isLoggedIn ? 'border-green-500/50 text-green-500 hover:bg-green-500/10' : 'border-white/10 hover:text-white hover:border-white/30'}`}
          >
            {isLoggedIn ? 'Panell' : 'Admin'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;