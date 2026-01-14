import React from 'react';
import { useConfig } from '../context/ConfigContext';

interface GastronomyProps {
    onRedirectToMenu: (tab: string) => void;
}

const Gastronomy: React.FC<GastronomyProps> = ({ onRedirectToMenu }) => {
    const { config } = useConfig();
    const { gastronomy } = config;

    if (gastronomy?.visible === false) return null;

    return (
        <section className="bg-[#1d1a15] bg-dark-texture py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="font-sans text-xs md:text-sm tracking-[0.2em] text-[#D0BB95] uppercase block">
                        {gastronomy.topTitle}
                    </span>
                    <h2 className="font-serif italic text-5xl md:text-7xl text-white font-medium">
                        {gastronomy.mainTitle}
                    </h2>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        {gastronomy.description}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    
                    {/* Card 1: Daily Menu */}
                    <div className="relative group h-[500px] overflow-hidden rounded-sm shadow-2xl cursor-pointer bg-black" onClick={() => onRedirectToMenu(gastronomy.card1.targetTab)}>
                        <img 
                            src={gastronomy.card1.image} 
                            alt={gastronomy.card1.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                        
                        <div className="absolute inset-0 p-10 flex flex-col justify-between">
                            <div className="border-l-2 border-primary pl-6 py-2">
                                <h3 className="font-serif text-4xl text-white font-medium mb-2">{gastronomy.card1.title}</h3>
                                <p className="font-sans text-xs tracking-widest text-gray-300 uppercase">{gastronomy.card1.subtitle}</p>
                            </div>
                            
                            <div>
                                <p className="font-serif italic text-2xl text-white/90 mb-8">{gastronomy.card1.footerText}</p>
                                <button className="border border-white/30 hover:bg-primary hover:border-primary hover:text-black text-white px-8 py-3 text-xs tracking-widest uppercase transition-colors duration-300">
                                    {gastronomy.card1.buttonText}
                                </button>
                            </div>

                            <span className="absolute bottom-10 right-10 font-serif italic text-6xl text-primary font-bold">
                                {gastronomy.card1.price}
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Full Menu */}
                    <div className="relative group h-[500px] overflow-hidden rounded-sm shadow-2xl cursor-pointer bg-black" onClick={() => onRedirectToMenu(gastronomy.card2.targetTab)}>
                        <img 
                            src={gastronomy.card2.image} 
                            alt={gastronomy.card2.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                        
                        <div className="absolute inset-0 p-10 flex flex-col justify-between">
                            <div className="border-l-2 border-white pl-6 py-2">
                                <h3 className="font-serif text-4xl text-white font-medium mb-2">{gastronomy.card2.title}</h3>
                                <p className="font-sans text-xs tracking-widest text-gray-300 uppercase">{gastronomy.card2.subtitle}</p>
                            </div>
                            
                            <div>
                                <p className="font-serif italic text-2xl text-white/90 mb-8 max-w-sm leading-snug">
                                    {gastronomy.card2.description}
                                </p>
                                <button className="bg-white text-black hover:bg-primary px-8 py-3 text-xs tracking-widest uppercase transition-colors duration-300 font-bold">
                                    {gastronomy.card2.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Links */}
                <div className="flex flex-col items-center">
                    <span className="text-[#8b5a2b] text-[10px] uppercase tracking-[0.25em] font-bold mb-6 block">
                        {gastronomy.footerTitle}
                    </span>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {gastronomy.footerLinks.map((link, idx) => (
                            <button 
                                key={idx}
                                onClick={() => onRedirectToMenu(link.targetTab)}
                                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                            >
                                <span className="material-symbols-outlined text-xl text-primary group-hover:scale-110 transition-transform">{link.icon}</span>
                                <span className="font-serif italic text-lg decoration-primary decoration-1 underline-offset-4 group-hover:underline">
                                    {link.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Gastronomy;