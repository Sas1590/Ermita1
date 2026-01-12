import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

// 0. Define Menu Types
export interface MenuItem {
  name: string;
  price: string;
}

export interface MenuSection {
  id: string;
  category: string;
  icon?: string; // New: For Logo selection
  items: MenuItem[];
  footer?: string;
}

// Group Menu Types
export interface GroupMenuItem {
  nameCa: string;
  nameEs: string;
}

export interface GroupMenuSection {
  title: string;
  items: GroupMenuItem[];
}

// 1. Define the AppConfig interface
interface AppConfig {
  brand: {
    logoUrl: string;
  };
  hero: {
    reservationFormTitle: string;
    reservationFormSubtitle: string;
    reservationPhoneNumber: string;
    reservationButtonText: string;
    stickyNoteText: string;
    backgroundImages: string[];
    // NEW RESERVATION LIMITS
    reservationTimeStart: string; // "13:00"
    reservationTimeEnd: string;   // "15:30"
    reservationTimeInterval: number; // 15 (minutes)
    reservationErrorMessage: string; // "Ho sentim, la cuina està tancada."
  };
  intro: {
    smallTitle: string;
    mainTitle: string;
    description: string;
  };
  specialties: {
    sectionTitle: string; // "Autèntics Sabors"
    mainTitle: string;    // "Les Nostres Especialitats"
    description: string;  // "Una selecció de plats i vins..."
    items: Array<{
      title: string;
      subtitle: string;
      image: string;
      badge?: string; // "Temporada", etc.
    }>;
  };
  philosophy: {
    sectionTitle: string;     // Title 1
    titleLine1: string;       // Title 2
    titleLine2: string;       // Title 3
    description: string;      // Main Description
    
    // New fields for the blocks
    cardTag: string;          // Note on the image
    productTitle: string;
    productDescription: string;
    productImages: string[];  // NEW: Array for the product slider
    
    historicTitle: string;
    historicDescription: string;
    historicLinkUrl: string;  // Link URL (Kept)
    historicImages: string[]; // NEW: Array for the slider
  };
  foodMenu: MenuSection[]; // New Dynamic Menu
  
  // NEW DYNAMIC GROUP MENU
  groupMenu: {
    title: string;
    price: string;
    vat: string;
    disclaimer: string; // The red text
    sections: GroupMenuSection[];
    drinks: string[]; // List of included drinks
    infoIntro: string;
    infoAllergy: string;
  };

  contact: {
    importantNoteTitle: string;
    importantNoteMessage1: string;
    importantNoteMessage2: string;
    phoneNumbers: string[];
    
    // Location & Schedule
    sectionTitle: string;      // "Estem a prop teu"
    locationTitle: string;     // "Localització"
    addressLine1: string;      // "Carretera..."
    addressLine2: string;      // "43470..."
    schedule: string;          // "De dimarts a..."
    directionsButtonText: string; // "PORTA'M-HI"
    mapUrl: string;            // Google Maps URL

    // Social Media
    instagramUrl: string;
    socialTitle: string;       // "Xarxes Socials"
    socialDescription: string; // "Segueix el nostre dia a dia"
    socialButtonText: string;  // "SEGUEIX-NOS"

    // Contact Form Config
    formTitle: string;
    formNameLabel: string;
    formEmailLabel: string;
    formPhoneLabel: string;
    formSubjectLabel: string;
    formMessageLabel: string;
    formButtonText: string;
  };
  navbar: {
    reserveButtonText: string;
  };
}

// 2. Define default values for the configuration (Fallback)
const defaultAppConfig: AppConfig = {
  brand: {
    logoUrl: "", 
  },
  hero: {
    reservationFormTitle: "Reserva la teva taula",
    reservationFormSubtitle: "Omple'l o truca'ns!",
    reservationPhoneNumber: "+34 654 321 987",
    reservationButtonText: "Reservar Ara!",
    stickyNoteText: "Obert tot l'any!",
    backgroundImages: [
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_5.png",
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_4.png"
    ],
    reservationTimeStart: "13:00",
    reservationTimeEnd: "15:30",
    reservationTimeInterval: 15,
    reservationErrorMessage: "Ho sentim, l'horari de reserva és de 13:00 a 15:30."
  },
  intro: {
    smallTitle: "Filosofia",
    mainTitle: "Menjar típic català i casolà.",
    description: "\"Calçotades com al mas, cuina tradicional catalana i carns a la brasa amb llenya d’olivera. Gaudint de l'entorn històric i la tranquil·litat de la nostra terra.\""
  },
  specialties: {
    sectionTitle: "Autèntics Sabors",
    mainTitle: "Les Nostres Especialitats",
    description: "Una selecció de plats i vins que representen l'essència de la nostra terra, cuinats amb passió i producte de proximitat.",
    items: [
      {
        title: "Carns a la Brasa",
        subtitle: "Llenya d'olivera",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
        badge: ""
      },
      {
        title: "Calçotades",
        subtitle: "Salsa Romesco",
        image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=2070&auto=format&fit=crop",
        badge: "Temporada"
      },
      {
        title: "Vins de Proximitat",
        subtitle: "DO Tarragona",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
        badge: "Celler"
      }
    ]
  },
  philosophy: {
    sectionTitle: "Filosofia i Entorn",
    titleLine1: "Cuina amb ànima,",
    titleLine2: "arrelada a la terra.",
    description: "Més que un restaurant, som un refugi de tradició on el temps s'atura i els sabors expliquen històries antigues.",
    cardTag: "\"L'aroma dels nostres camps a la taula\"",
    productTitle: "Producte de Proximitat",
    productDescription: "Cuinem amb productes del \"troç\". Les nostres hortalisses venen directament dels horts veïns i treballem amb ramaders locals per oferir la millor qualitat, respectant el cicle de cada estació.",
    productImages: [
      "https://images.unsplash.com/photo-1541457523724-95f54f7740cc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=2070&auto=format&fit=crop"
    ],
    historicTitle: "Un entorn històric",
    historicDescription: "Situat a l'Ermita de la Paret Delgada, gaudiràs d'un paratge únic que inspira calma. Les parets de pedra i els antics murs contenen el pas del temps, convertint cada àpat en una celebració en companyia.",
    historicLinkUrl: "https://es.wikipedia.org/wiki/Ermita_de_Santa_Mar%C3%ADa_de_Paretdelgada",
    historicImages: [
      "https://images.unsplash.com/photo-1582298539230-22c6081d5821?q=80&w=2574&auto=format&fit=crop",
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_2.png"
    ]
  },
  foodMenu: [
    {
      id: "sec_1",
      category: "ENTRANTS · ENTRANTES",
      icon: "soup_kitchen",
      items: [
        { name: "Amanida verda de l'horta / Ensalada verde de la huerta.", price: "12.00" },
        { name: "Amanida de formatge de cabra amb pasta brick, préssec al forn i vinagreta de mel. / Ensalada de queso de cabra con pasta brick, melocotón al horno y vinagreta de miel.", price: "16.00" },
        { name: "Coca de carxofa confitada, foie i pernil ibèric / Coca de alcachofa confitada, foie y jamón ibérico.", price: "18.00" },
        { name: "Tartar de bacallà amb taronja i vinagreta d'olives negres. / Tartar de bacalao con naranja y vinagreta de olivas negras.", price: "16.00" },
        { name: "Canelons de carn casolans, gratinats / Canelones caseros de carne, gratinados.", price: "14.00" },
        { name: "Canelons de bolets silvestres gratinats amb parmesà / Canelones de setas silvestres gratinados con parmesano.", price: "13.00" },
        { name: "Carpaccio de xuleta de vaca madurada Okelan / Carpaccio de chuleta de ternera madurada Okelan.", price: "18.00" },
        { name: "Cargols a la llauna fets a la brasa / Caracoles a la \"llauna\" hechos a la brasa.", price: "19.00" },
        { name: "Ració de pa de vidre i tomacons / Ración de pan de cristal y tomates.", price: "4.00" },
        { name: "Ració de pa torrat, alls i tomacons / Ración de pan tostado, ajos y tomates.", price: "5.00" },
        { name: "Ració de panet de 65 gr. / Ración de panecillo de 65gr.", price: "0.60" },
      ]
    },
    {
      id: "sec_2",
      category: "TAPES · TAPAS",
      icon: "tapas",
      items: [
        { name: "Patates braves / Patatas bravas.", price: "8.00" },
        { name: "Croquetes de carn d'olla, 6 unitats / Croquetas de cocido, 6 unidades.", price: "10.00" },
        { name: "Cassoleta de xistorra de Navarra amb mel i sèsam / Cazuela de chisttorra de Navarra con miel y sésamo.", price: "10.00" },
        { name: "Camembert al forn amb raïm, nous i melmelada de pebrot escalivat / Camembert al horno con uvas, nueces y mermelada de pimiento escalivado.", price: "16.00" },
        { name: "Ous estrellats sobre niu de patates i pernil ibèric / Huevos estrellados sobre nido de patatas y jamón ibérico.", price: "16.00" },
        { name: "Calamars a l'andalusa amb ceba caramelitzada / Calamares a la andaluza con cebolla caramelizada.", price: "12.00" },
        { name: "Albergínia fregida a la mel i pebrot del padró / Berenjena frita con miel y pimiento del padrón.", price: "12.00" },
        { name: "Sépia amb all i oli / Sepia con alioli.", price: "15.00" },
      ]
    },
    {
      id: "sec_3",
      category: "PLATS CUINATS · PLATOS COCINADOS",
      icon: "skillet",
      items: [
        { name: "Galta de vedella amb caramel de vi i patata gratinada / Carrillera de ternera con caramelo de vino y patata gratinada.", price: "18.00" },
        { name: "Filets de cérvol adobat a la planxa / Filetes de ciervo adobado a la plancha.", price: "20.00" },
        { name: "Cabrit arrebossat (mitjanes i costelletes) / Cabrito rebozado (medianas y costillitas).", price: "22.00" },
        { name: "Cassola de peus de porc amb escamarlans / Cazuela de pies de cerdo con cigalas.", price: "19.00" },
        { name: "Espatlla de cabrit al forn / Paletilla de cabrito al horno.", price: "28.00" },
      ]
    },
    {
      id: "sec_4",
      category: "CARNS A LA BRASA · CARNES A LA BRASA",
      icon: "outdoor_grill",
      items: [
        { name: "Llonganissa de la Selva / Longaniza de la Selva.", price: "14.00" },
        { name: "Cuixa de pollastre / Muslo de pollo.", price: "12.00" },
        { name: "Llodrigó a la brasa amb all i oli / Gazapo a la brasa con ali oli.", price: "19.00" },
        { name: "Peus de porc de Can Pistraques / Pies de cerdo de Can Pistraques.", price: "16.00" },
        { name: "Costelles de xai. / Costillas de cordero.", price: "20.00" },
        { name: "Entrecot de vedella de 300 gr. / Entrecot de ternera de 300 gr.", price: "24.00" },
        { name: "Filet de vedella de 280 gr. / Solomillo de ternera de 280 gr.", price: "26.00" },
        { name: "Graellada de carn (llonganissa, cansalada, butifarra negra i xai) / Parrillada de carne (longaniza, panceta, morcilla negra y cordero).", price: "25.00" },
        { name: "Lagarto de porc gallec alimentat amb castanyes / Lagarto de cerdo gallego alimentado con castañas.", price: "19.00" },
        { name: "Tarrina d'allioli / Tarrina de \"alioli\".", price: "2.50" },
        { name: "Tarrina de romesco / Tarrina de \"romesco\".", price: "2.50" },
        { name: "Salsa de pebre verd o roquefort / Salsa de pimienta verde o roquefort.", price: "2.50" },
        { name: "Plat patates fregides / Plato patatas fritas.", price: "4.50" },
      ]
    },
    {
      id: "sec_5",
      category: "PEIX · PESCADO",
      icon: "set_meal",
      items: [
        { name: "Pota de pop a la brasa amb patata confitada / Pata de pulpo a la brasa con patata confitada.", price: "25.00" },
        { name: "Bacallà al forn amb crema d'alls tendres i xerris / Bacalao al horno con crema de ajos tiernos y cherrys.", price: "19.00" },
        { name: "Llenguado a la brasa regat amb oli a l'Orio / Lenguado a la brasa regado con aceite al Orio.", price: "20.00" },
      ]
    },
    {
      id: "sec_6",
      category: "VEGETARIANS · VEGANS",
      icon: "eco",
      items: [
        { name: "Timbal d'escalivada amb patata i bolets / Timbal de escalivada con patata y setas.", price: "14.00" },
        { name: "Amanida amb fruita i vinagreta de cítrics / Ensalada con fruta y vinagreta de cítricos.", price: "14.00" },
        { name: "Parrillada de verdures / Parrillada de verduras.", price: "15.00" },
        { name: "Hummus amb albergínia i pebrot escalivat / Hummus con berenjena y pimientos escalivados.", price: "15.00" },
      ]
    },
    {
      id: "sec_7",
      category: "LLESQUES I HAMBURGUESES · LLESCAS Y HAMBURGUESAS",
      icon: "lunch_dining",
      items: [
        { name: "Esperdenya de llonganissa amb salsa de tomaquet escalivat / Llesca de longaniza con salsa de tomate escalivado.", price: "15.00" },
        { name: "Esperdenya amb anxoves i olives / Llesca con anchoas y aceitunas.", price: "13.00" },
        { name: "Torrada amb sobrassada, formatge de cabra i mel / Tostada con sobrasada, queso de cabra y miel.", price: "14.00" },
        { name: "Hamburguesa amb formatge gouda, enciam i tomàquet / Hamburguesa con queso gouda, lechuga y tomate.", price: "12.00" },
        { name: "Hamburguesa amb formatge gouda, melmelada, beicon, ceba encurtida, cogombrets i mahonesa de chimichurri / Hamburguesa con queso gouda, mermelada, beicon, cebolla encurtida, pepinillos y mayonesa de chimichurri.", price: "15.00" },
      ]
    },
    {
      id: "sec_8",
      category: "PLATS INFANTILS · PLATOS INFANTILES",
      icon: "child_care",
      items: [
        { name: "Macarrons a la bolonyesa / Macarrones a la boloñesa.", price: "10.00" },
        { name: "Combinat amb escalopa de pollastre, macarrons i patates / Combinado con escalopa de pollo, macarrones y patatas.", price: "15.00" },
        { name: "Combinat amb hamburguesa de vedella, macarrons i patates / Combinado con hamburguesa de ternera, macarrones y patatas.", price: "16.00" },
        { name: "Escalopa de pollastre amb patates / Escalopa de pollo con patatas.", price: "10.00" },
        { name: "Hamburguesa de vedella amb patates / Hamburguesa de ternera con patatas.", price: "10.00" },
      ],
      footer: "MÀXIM FINS A 12 ANYS I NO ES POT COMPARTIR / MÁXIMO HASTA 12 AÑOS Y NO SE PUEDE COMPARTIR."
    },
    {
      id: "sec_9",
      category: "POSTRES · POSTRES",
      icon: "icecream",
      items: [
        { name: "Crema catalana / Crema catalana.", price: "6.00" },
        { name: "Torrija d'orxata amb gelat de canyella / Torrija de horchata con helado de canela.", price: "6.50" },
        { name: "Coulant de xocolata sense gluten amb gelat de vainilla / Coulant de chocolate sin gluten con helado de vainilla.", price: "7.50" },
        { name: "Coulant de xocolata amb gelat de vainilla / Coulant de chocolate con helado de vainilla.", price: "6.00" },
        { name: "Pastís de formatge amb fruits del bosc / Tarta de queso con frutos del bosque.", price: "7.00" },
        { name: "Lioneses farcides de nata amb xocolata calenta / Lionesas rellenas de nata con chocolate caliente.", price: "6.50" },
        { name: "Postre de músic amb fruits secs i porró de moscatell / Postre de músico con frutos secos y porrón de moscatel.", price: "10.50" },
        { name: "Cafè irlandes / Café irlandes.", price: "7.00" },
      ]
    },
    {
      id: "sec_10",
      category: "BOLES DE GELAT · BOLAS DE HELADO",
      icon: "icecream",
      items: [
        { name: "Vainilla / Vainilla.", price: "6.00" },
        { name: "Xocolata / Chocolate.", price: "6.00" },
        { name: "Avellana /Avellana.", price: "7.00" },
        { name: "Sorbet de llimona / Sorbete de limón.", price: "7.00" },
        { name: "Sorbet de mandarina / Sorbete de mandarina.", price: "7.00" },
      ]
    }
  ],
  groupMenu: {
    title: "MENÚ DE GRUP",
    price: "39 EUROS",
    vat: "IVA INCLÒS",
    disclaimer: "*Qualsevol beguda no inclosa al menú es cobrarà a part.",
    sections: [
        {
            title: "PER PICAR AL MIG DE LA TAULA",
            items: [
                { 
                    nameCa: "Amanida de fumats amb vinagreta d'avellana.", 
                    nameEs: "Ensalada de ahumados con vinagreta de avellana." 
                },
                { 
                    nameCa: "Caneló cruixent de confit d'ànec i bolets.", 
                    nameEs: "Canelón crujiente de confit de pato y setas." 
                },
                { 
                    nameCa: "Assortiment de formatges i embotits.", 
                    nameEs: "Surtido de quesos y embutidos." 
                },
                { 
                    nameCa: "Patates braves de l'Ermita.", 
                    nameEs: "Patatas bravas de la Ermita." 
                }
            ]
        },
        {
            title: "SEGONS A TRIAR",
            items: [
                { 
                    nameCa: "Llobarro farcit de verdures fetes a la brasa amb orio de tomaquets xerrys.", 
                    nameEs: "Lubina rellena de verduras a la brasa con orio de tomates cherry." 
                },
                { 
                    nameCa: "Espatlla de xai al forn al estil tradicional.", 
                    nameEs: "Paletilla de cordero al horno al estilo tradicional." 
                },
                { 
                    nameCa: "Timbal d'escalivada amb patata confitada i ceps.", 
                    nameEs: "Timbal de escalivada con patata confitada y setas." 
                },
                { 
                    nameCa: "Presa duroc a la brasa amb guarnició.", 
                    nameEs: "Presa duroc a la brasa con guarnición." 
                }
            ]
        },
        {
            title: "POSTRES",
            items: [
                { 
                    nameCa: "Torrija d'orxata amb xocolata calenta i gelat de canyella.", 
                    nameEs: "Torrija de horchata con chocolate caliente y helado de canela." 
                },
                { 
                    nameCa: "Caneló amb trufa i salsa toffe.", 
                    nameEs: "Canelón con trufa y salsa toffee." 
                },
                { 
                    nameCa: "Pannacotta amb fruits vermells.", 
                    nameEs: "Pannacotta con frutos rojos." 
                },
                { 
                    nameCa: "Sorbet de llimona amb coulis de menta.", 
                    nameEs: "Sorbete de limón con coulis de menta." 
                }
            ]
        }
    ],
    drinks: [
        "Vi negre o Vi blanc, 1 ampolla per cada 4 persones",
        "Aigua d'un litre, 1 ampolla per cada 2 persones",
        "Pa, cafè i infusió."
    ],
    infoIntro: "A l’Ermita t’oferim un menú especial per a grups, una selecció de les nostres millors receptes a preus per a qualsevol pressupost.",
    infoAllergy: "En el cas que algun comensal tingués algun tipus d’intolerància alimentària, no dubtis a dir-nos, el nostre equip de cuina s’encarregarà d’oferir les millors alternatives perquè pugui gaudir del menjar."
  },
  contact: {
    importantNoteTitle: "Important!",
    importantNoteMessage1: "Només acceptem reserves per telèfon.",
    importantNoteMessage2: "Per altres consultes, envieu el formulari. Gràcies!",
    phoneNumbers: ["977 84 08 70", "619 685 156"],
    
    // Default Location
    sectionTitle: "Estem a prop teu",
    locationTitle: "Localització",
    addressLine1: "Carretera de la Selva-Villalonga, Km 2",
    addressLine2: "43470 La Selva del Camp",
    schedule: "De dimarts a diumenge de 11:00 a 17:00 h.",
    directionsButtonText: "PORTA'M-HI",
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Ermita+Paret+Delgada+Restaurant",

    // Social Media Defaults
    instagramUrl: "https://www.instagram.com/paret_delgada/",
    socialTitle: "Xarxes Socials",
    socialDescription: "Segueix el nostre dia a dia.",
    socialButtonText: "SEGUEIX-NOS",

    formTitle: "Formulari de Contacte",
    formNameLabel: "El teu nom",
    formEmailLabel: "El teu email",
    formPhoneLabel: "El teu telèfon",
    formSubjectLabel: "Assumpte",
    formMessageLabel: "Missatge",
    formButtonText: "Enviar Missatge"
  },
  navbar: {
    reserveButtonText: "Reserva",
  }
};

// 3. Define the context type
interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
  isLoading: boolean;
}

// 4. Create the context
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// 5. Create the ConfigProvider component
interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load config from Realtime Database on mount
  useEffect(() => {
    // Apuntamos al nodo 'websiteConfig' que se ve en tu captura
    const dbRef = ref(db, 'websiteConfig');

    // Subscribe to real-time updates
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Partial<AppConfig>;
        
        // Merge with default to ensure all fields exist even if DB is partial
        setConfig(prev => ({
           ...prev,
           ...data,
           brand: { ...prev.brand, ...data.brand },
           hero: { ...prev.hero, ...data.hero },
           intro: { ...prev.intro, ...data.intro },
           specialties: { ...prev.specialties, ...data.specialties },
           philosophy: { ...prev.philosophy, ...data.philosophy },
           contact: { ...prev.contact, ...data.contact },
           navbar: { ...prev.navbar, ...data.navbar },
           // Arrays need fallback if empty in DB
           foodMenu: data.foodMenu || prev.foodMenu,
           groupMenu: data.groupMenu ? {
                ...prev.groupMenu,
                ...data.groupMenu,
                sections: data.groupMenu.sections || prev.groupMenu.sections
           } : prev.groupMenu
        }));
      } else {
        // Si no existe (es la primera vez), subimos la configuración por defecto
        try {
          set(dbRef, defaultAppConfig);
          console.log("Created default configuration in Realtime Database");
        } catch (e) {
          console.error("Error creating default config:", e);
        }
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to config:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    // 1. Optimistic update (for UI responsiveness)
    setConfig(prev => {
        const merged = { ...prev, ...newConfig };
        return merged;
    });

    // 2. Save to Realtime Database
    try {
      const dbRef = ref(db, 'websiteConfig');
      const configToSave = { ...config, ...newConfig };
      await set(dbRef, configToSave);
      console.log("Config saved to Realtime Database successfully");
    } catch (error) {
      console.error("Error saving config to Database:", error);
      alert("Error guardant a la base de dades. Comprova la connexió.");
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};