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
  hero: {
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
  };
  intro: {
    smallTitle: string;
    mainTitle: string;
    description: string;
  };
  specialties: {
    sectionTitle: string;
    mainTitle: string;
    description: string;
    items: Array<{
      title: string;
      subtitle: string;
      image: string;
      badge?: string;
      visible?: boolean; // Added visible property
    }>;
  };
  philosophy: {
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
  
  foodMenu: MenuSection[]; // Refactored Dynamic Menu
  wineMenu: WineCategory[]; // New Dynamic Wine Menu
  
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

  // NEW: Support for multiple additional menus
  extraMenus: ExtraMenu[];

  contact: {
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
        badge: "",
        visible: true
      },
      {
        title: "Calçotades",
        subtitle: "Salsa Romesco",
        image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=2070&auto=format&fit=crop",
        badge: "Temporada",
        visible: true
      },
      {
        title: "Vins de Proximitat",
        subtitle: "DO Tarragona",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
        badge: "Celler",
        visible: true
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
        { nameCa: "Amanida verda de l'horta", nameEs: "Ensalada verde de la huerta.", price: "12.00" },
        { nameCa: "Amanida de formatge de cabra amb pasta brick, préssec al forn i vinagreta de mel.", nameEs: "Ensalada de queso de cabra con pasta brick, melocotón al horno y vinagreta de miel.", price: "16.00" },
        { nameCa: "Coca de carxofa confitada, foie i pernil ibèric", nameEs: "Coca de alcachofa confitada, foie y jamón ibérico.", price: "18.00" },
        { nameCa: "Tartar de bacallà amb taronja i vinagreta d'olives negres.", nameEs: "Tartar de bacalao con naranja y vinagreta de olivas negras.", price: "16.00" },
        { nameCa: "Canelons de carn casolans, gratinats", nameEs: "Canelones caseros de carne, gratinados.", price: "14.00" },
        { nameCa: "Canelons de bolets silvestres gratinats amb parmesà", nameEs: "Canelones de setas silvestres gratinados con parmesano.", price: "13.00" },
        { nameCa: "Carpaccio de xuleta de vaca madurada Okelan", nameEs: "Carpaccio de chuleta de ternera madurada Okelan.", price: "18.00" },
        { nameCa: "Cargols a la llauna fets a la brasa", nameEs: "Caracoles a la \"llauna\" hechos a la brasa.", price: "19.00" },
        { nameCa: "Ració de pa de vidre i tomacons", nameEs: "Ración de pan de cristal y tomates.", price: "4.00" },
        { nameCa: "Ració de pa torrat, alls i tomacons", nameEs: "Ración de pan tostado, ajos y tomates.", price: "5.00" },
        { nameCa: "Ració de panet de 65 gr.", nameEs: "Ración de panecillo de 65gr.", price: "0.60" },
      ]
    },
    {
      id: "sec_2",
      category: "TAPES · TAPAS",
      icon: "tapas",
      items: [
        { nameCa: "Patates braves", nameEs: "Patatas bravas.", price: "8.00" },
        { nameCa: "Croquetes de carn d'olla, 6 unitats", nameEs: "Croquetas de cocido, 6 unidades.", price: "10.00" },
        { nameCa: "Cassoleta de xistorra de Navarra amb mel i sèsam", nameEs: "Cazuela de chisttorra de Navarra con miel y sésamo.", price: "10.00" },
        { nameCa: "Camembert al forn amb raïm, nous i melmelada de pebrot escalivat", nameEs: "Camembert al horno con uvas, nueces y mermelada de pimiento escalivado.", price: "16.00" },
        { nameCa: "Ous estrellats sobre niu de patates i pernil ibèric", nameEs: "Huevos estrellados sobre nido de patatas y jamón ibérico.", price: "16.00" },
        { nameCa: "Calamars a l'andalusa amb ceba caramelitzada", nameEs: "Calamares a la andaluza con cebolla caramelizada.", price: "12.00" },
        { nameCa: "Albergínia fregida a la mel i pebrot del padró", nameEs: "Berenjena frita con miel y pimiento del padrón.", price: "12.00" },
        { nameCa: "Sépia amb all i oli", nameEs: "Sepia con alioli.", price: "15.00" },
      ]
    },
    {
      id: "sec_3",
      category: "PLATS CUINATS · PLATOS COCINADOS",
      icon: "skillet",
      items: [
        { nameCa: "Galta de vedella amb caramel de vi i patata gratinada", nameEs: "Carrillera de ternera con caramelo de vino y patata gratinada.", price: "18.00" },
        { nameCa: "Filets de cérvol adobat a la planxa", nameEs: "Filetes de ciervo adobado a la plancha.", price: "20.00" },
        { nameCa: "Cabrit arrebossat (mitjanes i costelletes)", nameEs: "Cabrito rebozado (medianas y costillitas).", price: "22.00" },
        { nameCa: "Cassola de peus de porc amb escamarlans", nameEs: "Cazuela de pies de cerdo con cigalas.", price: "19.00" },
        { nameCa: "Espatlla de cabrit al forn", nameEs: "Paletilla de cabrito al horno.", price: "28.00" },
      ]
    },
    {
      id: "sec_4",
      category: "CARNS A LA BRASA · CARNES A LA BRASA",
      icon: "outdoor_grill",
      items: [
        { nameCa: "Llonganissa de la Selva", nameEs: "Longaniza de la Selva.", price: "14.00" },
        { nameCa: "Cuixa de pollastre", nameEs: "Muslo de pollo.", price: "12.00" },
        { nameCa: "Llodrigó a la brasa amb all i oli", nameEs: "Gazapo a la brasa con ali oli.", price: "19.00" },
        { nameCa: "Peus de porc de Can Pistraques", nameEs: "Pies de cerdo de Can Pistraques.", price: "16.00" },
        { nameCa: "Costelles de xai.", nameEs: "Costillas de cordero.", price: "20.00" },
        { nameCa: "Entrecot de vedella de 300 gr.", nameEs: "Entrecot de ternera de 300 gr.", price: "24.00" },
        { nameCa: "Filet de vedella de 280 gr.", nameEs: "Solomillo de ternera de 280 gr.", price: "26.00" },
        { nameCa: "Graellada de carn (llonganissa, cansalada, butifarra negra i xai)", nameEs: "Parrillada de carne (longaniza, panceta, morcilla negra y cordero).", price: "25.00" },
        { nameCa: "Lagarto de porc gallec alimentat amb castanyes", nameEs: "Lagarto de cerdo gallego alimentado con castañas.", price: "19.00" },
        { nameCa: "Tarrina d'allioli", nameEs: "Tarrina de \"alioli\".", price: "2.50" },
        { nameCa: "Tarrina de romesco", nameEs: "Tarrina de \"romesco\".", price: "2.50" },
        { nameCa: "Salsa de pebre verd o roquefort", nameEs: "Salsa de pimienta verde o roquefort.", price: "2.50" },
        { nameCa: "Plat patates fregides", nameEs: "Plato patatas fritas.", price: "4.50" },
      ]
    },
    {
      id: "sec_5",
      category: "PEIX · PESCADO",
      icon: "set_meal",
      items: [
        { nameCa: "Pota de pop a la brasa amb patata confitada", nameEs: "Pata de pulpo a la brasa con patata confitada.", price: "25.00" },
        { nameCa: "Bacallà al forn amb crema d'alls tendres i xerris", nameEs: "Bacalao al horno con crema de ajos tiernos y cherrys.", price: "19.00" },
        { nameCa: "Llenguado a la brasa regat amb oli a l'Orio", nameEs: "Lenguado a la brasa regado con aceite al Orio.", price: "20.00" },
      ]
    },
    {
      id: "sec_6",
      category: "VEGETARIANS · VEGANS",
      icon: "eco",
      items: [
        { nameCa: "Timbal d'escalivada amb patata i bolets", nameEs: "Timbal de escalivada con patata y setas.", price: "14.00" },
        { nameCa: "Amanida amb fruita i vinagreta de cítrics", nameEs: "Ensalada con fruta y vinagreta de cítricos.", price: "14.00" },
        { nameCa: "Parrillada de verdures", nameEs: "Parrillada de verduras.", price: "15.00" },
        { nameCa: "Hummus amb albergínia i pebrot escalivat", nameEs: "Hummus con berenjena y pimientos escalivados.", price: "15.00" },
      ]
    },
    {
      id: "sec_7",
      category: "LLESQUES I HAMBURGUESES · LLESCAS Y HAMBURGUESAS",
      icon: "lunch_dining",
      items: [
        { nameCa: "Esperdenya de llonganissa amb salsa de tomaquet escalivat", nameEs: "Llesca de longaniza con salsa de tomate escalivado.", price: "15.00" },
        { nameCa: "Esperdenya amb anxoves i olives", nameEs: "Llesca con anchoas y aceitunas.", price: "13.00" },
        { nameCa: "Torrada amb sobrassada, formatge de cabra i mel", nameEs: "Tostada con sobrasada, queso de cabra y miel.", price: "14.00" },
        { nameCa: "Hamburguesa amb formatge gouda, enciam i tomàquet", nameEs: "Hamburguesa con queso gouda, lechuga y tomate.", price: "12.00" },
        { nameCa: "Hamburguesa amb formatge gouda, melmelada, beicon, ceba encurtida, cogombrets i mahonesa de chimichurri", nameEs: "Hamburguesa con queso gouda, mermelada, beicon, cebolla encurtida, pepinillos y mayonesa de chimichurri.", price: "15.00" },
      ]
    },
    {
      id: "sec_8",
      category: "PLATS INFANTILS · PLATOS INFANTILES",
      icon: "child_care",
      items: [
        { nameCa: "Macarrons a la bolonyesa", nameEs: "Macarrones a la boloñesa.", price: "10.00" },
        { nameCa: "Combinat amb escalopa de pollastre, macarrons i patates", nameEs: "Combinado con escalopa de pollo, macarrones y patatas.", price: "15.00" },
        { nameCa: "Combinat amb hamburguesa de vedella, macarrons i patates", nameEs: "Combinado con hamburguesa de ternera, macarrones y patatas.", price: "16.00" },
        { nameCa: "Escalopa de pollastre amb patates", nameEs: "Escalopa de pollo con patatas.", price: "10.00" },
        { nameCa: "Hamburguesa de vedella amb patates", nameEs: "Hamburguesa de ternera con patatas.", price: "10.00" },
      ],
      footer: "MÀXIM FINS A 12 ANYS I NO ES POT COMPARTIR / MÁXIMO HASTA 12 AÑOS Y NO SE PUEDE COMPARTIR."
    },
    {
      id: "sec_9",
      category: "POSTRES · POSTRES",
      icon: "icecream",
      items: [
        { nameCa: "Crema catalana", nameEs: "Crema catalana.", price: "6.00" },
        { nameCa: "Torrija d'orxata amb gelat de canyella", nameEs: "Torrija de horchata con helado de canela.", price: "6.50" },
        { nameCa: "Coulant de xocolata sense gluten amb gelat de vainilla", nameEs: "Coulant de chocolate sin gluten con helado de vainilla.", price: "7.50" },
        { nameCa: "Coulant de xocolata amb gelat de vainilla", nameEs: "Coulant de chocolate con helado de vainilla.", price: "6.00" },
        { nameCa: "Pastís de formatge amb fruits del bosc", nameEs: "Tarta de queso con frutos del bosque.", price: "7.00" },
        { nameCa: "Lioneses farcides de nata amb xocolata calenta", nameEs: "Lionesas rellenas de nata con chocolate caliente.", price: "6.50" },
        { nameCa: "Postre de músic amb fruits secs i porró de moscatell", nameEs: "Postre de músico con frutos secos y porrón de moscatel.", price: "10.50" },
        { nameCa: "Cafè irlandes", nameEs: "Café irlandes.", price: "7.00" },
      ]
    },
    {
      id: "sec_10",
      category: "BOLES DE GELAT · BOLAS DE HELADO",
      icon: "icecream",
      items: [
        { nameCa: "Vainilla", nameEs: "Vainilla.", price: "6.00" },
        { nameCa: "Xocolata", nameEs: "Chocolate.", price: "6.00" },
        { nameCa: "Avellana", nameEs: "Avellana.", price: "7.00" },
        { nameCa: "Sorbet de llimona", nameEs: "Sorbete de limón.", price: "7.00" },
        { nameCa: "Sorbet de mandarina", nameEs: "Sorbete de mandarina.", price: "7.00" },
      ]
    }
  ],
  wineMenu: [
    {
      category: "Negres",
      groups: [
        {
          sub: "D.O. Terra Alta",
          items: [
            { name: "Portal Negra (Afruitat)", desc: "12 mesos garnatxa, carinyena, syrah, merlot.", price: "17.50" },
            { name: "Llàgrimes de Tardor (Afruitat)", desc: "12 mesos garnatxa, carinyena, syrah i cabernet sauvignon.", price: "16.50" },
          ]
        },
        {
          sub: "D.O.Q Priorat",
          items: [
            { name: "Els Pics (Afruitat)", desc: "14 mesos garnatxa, carinyena, merlot i syrah.", price: "22.00" },
            { name: "Brùixola (Afruitat)", desc: "5 mesos garnatxa, carinyena, syrah.", price: "21.00" },
            { name: "Artigas (Madur)", desc: "16 mesos garnatxa, carinyena, cabernet sauvignon.", price: "26.00" },
          ]
        },
        {
          sub: "D.O. Montsant",
          items: [
            { name: "Blau (Afruitat)", desc: "4 mesos Garnatxa, Sansó, Syrah.", price: "16.00" },
            { name: "Sileo (Afruitat)", desc: "9 mesos Garnatxa, Carinyena.", price: "17.00" },
            { name: "Volador (Afruitat)", desc: "9 mesos Garnatxa, Carinyena.", price: "18.00" },
            { name: "Bona Nit (Afruitat)", desc: "4 mesos Garnatxa, Carinyena, Syrah.", price: "18.50" },
            { name: "Perlat Syrach (Lleuger)", desc: "Syrah.", price: "15.00" },
          ]
        },
        {
          sub: "D.O. Ribera del Duero",
          items: [
            { name: "Figuero 12 (Afruitat)", desc: "12/24 mesos Tempranillo", price: "25.00" },
          ]
        },
        {
          sub: "D.O. Rioja",
          items: [
            { name: "Marqués de Riscal Reserva", desc: "25 mesos Tempranillo, Graciano, Mazuelo", price: "23.00" },
            { name: "Muriel Crianza", desc: "12 mesos", price: "13.00" },
          ]
        },
        {
          sub: "D. O. Conca de Barberà",
          items: [
            { name: "Josep Foraster Trepat (Especiat)", desc: "7 mesos trepat", price: "20.00" },
          ]
        },
      ]
    },
    {
      category: "Vins Ecològics",
      groups: [
        {
          sub: "D.O. Tarragona",
          items: [
            { name: "Pilanot Negre", desc: "45 dies de maceració amb pells, 6 mesos en bota de roure...", price: "15.00" },
            { name: "Pilanot Rosat", desc: "Passat per bota.", price: "13.00" },
            { name: "Pilanot Blanc", desc: "Passat per bota.", price: "13.00" },
          ]
        },
        {
          sub: "Mas de la Basserola",
          items: [
            { name: "Vi Negre L'Origen", desc: "Garnatxa, Merlot, Sumoll.", price: "13.00" },
            { name: "Vi Blanc L'Essència", desc: "Parellada, Macabeu, Sauvignon.", price: "12.00" },
          ]
        }
      ]
    },
    {
      category: "Blancs",
      groups: [
        {
          sub: "D.O. Montsant",
          items: [
            { name: "Cairats Frescal (Afruitat)", desc: "4 mesos, Garnatxa.", price: "17.50" },
            { name: "Perlat (Lleuger)", desc: "Macabeu, Garnatxa.", price: "15.00" },
          ]
        },
        {
          sub: "D.O. Terra Alta",
          items: [
            { name: "Petites Estones (Lleuger)", desc: "Garnatxa.", price: "16.50" },
            { name: "Ennat (Afruitat)", desc: "Garnatxa, Macabeu.", price: "16.00" },
          ]
        },
        {
          sub: "D.O. Penedès",
          items: [
            { name: "La Volada (Afruitat)", desc: "Variats florals i aromàtiques.", price: "19.50" },
          ]
        },
        {
          sub: "D.O. Rueda",
          items: [
            { name: "Palomo Cojo (Afruitat)", desc: "Verdejo.", price: "16.50" },
          ]
        }
      ]
    },
    {
      category: "Rosats",
      groups: [
        {
          sub: "D.O. Terra Alta",
          items: [
            { name: "Flor de Nit (Lleuger)", desc: "Garnatxa.", price: "17.50" },
          ]
        },
        {
          sub: "D.O. Conca de Barberà",
          items: [
            { name: "Els Nanos Rosats (Lleuger)", desc: "Trepat.", price: "14.50" },
          ]
        }
      ]
    },
    {
      category: "Cava",
      groups: [
        {
          sub: "",
          items: [
            { name: "Rimat 24 Brut Natura Reserva (Eco)", desc: "madur 30 mesos, Macabeu, Perellada, Xarel·lo", price: "18.50" },
            { name: "Clos la Soleya Brut Natura (Lleuger)", desc: "Macabeu, Xarel·lo, Parellada.", price: "14.00" },
          ]
        },
        {
          sub: "",
          items: [
            { name: "Sangria de Vi de la casa", desc: "", price: "9.50" }
          ]
        }
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
    infoAllergy: "En el cas que algun comensal tingués algun tipus d’intolerància alimentària, no dubtis a dir-nos, el nostre equip de cuina s’encarregarà d’oferir les millors alternatives perquè pugui gaudir del menjar.",
    footerText: "Celebracions amb ànima"
  },
  extraMenus: [],
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
           wineMenu: data.wineMenu || prev.wineMenu,
           extraMenus: data.extraMenus || prev.extraMenus || [], // Ensure array
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