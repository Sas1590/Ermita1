import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

export interface FoodMenuItem {
  nameCa: string;
  nameEs: string;
  price: string;
  visible?: boolean;
  strikethrough?: boolean;
}

export interface MenuSection {
  id: string;
  category: string;
  icon?: string; 
  items: FoodMenuItem[];
  footer?: string;
}

export interface FoodMenuConfig {
  title?: string;
  subtitle?: string;
  icon?: string;
  visible?: boolean;
  recommended?: boolean;
  price?: string;
  vat?: string;
  infoIntro?: string;
  infoAllergy?: string;
  showPrice?: boolean;
  showInfo?: boolean;
  disclaimer?: string;
  showDisclaimer?: boolean;
  footerText?: string;
  sections: MenuSection[];
}

export interface GroupMenuItem {
  nameCa: string;
  nameEs: string;
  visible?: boolean;
  strikethrough?: boolean;
}

export interface GroupMenuSection {
  title: string;
  icon?: string;
  items: GroupMenuItem[];
}

export interface WineItem {
  name: string;
  desc: string;
  price: string;
  visible?: boolean;
  strikethrough?: boolean;
  image?: string;
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

export interface WineMenuConfig {
  title?: string;
  subtitle?: string;
  icon?: string;
  visible?: boolean;
  recommended?: boolean;
  price?: string;
  vat?: string;
  infoIntro?: string;
  infoAllergy?: string;
  showPrice?: boolean;
  showInfo?: boolean;
  disclaimer?: string;
  showDisclaimer?: boolean;
  footerText?: string;
  categories: WineCategory[];
}

export interface ExtraMenu {
  id: string;
  type: 'food' | 'wine' | 'group' | 'daily';
  title: string;
  subtitle?: string;
  icon?: string; 
  visible?: boolean;
  recommended?: boolean;
  data: FoodMenuConfig | WineMenuConfig | any; 
}

export interface AppConfig {
  brand: {
    logoUrl: string;
  };
  adminSettings: {
    customDisplayName: string;
    maxExtraMenus: number;
    maxHeroImages: number;
    maxProductImages: number;
    maxHistoricImages: number;
    enableReservationsTab?: boolean; // NEW TOGGLE
  };
  managementSettings: {
    superAdminEmails: string[];
    developerEmails: string[];
  };
  // NEW EMAIL INTEGRATION SETTINGS
  emailSettings: {
    serviceId: string;
    templateId: string;
    autoReplyTemplateId?: string; // NEW: Template for client confirmation
    publicKey: string;
    enabled: boolean;
  };
  supportSettings: {
    text: string;
    url: string;
  };
  menuHeader: {
    title: string;
    subtitle: string;
  };
  menuGlobalFooter: string;
  hero: {
    formType: 'reservation' | 'contact' | 'none';
    reservationVisible?: boolean;
    
    // Reservation Fields
    reservationFormTitle: string;
    reservationFormSubtitle: string;
    reservationPhoneNumber: string;
    reservationButtonText: string;
    reservationTimeStart: string;
    reservationTimeEnd: string;
    reservationTimeInterval: number;
    reservationErrorMessage: string;
    
    // Hero Contact Fields
    heroContactTitle: string;
    heroContactSubtitle: string;
    heroContactBtnText: string;

    stickyNoteText: string;
    backgroundImages: string[];
    
    // Common Labels & Placeholders
    formNameLabel: string;
    formNamePlaceholder: string; 

    formEmailLabel: string;
    formEmailPlaceholder: string; 

    formPhoneLabel: string;
    formPhonePlaceholder: string; 

    formMessageLabel: string;
    formMessagePlaceholder: string; 

    formDateLabel: string;
    
    formPaxLabel: string;
    formPaxPlaceholder: string; 

    formNotesLabel: string;
    formNotesPlaceholder: string; 

    formPrivacyLabel: string;
    formCallUsLabel: string;
    
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
    footerVisible?: boolean;
  };
  dailyMenu: {
    title: string;
    subtitle?: string;
    icon?: string;
    visible?: boolean;
    recommended?: boolean;
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
    subtitle?: string;
    icon?: string;
    visible?: boolean;
    recommended?: boolean;
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
    
    // Bottom Form Fields
    formTitle: string;
    formNameLabel: string;
    formNamePlaceholder: string; 
    
    formEmailLabel: string;
    formEmailPlaceholder: string; 
    
    formPhoneLabel: string;
    formPhonePlaceholder: string; 
    
    formSubjectLabel: string;
    formSubjectPlaceholder: string; 
    
    formMessageLabel: string;
    formMessagePlaceholder: string; 
    
    formButtonText: string;
  };
  navbar: {
    reserveButtonText: string;
  };
}

export const defaultAppConfig: AppConfig = {
  brand: { logoUrl: "" },
  adminSettings: {
    customDisplayName: "",
    maxExtraMenus: 10,
    maxHeroImages: 5,
    maxProductImages: 5,
    maxHistoricImages: 5,
    enableReservationsTab: false // Defaults to Locked
  },
  managementSettings: {
    superAdminEmails: [],
    developerEmails: []
  },
  emailSettings: {
    serviceId: "",
    templateId: "",
    autoReplyTemplateId: "",
    publicKey: "",
    enabled: false
  },
  supportSettings: {
    text: "Contactar amb UMC Ideas",
    url: "mailto:support@umcideas.com"
  },
  menuHeader: { title: "La Carta", subtitle: "Sabors de la nostra terra" },
  menuGlobalFooter: "* Preus en euros, impostos inclosos. Consultar al·lèrgens al personal de sala.",
  hero: {
    formType: 'reservation',
    reservationVisible: true,
    reservationFormTitle: "Reserva Taula!",
    reservationFormSubtitle: "omple'l o truca'ns!",
    reservationPhoneNumber: "977 84 08 70",
    reservationButtonText: "Reservar Ara!",
    reservationTimeStart: "13:00",
    reservationTimeEnd: "15:30",
    reservationTimeInterval: 15,
    reservationErrorMessage: "Ho sentim, l'horari de reserva és de", 
    
    heroContactTitle: "Contacta'ns",
    heroContactSubtitle: "Envia'ns un missatge",
    heroContactBtnText: "Enviar Missatge",

    formNameLabel: "Nom:",
    formNamePlaceholder: "Nom...", 

    formEmailLabel: "El teu email",
    formEmailPlaceholder: "email...", 

    formPhoneLabel: "Telèfon:",
    formPhonePlaceholder: "6...", 

    formMessageLabel: "Missatge",
    formMessagePlaceholder: "El teu missatge...", 

    formDateLabel: "Dia i hora:",
    
    formPaxLabel: "Gent:",
    formPaxPlaceholder: "2", 

    formNotesLabel: "Notes:",
    formNotesPlaceholder: "Al·lèrgies, terrassa...", 

    formPrivacyLabel: "Si, accepto la privacitat.",
    formCallUsLabel: "O truca'ns:",
    
    stickyNoteText: "Obert tot l'any!",
    backgroundImages: [
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_5.png",
      "https://www.ermitaparetdelgada.com/wp-content/uploads/2023/04/ERMITA_slider_4.png"
    ],
    heroDescription: "Una experiència gastronòmica que uneix tradició i modernitat en un entorn històric inoblidable.",
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
        title: "Postres Artesans",
        subtitle: "Dolça Tradició",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2057&auto=format&fit=crop",
        badge: "Casolà",
        description: "El final perfecte amb les receptes de l'àvia: Crema Catalana, flams i pastissos elaborats cada dia a la nostra cuina.",
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
    topTitle: "",
    mainTitle: "Gastronomia",
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
    ],
    footerVisible: true
  },
  dailyMenu: {
    title: "Menú Diari",
    subtitle: "DE DIMARTS A DIVENDRES", 
    icon: "lunch_dining",
    visible: true,
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
    visible: true,
    recommended: false,
    footerText: "",
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
    visible: true,
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
    visible: true,
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
    formNamePlaceholder: "Nom i cognoms",
    formEmailLabel: "Email",
    formEmailPlaceholder: "exemple@email.com",
    formPhoneLabel: "Telèfon",
    formPhonePlaceholder: "+34...",
    formSubjectLabel: "Assumpte",
    formSubjectPlaceholder: "De què vols parlar?",
    formMessageLabel: "Missatge",
    formMessagePlaceholder: "Explica'ns de què es tracta...",
    formButtonText: "Enviar"
  },
  navbar: {
    reserveButtonText: "Reserva",
  }
};

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

const toArray = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return Object.values(data);
};

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(db, 'websiteConfig');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Partial<AppConfig>;
        
        // MIGRATION LOGIC: If formType doesn't exist but reservationVisible is false, set to 'none'
        let migratedFormType = data.hero?.formType || 'reservation';
        if (!data.hero?.formType && data.hero?.reservationVisible === false) {
            migratedFormType = 'none';
        }

        setConfig(prev => ({
           ...prev,
           ...data,
           managementSettings: data.managementSettings ? {
               superAdminEmails: data.managementSettings.superAdminEmails || [],
               developerEmails: data.managementSettings.developerEmails || []
           } : prev.managementSettings,
           emailSettings: data.emailSettings ? {
                serviceId: data.emailSettings.serviceId || "",
                templateId: data.emailSettings.templateId || "",
                autoReplyTemplateId: data.emailSettings.autoReplyTemplateId || "", // New field
                publicKey: data.emailSettings.publicKey || "",
                enabled: data.emailSettings.enabled !== undefined ? data.emailSettings.enabled : false
           } : prev.emailSettings,
           menuGlobalFooter: data.menuGlobalFooter || prev.menuGlobalFooter, 
           menuHeader: data.menuHeader ? { ...prev.menuHeader, ...data.menuHeader } : prev.menuHeader,
           brand: { ...prev.brand, ...data.brand },
           adminSettings: { 
               ...prev.adminSettings, 
               ...data.adminSettings,
               enableReservationsTab: data.adminSettings?.enableReservationsTab !== undefined ? data.adminSettings.enableReservationsTab : prev.adminSettings.enableReservationsTab
           },
           supportSettings: data.supportSettings ? { ...prev.supportSettings, ...data.supportSettings } : prev.supportSettings,
           hero: { 
               ...prev.hero, 
               ...data.hero,
               formType: migratedFormType,
               heroContactTitle: data.hero?.heroContactTitle || prev.hero.heroContactTitle || "Contacta'ns",
               heroContactSubtitle: data.hero?.heroContactSubtitle || prev.hero.heroContactSubtitle || "Envia'ns un missatge",
               heroContactBtnText: data.hero?.heroContactBtnText || prev.hero.heroContactBtnText || "Enviar Missatge",
               formEmailLabel: data.hero?.formEmailLabel || prev.hero.formEmailLabel || "El teu email",
               formMessageLabel: data.hero?.formMessageLabel || prev.hero.formMessageLabel || "Missatge",
               
               // Placeholders with defaults
               formNamePlaceholder: data.hero?.formNamePlaceholder || prev.hero.formNamePlaceholder || "Nom...",
               formEmailPlaceholder: data.hero?.formEmailPlaceholder || prev.hero.formEmailPlaceholder || "email...",
               formPhonePlaceholder: data.hero?.formPhonePlaceholder || prev.hero.formPhonePlaceholder || "6...",
               formMessagePlaceholder: data.hero?.formMessagePlaceholder || prev.hero.formMessagePlaceholder || "El teu missatge...",
               formPaxPlaceholder: data.hero?.formPaxPlaceholder || prev.hero.formPaxPlaceholder || "2",
               formNotesPlaceholder: data.hero?.formNotesPlaceholder || prev.hero.formNotesPlaceholder || "Al·lèrgies, terrassa...",
           },
           intro: { 
               ...prev.intro, 
               ...data.intro,
               visible: data.intro?.visible !== undefined ? data.intro.visible : prev.intro.visible
           },
           specialties: { 
               ...prev.specialties, 
               ...data.specialties,
               visible: data.specialties?.visible !== undefined ? data.specialties.visible : prev.specialties.visible
           },
           philosophy: { 
               ...prev.philosophy, 
               ...data.philosophy,
               visible: data.philosophy?.visible !== undefined ? data.philosophy.visible : prev.philosophy.visible,
               productButtonText: data.philosophy?.productButtonText || prev.philosophy.productButtonText || "VEURE LA NOSTRA CARTA"
           },
           gastronomy: { 
               ...prev.gastronomy, 
               ...data.gastronomy,
               visible: data.gastronomy?.visible !== undefined ? data.gastronomy.visible : prev.gastronomy.visible
           }, 
           dailyMenu: data.dailyMenu ? { 
               ...prev.dailyMenu, 
               ...data.dailyMenu, 
               visible: data.dailyMenu.visible !== undefined ? data.dailyMenu.visible : prev.dailyMenu.visible 
           } : prev.dailyMenu,
           contact: { 
               ...prev.contact, 
               ...data.contact,
               formVisible: data.contact?.formVisible !== undefined ? data.contact.formVisible : prev.contact.formVisible,
               // NEW PLACEHOLDERS MIGRATION LOGIC
               formNamePlaceholder: data.contact?.formNamePlaceholder || prev.contact.formNamePlaceholder || "Nom i cognoms",
               formEmailPlaceholder: data.contact?.formEmailPlaceholder || prev.contact.formEmailPlaceholder || "exemple@email.com",
               formPhonePlaceholder: data.contact?.formPhonePlaceholder || prev.contact.formPhonePlaceholder || "+34...",
               formSubjectPlaceholder: data.contact?.formSubjectPlaceholder || prev.contact.formSubjectPlaceholder || "De què vols parlar?",
               formMessagePlaceholder: data.contact?.formMessagePlaceholder || prev.contact.formMessagePlaceholder || "Explica'ns de què es tracta..."
           },
           navbar: { ...prev.navbar, ...data.navbar },
           foodMenu: data.foodMenu || prev.foodMenu,
           wineMenu: data.wineMenu || prev.wineMenu,
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
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    try {
      const dbRef = ref(db, 'websiteConfig');
      const configToSave = JSON.parse(JSON.stringify({ ...config, ...newConfig }));
      await set(dbRef, configToSave);
    } catch (error) {
      console.error(error);
      alert("Error guardant a la base de dades.");
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
  if (context === undefined) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};