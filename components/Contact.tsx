import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import emailjs from '@emailjs/browser';

interface ContactProps {
  onOpenPrivacy: () => void;
}

const Contact: React.FC<ContactProps> = ({ onOpenPrivacy }) => {
  const { config } = useConfig(); 
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy: false
  });
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Determine visibility
  const isNoteVisible = config.contact.importantNoteVisible !== false;
  const isInfoVisible = config.contact.infoVisible !== false;
  const isSocialVisible = config.contact.socialVisible !== false;
  const isFormVisible = config.contact.formVisible !== false;

  const isLeftColumnVisible = isNoteVisible || isInfoVisible || isSocialVisible;
  const isRightColumnVisible = isFormVisible;

  // If nothing is visible, hide the entire section
  if (!isLeftColumnVisible && !isRightColumnVisible) {
      return null;
  }

  // Layout Logic: Split (2 cols) vs Single (Centered)
  const isSplitLayout = isLeftColumnVisible && isRightColumnVisible;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, privacy: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacy) {
      alert("Si us plau, accepta la política de privacitat.");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.message) {
      alert("Si us plau, omple els camps obligatoris.");
      return;
    }

    setStatus('sending');

    try {
      // 1. SAVE TO FIREBASE
      const messagesRef = ref(db, 'contactMessages');
      await push(messagesRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        privacyAccepted: true, // Guardamos explícitamente que aceptó la privacidad
        timestamp: Date.now(), // Client side timestamp for immediate sorting
        read: false
      });

      // 2. SEND EMAILS VIA EMAILJS (If configured)
      const emailSettings = config.emailSettings;
      if (emailSettings && emailSettings.enabled && emailSettings.serviceId && emailSettings.templateId && emailSettings.publicKey) {
          const templateParams = {
              subject: `Nou Contacte Web - ${formData.subject || formData.name}`,
              from_name: formData.name,
              from_email: formData.email,
              phone: formData.phone,
              message: `MISSATGE DE CONTACTE (PEU DE PÀGINA)\n\n${formData.message}`,
          };

          // Admin Notification
          await emailjs.send(
              emailSettings.serviceId,
              emailSettings.templateId,
              templateParams,
              emailSettings.publicKey
          );

          // 3. AUTO REPLY (If configured)
          if (emailSettings.autoReplyTemplateId) {
              try {
                  await emailjs.send(
                      emailSettings.serviceId,
                      emailSettings.autoReplyTemplateId,
                      templateParams, // This params object has 'from_email' which EmailJS uses as recipient if configured correctly
                      emailSettings.publicKey
                  );
              } catch (clientErr) {
                  console.warn("Client auto-reply failed", clientErr);
              }
          }
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', privacy: false });
      
      // Reset status after a delay
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contacte" className="bg-[#1d1a15] bg-dark-texture py-24 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute -bottom-20 -right-20 text-white/5 pointer-events-none">
         <span className="material-symbols-outlined text-[30rem]">local_dining</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Info & Sticky Note */}
          {isLeftColumnVisible && (
            <div className={`${isSplitLayout ? 'lg:col-span-6' : 'lg:col-span-8 lg:col-start-3'} space-y-16 mt-8`}>
                
                {/* The Sticky Note */}
                {isNoteVisible && (
                    <div className={`relative max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-300 ${!isSplitLayout ? 'mx-auto' : 'mx-auto lg:mx-0'}`}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-sm z-20 border border-red-900"></div>
                        
                        <div className="bg-[#f0ece6] p-8 shadow-card rounded-sm border border-white/10">
                            <h3 className="font-hand text-red-900 text-4xl font-bold mb-4">{config.contact.importantNoteTitle}</h3>
                            <p className="font-hand text-2xl text-black leading-snug mb-4">
                                {config.contact.importantNoteMessage1}
                            </p>
                            <div className="w-full border-t border-gray-400 my-4"></div>
                            <p className="font-hand text-xl text-gray-700 leading-snug">
                                {config.contact.importantNoteMessage2}
                            </p>
                        </div>
                    </div>
                )}

                {/* Contact Info & Social Wrapper */}
                {(isInfoVisible || isSocialVisible) && (
                    <div className={`space-y-8 ${isSplitLayout ? 'pl-4' : 'text-center flex flex-col items-center'}`}>
                        
                        {isInfoVisible && (
                            <div className={`space-y-8 w-full ${!isSplitLayout ? 'flex flex-col items-center' : ''}`}>
                                {/* Section Title */}
                                <h2 className="font-serif text-5xl font-bold text-white leading-tight">{config.contact.sectionTitle}</h2>
                                
                                <div className={`flex gap-6 items-start ${!isSplitLayout ? 'text-left max-w-md' : ''}`}>
                                    <div className="w-12 h-12 bg-[#2c241b] border border-white/10 rounded-full flex items-center justify-center shadow-lg text-primary shrink-0">
                                        <span className="material-symbols-outlined text-2xl">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-xl font-bold text-primary mb-1">{config.contact.locationTitle}</h4>
                                        <p className="text-gray-400 font-light">
                                            {config.contact.addressLine1}<br/>
                                            {config.contact.addressLine2}
                                        </p>
                                        <p className="text-primary/70 text-sm mt-2 italic">{config.contact.schedule}</p>
                                        
                                        <a 
                                            href={config.contact.mapUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 text-white border-b border-primary/50 pb-1 hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold group"
                                        >
                                            {config.contact.directionsButtonText}
                                            <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">near_me</span>
                                        </a>
                                    </div>
                                </div>

                                <div className={`flex gap-6 items-start ${!isSplitLayout ? 'text-left max-w-md' : ''}`}>
                                    <div className="w-12 h-12 bg-[#2c241b] border border-white/10 rounded-full flex items-center justify-center shadow-lg text-primary shrink-0">
                                        <span className="material-symbols-outlined text-2xl">call</span>
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-xl font-bold text-primary mb-1">Telèfons</h4>
                                        {config.contact.phoneNumbers.map((phone, index) => (
                                            <a 
                                                key={index} 
                                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                                className={`block hover:text-primary transition-colors font-bold ${index === 0 ? 'text-white text-lg' : 'text-gray-400'}`}
                                            >
                                                {phone}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* INSTAGRAM SECTION - DYNAMIC */}
                        {isSocialVisible && (
                            <div className={`flex gap-6 items-start ${!isSplitLayout ? 'text-left max-w-md' : ''}`}>
                                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg text-white shrink-0 p-0.5">
                                    <div className="bg-[#2c241b] w-full h-full rounded-full flex items-center justify-center group hover:bg-transparent transition-colors duration-500 cursor-pointer">
                                        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">photo_camera</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-serif text-xl font-bold text-primary mb-1">{config.contact.socialTitle}</h4>
                                    <p className="text-gray-400 font-light text-sm mb-2">{config.contact.socialDescription}</p>
                                    
                                    <a 
                                        href={config.contact.instagramUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                        {config.contact.socialButtonText}
                                    </a>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
          )}

          {/* Right Column: Contact Form */}
          {isRightColumnVisible && (
            <div className={`${isSplitLayout ? 'lg:col-span-6' : 'lg:col-span-8 lg:col-start-3'} bg-[#2c241b] p-10 rounded shadow-2xl border border-white/10 relative`}>
                <div className="mb-8">
                <h3 className="font-serif text-3xl font-bold text-primary border-b-2 border-primary/20 pb-2 inline-block">
                    {config.contact.formTitle}
                </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="font-hand text-2xl text-gray-300 pl-2">{config.contact.formNameLabel}</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder={config.contact.formNamePlaceholder} 
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-white/20" 
                        />
                    </div>
                    {/* Email */}
                    <div className="space-y-1">
                        <label className="font-hand text-2xl text-gray-300 pl-2">{config.contact.formEmailLabel}</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={config.contact.formEmailPlaceholder} 
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-white/20" 
                        />
                    </div>
                    {/* Phone */}
                    <div className="space-y-1">
                        <label className="font-hand text-2xl text-gray-300 pl-2">{config.contact.formPhoneLabel}</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={config.contact.formPhonePlaceholder} 
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-white/20" 
                        />
                    </div>
                    {/* Subject */}
                    <div className="space-y-1">
                        <label className="font-hand text-2xl text-gray-300 pl-2">{config.contact.formSubjectLabel}</label>
                        <input 
                            type="text" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder={config.contact.formSubjectPlaceholder} 
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-white/20" 
                        />
                    </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <label className="font-hand text-2xl text-gray-300 pl-2">{config.contact.formMessageLabel}</label>
                            {/* UPDATED COUNTER LOGIC AND MAX 1000 */}
                            <span className={`text-[10px] font-sans ${formData.message.length >= 1000 ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                                {formData.message.length} / 1000
                            </span>
                        </div>
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            maxLength={1000} // UPDATED LIMIT
                            rows={4} 
                            placeholder={config.contact.formMessagePlaceholder} 
                            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none placeholder-white/20"
                        ></textarea>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                    <input 
                        type="checkbox" 
                        id="privacy_check"
                        checked={formData.privacy}
                        onChange={handleCheckbox}
                        className="mt-1 accent-primary h-4 w-4 bg-white/10 border-white/20 cursor-pointer" 
                    />
                    <label htmlFor="privacy_check" className="text-xs text-gray-400 cursor-pointer">
                        <span className="font-bold text-primary block mb-0.5" onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>
                            Política de Privacitat
                        </span>
                        Dono el meu consentiment pel tractament de les dades.
                    </label>
                    </div>

                    <div className="flex flex-col items-end pt-4">
                    <button 
                        type="submit"
                        disabled={status === 'sending' || status === 'success'}
                        className={`bg-primary hover:bg-[#bfa575] text-black font-bold py-3 px-8 rounded shadow-md transform hover:scale-105 transition-all flex items-center gap-2 text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed ${status === 'success' ? 'bg-green-600 hover:bg-green-600 text-white' : ''}`}
                    >
                        {status === 'sending' ? 'Enviant...' : status === 'success' ? 'Enviat Correctament!' : config.contact.formButtonText}
                        {status === 'idle' && <span className="material-symbols-outlined text-lg">edit</span>}
                        {status === 'success' && <span className="material-symbols-outlined text-lg">check</span>}
                    </button>
                    
                    {status === 'error' && (
                        <p className="text-red-500 mt-2 text-sm font-bold">Hi ha hagut un error. Si us plau, truca'ns.</p>
                    )}
                    </div>
                </form>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Contact;