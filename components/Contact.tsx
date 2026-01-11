import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db } from '../firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

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
      // Create a reference to the 'contactMessages' node
      const messagesRef = ref(db, 'contactMessages');
      
      // Push the new message
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

      // Show success
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', privacy: false });
      
      // Reset status after a delay
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error("Error sending message to Firebase:", error);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info & Sticky Note */}
          <div className="space-y-16 mt-8">
            
            {/* The Sticky Note */}
            <div className="relative max-w-sm mx-auto lg:mx-0 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
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

            {/* Contact Info */}
            <div className="space-y-8 pl-4">
                <h2 className="font-serif text-5xl font-bold text-white">{config.contact.sectionTitle}</h2>
                
                <div className="flex gap-6 items-start">
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

                <div className="flex gap-6 items-start">
                   <div className="w-12 h-12 bg-[#2c241b] border border-white/10 rounded-full flex items-center justify-center shadow-lg text-primary shrink-0">
                      <span className="material-symbols-outlined text-2xl">call</span>
                   </div>
                   <div>
                      <h4 className="font-serif text-xl font-bold text-primary mb-1">Telèfons</h4>
                      {config.contact.phoneNumbers.map((phone, index) => (
                        <p key={index} className={`font-bold ${index === 0 ? 'text-white text-lg' : 'text-gray-400'}`}>{phone}</p>
                      ))}
                   </div>
                </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-[#2c241b] p-10 rounded shadow-2xl border border-white/10 relative">
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
                        placeholder="Nom i cognoms" 
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
                        placeholder="exemple@email.com" 
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
                        placeholder="+34..." 
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
                        placeholder="De què vols parlar?" 
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder-white/20" 
                     />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                     <label className="font-hand text-2xl text-gray-300 pl-2">{config.contact.formMessageLabel}</label>
                     <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4} 
                        placeholder="Explica'ns de què es tracta..." 
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

        </div>
      </div>
    </section>
  );
};

export default Contact;