import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update, remove, push, set } from 'firebase/database';
import { AppConfig, defaultAppConfig } from '../../context/ConfigContext';

interface OperationsProps {
    activeTab: 'inbox' | 'reservations' | 'security';
    config?: AppConfig;
    updateConfig?: (newConfig: any) => Promise<void>;
    setLocalConfig?: (config: any) => void;
}

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    timestamp: number;
    read: boolean;
}
  
interface Reservation {
    id: string;
    name: string;
    phone: string;
    pax: string;
    notes: string;
    date: string;
    time: string;
    dateTimeIso: string;
    createdAt: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    privacy: boolean;
}
  
interface BackupItem {
    id: string;
    timestamp: number;
    name: string;
    data: AppConfig;
}

// --- 1. MENÚ DIARI BETA DATA ---
const BETA_DATA_DAILY = {
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
};

// --- 2. CARTA MENJAR BETA DATA (UPDATED TO OBJECT STRUCTURE) ---
const BETA_DATA_CARTA = {
    title: "Carta de Menjar", // Added explicit title just in case
    // New fields default hidden for compatibility
    price: "",
    vat: "",
    infoIntro: "",
    infoAllergy: "",
    showPrice: false,
    showInfo: false,
    showDisclaimer: true,
    disclaimer: "",
    // The content
    sections: [
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
            { nameCa: "Amanida tèbia de formatge de cabra amb pasta brick...", nameEs: "Ensalada tibia de queso de cabra...", price: "16.00€" },
            { nameCa: "Coca amb crema de xirivia, bolets i verdures a la brasa", nameEs: "Coca con crema de chirivía y verduras.", price: "16.00€" },
            { nameCa: "Coca amb crema de xirivia... amb formatge de cabra", nameEs: "Coca con crema de chirivía... con queso.", price: "18.00€" },
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
            { nameCa: "Cabrit km0 a baixa temperatura", nameEs: "Cabrito km0 a baja temperatura.", price: "29.00€" }
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
            { nameCa: "Graellada de carn", nameEs: "Parrillada de carne.", price: "25.00€" },
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
            { nameCa: "Bacallà al pil-pil de bolets", nameEs: "Bacalao al pil-pil de setas.", price: "19.00€" },
            { nameCa: "Llenguado a la brasa", nameEs: "Lenguado a la brasa.", price: "20.00€" },
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
            { nameCa: "Combinat amb escalopa de pollastre...", nameEs: "Combinado con escalopa de pollo...", price: "15.00€" }
        ],
        footer: "MÀXIM FINS A 12 ANYS I NO ES POT COMPARTIR."
        },
        // 8. POSTRES / POSTRES
        {
        id: "sec_postres",
        category: "POSTRES · POSTRES",
        icon: "cake",
        items: [
            { nameCa: "Crema catalana", nameEs: "Crema catalana.", price: "6.00€" },
            { nameCa: "Torrija d'orxata", nameEs: "Torrija de horchata.", price: "6.00€" },
            { nameCa: "Coulant de xocolata", nameEs: "Coulant de chocolate.", price: "6.00€" },
            { nameCa: "Profiterols", nameEs: "Profiteroles.", price: "6.00€" },
            { nameCa: "Pastís de pastanaga", nameEs: "Tarta de zanahoria.", price: "6.00€" },
            { nameCa: "Pastís de formatge", nameEs: "Tarta de queso.", price: "7.00€" },
            { nameCa: "Coulant d'avellana", nameEs: "Coulant de avellana.", price: "7.00€" },
            { nameCa: "Cafè irlandes", nameEs: "Café irlandes.", price: "7.00€" },
            { nameCa: "Postre de músic", nameEs: "Postre de músico.", price: "10.00€" }
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
    ]
};

// --- 3. CARTA VINS BETA DATA (UPDATED TO OBJECT STRUCTURE) ---
const BETA_DATA_WINE = {
    title: "Carta de Vins", // Added explicit title
    // New fields default hidden for compatibility
    price: "",
    vat: "",
    infoIntro: "",
    infoAllergy: "",
    showPrice: false,
    showInfo: false,
    showDisclaimer: true,
    disclaimer: "",
    // The content
    categories: [
        {
            category: "VINS NEGRES",
            groups: [
                {
                    sub: "D.O. TERRA ALTA",
                    items: [
                        { name: "Llàgrimes de Tardor", desc: "Garnatxa, Carinyena", price: "18.50€" },
                        { name: "La Fou El Sender", desc: "Garnatxa negra, Syrah", price: "21.00€" }
                    ]
                },
                {
                    sub: "D.O. MONTSANT",
                    items: [
                        { name: "Sindicat La Figuera", desc: "Garnatxa fina", price: "16.00€" },
                        { name: "Brunus", desc: "Carinyena, Garnatxa, Syrah", price: "24.00€" }
                    ]
                }
            ]
        },
        {
            category: "VINS BLANCS",
            groups: [
                {
                    sub: "D.O. TARRAGONA",
                    items: [
                        { name: "Ipsis Blanc Flor", desc: "Muscat", price: "14.50€" }
                    ]
                },
                {
                    sub: "D.O. TERRA ALTA",
                    items: [
                        { name: "Via Edetana Blanc", desc: "Garnatxa blanca", price: "19.00€" }
                    ]
                }
            ]
        },
        {
            category: "CAVES I ESCUMOSOS",
            groups: [
                {
                    sub: "D.O. CAVA",
                    items: [
                        { name: "Rovellats Imperial", desc: "Brut", price: "22.00€" },
                        { name: "Juvé & Camps", desc: "Reserva de la Família", price: "28.00€" }
                    ]
                }
            ]
        }
    ]
};

// --- 4. MENÚ GRUP BETA DATA ---
const BETA_DATA_GROUP = {
    title: "Menú de Grup", // CHANGED FROM "MENÚ DE GRUP" to Title Case
    price: "35.00€",
    vat: "IVA INCLÒS",
    disclaimer: "Mínim 10 persones. Cal reservar amb antelació.",
    sections: [
        {
            title: "PICA-PICA (PER COMPARTIR)",
            items: [
                { nameCa: "Assortiment d'embotits ibèrics i formatges", nameEs: "Surtido de embutidos ibéricos y quesos" },
                { nameCa: "Pa de vidre amb tomàquet", nameEs: "Pan de cristal con tomate" },
                { nameCa: "Croquetes casolanes de l'àvia", nameEs: "Croquetas caseras de la abuela" },
                { nameCa: "Calamars a l'andalusa", nameEs: "Calamares a la andaluza" }
            ]
        },
        {
            title: "SEGONS (A ESCOLLIR)",
            items: [
                { nameCa: "Entrecot de vedella a la brasa", nameEs: "Entrecot de ternera a la brasa" },
                { nameCa: "Bacallà a la llauna", nameEs: "Bacalao a la llauna" },
                { nameCa: "Peus de porc guisats", nameEs: "Pies de cerdo guisados" }
            ]
        },
        {
            title: "POSTRES",
            items: [
                { nameCa: "Pastís de la casa o Fruita del temps", nameEs: "Pastel de la casa o Fruta del tiempo" }
            ]
        }
    ],
    drinks: ["Aigua mineral", "Vi de la casa (Negre/Blanc)", "Cafès"],
    infoIntro: "El menú inclou pa, aigua, vi i cafè.",
    infoAllergy: "Si us plau, consulteu els al·lèrgens al nostre personal."
};

export const Operations: React.FC<OperationsProps> = ({ activeTab, config, updateConfig, setLocalConfig }) => {
    // --- RESERVATIONS STATE ---
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationFilter, setReservationFilter] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
    
    // --- INBOX STATE ---
    const [messages, setMessages] = useState<ContactMessage[]>([]);

    // --- BACKUPS STATE ---
    const [backups, setBackups] = useState<BackupItem[]>([]);

    // --- UI STATES ---
    const [showInjectConfirm, setShowInjectConfirm] = useState<{ show: boolean, type: 'daily' | 'food' | 'wine' | 'group' | null }>({ show: false, type: null });
    const [showFactoryResetConfirm, setShowFactoryResetConfirm] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // --- NEW: GENERIC CONFIRMATION MODAL STATE ---
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'warning' | 'info';
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'info', onConfirm: () => {} });

    // --- FETCH DATA LOGIC ---
    useEffect(() => {
        if (activeTab === 'reservations') {
            const reservationsRef = ref(db, 'reservations');
            return onValue(reservationsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const resList: Reservation[] = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => b.createdAt - a.createdAt);
                    setReservations(resList);
                } else setReservations([]);
            });
        }
        if (activeTab === 'inbox') {
            const messagesRef = ref(db, 'contactMessages');
            return onValue(messagesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const messageList: ContactMessage[] = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => b.timestamp - a.timestamp);
                    setMessages(messageList);
                } else setMessages([]);
            });
        }
        if (activeTab === 'security') {
            const backupsRef = ref(db, 'backups');
            return onValue(backupsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const backupsList: BackupItem[] = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => b.timestamp - a.timestamp);
                    setBackups(backupsList);
                } else setBackups([]);
            });
        }
    }, [activeTab]);

    const showFeedback = (type: 'success' | 'error', msg: string) => {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 4000);
    };

    // --- ACTIONS ---
    const handleUpdateReservationStatus = async (resId: string, newStatus: 'confirmed' | 'cancelled' | 'pending') => {
        try { await update(ref(db, `reservations/${resId}`), { status: newStatus }); } catch (e) { console.error(e); }
    };

    // UPDATED: Modal instead of window.confirm
    const handleDeleteReservation = (resId: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Eliminar Reserva",
            message: "Segur que vols eliminar aquesta reserva? Aquesta acció no es pot desfer.",
            type: 'danger',
            onConfirm: async () => {
                try { await remove(ref(db, `reservations/${resId}`)); } catch (e) { console.error(e); }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleMarkAsRead = async (messageId: string) => {
        try { await update(ref(db, `contactMessages/${messageId}`), { read: true }); } catch (e) { console.error(e); }
    };

    // UPDATED: Modal instead of window.confirm
    const handleDeleteMessage = (messageId: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Eliminar Missatge",
            message: "Estàs segur que vols esborrar aquest missatge de la bústia?",
            type: 'danger',
            onConfirm: async () => {
                try { await remove(ref(db, `contactMessages/${messageId}`)); } catch (e) { console.error(e); }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };
    
    // --- CUSTOM NAMED BACKUP ---
    const handleCreateBackup = async () => {
        if (!config) return;
        
        // Custom name prompt
        const defaultName = `Còpia ${new Date().toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
        const customName = window.prompt("Escriu un nom per a la còpia (ex: Carta_BETA):", defaultName);
        
        if (customName === null) return; // User cancelled

        try {
            await push(ref(db, 'backups'), { 
                timestamp: Date.now(), 
                name: customName || defaultName, 
                data: config 
            });
            showFeedback('success', `Còpia "${customName || defaultName}" creada.`);
        } catch (e) { showFeedback('error', "Error creant la còpia."); }
    };

    // UPDATED: Modal instead of window.confirm
    const handleRestoreBackup = (backup: BackupItem) => {
        if (!updateConfig || !setLocalConfig) return;
        setConfirmModal({
            isOpen: true,
            title: "Restaurar Còpia",
            message: `Estàs segur de restaurar la còpia "${backup.name}"? Això sobreescriurà la configuració actual.`,
            type: 'warning',
            onConfirm: async () => {
                try { 
                    await updateConfig(backup.data); 
                    setLocalConfig(backup.data); 
                    showFeedback('success', "Restauració completada."); 
                } catch(e) { 
                    showFeedback('error', "Error restaurant."); 
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };
    
    // UPDATED: Modal instead of window.confirm
    const handleDeleteBackup = (backupId: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Eliminar Còpia",
            message: "Esborrar aquesta còpia de seguretat permanentment?",
            type: 'danger',
            onConfirm: async () => {
                try { await remove(ref(db, `backups/${backupId}`)); } catch(e) { console.error(e); }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const performFactoryReset = async () => {
        if (!updateConfig || !setLocalConfig) return;
        try { 
            await updateConfig(defaultAppConfig); 
            setLocalConfig(defaultAppConfig); 
            showFeedback('success', "Restaurat a fàbrica."); 
            setShowFactoryResetConfirm(false);
        } catch (e) { console.error(e); showFeedback('error', "Error al restaurar."); }
    };

    // --- GRANULAR BETA INJECTION EXECUTION ---
    const performBetaInjection = async () => {
        const type = showInjectConfirm.type;
        if (!type) return;

        let path = '';
        let data: any = null;
        let successMsg = '';

        if (type === 'daily') {
            path = 'dailyMenu';
            data = BETA_DATA_DAILY;
            successMsg = "MENUDIARI_BETA carregat correctament.";
        } else if (type === 'food') {
            path = 'foodMenu';
            data = BETA_DATA_CARTA;
            successMsg = "CARTA_BETA carregada correctament.";
        } else if (type === 'wine') {
            path = 'wineMenu';
            data = BETA_DATA_WINE;
            successMsg = "CARTAVINS_BETA carregada correctament.";
        } else if (type === 'group') {
            path = 'groupMenu';
            data = BETA_DATA_GROUP;
            successMsg = "MENUGRUP_BETA carregat correctament.";
        }

        try {
            const dbRef = ref(db, `websiteConfig/${path}`);
            await set(dbRef, data);
            
            // Local update
            if (setLocalConfig) {
                setLocalConfig((prev: any) => ({ ...prev, [path]: data }));
            }
            if (updateConfig) {
                await updateConfig({ [path]: data });
            }

            setShowInjectConfirm({ show: false, type: null });
            showFeedback('success', successMsg);
        } catch (e) {
            console.error(e);
            showFeedback('error', "Error injectant les dades.");
        }
    };

    // HELPER: Modal Render (since we use it in multiple return blocks)
    const renderConfirmModal = () => (
        confirmModal.isOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                <div className={`bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 text-center ${confirmModal.type === 'danger' ? 'border-red-600' : 'border-yellow-500'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <span className="material-symbols-outlined text-3xl">warning</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">{confirmModal.title}</h3>
                    <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                        {confirmModal.message}
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setConfirmModal(prev => ({...prev, isOpen: false}))}
                            className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors"
                        >
                            Cancel·lar
                        </button>
                        <button 
                            onClick={confirmModal.onConfirm}
                            className={`flex-1 py-3 text-white rounded font-bold uppercase text-xs shadow-md transition-colors ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    // --- RENDER ---
    if (activeTab === 'reservations') {
        const filtered = reservations.filter(r => r.status === reservationFilter);
        const counts = {
            pending: reservations.filter(r => r.status === 'pending').length,
            confirmed: reservations.filter(r => r.status === 'confirmed').length,
            cancelled: reservations.filter(r => r.status === 'cancelled').length
        };

        return (
            <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2"><span className="material-symbols-outlined text-red-600">book_online</span> Gestió de Reserves</h3>
                </div>
                <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
                    {(['pending', 'confirmed', 'cancelled'] as const).map(status => (
                        <button key={status} onClick={() => setReservationFilter(status)} className={`pb-2 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${reservationFilter === status ? (status === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-500' : status === 'confirmed' ? 'text-green-600 border-b-2 border-green-500' : 'text-red-400 border-b-2 border-red-400') : 'text-gray-400 hover:text-gray-600'}`}>
                            {status === 'pending' ? 'Pendents' : status === 'confirmed' ? 'Confirmades' : 'Cancel·lades'} 
                            {counts[status] > 0 && <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{counts[status]}</span>}
                        </button>
                    ))}
                </div>
                {filtered.length === 0 ? (
                    <div className="text-center py-20 opacity-50 bg-white rounded-lg border border-gray-200 border-dashed"><span className="material-symbols-outlined text-6xl mb-4 text-gray-300">event_busy</span><p className="text-lg text-gray-400">No hi ha reserves en aquesta safata.</p></div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse table-fixed">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="p-4 w-24">Estat</th>
                                        <th className="p-4 w-32">Dia i Hora</th>
                                        <th className="p-4 w-20">Pax</th>
                                        <th className="p-4 w-40">Nom</th>
                                        <th className="p-4 w-32">Telèfon</th>
                                        <th className="p-4">Notes</th>
                                        <th className="p-4 text-right w-32">Accions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((res) => (
                                        <tr key={res.id} className={`hover:bg-gray-50 transition-colors ${res.status === 'pending' ? 'bg-yellow-50/10' : ''}`}>
                                            <td className="p-4 align-middle"><span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${res.status === 'pending' ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : res.status === 'confirmed' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-400 border border-red-100 decoration-line-through"}`}>{res.status === 'pending' ? "PENDENT" : res.status === 'confirmed' ? "CONFIRMADA" : "CANCEL·LADA"}</span></td>
                                            <td className="p-4 align-middle"><div className="flex flex-col"><span className="font-bold text-gray-800">{new Date(res.date).toLocaleDateString('ca-ES')}</span><span className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded w-fit">{res.time}</span></div></td>
                                            <td className="p-4 align-middle font-bold text-lg text-secondary">{res.pax} <span className="text-xs font-normal text-gray-400">pers.</span></td>
                                            <td className="p-4 align-middle font-medium text-gray-700 truncate" title={res.name}>{res.name}</td>
                                            <td className="p-4 align-middle truncate"><a href={`tel:${res.phone}`} className="text-primary hover:underline font-mono text-sm">{res.phone}</a></td>
                                            <td className="p-4 align-middle text-sm text-gray-500 truncate" title={res.notes}>{res.notes || '-'}</td>
                                            <td className="p-4 align-middle text-right"><div className="flex justify-end gap-2">
                                                {res.status === 'pending' && (<><button onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">check</span></button><button onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')} className="bg-red-400 hover:bg-red-500 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">close</span></button></>)}
                                                {res.status === 'confirmed' && (<button onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')} className="border border-red-300 text-red-400 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">block</span></button>)}
                                                {res.status === 'cancelled' && (<button onClick={() => handleUpdateReservationStatus(res.id, 'pending')} title="Tornar a Pendent" className="border border-yellow-300 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 p-2 rounded transition-colors"><span className="material-symbols-outlined text-sm">restore</span></button>)}
                                                {/* DELETE BUTTON - NOW USES MODAL */}
                                                <button onClick={() => handleDeleteReservation(res.id)} className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors" title="Esborrar definitivament"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {renderConfirmModal()}
            </div>
        );
    }

    if (activeTab === 'inbox') {
        return (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto">
                <div className="flex justify-between items-center"><h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2"><span className="material-symbols-outlined text-blue-600">mail</span> Bústia de Missatges</h3><div className="text-xs font-bold text-blue-600 bg-white px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">Total: {messages.length}</div></div>
                {messages.length === 0 ? (<div className="text-center py-24 bg-white rounded-xl border border-blue-100 border-dashed shadow-sm"><div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-4xl text-blue-300">inbox</span></div><p className="text-lg text-gray-400 font-medium">La bústia està buida.</p></div>) : (<div className="space-y-4">{messages.map((msg) => (<div key={msg.id} className={`rounded-xl border transition-all duration-300 group ${!msg.read ? 'bg-white border-blue-300 shadow-md border-l-[6px] border-l-blue-600' : 'bg-white/80 border-gray-200 shadow-sm hover:shadow-md'}`}>
                
                {/* --- HEADER: DATE ON LEFT, SEPARATED FORMAT --- */}
                <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center border-b border-gray-50 bg-gray-50/30 rounded-t-xl gap-4">
                    
                    {/* 1. DATE BADGE (MOVED TO LEFT) */}
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-100/50 px-3 py-1 rounded-md border border-blue-200 shrink-0">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span>{new Date(msg.timestamp).toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                        {/* Vertical Separator for spacing */}
                        <span className="text-blue-300 mx-1">|</span> 
                        <span>{new Date(msg.timestamp).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* 2. SUBJECT & UNREAD INDICATOR */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {!msg.read && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>}
                        <h4 className={`text-lg truncate w-full ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                            {msg.subject || '(Sense assumpte)'}
                        </h4>
                    </div>
                </div>

                <div className="p-6"><div className="flex flex-wrap gap-2 mb-4"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"><span className="material-symbols-outlined text-sm">person</span> {msg.name}</span><a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium border border-gray-200"><span className="material-symbols-outlined text-sm">alternate_email</span> {msg.email}</a>{msg.phone && (<a href={`tel:${msg.phone}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors text-xs font-medium border border-gray-200"><span className="material-symbols-outlined text-sm">call</span> {msg.phone}</a>)}</div><div className="bg-gray-50 rounded-lg p-4 border border-gray-100"><p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{msg.message}</p></div></div>
                
                <div className="px-6 py-3 bg-gray-50 rounded-b-xl flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!msg.read && (<button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 transition-colors"><span className="material-symbols-outlined text-sm">mark_email_read</span> Marcar llegit</button>)}
                    {/* DELETE BUTTON REDESIGNED (RED STYLE) */}
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 border border-red-100 text-xs font-bold uppercase flex items-center gap-1 px-3 py-2 rounded transition-colors"><span className="material-symbols-outlined text-sm">delete</span> Esborrar</button>
                </div></div>))}</div>)}
                {renderConfirmModal()}
            </div>
        );
    }

    if (activeTab === 'security') {
        return (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto relative">
                
                {/* --- FEEDBACK TOAST --- */}
                {feedback && (
                    <div className={`fixed top-4 right-4 z-[200] px-6 py-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-[fadeIn_0.3s_ease-out] ${feedback.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 text-white border-red-700'}`}>
                        <span className="material-symbols-outlined text-2xl">{feedback.type === 'success' ? 'check_circle' : 'error'}</span>
                        <span className="font-bold">{feedback.msg}</span>
                    </div>
                )}

                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">security</span>
                        <div><h3 className="font-serif text-xl font-bold text-gray-800">Còpies de Seguretat</h3><p className="text-gray-500 text-sm">Crea fotos de l'estat actual de la web.</p></div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3"><span className="material-symbols-outlined text-blue-500">info</span><p className="text-sm text-blue-700"><strong>Nota:</strong> Les còpies guarden la configuració visual (textos, fotos, menús). No guarden les reserves.</p></div>
                    <div className="flex justify-between items-center mb-6"><h4 className="font-bold text-gray-700">Historial</h4><button onClick={handleCreateBackup} className="bg-primary hover:bg-accent text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-md transition-all"><span className="material-symbols-outlined text-sm">save</span> Crear còpia</button></div>
                    {backups.length === 0 ? <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg"><p className="text-gray-400">No hi ha còpies.</p></div> : <div className="space-y-3">{backups.map((backup) => (<div key={backup.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200 hover:shadow-md transition-shadow"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-gray-400">backup</span><div><p className="font-bold text-gray-800 text-sm">{backup.name}</p><p className="text-xs text-gray-500 font-mono">{new Date(backup.timestamp).toLocaleString()}</p></div></div><div className="flex gap-2"><button onClick={() => handleRestoreBackup(backup)} className="text-blue-600 hover:text-blue-800 text-[10px] font-bold uppercase border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">Restaurar</button><button onClick={() => handleDeleteBackup(backup.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button></div></div>))}</div>}
                </div>
                
                {/* SPLIT BETA RESTORATION SECTION - NOW WITH 4 BUTTONS */}
                <div className="bg-green-50 p-6 rounded shadow-sm border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined">menu_book</span> RESTAURACIÓ CARTA BETA (ORIGINAL)</h4>
                    <p className="text-xs text-green-700 mb-4">Utilitza aquests botons per recuperar les versions originals (Beta) dels 4 menús principals si s'han esborrat.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'daily'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all">
                            <span className="material-symbols-outlined text-2xl">lunch_dining</span>
                            Carregar MENUDIARI_BETA
                        </button>
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'food'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all">
                            <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                            Carregar CARTA_BETA
                        </button>
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'wine'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all">
                            <span className="material-symbols-outlined text-2xl">wine_bar</span>
                            Carregar CARTAVINS_BETA
                        </button>
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'group'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all">
                            <span className="material-symbols-outlined text-2xl">diversity_3</span>
                            Carregar MENUGRUP_BETA
                        </button>
                    </div>
                </div>

                <div className="bg-red-50 p-6 rounded shadow-sm border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined">warning</span> Zona de Perill</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setShowFactoryResetConfirm(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold uppercase shadow flex items-center gap-2 w-full justify-center sm:w-auto">
                            <span className="material-symbols-outlined text-sm">restart_alt</span> Restaurar TOTA la Web (Fàbrica)
                        </button>
                    </div>
                </div>

                {/* --- CUSTOM MODAL FOR BETA INJECTION --- */}
                {showInjectConfirm.show && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 border-green-600 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <span className="material-symbols-outlined text-3xl">
                                    {showInjectConfirm.type === 'food' ? 'restaurant_menu' : showInjectConfirm.type === 'wine' ? 'wine_bar' : showInjectConfirm.type === 'group' ? 'diversity_3' : 'lunch_dining'}
                                </span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                                {showInjectConfirm.type === 'food' ? 'Carregar CARTA_BETA?' : showInjectConfirm.type === 'wine' ? 'Carregar CARTAVINS_BETA?' : showInjectConfirm.type === 'group' ? 'Carregar MENUGRUP_BETA?' : 'Carregar MENUDIARI_BETA?'}
                            </h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                Això <strong className="text-gray-800">sobrescriurà només aquesta secció</strong> amb la versió original/beta. Els altres menús no es tocaran.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowInjectConfirm({ show: false, type: null })} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">
                                    Cancel·lar
                                </button>
                                <button onClick={performBetaInjection} className="flex-1 py-3 bg-green-600 text-white rounded font-bold uppercase text-xs hover:bg-green-700 shadow-md transition-colors">
                                    Sí, Restaurar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CUSTOM MODAL FOR FACTORY RESET --- */}
                {showFactoryResetConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 border-red-600 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Restaurar de Fàbrica?</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                <strong className="text-red-600">ATENCIÓ:</strong> Això esborrarà TOTA la configuració actual i deixarà la web com nova. No es pot desfer.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowFactoryResetConfirm(false)} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">
                                    Cancel·lar
                                </button>
                                <button onClick={performFactoryReset} className="flex-1 py-3 bg-red-600 text-white rounded font-bold uppercase text-xs hover:bg-red-700 shadow-md transition-colors">
                                    Sí, Restaurar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {renderConfirmModal()}
            </div>
        );
    }

    return null;
};