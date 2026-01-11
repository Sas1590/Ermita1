import React from 'react';

interface FooterProps {
  onEnableAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ onEnableAdmin }) => {
  return (
    <footer className="bg-black text-white/40 py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif italic text-lg text-white/60 mb-2">Ermita Paret Delgada</p>
          <p>© 2023 Tots els drets reservats.</p>
        </div>
        
        <div className="flex gap-8 uppercase font-bold items-center flex-wrap justify-center">
          <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          <a href="#" className="hover:text-primary transition-colors">Avís Legal</a>
          <a href="#" className="hover:text-primary transition-colors">Privacitat</a>
          
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