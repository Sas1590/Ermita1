import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

// Subcomponente inteligente ultra-robusto para imágenes
const SmartBackgroundImage: React.FC<{ src: string; isActive: boolean; index: number }> = ({ src, isActive, index }) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [attemptIndex, setAttemptIndex] = useState(0);

  // Lista de extensiones a probar si falla o si no tiene extensión
  const extensionsToTry = ['.jpg', '.png', '.webp', '.jpeg'];

  useEffect(() => {
    // Si la imagen ya tiene extensión completa (ej: http... o /img/foto.jpg), usarla tal cual primero.
    // Si no tiene extensión (ej: /slides/slide1), empezar a probar extensiones.
    const hasExtension = src.match(/\.[0-9a-z]+$/i);
    
    if (hasExtension) {
      setCurrentSrc(src);
      setAttemptIndex(0);
    } else {
      // Si no tiene extensión, probamos la primera de la lista
      setCurrentSrc(`${src}${extensionsToTry[0]}`);
      setAttemptIndex(0);
    }
  }, [src]);

  const handleError = () => {
    // Si falla la carga, intentamos la siguiente extensión
    const nextAttempt = attemptIndex + 1;
    
    // Si la fuente original tenía extensión, intentamos hacer swap inteligente
    const hasOriginalExtension = src.match(/\.[0-9a-z]+$/i);

    if (hasOriginalExtension) {
        // Lógica simple de swap para paths completos
        if (currentSrc?.toLowerCase().endsWith('.jpg')) {
            setCurrentSrc(currentSrc.replace(/.jpg$/i, '.png'));
        } else if (currentSrc?.toLowerCase().endsWith('.png')) {
             // Stop trying, we assume jpg/png are the only main ones for simple swaps
        }
        return;
    }

    // Si estamos probando extensiones manualmente
    if (nextAttempt < extensionsToTry.length) {
      setCurrentSrc(`${src}${extensionsToTry[nextAttempt]}`);
      setAttemptIndex(nextAttempt);
    }
  };

  if (!currentSrc) return null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img 
        src={currentSrc} 
        alt="" 
        onError={handleError}
        className="w-full h-full object-cover brightness-[0.4]"
        loading="lazy"
      />
    </div>
  );
};

const Hero: React.FC = () => {
  const { config, isLoading } = useConfig(); 
  const backgroundImages = config.hero.backgroundImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [backgroundImages]);

  return (
    <header id="reserva" className="relative min-h-screen flex items-center justify-center pt-20 pb-20 lg:pt-0 lg:pb-0 overflow-hidden">
      
      {/* Background Slider */}
      <div className="absolute inset-0 z-0 bg-[#1d1a15]">
        {backgroundImages.map((image, index) => (
          <SmartBackgroundImage 
            key={`${image}-${index}`} 
            src={image} 
            index={index} 
            isActive={index === currentImageIndex} 
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d1a15] via-transparent to-black/30 z-10"></div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div className="lg:col-span-7 text-white flex flex-col items-center lg:items-start mt-12 lg:mt-0">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center lg:items-start mb-8 transition-transform duration-700 w-full min-h-[200px] justify-center lg:justify-start">
             
             {isLoading ? (
               <div className="w-[200px] h-[200px] flex items-center justify-center">
                 <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin"></div>
               </div>
             ) : (
                <div className="animate-fade-in-slow">
                  {config.brand?.logoUrl ? (
                      <img 
                        src={config.brand.logoUrl} 
                        alt="Ermita Paret Delgada" 
                        className="w-full max-w-[550px] md:max-w-[900px] h-auto object-contain mb-8 drop-shadow-2xl"
                      />
                  ) : (
                      <div className="mb-4 text-white opacity-90">
                          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg mx-auto lg:mx-0">
                            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="4" />
                            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
                            <path d="M70 60 V 120 Q 70 140 100 140 V 170" stroke="white" strokeWidth="6" strokeLinecap="round" />
                            <path d="M55 60 V 90 Q 55 110 70 110" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <path d="M85 60 V 90 Q 85 110 70 110" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <path d="M130 60 V 140 Q 130 170 100 170" stroke="white" strokeWidth="6" strokeLinecap="round" />
                            <path d="M130 60 Q 110 60 110 100 V 140" stroke="white" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                          <div className="text-center mt-4">
                              <h1 className="font-hand text-6xl md:text-8xl leading-none text-shadow-lg">
                              Ermita <span className="block text-4xl md:text-5xl mt-2">Paret Delgada</span>
                              </h1>
                          </div>
                      </div>
                  )}
                </div>
             )}
          </div>

          <p className="font-sans font-light text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed text-center lg:text-left mt-4 animate-fade-in-slow" style={{ animationDelay: '0.3s' }}>
            Una experiència gastronòmica que uneix tradició i modernitat en un entorn històric inoblidable.
          </p>

          {/* Schedule Display */}
          <div className="mt-8 flex flex-col items-center lg:items-start animate-fade-in-slow" style={{ animationDelay: '0.5s' }}>
             <div className="h-px w-24 bg-primary/40 mb-4"></div>
             <p className="font-serif italic text-xl md:text-2xl text-primary tracking-wide text-shadow-lg text-center lg:text-left">
               {config.contact.schedule}
             </p>
          </div>
        </div>

        {/* Right Content - Sticky Note Reservation Form */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-1000 animate-fade-in-slow" style={{ animationDelay: '0.6s' }}>
          <div className="relative w-full max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
            
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-700 rounded-full shadow-md z-20 border-2 border-red-900"></div>

            <div className="bg-paper bg-paper-texture p-8 shadow-paper relative">
              <div className="absolute bottom-0 right-0 border-t-[30px] border-r-[30px] border-t-black/5 border-r-transparent pointer-events-none"></div>

              <div className="text-center mb-6">
                <h2 className="font-hand text-4xl font-bold text-secondary mb-1">{config.hero.reservationFormTitle}</h2>
                <p className="font-marker text-gray-500 text-lg">{config.hero.reservationFormSubtitle}</p>
              </div>

              <form className="space-y-4 font-marker text-lg text-secondary">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1 font-sans">Nom:</label>
                    <input type="text" placeholder="Pere..." className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1 font-sans">Telèfon:</label>
                    <input type="tel" placeholder="6..." className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1 font-sans">Dia i hora:</label>
                    <input type="datetime-local" className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400 text-gray-600 font-sans text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1 font-sans">Gent:</label>
                    <select className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full text-secondary">
                      <option>2 pers.</option>
                      <option>3 pers.</option>
                      <option>4 pers.</option>
                      <option>+5 pers.</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1 font-sans">Notes:</label>
                    <input type="text" placeholder="Algèrgies, terrassa..." className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="privacy" className="accent-olive" />
                  <label htmlFor="privacy" className="text-sm font-hand text-gray-600">Sí, accepto la privacitat.</label>
                </div>

                <div className="border-t border-dashed border-gray-400 my-4"></div>

                <div className="flex justify-between items-end mb-4">
                   <div className="text-sm font-sans text-gray-500">O truca'ns:</div>
                   <div className="font-bold font-hand text-xl">{config.hero.reservationPhoneNumber}</div>
                </div>

                <button type="button" className="w-full bg-[#4a403a] hover:bg-[#3a302a] text-white font-marker text-2xl py-2 shadow-md transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                  {config.hero.reservationButtonText}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <div className="absolute -bottom-6 -left-6 bg-yellow-200 p-3 shadow-md transform -rotate-6 w-32 text-center font-hand font-bold text-accent">
                {config.hero.stickyNoteText}
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center animate-bounce z-20">
        <span className="text-[10px] tracking-widest uppercase mb-2">Scroll</span>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </div>
    </header>
  );
};

export default Hero;