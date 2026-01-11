import React from 'react';
import { useConfig } from '../context/ConfigContext';

const Philosophy: React.FC = () => {
  const { config } = useConfig();

  return (
    <section id="historia" className="bg-[#1d1a15] bg-dark-texture py-24 md:py-32 relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="font-hand text-3xl text-primary italic mb-2 block decoration-primary underline decoration-2 underline-offset-4">
              {config.philosophy.sectionTitle}
            </span>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight">
              {config.philosophy.titleLine1} <br/>
              <span className="italic font-serif text-primary opacity-80">{config.philosophy.titleLine2}</span>
            </h2>
          </div>
          <div className="max-w-xs text-right hidden md:block">
            <p className="font-sans text-sm text-gray-400 italic">
              {config.philosophy.description}
            </p>
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Product Image (Editable) */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            
            {/* Image Card */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-primary/20 transform rotate-3 rounded-sm shadow-xl transition-transform duration-500 group-hover:rotate-1 border border-white/5"></div>
              <div className="relative h-[450px] w-full bg-black overflow-hidden rounded-sm shadow-lg flex items-center justify-center border border-white/10">
                 <img 
                   src={config.philosophy.productImageUrl} 
                   alt={config.philosophy.productTitle} 
                   className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay hover:scale-110 transition-transform duration-700"
                 />
                 {/* Floating Paper Note */}
                 <div className="absolute top-8 right-8 bg-[#2c241b] border border-white/20 p-4 max-w-[150px] shadow-card transform -rotate-3 text-center">
                    <span className="font-hand text-xl text-primary leading-none">
                      {config.philosophy.cardTag}
                    </span>
                    <div className="w-8 h-8 bg-black/50 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 shadow-inner border border-white/10"></div>
                 </div>
              </div>
            </div>

            {/* Product Text */}
            <div className="pl-4 border-l-4 border-primary/30">
              <h3 className="font-serif text-3xl font-bold text-white mb-3">
                {config.philosophy.productTitle}
              </h3>
              <p className="font-sans text-gray-400 leading-relaxed mb-4">
                {config.philosophy.productDescription}
              </p>
              <a href="#carta" className="inline-flex items-center gap-2 font-bold text-primary uppercase tracking-widest text-xs hover:text-white transition-colors decoration-2 underline-offset-4">
                Veure la nostra carta
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </a>
            </div>

          </div>

          {/* Right Column: Historic Image (Editable) */}
          <div className="lg:col-span-7 relative mt-12 lg:mt-0">
             
             {/* Main Historic Image */}
             <div className="relative h-[500px] w-full shadow-2xl overflow-hidden rounded-sm group border border-white/10">
               <img 
                 src={config.philosophy.historicImageUrl} 
                 alt={config.philosophy.historicTitle} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
             </div>

             {/* Overlapping Content Box */}
             <div className="bg-[#2c241b] p-8 md:p-10 shadow-card max-w-md absolute -bottom-16 -left-4 lg:-left-12 z-20 rounded-sm border border-white/10">
                <h3 className="font-serif text-3xl font-bold text-white mb-4">
                  {config.philosophy.historicTitle}
                </h3>
                <p className="font-sans text-gray-400 mb-6 text-sm leading-relaxed">
                  {config.philosophy.historicDescription}
                </p>
                
                <a 
                   href={config.philosophy.historicLinkUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 group/btn cursor-pointer"
                >
                   <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center transition-transform group-hover/btn:scale-110">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                   </div>
                   <span className="font-hand text-xl text-primary group-hover/btn:text-white transition-colors">
                     Descobreix el passat
                   </span>
                </a>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Philosophy;