import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

const Philosophy: React.FC = () => {
  const { config } = useConfig();
  
  // Get images array for Historic section (Right Column)
  const historicImages = config.philosophy.historicImages?.filter(url => url && url.trim() !== '') || [];
  
  // Get images array for Product section (Left Column)
  const productImages = config.philosophy.productImages?.filter(url => url && url.trim() !== '') || [];
  
  // Slider Logic for Historic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Slider Logic for Product
  const [currentProductImageIndex, setCurrentProductImageIndex] = useState(0);

  // Effect for Historic Images Slider
  useEffect(() => {
    if (historicImages.length > 1) {
        const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % historicImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }
  }, [historicImages]);

  // Effect for Product Images Slider
  useEffect(() => {
    if (productImages.length > 1) {
        const interval = setInterval(() => {
        setCurrentProductImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
        }, 5000); 
        return () => clearInterval(interval);
    }
  }, [productImages]);

  // Fallbacks
  const fallbackHistoricImage = "https://images.unsplash.com/photo-1582298539230-22c6081d5821?q=80&w=2574&auto=format&fit=crop";
  const displayHistoricImages = historicImages.length > 0 ? historicImages : [fallbackHistoricImage];

  const fallbackProductImage = "https://images.unsplash.com/photo-1541457523724-95f54f7740cc?q=80&w=2070&auto=format&fit=crop";
  const displayProductImages = productImages.length > 0 ? productImages : [fallbackProductImage];

  return (
    // UPDATED PADDING: pt-12 (top reduced significantly), pb-24 (bottom remains standard)
    <section id="historia" className="bg-[#1d1a15] bg-dark-texture pt-12 pb-24 md:pb-32 relative overflow-hidden scroll-mt-24">
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
          
          {/* Left Column: Product Image & Slider */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            
            {/* Image Card Container */}
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-primary/20 transform rotate-3 rounded-sm shadow-xl transition-transform duration-500 group-hover:rotate-1 border border-white/5"></div>
              
              {/* Product Slider Container */}
              <div className="relative h-[450px] w-full bg-black overflow-hidden rounded-sm shadow-lg flex items-center justify-center border border-white/10 group">
                 
                 {/* Images Mapping */}
                 {displayProductImages.map((src, index) => (
                    <img 
                        key={index}
                        src={src} 
                        alt={`Producte Proximitat ${index}`} 
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out
                            ${index === currentProductImageIndex ? 'opacity-80 scale-110' : 'opacity-0 scale-100'}
                        `}
                    />
                 ))}

                 {/* Floating Paper Note (Static on top of slider) */}
                 <div className="absolute top-8 right-8 bg-[#2c241b] border border-white/20 p-4 max-w-[150px] shadow-card transform -rotate-3 text-center z-10">
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

          {/* Right Column: Historic Image Slider */}
          <div className="lg:col-span-7 relative mt-12 lg:mt-0">
             
             {/* Main Historic Image Container */}
             <div className="relative h-[500px] w-full shadow-2xl overflow-hidden rounded-sm group border border-white/10 bg-black">
               
               {/* Slider Implementation */}
               {displayHistoricImages.map((src, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? 'opacity-80' : 'opacity-0'
                    }`}
                  >
                      <img 
                        src={src} 
                        alt={`Ermita Paret Delgada Història ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-[5000ms] ease-linear scale-100 group-hover:scale-105"
                        style={{ transform: index === currentImageIndex ? 'scale(1.05)' : 'scale(1)' }}
                      />
                  </div>
               ))}
               
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 pointer-events-none"></div>
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