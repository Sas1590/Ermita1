import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white/40 py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif italic text-lg text-white/60 mb-2">Ermita Paret Delgada</p>
          <p>© 2023 Tots els drets reservats.</p>
        </div>
        
        <div className="flex gap-8 uppercase font-bold">
          <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          <a href="#" className="hover:text-primary transition-colors">Avís Legal</a>
          <a href="#" className="hover:text-primary transition-colors">Privacitat</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;