import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';

interface HeroProps {
    onRedirectToMenu?: (tab: string) => void;
}

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
      } ${blur ? 'blur-[1px] brightness-[0.7]' : 'blur-0 brightness-100'}`}
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
    const [viewMode, setViewMode] = useState<'date' | 'time'>('date'); 
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
        } else {
            // Reset internal state if value is cleared externally
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setViewMode('date');
        }
    }, [value]);

    // Reset view to date when opening
    useEffect(() => {
        if (isOpen) {
             if (!selectedDate) {
                 setViewMode('date');
             } else {
                 setViewMode('date'); // Always start at date for context
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
        return day === 0 ? 6 : day - 1;
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTimeSlot(null); 
        setViewMode('time'); 
    };

    const handleTimeClick = (time: string) => {
        setSelectedTimeSlot(time);
        if (selectedDate) {
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
                                        className={`py-2 px-1 rounded border transition-colors font-hand text-xl font-bold tracking-wide
                                            ${selectedTimeSlot === time 
                                                ? 'bg-primary text-white border-primary shadow-sm' 
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


const Hero: React.FC<HeroProps> = ({ onRedirectToMenu }) => {
  const { config, isLoading } = useConfig(); 
  const backgroundImages = config.hero.backgroundImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // --- RESERVATION STATE ---
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      pax: '', // Default to empty string to encourage typing
      notes: '',
      privacy: false
  });
  const [dateTime, setDateTime] = useState("");
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Validation State
  const [phoneError, setPhoneError] = useState('');
  const [privacyError, setPrivacyError] = useState(false);

  // Group Warning Modal State
  const [showGroupWarning, setShowGroupWarning] = useState(false);

  // Check if reservation form should be visible
  const isFormVisible = config.hero?.reservationVisible !== false;

  // Construct dynamic error message from config
  const dynamicErrorMsg = `${config.hero.reservationErrorMessage} ${config.hero.reservationTimeStart} a ${config.hero.reservationTimeEnd}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // Phone Validation Logic
      if (name === 'phone') {
          // Check if contains letters
          const hasLetters = /[a-zA-Z]/.test(value);
          if (hasLetters) {
              setPhoneError("Si us plau, introdueix només números.");
          } else {
              setPhoneError("");
          }
      }

      // PAX Logic check (Group Menu Warning) - UPDATED TO INCLUDE 10 (>= 10)
      if (name === 'pax') {
          const num = parseInt(value, 10);
          // Check immediately if number is valid and greater than or equal to 10
          if (!isNaN(num) && num >= 10) {
              setShowGroupWarning(true);
          }
      }

      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, privacy: e.target.checked }));
      if (e.target.checked) setPrivacyError(false); // Clear error when checked
  };

  const handleGroupRedirect = (shouldRedirect: boolean) => {
      setShowGroupWarning(false);
      if (shouldRedirect && onRedirectToMenu) {
          onRedirectToMenu('group');
      }
      // If no redirect (clicked No), user stays on form with the number they typed.
  };

  const handleSubmit = async () => {
      // Basic Validation
      if (!formData.name || !formData.phone || !dateTime || !formData.pax) {
          alert("Si us plau, omple el nom, telèfon, persones i data de reserva.");
          return;
      }
      
      // Strict Phone Validation before submit
      const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
      if (/[a-zA-Z]/.test(formData.phone) || digitsOnly.length < 6) {
          setPhoneError("El telèfon no sembla correcte (mínim 6 dígits).");
          alert("El número de telèfon no sembla correcte. Si us plau, revisa'l abans de reservar.");
          return;
      }

      // Privacy Validation - Visual Error, no alert
      if (!formData.privacy) {
          setPrivacyError(true);
          return;
      }

      setFormStatus('loading');

      try {
          const reservationsRef = ref(db, 'reservations');
          
          // Split Date and Time for cleaner storage
          // dateTime format from picker is YYYY-MM-DDTHH:mm
          const [datePart, timePart] = dateTime.split('T');

          await push(reservationsRef, {
              ...formData,
              date: datePart, // YYYY-MM-DD
              time: timePart, // HH:mm
              dateTimeIso: dateTime, // Keep ISO just in case
              createdAt: Date.now(),
              status: 'pending' // pending, confirmed, cancelled
          });

          setFormStatus('success');
          // No automatic timeout anymore. User must close it manually.
          // We reset form data here so if they reopen or click 'Make another', it's clean.
          setFormData({ name: '', phone: '', pax: '', notes: '', privacy: false });
          setDateTime("");
          setPhoneError("");
          setPrivacyError(false);

      } catch (error) {
          console.error("Error saving reservation:", error);
          setFormStatus('error');
      }
  };

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
      
      {/* CSS to hide input number spinners */}
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

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

      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Content - Dynamic Size if Form is hidden */}
        <div className={`text-white flex flex-col items-center mt-12 lg:mt-0 transition-all duration-500
            ${isFormVisible 
                ? 'lg:col-span-7 lg:items-start' 
                : 'lg:col-span-12 items-center text-center'
            }
        `}>
          
          {/* Logo Section */}
          <div className={`flex flex-col items-center mb-8 transition-transform duration-700 w-full min-h-[200px] 
              ${isFormVisible ? 'lg:justify-start lg:items-start' : 'justify-center'}
          `}>
             
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
                        className={`w-full max-w-[550px] md:max-w-[900px] h-auto object-contain mb-8 drop-shadow-2xl transition-all duration-500 ${!isFormVisible ? 'scale-110' : ''}`}
                      />
                  ) : (
                      <div className="mb-4 text-white opacity-90">
                          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-lg mx-auto ${isFormVisible ? 'lg:mx-0' : ''}`}>
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

          <p className={`font-sans font-light text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed mt-4 animate-fade-in-slow 
                ${isFormVisible ? 'text-center lg:text-left' : 'text-center mx-auto'}
          `} style={{ animationDelay: '0.3s' }}>
            Una experiència gastronòmica que uneix tradició i modernitat en un entorn històric inoblidable.
          </p>

          {/* Schedule Display */}
          <div className={`mt-8 flex flex-col items-center animate-fade-in-slow ${isFormVisible ? 'lg:items-start' : ''}`} style={{ animationDelay: '0.5s' }}>
             <div className="h-px w-24 bg-primary/40 mb-4"></div>
             <p className={`font-serif italic text-xl md:text-2xl text-primary tracking-wide text-shadow-lg text-center ${isFormVisible ? 'lg:text-left' : ''}`}>
               {config.contact.schedule}
             </p>
          </div>
        </div>

        {/* Right Content - Sticky Note Reservation Form - CONDITIONALLY RENDERED */}
        {isFormVisible && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end perspective-1000 animate-fade-in-slow" style={{ animationDelay: '0.6s' }}>
            <div className="relative w-full max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
                
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-700 rounded-full shadow-md z-20 border-2 border-red-900"></div>

                <div className="bg-paper bg-paper-texture p-8 shadow-paper relative">
                <div className="absolute bottom-0 right-0 border-t-[30px] border-r-[30px] border-t-black/5 border-r-transparent pointer-events-none"></div>

                {formStatus === 'success' ? (
                    <div className="text-center py-10 animate-[fadeIn_0.5s_ease-out]">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                            <span className="material-symbols-outlined text-4xl text-green-600">check</span>
                        </div>
                        <h3 className="font-hand text-3xl font-bold text-secondary mb-2">Reserva Enviada!</h3>
                        <p className="font-sans text-gray-600 mb-6 leading-relaxed">Gràcies {formData.name}, hem rebut la teva sol·licitud. Ens posarem en contacte aviat.</p>
                        
                        <div className="flex flex-col items-center gap-3">
                            {/* UPDATED BUTTON: CLEANER, CORPORATE BROWN */}
                            <button 
                                onClick={() => setFormStatus('idle')}
                                className="px-8 py-3 bg-[#8b5a2b] hover:bg-[#6b4521] text-white font-sans font-bold text-sm uppercase tracking-widest rounded shadow-md transition-all transform hover:-translate-y-0.5"
                            >
                                Tancar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                    <div className="text-center mb-6">
                        <h2 className="font-hand text-4xl font-bold text-secondary mb-1">{config.hero.reservationFormTitle}</h2>
                        <p className="font-marker text-gray-500 text-lg">{config.hero.reservationFormSubtitle}</p>
                    </div>

                    <form className="space-y-4 font-marker text-lg text-secondary">
                        <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1 font-sans">{config.hero.formNameLabel}</label>
                            <input 
                                type="text" 
                                name="name"
                                maxLength={40} // Limit added
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Pere..." 
                                className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400" 
                            />
                        </div>
                        <div className="flex flex-col relative">
                            <label className="text-sm text-gray-500 mb-1 font-sans">{config.hero.formPhoneLabel}</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="6..." 
                                className={`bg-white/50 border-b-2 outline-none px-2 py-1 w-full placeholder-gray-400 transition-colors ${phoneError ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 focus:border-accent'}`} 
                            />
                            {/* Mensaje de error flotante */}
                            {phoneError && (
                                <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-sans font-bold leading-tight bg-white/90 px-1 rounded">
                                    {phoneError}
                                </span>
                            )}
                        </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-40">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1 font-sans">{config.hero.formDateLabel}</label>
                            {/* CUSTOM DATE PICKER IMPLEMENTATION */}
                            <CustomDateTimePicker 
                                value={dateTime}
                                onChange={setDateTime}
                                configStart={config.hero.reservationTimeStart}
                                configEnd={config.hero.reservationTimeEnd}
                                configInterval={config.hero.reservationTimeInterval}
                                errorMsg={dynamicErrorMsg}
                            />
                        </div>
                        
                        {/* --- MODIFIED PAX INPUT (Gent + Handwritten Style) --- */}
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1 font-sans">{config.hero.formPaxLabel}</label>
                            <input 
                                type="number" 
                                name="pax"
                                min="1"
                                max="50"
                                placeholder="2"
                                value={formData.pax}
                                onChange={handleInputChange}
                                // Applied same styling as phone input (font-marker, bg, border, padding)
                                className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400 font-marker text-lg"
                            />
                        </div>
                        </div>

                        <div className="flex flex-col relative z-0">
                            <label className="text-sm text-gray-500 mb-1 font-sans">{config.hero.formNotesLabel}</label>
                            <input 
                                type="text" 
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Algèrgies, terrassa..." 
                                className="bg-white/50 border-b-2 border-gray-300 focus:border-accent outline-none px-2 py-1 w-full placeholder-gray-400" 
                            />
                        </div>

                        {/* PRIVACY SECTION WITH ERROR VALIDATION */}
                        <div className="flex flex-col pt-2">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="privacy" 
                                    checked={formData.privacy}
                                    onChange={handleCheckboxChange}
                                    className="accent-olive h-4 w-4" 
                                />
                                <label htmlFor="privacy" className={`text-sm font-hand ${privacyError ? 'text-red-500 font-bold' : 'text-gray-600'}`}>{config.hero.formPrivacyLabel}</label>
                            </div>
                            {/* Visual Error Message */}
                            {privacyError && (
                                <p className="text-red-500 text-xs font-sans pl-6 mt-1 animate-pulse font-bold">Has d'acceptar la política de privacitat.</p>
                            )}
                        </div>

                        <div className="border-t border-dashed border-gray-400 my-4"></div>

                        <div className="flex flex-col items-center justify-center mb-6">
                            <span className="text-sm font-sans text-gray-500 mb-1">{config.hero.formCallUsLabel}</span>
                            <a 
                                href={`tel:${config.hero.reservationPhoneNumber.replace(/\s+/g, '')}`}
                                className="font-bold font-hand text-4xl text-secondary hover:text-accent transition-colors leading-none"
                            >
                                {config.hero.reservationPhoneNumber.replace(/^\+34\s?/, '')}
                            </a>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            disabled={formStatus === 'loading'}
                            className={`w-full bg-[#4a403a] hover:bg-[#3a302a] text-white font-marker text-2xl py-2 shadow-md transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 ${formStatus === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                        >
                        {formStatus === 'loading' ? 'Enviant...' : config.hero.reservationButtonText}
                        {formStatus !== 'loading' && <span className="material-symbols-outlined">arrow_forward</span>}
                        </button>
                        {formStatus === 'error' && <p className="text-red-500 text-center text-sm font-sans">Error enviant. Truca'ns!</p>}
                    </form>
                    </>
                )}

                {config.hero.stickyNoteText && config.hero.stickyNoteText.trim() !== '' && (
                    <div className="absolute -bottom-6 -left-14 bg-[#fef08a] text-[#854d0e] p-4 shadow-lg transform -rotate-6 font-hand font-bold text-xl leading-none text-center max-w-[160px] break-words whitespace-pre-line z-50">
                    {config.hero.stickyNoteText}
                    </div>
                )}

                </div>
            </div>
            </div>
        )}
      </div>
      
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center animate-bounce z-20 transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <span className="text-[10px] tracking-widest uppercase mb-2">Scroll</span>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </div>

      {/* --- GROUP MENU WARNING MODAL (High Z-Index) --- */}
      {showGroupWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGroupWarning(false)}></div>
              <div className="bg-[#fdfbf7] bg-paper-texture p-6 max-w-sm w-full rounded shadow-2xl relative z-10 border border-primary text-center transform rotate-1 animate-[fadeIn_0.2s_ease-out]">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-3xl text-primary">groups</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-secondary mb-2">10 o més persones?</h3>
                  <p className="font-sans text-gray-600 mb-6 text-sm">
                      Sembla que sou un grup gran. Potser us interessa fer un cop d'ull al nostre <strong>Menú de Grup</strong> abans de reservar.
                  </p>
                  <div className="flex gap-3 justify-center">
                      <button 
                          onClick={() => handleGroupRedirect(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
                      >
                          No, gràcies
                      </button>
                      <button 
                          onClick={() => handleGroupRedirect(true)}
                          className="px-4 py-2 bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-accent transition-colors shadow-lg"
                      >
                          Sí, veure menú
                      </button>
                  </div>
              </div>
          </div>
      )}

    </header>
  );
};

export default Hero;