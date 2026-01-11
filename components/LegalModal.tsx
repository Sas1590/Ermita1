import React from 'react';

interface LegalModalProps {
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
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
          <h2 className="font-serif text-2xl md:text-3xl font-bold">Avís Legal</h2>
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
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Avís legal i termes d’ús</h3>
            <p className="text-gray-700 mb-4">
              En aquest espai, l’USUARI, podrà trobar tota la informació relativa als termes i condicions legals que defineixen les relacions entre els usuaris i nosaltres com a responsables d’aquesta web. Com a usuari, és important que coneguis aquests termes abans de continuar la teva navegació. Restaurant Ermita Paretdelgada, com a responsable d’aquesta web, assumeix el compromís de processar la informació dels nostres usuaris i clients amb plenes garanties i complir amb els requisits nacionals i europeus que regulen la recopilació i ús de les dades personals dels nostres usuaris. Aquesta web, per tant, compleix rigorosament amb el RGPD (REGLAMENT (UE) 2016/679 de protecció de dades) i la LSSI-CE la Llei 34/2002, d’11 de juliol, de serveis de la societat de la informació i de comerç electrònic.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Condicions Generals d'Ús</h3>
            <p className="text-gray-700">
              Les presents Condicions Generals regulen l’ús (incloent el mer accés) de les pàgines de la web, integrants del lloc web de www.ermitaparetdelgada.com inclosos els continguts i serveis posats a disposició en elles. Tota persona que accedeixi a la web, www.ermitaparetdelgada.com (“Usuari”) accepta sotmetre’s a les Condicions Generals vigents a cada moment del portal www.ermitaparetdelgada.com.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Dades Personals que recaptem</h3>
            <p className="text-gray-700">
              Llegir <span className="text-primary font-bold cursor-pointer underline">Política de Privacitat</span>.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Compromisos i Obligacions dels Usuaris</h3>
            <p className="text-gray-700 mb-4">
              L’Usuari queda informat, i accepta, que l’accés a la present web no suposa, de cap manera, l’inici d’una relació comercial amb www.ermitaparetdelgada.com. D’aquesta manera, l’usuari es compromet a utilitzar el lloc web, els seus serveis i continguts sense contravenir la legislació vigent, la bona fe i l’ordre públic.
            </p>
            <p className="text-gray-700 mb-4">
              Queda prohibit l’ús de la web, amb finalitats il·lícits o lesius, o que, de qualsevol forma, puguin causar perjudici o impedir el normal funcionament del lloc web. Respecte dels continguts d’aquesta web, es prohibeix:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>La seva reproducció, distribució o modificació, total o parcial, tret que es compti amb l’autorització dels seus legítims titulars;</li>
                <li>Qualsevol vulneració dels drets del prestador o dels legítims titulars;</li>
                <li>La seva utilització per a fins comercials o publicitaris.</li>
            </ul>
            <p className="text-gray-700">
              En la utilització de la web, www.ermitaparetdelgada.com, l’Usuari es compromet a no dur a terme cap conducta que pogués danyar la imatge, els interessos i els drets de www.ermitaparetdelgada.com o de tercers o que pogués danyar, inutilitzar o sobrecarregar el portal www.ermitaparetdelgada.com o que impedís, de qualsevol forma, la normal utilització de la web. No obstant això, l’Usuari ha de ser conscient que les mesures de seguretat dels sistemes informàtics en Internet no són enterament fiables i que, per tant www.ermitaparetdelgada.com no pot garantir la inexistència de virus o altres elements que puguin produir alteracions en els sistemes informàtics (programari i maquinari) de l’Usuari o en els seus documents electrònics i fitxers continguts en aquests.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Mesures de Seguretat</h3>
            <p className="text-gray-700 mb-4">
               Les dades personals comunicats per l’usuari a www.ermitaparetdelgada.com poden ser emmagatzemats en bases de dades automatitzades o no, la titularitat de les quals correspon en exclusiva a www.ermitaparetdelgada.com, assumint aquesta totes les mesures d’índole tècnica, organitzativa i de seguretat que garanteixen la confidencialitat, integritat i qualitat de la informació continguda en les mateixes d’acord amb el que s’estableix en la normativa vigent en protecció de dades.
            </p>
            <p className="text-gray-700">
               La comunicació entre els usuaris i www.ermitaparetdelgada.com utilitza un canal segur, i les dades transmeses són xifrats gràcies a protocols a https, per tant, garantim les millors condicions de seguretat perquè la confidencialitat dels usuaris estigui garantida.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Reclamacions</h3>
            <p className="text-gray-700 mb-4">
              www.ermitaparetdelgada.com informa que existeixen fulls de reclamació a la disposició d’usuaris i clients. L’Usuari podrà realitzar reclamacions sol·licitant el seu full de reclamació o remetent un correu electrònic a hola@ermitaparetdelgada.com indicant el seu nom i cognoms, el servei i/o producte adquirit i exposant els motius de la seva reclamació.
            </p>
            <p className="text-gray-700">
              L’usuari/comprador podrà notificar-nos la reclamació, bé a través de correu electrònic a: hola@ermitaparetdelgada.com, si ho desitja adjuntant el següent formulari de reclamació:
            </p>
            <div className="bg-white/50 p-4 border border-gray-200 mt-4 text-sm font-mono text-gray-600">
                <p>El servei/producte: [Nom Producte]</p>
                <p>Adquirit el dia: [Data]</p>
                <p>Nom de l’usuari: [Nom]</p>
                <p>Domicili de l’usuari: [Direcció]</p>
                <p>Signatura de l’usuari (només si es presenta en paper):</p>
                <p>Data: [Data]</p>
                <p>Motiu de la reclamació: [Text]</p>
            </div>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Plataforma de resolució de conflictes</h3>
             <p className="text-gray-700">
             Per si pot ser del teu interès, per a sotmetre les teves reclamacions pots utilitzar també la plataforma de resolució de litigis que facilita la Comissió Europea i que es troba disponible en el següent enllaç: <a href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary underline">http://ec.europa.eu/consumers/odr/</a>
             </p>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Drets de propietat intel·lectual i industrial</h3>
             <p className="text-gray-700 mb-4">
               En virtut del que es disposa en els articles 8 i 32.1, paràgraf segon, de la Llei de Propietat Intel·lectual, queden expressament prohibides la reproducció, la distribució i la comunicació pública, inclosa la seva modalitat de posada a disposició, de la totalitat o part dels continguts d’aquesta pàgina web, amb finalitats comercials, en qualsevol suport i per qualsevol mitjà tècnic, sense l’autorització de www.ermitaparetdelgada.com. L’usuari es compromet a respectar els drets de Propietat Intel·lectual i Industrial titularitat de www.ermitaparetdelgada.com.
             </p>
             <p className="text-gray-700 mb-4">
               L’usuari coneix i accepta que la totalitat del lloc web, contenint sense caràcter exhaustiu el text, programari, continguts (incloent estructura, selecció, ordenació i presentació dels mateixos) podcast, fotografies, material audiovisual i gràfics, està protegida per marques, drets d’autor i altres drets legítims, d’acord amb els tractats internacionals en els quals Espanya és part i altres drets de propietat i lleis d’Espanya.
             </p>
             <p className="text-gray-700 mb-4">
               En el cas que un usuari o un tercer considerin que s’ha produït una violació dels seus legítims drets de propietat intel·lectual per la introducció d’un determinat contingut en la web, haurà de notificar aquesta circumstància a www.ermitaparetdelgada.com indicant:
             </p>
             <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Dades personals de l’interessat titular dels drets presumptament infringits, o indicar la representació amb la qual actua en cas que la reclamació la present un tercer diferent de l’interessat.</li>
                <li>Assenyalar els continguts protegits pels drets de propietat intel·lectual i la seva ubicació en la web, l’acreditació dels drets de propietat intel·lectual assenyalats i declaració expressa en la qual l’interessat es responsabilitza de la veracitat de les informacions facilitades en la notificació.</li>
             </ul>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Enllaços externs</h3>
             <p className="text-gray-700 mb-4">
               Les pàgines de la web www.ermitaparetdelgada.com, podria proporcionar enllaços a altres llocs web propis i continguts que són propietat de tercers. L’únic objecte dels enllaços és proporcionar a l’Usuari la possibilitat d’accedir a aquests enllaços. www.ermitaparetdelgada.com no es responsabilitza en cap cas dels resultats que puguin derivar-se a l’Usuari per accés a aquests enllaços.
               Així mateix, l’usuari trobarà dins d’aquest lloc, pàgines, promocions, programes d’afiliats que accedeixen als hàbits de navegació dels usuaris per a establir perfils. Aquesta informació sempre és anònima i no s’identifica a l’usuari.
             </p>
             <p className="text-gray-700 mb-4">
               La Informació que es proporcioni en aquests Llocs patrocinat o enllaços d’afiliats està subjecta a les polítiques de privacitat que s’utilitzin en aquests Llocs i no estarà subjecta a aquesta política de privacitat. Pel que recomanem àmpliament als Usuaris a revisar detalladament les polítiques de privacitat dels enllaços d’afiliat.
             </p>
             <p className="text-gray-700">
               L’Usuari que es proposi establir qualsevol dispositiu tècnic d’enllaç des del seu lloc web al portal www.ermitaparetdelgada.com haurà d’obtenir l’autorització prèvia i escrita de www.ermitaparetdelgada.com. L’establiment de l’enllaç no implica en cap cas l’existència de relacions entre www.ermitaparetdelgada.com i el propietari del lloc en el qual s’estableixi l’enllaç, ni l’acceptació o aprovació per part de www.ermitaparetdelgada.com dels seus continguts o serveis.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Política de comentaris</h3>
             <p className="text-gray-700 mb-2">
               En la nostra web i es permeten realitzar comentaris per a enriquir els continguts i realitzar consultes. No s’admetran comentaris que no estiguin relacionats amb la temàtica d’aquesta web, que incloguin difamacions, greuges, insults, atacs personals o faltes de respecte en general cap a l’autor o cap a altres membres. També seran suprimits els comentaris que continguin informació que sigui òbviament enganyosa o falsa, així com els comentaris que continguin informació personal, com, per exemple, domicilis privat o telèfons i que vulnerin la nostra política de protecció de dades.
             </p>
             <p className="text-gray-700 mb-2">
               Es desestimarà, igualment, aquells comentaris creats només amb finalitats promocionals d’una web, persona o col·lectiu i tot el que pugui ser considerat spam en general.
             </p>
             <p className="text-gray-700">
               No es permeten comentaris anònims, així com aquells realitzats per una mateixa persona amb diferents sobrenoms. No es consideraran tampoc aquells comentaris que intentin forçar un debat o una presa de postura per un altre usuari.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Exclusió de garanties i responsabilitat</h3>
             <p className="text-gray-700 mb-4">
               El Prestador no atorga cap garantia ni es fa responsable, en cap cas, dels danys i perjudicis de qualsevol naturalesa que poguessin portar causa de:
             </p>
             <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>La falta de disponibilitat, manteniment i efectiu funcionament de la web, o dels seus serveis i continguts;</li>
                <li>L’existència de virus, programes maliciosos o lesius en els continguts;</li>
                <li>L’ús il·lícit, negligent, fraudulent o contrari a aquest Avís Legal;</li>
                <li>La falta de licitud, qualitat, fiabilitat, utilitat i disponibilitat dels serveis prestats per tercers i llocs a la disposició dels usuaris en el lloc web.</li>
             </ul>
             <p className="text-gray-700">
               El prestador no es fa responsable en cap concepte dels danys que poguessin dimanar de l’ús il·legal o indegut de la present pàgina web.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Llei Aplicable i Jurisdicció</h3>
             <p className="text-gray-700">
               Amb caràcter general les relacions entre www.ermitaparetdelgada.com amb els Usuaris dels seus serveis telemàtics, presents en aquesta web es troben sotmeses a la legislació i jurisdicció espanyoles i als tribunals.
             </p>
          </section>

          <section>
             <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Contacte</h3>
             <p className="text-gray-700 mb-4">
               En cas que qualsevol Usuari tingués algun dubte sobre aquestes Condicions legals o qualsevol comentari sobre el portal www.ermitaparetdelgada.com, si us plau dirigeixi’s a <a href="mailto:hola@ermitaparetdelgada.com" className="text-primary underline">hola@ermitaparetdelgada.com</a>
             </p>
             <p className="text-gray-700 font-bold">
               De part de l’equip que formem Restaurant Ermita Paretdelgada t’agraïm el temps dedicat a llegir aquest Avís Legal.
             </p>
          </section>

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

export default LegalModal;