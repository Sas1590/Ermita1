import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

// 0. Define Menu Types

// --- FOOD MENU TYPES ---
export interface FoodMenuItem {
  nameCa: string;
  nameEs: string;
  price: string;
  visible?: boolean;      // NEW
  strikethrough?: boolean; // NEW
}

export interface MenuSection {
  id: string;
  category: string;
  icon?: string; 
  items: FoodMenuItem[];
  footer?: string;
}

// Wrapper for Food Menu (New Structure)
export interface FoodMenuConfig {
  title?: string;
  subtitle?: string; // NEW: Subtitle (e.g. "De dimarts a divendres")
  icon?: string;
  visible?: boolean; // NEW: Visibility Flag
  recommended?: boolean; // NEW: Recommended flag
  price?: string;
  vat?: string;
  infoIntro?: string;
  infoAllergy?: string;
  showPrice?: boolean;
  showInfo?: boolean;
  disclaimer?: string;
  showDisclaimer?: boolean;
  sections: MenuSection[];
}

// --- GROUP MENU TYPES ---
export interface GroupMenuItem {
  nameCa: string;
  nameEs: string;
  visible?: boolean;      // NEW
  strikethrough?: boolean; // NEW
}

export interface GroupMenuSection {
  title: string;
  icon?: string;
  items: GroupMenuItem[];
}

// --- WINE MENU TYPES ---
export interface WineItem {
  name: string;
  desc: string;
  price: string;
  visible?: boolean;      // NEW
  strikethrough?: boolean; // NEW
}

export interface WineGroup {
  sub: string;
  items: WineItem[];
}

export interface WineCategory {
  category: string;
  icon?: string;
  groups: WineGroup[];
}

// Wrapper for Wine Menu (New Structure)
export interface WineMenuConfig {
  title?: string;
  subtitle?: string; // NEW
  icon?: string;
  visible?: boolean; // NEW: Visibility Flag
  recommended?: boolean; // NEW
  price?: string;
  vat?: string;
  infoIntro?: string;
  infoAllergy?: string;
  showPrice?: boolean;
  showInfo?: boolean;
  disclaimer?: string;
  showDisclaimer?: boolean;
  categories: WineCategory[];
}

// --- EXTRA MENU WRAPPER ---
export interface ExtraMenu {
  id: string;
  type: 'food' | 'wine' | 'group' | 'daily'; // Updated type definition to include daily
  title: string;
  subtitle?: string; // NEW
  icon?: string; 
  visible?: boolean; // NEW: Visibility Flag
  recommended?: boolean; // NEW
  data: FoodMenuConfig | WineMenuConfig | any; 
}

// 1. Define the AppConfig interface
export interface AppConfig {
  brand: {
    logoUrl: string;
  };
  adminSettings: {
    customDisplayName: string;
    maxExtraMenus: number; // Cap for extra menus
    maxHeroImages: number; // Cap for hero slider images
    maxProductImages: number; // NEW: Cap for product slider images
    maxHistoricImages: number; // NEW: Cap for historic slider images
  };
  menuGlobalFooter: string; // NEW: Global footer text for the Menu page
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
    // NEW FIELDS FOR TEXT OVERLAY
    heroDescription: string;
    heroSchedule: string;
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
    productButtonText: string;
    productImages: string[];
    historicTitle: string;
    historicDescription: string;
    historicLinkUrl: string;
    historicImages: string[];
  };
  gastronomy: {
    visible?: boolean;
    topTitle: string;
    mainTitle: string;
    description: string;
    card1: {
      title: string;
      subtitle: string;
      description: string;
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
      price: string;
      footerText: string;
      image: string;
      buttonText: string;
      targetTab: string;
    };
    footerTitle: string;
    footerLinks: Array<{ label: string; icon: string; targetTab: string }>;
  };
  
  dailyMenu: {
    title: string;
    subtitle?: string; // NEW
    icon?: string;
    visible?: boolean; // NEW
    recommended?: boolean; // NEW
    price: string;
    vat: string;
    disclaimer: string;
    sections: GroupMenuSection[];
    drinks: string[];
    infoIntro: string;
    infoAllergy: string;
    footerText?: string;
  };

  foodMenu: FoodMenuConfig | MenuSection[];
  wineMenu: WineMenuConfig | WineCategory[];
  
  groupMenu: {
    title: string;
    subtitle?: string; // NEW
    icon?: string;
    visible?: boolean; // NEW
    recommended?: boolean; // NEW
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
    customDisplayName: "",
    maxExtraMenus: 10, // Default limit menus
    maxHeroImages: 5, // Default limit hero images
    maxProductImages: 5, // Default limit product images
    maxHistoricImages: 5 // Default limit historic images
  },
  menuGlobalFooter: "* Preus en euros, impostos inclosos. Consultar al·lèrgens al personal de sala.", // Default Value
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
    formCallUsLabel: "O truca'ns:",
    // Default text for hero description
    heroDescription: "Una experiència gastronòmica que uneix tradició i modernitat en un entorn històric inoblidable.",
    // Default schedule for hero
    heroSchedule: "De dimarts a diumenge de 11:00 a 17:00 h."
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
    productButtonText: "VEURE LA NOSTRA CARTA", 
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
      description: "", 
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
      price: "", 
      footerText: "", 
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
  
  dailyMenu: {
    title: "Menú Diari",
    subtitle: "DE DIMARTS A DIVENDRES", 
    icon: "lunch_dining",
    visible: true, // Default Visible
    recommended: true, 
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
        }
    ],
    drinks: ["Aigua", "Vi de la casa", "Gasosa"],
    infoIntro: "El menú inclou primer plat, segon plat, postres, pa, aigua i vi.",
    infoAllergy: "Si tens alguna al·lèrgia, informa el nostre personal.",
    footerText: "Cuina de mercat"
  },
  
  foodMenu: {
    title: "Carta de Menjar",
    icon: "restaurant_menu",
    visible: true, // Default Visible
    recommended: false,
    sections: [
      {
        id: "sec_tapas",
        category: "TAPES · TAPAS",
        icon: "tapas",
        items: [
          { nameCa: "Gilda d'anxova de Perellò 1898", nameEs: "Anxova 00, oliva gordal, piparra de Navarra i tomàquet sec (1 unitat).", price: "3.50€" }
        ]
      }
    ]
  },
  
  wineMenu: {
    title: "Carta de Vins",
    icon: "wine_bar",
    visible: true, // Default Visible
    recommended: false,
    categories: [
      {
          category: "VINS NEGRES",
          groups: [
              {
                  sub: "D.O. TERRA ALTA",
                  items: [
                      { name: "Llàgrimes de Tardor", desc: "Garnatxa, Carinyena", price: "18.50€" }
                  ]
              }
          ]
      }
    ]
  },

  groupMenu: {
    title: "Menú de Grup",
    subtitle: "MÍNIM 10 PERSONES",
    icon: "diversity_3",
    visible: true, // Default Visible
    recommended: false,
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

// HELPER: FORCE ARRAY (Firebase converts arrays to objects if keys are numeric but sparse)
const toArray = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // If it's an object, convert values to array
    return Object.values(data);
};

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
           menuGlobalFooter: data.menuGlobalFooter || prev.menuGlobalFooter, // Ensure this new field is merged
           brand: { ...prev.brand, ...data.brand },
           adminSettings: { ...prev.adminSettings, ...data.adminSettings },
           hero: { ...prev.hero, ...data.hero }, // Will merge heroDescription and heroSchedule automatically
           intro: { ...prev.intro, ...data.intro },
           specialties: { ...prev.specialties, ...data.specialties },
           // Ensure philosophy and productButtonText exist
           philosophy: { 
               ...prev.philosophy, 
               ...data.philosophy,
               productButtonText: data.philosophy?.productButtonText || prev.philosophy.productButtonText || "VEURE LA NOSTRA CARTA"
           },
           gastronomy: { ...prev.gastronomy, ...data.gastronomy }, 
           // MERGE VISIBILITY PROPS SAFELY
           dailyMenu: data.dailyMenu ? { ...prev.dailyMenu, ...data.dailyMenu, visible: data.dailyMenu.visible !== undefined ? data.dailyMenu.visible : prev.dailyMenu.visible } : prev.dailyMenu,
           contact: { ...prev.contact, ...data.contact },
           navbar: { ...prev.navbar, ...data.navbar },
           // Arrays need fallback if empty in DB
           // For Food/Wine, check if it's new object or old array
           foodMenu: data.foodMenu || prev.foodMenu,
           wineMenu: data.wineMenu || prev.wineMenu,
           // CRITICAL FIX: Ensure extraMenus is always an array, even if DB returns object
           extraMenus: toArray(data.extraMenus || prev.extraMenus), 
           groupMenu: data.groupMenu ? {
                ...prev.groupMenu,
                ...data.groupMenu,
                sections: data.groupMenu.sections || prev.groupMenu.sections,
                visible: data.groupMenu.visible !== undefined ? data.groupMenu.visible : prev.groupMenu.visible
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