import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

// 0. Define Menu Types

// --- FOOD MENU TYPES ---
export interface FoodMenuItem {
  nameCa: string;
  nameEs: string;
  price: string;
}

export interface MenuSection {
  id: string;
  category: string;
  icon?: string; 
  items: FoodMenuItem[];
  footer?: string;
}

// --- GROUP MENU TYPES ---
export interface GroupMenuItem {
  nameCa: string;
  nameEs: string;
}

export interface GroupMenuSection {
  title: string;
  items: GroupMenuItem[];
}

// --- WINE MENU TYPES ---
export interface WineItem {
  name: string;
  desc: string;
  price: string;
}

export interface WineGroup {
  sub: string; // Sub-header (e.g., D.O. Terra Alta)
  items: WineItem[];
}

export interface WineCategory {
  category: string; // Header (e.g., Negres)
  groups: WineGroup[];
}

// --- EXTRA MENU WRAPPER ---
export interface ExtraMenu {
  id: string;
  type: 'food' | 'wine' | 'group';
  title: string;
  data: MenuSection[] | WineCategory[] | any; // 'any' for group menu structure to avoid complex union types issues in simple context
}

// 1. Define the AppConfig interface
export interface AppConfig {
  brand: {
    logoUrl: string;
  };
  adminSettings: {
    customDisplayName: string;
  };
  hero: {
    reservationVisible?: boolean;
    reservationFormTitle: string;
    reservationFormSubtitle: string;
    reservationPhoneNumber: string;
    reservationButtonText: string;
    stickyNoteText: string;
    backgroundImages: string[];
    reservationTimeStart: string;
    reservationTimeEnd: string;
    reservationTimeInterval: number;
    reservationErrorMessage: string;
    formNameLabel: string;
    formPhoneLabel: string;
    formDateLabel: string;
    formPaxLabel: string;
    formNotesLabel: string;
    formPrivacyLabel: string;
    formCallUsLabel: string;
  };
  intro: {
    visible?: boolean;
    smallTitle: string;
    mainTitle: string;
    description: string;
  };
  specialties: {
    visible?: boolean;
    sectionTitle: string;
    mainTitle: string;
    description: string;
    items: Array<{
      title: string;
      subtitle: string;
      image: string;
      badge?: string;
      description?: string; 
      visible?: boolean;
    }>;
  };
  philosophy: {
    visible?: boolean;
    sectionTitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    cardTag: string;
    productTitle: string;
    productDescription: string;
    productImages: string[];
    historicTitle: string;
    historicDescription: string;
    historicLinkUrl: string;
    historicImages: string[];
  };
  // NEW GASTRONOMY SECTION
  gastronomy: {
    visible?: boolean;
    topTitle: string;
    mainTitle: string;
    description: string;
    card1: {
      title: string;
      subtitle: string;
      description: string; // Added for consistency
      price: string;
      footerText: string;
      image: string;
      buttonText: string;
      targetTab: string; 
    };
    card2: {
      title: string;
      subtitle: string;
      description: string;
      price: string; // Added for consistency
      footerText: string; // Added for consistency
      image: string;
      buttonText: string;
      targetTab: string;
    };
    footerTitle: string;
    footerLinks: Array<{ label: string; icon: string; targetTab: string }>;
  };
  
  dailyMenu: { // NEW DEDICATED DAILY MENU SECTION
    title: string;
    price: string;
    vat: string;
    disclaimer: string;
    sections: GroupMenuSection[];
    drinks: string[];
    infoIntro: string;
    infoAllergy: string;
    footerText?: string;
  };

  foodMenu: MenuSection[]; 
  wineMenu: WineCategory[]; 
  
  groupMenu: {
    title: string;
    price: string;
    vat: string;
    disclaimer: string;
    sections: GroupMenuSection[];
    drinks: string[];
    infoIntro: string;
    infoAllergy: string;
    footerText?: string;
  };

  extraMenus: ExtraMenu[];

  contact: {
    importantNoteVisible?: boolean;
    infoVisible?: boolean;
    socialVisible?: boolean;
    formVisible?: boolean;

    importantNoteTitle: string;
    importantNoteMessage1: string;
    importantNoteMessage2: string;
    phoneNumbers: string[];
    sectionTitle: string;
    locationTitle: string;
    addressLine1: string;
    addressLine2: string;
    schedule: string;
    directionsButtonText: string;
    mapUrl: string;
    instagramUrl: string;
    socialTitle: string;
    socialDescription: string;
    socialButtonText: string;
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

// 2. Define default values
export const defaultAppConfig: AppConfig = {
  brand: {
    logoUrl: "", 
  },
  adminSettings: {
    customDisplayName: ""
  },
  hero: {
    reservationVisible: true,
    reservationFormTitle: "Reserva Taula!",
    reservationFormSubtitle: "omple'l o truca'ns!",
    reservationPhoneNumber: "977 84 08 70",
    reservationButtonText: "Reservar Ara!",
    stickyNoteText: "Obert tot l'any!",
    backgroundImages: [
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_5.png",
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_4.png"
    ],
    reservationTimeStart: "13:00",
    reservationTimeEnd: "15:30",
    reservationTimeInterval: 15,
    reservationErrorMessage: "Ho sentim, l'horari de reserva és de", 
    formNameLabel: "Nom:",
    formPhoneLabel: "Telèfon:",
    formDateLabel: "Dia i hora:",
    formPaxLabel: "Gent:",
    formNotesLabel: "Notes:",
    formPrivacyLabel: "Si, accepto la privacitat.",
    formCallUsLabel: "O truca'ns:"
  },
  intro: {
    visible: true,
    smallTitle: "Filosofia",
    mainTitle: "Menjar típic català i casolà.",
    description: "\"Calçotades com al mas, cuina tradicional catalana i carns a la brasa amb llenya d’olivera. Gaudint de l'entorn històric i la tranquil·litat de la nostra terra.\""
  },
  specialties: {
    visible: true,
    sectionTitle: "Autèntics Sabors",
    mainTitle: "Les Nostres Especialitats",
    description: "Una selecció de plats i vins que representen l'essència de la nostra terra, cuinats amb passió i producte de proximitat.",
    items: [
      {
        title: "Carns a la Brasa",
        subtitle: "Llenya d'olivera",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
        badge: "",
        description: "Descobreix els sabors autèntics de la nostra terra, cuinats amb passió i respecte pel producte.",
        visible: true
      },
      {
        title: "Calçotades",
        subtitle: "Salsa Romesco",
        image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=2070&auto=format&fit=crop",
        badge: "Temporada",
        description: "Descobreix els sabors autèntics de la nostra terra, cuinats amb passió i respecte pel producte.",
        visible: true
      },
      {
        title: "Vins de Proximitat",
        subtitle: "DO Tarragona",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
        badge: "Celler",
        description: "Descobreix els sabors autèntics de la nostra terra, cuinats amb passió i respecte pel producte.",
        visible: true
      }
    ]
  },
  philosophy: {
    visible: true,
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
  gastronomy: {
    visible: true,
    topTitle: "LA NOSTRA PROPOSTA",
    mainTitle: "Gastronomia Local",
    description: "Productes de quilòmetre zero, receptes de tota la vida i el sabor autèntic de la brasa.",
    card1: {
      title: "Menú Diari",
      subtitle: "DE DIMARTS A DIVENDRES",
      description: "", // Added default
      footerText: "Cuina de mercat segons temporada",
      price: "18€",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop",
      buttonText: "VEURE MENÚ",
      targetTab: "daily"
    },
    card2: {
      title: "Carta Completa",
      subtitle: "CAPS DE SETMANA I FESTIUS",
      description: "Especialitats a la brasa, carns madurades i els clàssics de la cuina catalana.",
      price: "", // Added default
      footerText: "", // Added default
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
      buttonText: "DESCOBRIR CARTA",
      targetTab: "food"
    },
    footerTitle: "TAMBÉ DISPONIBLE",
    footerLinks: [
      { label: "Menú Calçotada", icon: "restaurant", targetTab: "extra_1" },
      { label: "Menú Infantil", icon: "child_care", targetTab: "food" },
      { label: "Carta de Vins", icon: "wine_bar", targetTab: "wine" }
    ]
  },
  // --- NEW DAILY MENU DEFAULT DATA ---
  dailyMenu: {
    title: "Menú Diari",
    price: "18€",
    vat: "IVA inclòs",
    disclaimer: "Vàlid de dimarts a divendres (no festius)",
    sections: [
        {
            title: "PRIMERS PLATS",
            items: [
                { nameCa: "Amanida de formatge de cabra amb fruits secs", nameEs: "Ensalada de queso de cabra" },
                { nameCa: "Canelons casolans de l'àvia", nameEs: "Canelones caseros de la abuela" },
                { nameCa: "Escudella barrejada", nameEs: "Escudella catalana" }
            ]
        },
        {
            title: "SEGONS PLATS",
            items: [
                { nameCa: "Botifarra a la brasa amb mongetes", nameEs: "Butifarra a la brasa con judías" },
                { nameCa: "Peix fresc de la llotja", nameEs: "Pescado fresco del día" },
                { nameCa: "Pollastre de pagès rostit", nameEs: "Pollo de payés asado" }
            ]
        },
        {
            title: "POSTRES",
            items: [
                { nameCa: "Crema Catalana", nameEs: "Crema Catalana" },
                { nameCa: "Flam d'ou casolà", nameEs: "Flan de huevo casero" },
                { nameCa: "Fruita del temps", nameEs: "Fruta del tiempo" }
            ]
        }
    ],
    drinks: ["Aigua", "Vi de la casa", "Gasosa"],
    infoIntro: "El menú inclou primer plat, segon plat, postres, pa, aigua i vi.",
    infoAllergy: "Si tens alguna al·lèrgia, informa el nostre personal.",
    footerText: "Cuina de mercat"
  },
  
  // --- UPDATED FOOD MENU INTEGRATION (EXACT CARTA 2) ---
  foodMenu: [
    // 1. TAPES / TAPAS
    {
      id: "sec_tapas",
      category: "TAPES · TAPAS",
      icon: "tapas",
      items: [
        { nameCa: "Gilda d'anxova de Perellò 1898", nameEs: "Anxova 00, oliva gordal, piparra de Navarra i tomàquet sec (1 unitat).", price: "3.50€" },
        { nameCa: "Patates braves", nameEs: "Patatas bravas.", price: "8.00€" },
        { nameCa: "Croquetes de carn d'olla, 6 unitats", nameEs: "Croquetas de cocido, 6 unidades.", price: "10.00€" },
        { nameCa: "Camembert al forn amb peres rostides, nous i oli d'avellana", nameEs: "Camembert al horno con peras asadas, nueces y aceite de avellanas.", price: "16.00€" },
        { nameCa: "Ous estrellats sobre niu de patates i pernil ibèric amb Foie", nameEs: "Huevos estrellados sobre nido de patatas y jamón ibérico con Foie.", price: "17.00€" },
        { nameCa: "Ous estrellats sobre niu de patates i cua de bou", nameEs: "Huevos estrellados sobre nido de patatas y rabo de toro.", price: "18.00€" }
      ]
    },
    // 2. ENTRANTS / ENTRANTES
    {
      id: "sec_entrants",
      category: "ENTRANTS · ENTRANTES",
      icon: "soup_kitchen",
      items: [
        { nameCa: "Ració de pa torrat, alls i tomacons", nameEs: "Ración de pan tostado, ajos y tomates.", price: "5.00€" },
        { nameCa: "Amanida verda de l'horta", nameEs: "Ensalada verde de la huerta.", price: "12.00€" },
        { nameCa: "Timbal d'escalivada amb patata i bolets", nameEs: "Timbal de escalivada con patata y setas.", price: "14.00€" },
        { nameCa: "Canelons de carn casolans, gratinats", nameEs: "Canelones caseros de carne, gratinados.", price: "14.00€" },
        { nameCa: "Escarola amb romesco i bacallà", nameEs: "Escarola con romesco y bacalao.", price: "16.00€" },
        { nameCa: "Amanida tèbia de formatge de cabra amb pasta brick, carabassa caramel·litzada, bolets i vinagreta de mel de romaní", nameEs: "Ensalada tibia de queso de cabra con pasta brick, calabaza caramelizada, setas y vinagreta de miel de romero.", price: "16.00€" },
        { nameCa: "Coca amb crema de xirivia, bolets, fonoll caramel·litzat i verdures a la brasa", nameEs: "Coca con crema de chirivía, setas, hinojo caramelizado y verduras a la brasa.", price: "16.00€" },
        { nameCa: "Coca amb crema de xirivia, bolets, fonoll caramel·litzat i verdures a la brasa amb formatge de cabra", nameEs: "Coca con crema de chirivía, setas, hinojo caramelizado y verduras a la brasa con queso de cabra.", price: "18.00€" },
        { nameCa: "Coca de carxofa confitada, foie i pernil ibèric", nameEs: "Coca de alcachofa confitada, foie y jamón ibérico.", price: "18.00€" },
        { nameCa: "Carpaccio de xuleta de vaca madurada Okelan", nameEs: "Carpaccio de chuleta de ternera madurada Okelan.", price: "18.00€" },
        { nameCa: "Cargols a la llauna fets a la brasa", nameEs: "Caracoles a la \"llauna\" hechos a la brasa.", price: "19.00€" },
        { nameCa: "Cabrit arrebossat", nameEs: "Cabrito rebozado.", price: "22.00€" }
      ]
    },
    // 3. PLATS CUINATS / PLATOS COCINADOS
    {
      id: "sec_plats_cuinats",
      category: "PLATS CUINATS · PLATOS COCINADOS",
      icon: "skillet",
      items: [
        { nameCa: "Escudella catalana", nameEs: "Escudella catalana.", price: "13.00€" },
        { nameCa: "Galta de vedella al toc de vi", nameEs: "Carrillera de ternera con toque de vino.", price: "18.00€" },
        { nameCa: "Cassola de peus de porc amb escamarlans", nameEs: "Cazuela de pies de cerdo con cigalas.", price: "19.00€" },
        { nameCa: "Cabrit km0 a baixa temperatura amb ametlles i farigola", nameEs: "Cabrito km0 a baja temperatura con almendras y tomillo.", price: "29.00€" }
      ]
    },
    // 4. CARNS A LA BRASA / CARNES A LA BRASA
    {
      id: "sec_carns",
      category: "CARNS A LA BRASA · CARNES A LA BRASA",
      icon: "outdoor_grill",
      items: [
        { nameCa: "Cuixa de pollastre", nameEs: "Muslo de pollo.", price: "12.00€" },
        { nameCa: "Llonganissa de la Selva", nameEs: "Longaniza de la Selva.", price: "14.00€" },
        { nameCa: "Peus de porc de Can Pistraques", nameEs: "Pies de cerdo de Can Pistraques.", price: "16.00€" },
        { nameCa: "Presa ibèrica a la brasa", nameEs: "Presa ibérica a la brasa.", price: "18.00€" },
        { nameCa: "Llodrigó a la brasa amb all i oli", nameEs: "Gazapo a la brasa con ali oli.", price: "19.00€" },
        { nameCa: "Costelles de xai", nameEs: "Costillas de cordero.", price: "20.00€" },
        { nameCa: "Entrecot de vedella de 300 gr.", nameEs: "Entrecot de ternera de 300 gr.", price: "22.00€" },
        { nameCa: "Txuletó \"Simmental\" 500gr madurat 30 dies", nameEs: "Chuletón \"Simmental\" 500gr madurado 30 días.", price: "24.00€" },
        { nameCa: "Graellada de carn (llonganissa, cansalada, butifarra negra i xai)", nameEs: "Parrillada de carne (longaniza, panceta, morcilla negra y cordero).", price: "25.00€" },
        { nameCa: "Filet de vedella de 280 gr.", nameEs: "Solomillo de ternera de 280 gr.", price: "26.00€" },
        { nameCa: "Txuletó \"Simmental\" 1kg madurat 30 dies", nameEs: "Chuletón \"Simmental\" 1kg madurado 30 días.", price: "43.00€" }
      ]
    },
    // 5. PEIX / PESCADO
    {
      id: "sec_peix",
      category: "PEIX · PESCADO",
      icon: "set_meal",
      items: [
        { nameCa: "Bacallà al pil-pil de bolets i calçots confitats", nameEs: "Bacalao al pil-pil de setas y calçots confitados.", price: "19.00€" },
        { nameCa: "Llenguado a la brasa regat amb oli a l'Orio", nameEs: "Lenguado a la brasa regado con aceite al Orio.", price: "20.00€" },
        { nameCa: "Pota de pop a la brasa", nameEs: "Pata de pulpo a la brasa.", price: "25.00€" }
      ]
    },
    // 6. GUARNICIÓ / GUARNICIÓN
    {
      id: "sec_guarnicio",
      category: "GUARNICIÓ · GUARNICIÓN",
      icon: "rice_bowl",
      items: [
        { nameCa: "Plat de fesols", nameEs: "Plato de alubias.", price: "4.00€" },
        { nameCa: "Plat de patates fregides casolanes", nameEs: "Plato de patatas fritas caseras.", price: "4.00€" },
        { nameCa: "Plat d'escalivada", nameEs: "Plato de escalivada.", price: "5.00€" }
      ]
    },
    // 7. PLATS INFANTILS / PLATOS INFANTILES
    {
      id: "sec_infantils",
      category: "PLATS INFANTILS · PLATOS INFANTILES",
      icon: "child_care",
      items: [
        { nameCa: "Macarrons a la bolonyesa", nameEs: "Macarrones a la boloñesa.", price: "10.00€" },
        { nameCa: "Escalopa de pollastre amb patates", nameEs: "Escalopa de pollo con patatas.", price: "10.00€" },
        { nameCa: "Combinat amb escalopa de pollastre, macarrons i patates", nameEs: "Combinado con escalopa de pollo, macarrones y patatas.", price: "15.00€" }
      ],
      footer: "MÀXIM FINS A 12 ANYS I NO ES POT COMPARTIR / MÁXIMO HASTA 12 AÑOS Y NO SE PUEDE COMPARTIR."
    },
    // 8. POSTRES / POSTRES
    {
      id: "sec_postres",
      category: "POSTRES · POSTRES",
      icon: "cake",
      items: [
        { nameCa: "Crema catalana", nameEs: "Crema catalana.", price: "6.00€" },
        { nameCa: "Torrija d'orxata amb gelat de canyella", nameEs: "Torrija de horchata con helado de canela.", price: "6.00€" },
        { nameCa: "Coulant de xocolata amb gelat de vainilla", nameEs: "Coulant de chocolate con helado de vainilla.", price: "6.00€" },
        { nameCa: "Profiterols farcits de crema amb bany de xocolata", nameEs: "Profiteroles rellenos de crema con baño de chocolate.", price: "6.00€" },
        { nameCa: "Pastís de pastanaga", nameEs: "Tarta de zanahoria.", price: "6.00€" },
        { nameCa: "Pastís de formatge (sense gluten)", nameEs: "Tarta de queso (sin gluten).", price: "7.00€" },
        { nameCa: "Coulant d'avellana de la Selva", nameEs: "Coulant de avellana de la Selva.", price: "7.00€" },
        { nameCa: "Cafè irlandes", nameEs: "Café irlandes.", price: "7.00€" },
        { nameCa: "Postre de músic amb fruits secs i porró de moscatell", nameEs: "Postre de músico con frutos secos y porrón de moscatel.", price: "10.00€" }
      ]
    },
    // 9. BOLES DE GELAT / BOLAS DE HELADO
    {
      id: "sec_gelats",
      category: "BOLES DE GELAT · BOLAS DE HELADO",
      icon: "icecream",
      items: [
        { nameCa: "Vainilla", nameEs: "Vainilla.", price: "6.00€" },
        { nameCa: "Xocolata", nameEs: "Chocolate.", price: "6.00€" },
        { nameCa: "Sorbet de llimona", nameEs: "Sorbete de limón.", price: "7.00€" }
      ]
    }
  ],
  
  wineMenu: [],
  groupMenu: {
    title: "Menú de Grup",
    price: "Consultar",
    vat: "IVA inclòs",
    disclaimer: "Mínim 10 persones",
    sections: [],
    drinks: ["Aigua", "Vi de la casa"],
    infoIntro: "El menú inclou...",
    infoAllergy: "Consulteu al·lèrgens."
  },
  extraMenus: [],
  contact: {
    importantNoteVisible: true,
    infoVisible: true,
    socialVisible: true,
    formVisible: true,
    importantNoteTitle: "Nota Important",
    importantNoteMessage1: "Obert caps de setmana i festius.",
    importantNoteMessage2: "Reserves recomanades.",
    phoneNumbers: ["+34 977 84 08 70"],
    sectionTitle: "Contacte i Ubicació",
    locationTitle: "On som",
    addressLine1: "Ctra. de la Selva a Vilallonga, Km 2",
    addressLine2: "43470 La Selva del Camp, Tarragona",
    schedule: "Dimarts a Diumenge 13:00 - 16:00",
    directionsButtonText: "Com arribar-hi",
    mapUrl: "https://goo.gl/maps/example",
    instagramUrl: "https://instagram.com/example",
    socialTitle: "Segueix-nos",
    socialDescription: "Per estar al dia de les nostres novetats.",
    socialButtonText: "Instagram",
    formTitle: "Envia'ns un missatge",
    formNameLabel: "Nom",
    formEmailLabel: "Email",
    formPhoneLabel: "Telèfon",
    formSubjectLabel: "Assumpte",
    formMessageLabel: "Missatge",
    formButtonText: "Enviar"
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
           adminSettings: { ...prev.adminSettings, ...data.adminSettings },
           hero: { ...prev.hero, ...data.hero },
           intro: { ...prev.intro, ...data.intro },
           specialties: { ...prev.specialties, ...data.specialties },
           philosophy: { ...prev.philosophy, ...data.philosophy },
           gastronomy: { ...prev.gastronomy, ...data.gastronomy }, // Merge new section
           dailyMenu: data.dailyMenu ? { ...prev.dailyMenu, ...data.dailyMenu } : prev.dailyMenu, // Merge daily menu
           contact: { ...prev.contact, ...data.contact },
           navbar: { ...prev.navbar, ...data.navbar },
           // Arrays need fallback if empty in DB
           foodMenu: data.foodMenu || prev.foodMenu,
           wineMenu: data.wineMenu || prev.wineMenu,
           extraMenus: data.extraMenus || prev.extraMenus || [], 
           groupMenu: data.groupMenu ? {
                ...prev.groupMenu,
                ...data.groupMenu,
                sections: data.groupMenu.sections || prev.groupMenu.sections
           } : prev.groupMenu
        }));
      } else {
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
    setConfig(prev => {
        const merged = { ...prev, ...newConfig };
        return merged;
    });

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