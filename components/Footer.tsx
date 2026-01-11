import React from 'react';

interface FooterProps {
  onEnableAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenCookies: () => void;
  onOpenLegal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onEnableAdmin, onOpenPrivacy, onOpenCookies, onOpenLegal }) => {
  return (
    <footer className="bg-black text-white/40 py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif italic text-lg text-white/60 mb-2">Ermita Paret Delgada</p>
          <p>© 2023 Tots els drets reservats.</p>
        </div>
        
        <div className="flex gap-8 uppercase font-bold items-center flex-wrap justify-center">
          <button onClick={(e) => { e.preventDefault(); onOpenCookies(); }} className="hover:text-primary transition-colors">Cookies</button>
          <button onClick={(e) => { e.preventDefault(); onOpenLegal(); }} className="hover:text-primary transition-colors">Avís Legal</button>
          <button onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }} className="hover:text-primary transition-colors">Privacitat</button>
          
          <button 
            onClick={(e) => { e.preventDefault(); onEnableAdmin(); }} 
            className="hover:text-white transition-colors border border-white/10 px-2 py-1 rounded hover:border-white/30 text-[10px]"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;