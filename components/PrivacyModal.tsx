import React from 'react';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#fdfbf7] bg-paper-texture w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl overflow-hidden flex flex-col animate-[fadeIn_0.3s_ease-out] border border-white/20">
        
        {/* Header */}
        <div className="bg-[#2c241b] text-white px-8 py-6 flex justify-between items-center shrink-0 border-b border-white/10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold">Política de Privacitat</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 md:p-12 overflow-y-auto font-sans text-secondary leading-relaxed space-y-8 text-sm md:text-base">
          
          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Responsable – qui és el responsable del tractament de les dades?</h3>
            <ul className="list-none space-y-1 ml-2 text-gray-700">
              <li><strong>Identitat:</strong> Restaurant Ermita Paretdelgada</li>
              <li><strong>Domicili social:</strong> Carretera de la Selva-Villalonga, Km 2 43470 La Selva del Camp.</li>
              <li><strong>NIF:</strong> 39.705.711.Y</li>
              <li><strong>Telèfon:</strong> 977 84 08 70</li>
              <li><strong>Correu Electrònic:</strong> hola@ermitaparetdelgada.com</li>
              <li><strong>Contacte:</strong> Elena García</li>
              <li><strong>Nom del domini:</strong> www.ermitaparetdelgada.com</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Finalitats – amb quines finalitats tractem les teves dades?</h3>
            <p className="mb-4">En compliment del que es disposa en el Reglament Europeu 2016/679 General de Protecció de Dades, t’informem de què tractarem les dades que ens facilites per a:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Gestionar la contractació de serveis que realitzi a través de la Plataforma, així com la facturació i lliurament corresponent.</li>
              <li>Remetre periòdicament comunicacions sobre serveis, esdeveniments i notícies relacionades amb les activitats desenvolupades per Restaurant Ermita Paretdelgada.</li>
              <li>Remetre informació comercial i/o promocional relacionada amb el sector de serveis contractats.</li>
              <li>Donar compliment a les obligacions legalment establertes i prevenció de frau.</li>
              <li>Cessió de dades a organismes i autoritats quan siguin requerits legalment.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Categories de dades – Quines dades tractem?</h3>
            <p className="mb-2">Derivada de les finalitats abans esmentades, en Restaurant Ermita Paretdelgada gestionem les següents categories de dades:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Dades identificatives</li>
              <li>Metadades de comunicacions electròniques</li>
              <li>Dades d’informació comercial.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Legitimació</h3>
            <p className="text-gray-700">El tractament de dades es basa en el consentiment de l’interessat, sol·licitat expressament per a dur a terme aquests tractaments, d’acord amb la normativa vigent.</p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Termini de Conservació</h3>
            <p className="text-gray-700">Restaurant Ermita Paretdelgada conservarà les dades personals dels usuaris únicament durant el temps necessari per a la realització de les finalitats per a les quals van ser recollits.</p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Destinataris</h3>
            <p className="mb-2">Les teves dades podran ser comunicades a:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Proveïdors de serveis (màrqueting, allotjament web, etc.) sota contracte de confidencialitat.</li>
              <li>Forces i Cossos de Seguretat de l’Estat en els casos d'obligació legal.</li>
              <li>Bancs i entitats financeres.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Drets de l'Usuari</h3>
            <p className="mb-2">Tens dret a:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Accedir a les teves dades personals.</li>
              <li>Sol·licitar la rectificació de les dades inexactes.</li>
              <li>Sol·licitar la supressió de les dades.</li>
              <li>Sol·licitar la limitació del tractament.</li>
              <li>Oposar-te al tractament.</li>
            </ul>
            <p className="mt-4 font-bold">Si desitges fer ús de qualsevol dels teus drets pot dirigir-se a <a href="mailto:hola@ermitaparetdelgada.com" className="text-primary underline">hola@ermitaparetdelgada.com</a></p>
          </section>

          <div className="border-t border-gray-300 pt-6 mt-8 text-xs text-gray-500 text-center">
            <p>La present Política de Privacitat es troba actualitzada a data 26/04/2023. Restaurant Ermita Paretdelgada (Espanya). Reservats tots els drets.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#e8e4d9] border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary hover:bg-[#bfa575] text-black font-bold py-3 px-8 rounded shadow-md uppercase tracking-widest text-sm transition-colors"
          >
            Entesos
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyModal;