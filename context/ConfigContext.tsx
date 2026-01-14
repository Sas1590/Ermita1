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
    reservationVisible?: boolean; // NEW: Toggle Reservation Form
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
    // New Form Labels
    formNameLabel: string;
    formPhoneLabel: string;
    formDateLabel: string;
    formPaxLabel: string;
    formNotesLabel: string;
    formPrivacyLabel: string;
    formCallUsLabel: string;
  };
  intro: {
    visible?: boolean; // NEW: Toggle Intro Section
    smallTitle: string;
    mainTitle: string;
    description: string;
  };
  specialties: {
    visible?: boolean; // NEW: Toggle Whole Section
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
    visible?: boolean; // NEW: Toggle Philosophy Section
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
    // Visibility Flags
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

// 2. Define default values for the configuration (Fallback)
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
  foodMenu: [],
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