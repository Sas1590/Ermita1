import React, { useState } from 'react';

interface CookiesModalProps {
  onClose: () => void;
}

const CookiesModal: React.FC<CookiesModalProps> = ({ onClose }) => {
  const [showExtended, setShowExtended] = useState(false);

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
        <div className="bg-[#2c241b] text-white px-6 md:px-8 py-6 flex justify-between items-center shrink-0 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Política de Cookies</h2>
            <button 
                onClick={() => setShowExtended(!showExtended)}
                className="text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider underline underline-offset-4 decoration-primary/50 hover:decoration-white"
            >
                {showExtended ? 'Veure Resum' : 'Més informació sobre les cookies'}
            </button>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 md:p-12 overflow-y-auto font-sans text-secondary leading-relaxed space-y-8 text-sm md:text-base scroll-smooth">
          
          {/* --- VISTA RESUMIDA (Original) --- */}
          {!showExtended && (
            <div className="animate-[fadeIn_0.3s_ease-out] space-y-8">
                <section>
                    <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Una cookie és un petit fitxer...</h3>
                    <p className="text-gray-700">
                    Una cookie és un petit fitxer de text que s’emmagatzema en el seu navegador quan visita gairebé qualsevol pàgina web. La seva utilitat és que la web sigui capaç de recordar la seva visita quan torni a navegar per aquesta pàgina. Les cookies solen emmagatzemar informació de caràcter tècnic, preferències personals, personalització de continguts, estadístiques d’ús, enllaços a xarxes socials, accés a comptes d’usuari, etc. L’objectiu de la cookie és adaptar el contingut de la web al seu perfil i necessitats, sense cookies els serveis oferts per qualsevol pàgina es veurien minvats notablement.
                    </p>
                </section>

                <section>
                    <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Cookies utilitzades en aquest lloc web</h3>
                    <p className="mb-4">Seguint les directrius de l’Agència Espanyola de Protecció de Dades procedim a detallar l’ús de cookies que fa aquesta web amb la finalitat d’informar-lo amb la màxima exactitud possible.</p>
                    
                    <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2 text-secondary">Aquest lloc web utilitza les següents cookies pròpies:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Cookies de sessió:</strong> per a garantir que els usuaris que escriguin comentaris en el blog siguin humans i no aplicacions automatitzades. D’aquesta manera es combat el spam.</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-bold text-lg mb-2 text-secondary">Aquest lloc web utilitza les següents cookies de tercers:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Google Analytics:</strong> Emmagatzema cookies per a poder elaborar estadístiques sobre el trànsit i volum de visites d’aquesta web. En utilitzar aquest lloc web està consentint el tractament d’informació sobre vostè per Google. Per tant, l’exercici de qualsevol dret en aquest sentit haurà de fer-lo comunicant directament amb Google.</li>
                        <li><strong>Xarxes socials:</strong> Cada xarxa social utilitza les seves pròpies cookies perquè vostè pugui punxar en botons del tipus M’agrada o Compartir.</li>
                    </ul>
                    </div>
                </section>

                <section>
                    <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Desactivació o eliminació de cookies</h3>
                    <p className="text-gray-700">
                    En qualsevol moment podrà exercir el seu dret de desactivació o eliminació de cookies d’aquest lloc web. Aquestes accions es realitzen de manera diferent en funció del navegador que estigui usant.
                    </p>
                </section>

                <section>
                    <h3 className="font-serif text-xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">Notes addicionals</h3>
                    <ul className="list-disc pl-5 space-y-3 text-gray-700">
                    <li>Ni aquesta web ni els seus representants legals es fan responsables ni del contingut ni de la veracitat de les polítiques de privacitat que puguin tenir els tercers esmentats en aquesta política de cookies.</li>
                    <li>Els navegadors web són les eines encarregades d’emmagatzemar les cookies i des d’aquest lloc ha d’efectuar el seu dret a eliminació o desactivació d’aquestes. Ni aquesta web ni els seus representants legals poden garantir la correcta o incorrecta manipulació de les cookies per part dels esmentats navegadors.</li>
                    <li>En alguns casos és necessari instal·lar cookies perquè el navegador no oblidi la seva decisió de no acceptació d’aquestes.</li>
                    <li>En el cas de les cookies de Google Analytics, aquesta empresa emmagatzema les cookies en servidors situats als Estats Units i es compromet a no compartir-la amb tercers, excepte en els casos en els quals sigui necessari per al funcionament del sistema o quan la llei obligui a aquest efecte. Segons Google no guarda la seva adreça IP. Google Inc. és una companyia adherida a l’Acord de Port Segur que garanteix que totes les dades transferides seran tractats amb un nivell de protecció concorde a la normativa europea.</li>
                    </ul>
                    <p className="mt-4 font-bold text-gray-600">Per a qualsevol dubte o consulta sobre aquesta política de cookies no dubti a comunicar-se amb nosaltres a través de la secció de contacte.</p>
                </section>
            </div>
          )}

          {/* --- VISTA EXTESA (Més Informació) --- */}
          {showExtended && (
            <div className="animate-[fadeIn_0.3s_ease-out] space-y-8">
                <section>
                    <h3 className="font-serif text-2xl font-bold text-primary mb-4">Més informació sobre les cookies</h3>
                    
                    <h4 className="font-bold text-lg mt-6 mb-2 text-secondary">Què és una cookie?</h4>
                    <p className="text-gray-700">
                        Una cookie és un fitxer de text inofensiu que s’emmagatzema en el seu navegador quan visita gairebé qualsevol pàgina web. La utilitat de la cookie és que la web sigui capaç de recordar la seva visita quan torni a navegar per aquesta pàgina. Encara que molta gent no ho sap les cookies es porten utilitzant des de fa 20 anys, quan van aparèixer els primers navegadors per a la World Wide Web.
                    </p>

                    <h4 className="font-bold text-lg mt-6 mb-2 text-secondary">Què NO ÉS una cookie?</h4>
                    <p className="text-gray-700">
                        No és un virus, ni un troià, ni un cuc, ni spam, ni spyware, ni obre finestres pop-up.
                    </p>

                    <h4 className="font-bold text-lg mt-6 mb-2 text-secondary">Quina informació emmagatzema una cookie?</h4>
                    <p className="text-gray-700 mb-2">
                        Les cookies no solen emmagatzemar informació sensible sobre vostè, com a targetes de crèdit o dades bancàries, fotografies, el seu DNI o informació personal, etc. Les dades que guarden són de caràcter tècnic, preferències personals, personalització de continguts, etc.
                    </p>
                    <p className="text-gray-700">
                        El servidor web no li associa a vostè com a persona si no al seu navegador web. De fet, si vostè navega habitualment amb Internet Explorer i prova de navegar per la mateixa web amb Firefox o Chrome veurà que la web no s’adona que és vostè la mateixa persona perquè en realitat està associant al navegador, no a la persona.
                    </p>

                    <h4 className="font-bold text-lg mt-6 mb-2 text-secondary">Quin tipus de cookies existeixen?</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Cookies tècniques:</strong> Són les més elementals i permeten, entre altres coses, saber quan està navegant un humà o una aplicació automatitzada, quan navega un usuari anònim i un registrat, tasques bàsiques per al funcionament de qualsevol web dinàmica.</li>
                        <li><strong>Cookies d’anàlisis:</strong> Recullen informació sobre el tipus de navegació que està realitzant, les seccions que més utilitza, productes consultats, franja horària d’ús, idioma, etc.</li>
                        <li><strong>Cookies publicitàries:</strong> Mostren publicitat en funció de la seva navegació, el seu país de procedència, idioma, etc.</li>
                    </ul>

                    <h4 className="font-bold text-lg mt-6 mb-2 text-secondary">Què són les cookies pròpies i les de tercers?</h4>
                    <p className="text-gray-700">
                        Les cookies pròpies són les generades per la pàgina que està visitant i les de tercers són les generades per serveis o proveïdors externs com Facebook, Twitter, Google, etc.
                    </p>
                </section>

                <section className="bg-white/50 p-6 rounded border border-gray-200">
                    <h4 className="font-bold text-lg mb-4 text-secondary">Què ocorre si desactivo les cookies?</h4>
                    <p className="text-gray-700 mb-4">Perquè entengui l’abast que pot tenir desactivar les cookies li vam mostrar uns exemples:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                        <li>No podrà compartir continguts d’aquesta web en Facebook, Twitter o qualsevol altra xarxa social.</li>
                        <li>El lloc web no podrà adaptar els continguts a les seves preferències personals, com sol ocórrer a les botigues en línia.</li>
                        <li>No podrà accedir a l’àrea personal d’aquesta web, com per exemple El meu compte, o El meu perfil o Les meves comandes.</li>
                        <li>Botigues en línia: Li serà impossible realitzar compres en línia, hauran de ser telefòniques o visitant la botiga física si és que disposa d’ella.</li>
                        <li>No serà possible personalitzar les seves preferències geogràfiques com a franja horària, divisa o idioma.</li>
                        <li>El lloc web no podrà realitzar analítiques web sobre visitants i trànsit en la web, la qual cosa dificultarà que la web sigui competitiva.</li>
                        <li>No podrà escriure en el blog, no podrà pujar fotos, publicar comentaris, valorar o puntuar continguts. La web tampoc podrà saber si vostè és un humà o una aplicació automatitzada que publica spam.</li>
                        <li>No es podrà mostrar publicitat sectoritzada, la qual cosa reduirà els ingressos publicitaris de la web.</li>
                        <li>Totes les xarxes socials usen cookies, si les desactiva no podrà utilitzar cap xarxa social.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-lg mb-2 text-secondary">Es poden eliminar les cookies?</h4>
                    <p className="text-gray-700 mb-2">Sí. No sols eliminar, també bloquejar, de manera general o particular per a un domini específic.</p>
                    <p className="text-gray-700">Per a eliminar les cookies d’un lloc web ha d’anar a la configuració del seu navegador i allí podrà buscar les associades al domini en qüestió i procedir a la seva eliminació.</p>
                </section>

                <section>
                    <h3 className="font-serif text-xl font-bold text-primary mb-6 border-b border-primary/20 pb-2">Configuració de cookies per als navegadors més populars</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <h5 className="font-bold text-secondary mb-2">Google Chrome</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Vagi a Configuració o Preferències mitjançant el menú Arxiu o bé punxant la icona de personalització que apareix a dalt a la dreta.</li>
                                <li>Veurà diferents seccions, punxi l’opció Mostrar opcions avançades.</li>
                                <li>Vagi a Privacitat, Configuració de contingut.</li>
                                <li>Seleccioni Totes les cookies i les dades de llocs.</li>
                                <li>Apareixerà un llistat amb totes les cookies ordenades per domini. Perquè li sigui més fàcil trobar les cookies d’un determinat domini introdueixi parcial o totalment la direcció en el camp Buscar cookies.</li>
                                <li>Després de realitzar aquest filtre apareixeran en pantalla una o diverses línies amb les cookies de la web sol·licitada. Ara només ha de seleccionar-la i prémer la X per a procedir a la seva eliminació.</li>
                            </ol>
                        </div>

                        <div>
                            <h5 className="font-bold text-secondary mb-2">Internet Explorer</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Vagi a Eines, Opcions d’Internet</li>
                                <li>Faci clic en Privacitat.</li>
                                <li>Mogui el deslizador fins a ajustar el nivell de privacitat que desitgi.</li>
                            </ol>
                        </div>

                        <div>
                            <h5 className="font-bold text-secondary mb-2">Mozilla Firefox</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Vagi a Opcions o Preferències segons el seu sistema operatiu.</li>
                                <li>Faci clic en Privacitat.</li>
                                <li>En Historial triï Usar una configuració personalitzada per a l’historial.</li>
                                <li>Ara veurà l’opció Acceptar cookies, pot activar-la o desactivar-la segons les seves preferències.</li>
                            </ol>
                        </div>

                        <div>
                            <h5 className="font-bold text-secondary mb-2">Safari (OSX)</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Vagi a Preferències, després Privacitat.</li>
                                <li>En aquest lloc veurà l’opció Bloquejar cookies perquè ajusti el tipus de bloqueig que desitja realitzar.</li>
                            </ol>
                        </div>

                        <div>
                            <h5 className="font-bold text-secondary mb-2">Safari (iOS)</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Vagi a Ajustos, després Safari.</li>
                                <li>Vagi a Privacitat i Seguretat, veurà l’opció Bloquejar cookies perquè ajusti el tipus de bloqueig que desitja realitzar.</li>
                            </ol>
                        </div>

                        <div>
                            <h5 className="font-bold text-secondary mb-2">Android</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Executi el navegador i premi la tecla Menú, després Ajustos.</li>
                                <li>Vagi a Seguretat i Privacitat, veurà l’opció Acceptar cookies perquè activi o desactivi la casella.</li>
                            </ol>
                        </div>

                        <div>
                            <h5 className="font-bold text-secondary mb-2">Windows Phone</h5>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
                                <li>Obri Internet Explorer, després Més, després Configuració</li>
                                <li>Ara pot activar o desactivar la casella Permetre cookies.</li>
                            </ol>
                        </div>
                    </div>
                </section>

                <div className="flex justify-center pt-8">
                    <button 
                        onClick={() => setShowExtended(false)}
                        className="text-primary hover:text-black underline text-sm"
                    >
                        Tornar al resum
                    </button>
                </div>
            </div>
          )}

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

export default CookiesModal;