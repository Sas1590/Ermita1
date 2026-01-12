import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';

// Subcomponente inteligente ultra-robusto para imágenes
const SmartBackgroundImage: React.FC<{ src: string; isActive: boolean; index: number; blur: boolean }> = ({ src, isActive, index, blur }) => {
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
      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
        isActive ? 'opacity-100' : 'opacity-0'
      } ${blur ? 'blur-[3px] brightness-[0.4]' : 'blur-0 brightness-[0.7]'}`}
    >
      <img 
        src={currentSrc} 
        alt="" 
        onError={handleError}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

// --- CUSTOM DATE TIME PICKER ---
const CustomDateTimePicker: React.FC<{ 
    value: string; 
    onChange: (val: string) => void;
    configStart: string;
    configEnd: string;
    configInterval: number;
    errorMsg: string;
}> = ({ value, onChange, configStart, configEnd, configInterval, errorMsg }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'date' | 'time'>('date'); // NEW: Controls the view step
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initial load from value prop
    useEffect(() => {
        if (value) {
            // Value is expected to be "YYYY-MM-DDTHH:mm"
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setSelectedDate(d);
                // Format time as HH:mm
                const hours = d.getHours().toString().padStart(2, '0');
                const minutes = d.getMinutes().toString().padStart(2, '0');
                setSelectedTimeSlot(`${hours}:${minutes}`);
            }
        }
    }, []);

    // Reset view to date when opening
    useEffect(() => {
        if (isOpen) {
            if (!selectedDate) {
                setViewMode('date');
            } else {
                // If date is already selected, user might want to change time, 
                // but usually better to show date first or current selection context.
                // Let's default to date picker to allow changing date easily, 
                // or if time is set, maybe show time? Let's stick to date for consistency.
                // However, for UX, if I click to edit, I might want to see what I picked.
                // We'll default to 'date' so they can see the calendar.
                setViewMode('date'); 
            }
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helpers for Calendar
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        let day = new Date(year, month, 1).getDay();
        // Shift so Monday is index 0 (European style)
        return day === 0 ? 6 : day - 1;
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTimeSlot(null); // Reset time when date changes
        setViewMode('time'); // SWITCH TO TIME VIEW
    };

    const handleTimeClick = (time: string) => {
        setSelectedTimeSlot(time);
        if (selectedDate) {
            // Construct final ISO string for form
            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = selectedDate.getDate().toString().padStart(2, '0');
            onChange(`${year}-${month}-${day}T${time}`);
            setIsOpen(false);
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(viewDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setViewDate(newDate);
    };

    // Generate Time Slots based on Config
    const generateTimeSlots = () => {
        const slots = [];
        const [startHour, startMin] = (configStart || "13:00").split(':').map(Number);
        const [endHour, endMin] = (configEnd || "15:30").split(':').map(Number);
        
        let current = new Date();
        current.setHours(startHour, startMin, 0, 0);
        
        const end = new Date();
        end.setHours(endHour, endMin, 0, 0);

        while (current <= end) {
            const h = current.getHours().toString().padStart(2, '0');
            const m = current.getMinutes().toString().padStart(2, '0');
            slots.push(`${h}:${m}`);
            current.setMinutes(current.getMinutes() + (configInterval || 15));
        }
        return slots;
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleString('ca-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });
    };

    // Calendar Grid Gen
    const daysInMonth = getDaysInMonth(viewDate);
    const startOffset = getFirstDayOfMonth(viewDate);
    const days = [];
    for (let i = 0; i < startOffset; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const isSelected = selectedDate?.getDate() === i && selectedDate?.getMonth() === viewDate.getMonth() && selectedDate?.getFullYear() === viewDate.getFullYear();
        const isToday = new Date().getDate() === i && new Date().getMonth() === viewDate.getMonth() && new Date().getFullYear() === viewDate.getFullYear();
        
        // Disable past dates logic
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
        const isPast = checkDate.setHours(23,59,59,999) < new Date().setHours(0,0,0,0);

        days.push(
            <button 
                key={i} 
                onClick={(e) => { e.preventDefault(); !isPast && handleDateClick(i); }}
                disabled={isPast}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-sans transition-colors
                    ${isSelected ? 'bg-primary text-white font-bold' : isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary/20 text-gray-700'}
                    ${isToday && !isSelected ? 'border border-primary text-primary' : ''}
                `}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="relative" ref={wrapperRef}>
            {/* READ ONLY INPUT TRIGGER */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/50 border-b-2 border-gray-300 hover:border-accent cursor-pointer px-2 py-1 w-full text-gray-600 font-sans text-sm flex justify-between items-center"
            >
                <span>{value ? formatDateDisplay(value) : "Tria dia i hora..."}</span>
                <span className="material-symbols-outlined text-gray-400 text-lg">calendar_month</span>
            </div>

            {/* POPUP */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-[300px] sm:w-[320px] bg-[#fdfbf7] bg-paper-texture shadow-2xl rounded-sm border border-primary/30 z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    
                    {/* VIEW 1: CALENDAR */}
                    {viewMode === 'date' && (
                        <div className="animate-[fadeIn_0.2s_ease-out]">
                            {/* Header Month */}
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                <button onClick={(e) => {e.preventDefault(); navigateMonth('prev')}} className="p-1 hover:text-primary"><span className="material-symbols-outlined">chevron_left</span></button>
                                <span className="font-serif font-bold text-secondary capitalize">
                                    {viewDate.toLocaleString('ca-ES', { month: 'long', year: 'numeric' })}
                                </span>
                                <button onClick={(e) => {e.preventDefault(); navigateMonth('next')}} className="p-1 hover:text-primary"><span className="material-symbols-outlined">chevron_right</span></button>
                            </div>

                            {/* Days Header */}
                            <div className="grid grid-cols-7 mb-2 text-center">
                                {['Dl','Dt','Dc','Dj','Dv','Ds','Dg'].map(d => (
                                    <span key={d} className="text-[10px] uppercase font-bold text-gray-400">{d}</span>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-2 place-items-center">
                                {days}
                            </div>
                        </div>
                    )}

                    {/* VIEW 2: TIME SLOTS */}
                    {viewMode === 'time' && (
                        <div className="animate-[fadeIn_0.2s_ease-out]">
                            {/* Header With Back Button */}
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                                <button 
                                    onClick={(e) => { e.preventDefault(); setViewMode('date'); }}
                                    className="p-1 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                                </button>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">Dia seleccionat</span>
                                    <span className="font-serif font-bold text-secondary capitalize text-sm">
                                        {selectedDate?.toLocaleString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                            </div>

                            <h5 className="font-serif text-sm font-bold text-secondary mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                                Horaris disponibles
                            </h5>
                            
                            <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                                {generateTimeSlots().map(time => (
                                    <button
                                        key={time}
                                        onClick={(e) => { e.preventDefault(); handleTimeClick(time); }}
                                        className={`py-2 px-1 text-xs rounded border transition-colors
                                            ${selectedTimeSlot === time 
                                                ? 'bg-primary text-white border-primary font-bold shadow-sm' 
                                                : 'bg-white border-gray-200 hover:border-primary hover:text-primary text-gray-600'}
                                        `}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-center text-gray-400 mt-3 italic">
                                * {configInterval} min entre reserves.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const Hero: React.FC = () => {
  const { config, isLoading } = useConfig(); 
  const backgroundImages = config.hero.backgroundImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Form State
  const [dateTime, setDateTime] = useState("");

  // Listener para el efecto blur al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [backgroundImages]);

  return (
    <header id="reserva" className="relative min-h-screen flex items-center justify-center pt-20 pb-20 lg:pt-0 lg:pb-0 overflow-hidden">
      
      {/* Background Slider with Conditional Blur */}
      <div className="absolute inset-0 z-0 bg-[#1d1a15]">
        {backgroundImages.map((image, index) => (
          <SmartBackgroundImage 
            key={`${image}-${index}`} 
            src={image} 
            index={index} 
            isActive={index === currentImageIndex} 
            blur={!scrolled} // Si NO hemos bajado (estamos arriba), aplicamos blur
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d1a15] via-transparent to-black/30 z-10 pointer-events-none"></div>
      </div>

      <div className={`max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 transition-opacity duration-700 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
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

                <div className="grid grid-cols-2 gap-4 relative z-40">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1 font-sans">Dia i hora:</label>
                    {/* CUSTOM DATE PICKER IMPLEMENTATION */}
                    <CustomDateTimePicker 
                        value={dateTime}
                        onChange={setDateTime}
                        configStart={config.hero.reservationTimeStart}
                        configEnd={config.hero.reservationTimeEnd}
                        configInterval={config.hero.reservationTimeInterval}
                        errorMsg={config.hero.reservationErrorMessage}
                    />
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

                <div className="flex flex-col relative z-0">
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
      
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center animate-bounce z-20 transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <span className="text-[10px] tracking-widest uppercase mb-2">Scroll</span>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </div>
    </header>
  );
};

export default Hero;