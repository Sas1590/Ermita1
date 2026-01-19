import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
import { AppConfig, defaultAppConfig } from '../../context/ConfigContext';

interface OperationsProps {
    activeTab: 'inbox' | 'reservations' | 'security' | 'superadmin';
    config?: AppConfig;
    updateConfig?: (newConfig: any) => Promise<void>;
    setLocalConfig?: (config: any) => void;
    isSuperAdmin?: boolean; 
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

// --- 1. MENÚ DIARI BETA DATA (UPDATED 2024) ---
const BETA_DATA_DAILY = {
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
                { nameCa: "Amanida de formatge de cabra amb fruits secs", nameEs: "Ensalada de queso de cabra", visible: true },
                { nameCa: "Canelons casolans de l'àvia", nameEs: "Canelones caseros de la abuela", visible: true },
                { nameCa: "Escudella barrejada", nameEs: "Escudella catalana", visible: true }
            ]
        },
        {
            title: "SEGONS PLATS",
            items: [
                { nameCa: "Botifarra a la brasa amb mongetes", nameEs: "Butifarra a la brasa con judías", visible: true },
                { nameCa: "Peix fresc de la llotja", nameEs: "Pescado fresco del día", visible: true },
                { nameCa: "Pollastre de pagès rostit", nameEs: "Pollo de payés asado", visible: true }
            ]
        },
        {
            title: "POSTRES",
            items: [
                { nameCa: "Crema Catalana", nameEs: "Crema Catalana", visible: true },
                { nameCa: "Flam d'ou casolà", nameEs: "Flan de huevo casero", visible: true },
                { nameCa: "Fruita del temps", nameEs: "Fruta del tiempo", visible: true }
            ]
        }
    ],
    drinks: ["Aigua", "Vi de la casa", "Gasosa"],
    infoIntro: "El menú inclou primer plat, segon plat, postres, pa, aigua i vi.",
    infoAllergy: "Si tens alguna al·lèrgia, informa el nostre personal.",
    footerText: "Cuina de mercat"
};

// --- 2. CARTA MENJAR BETA DATA (UPDATED 2024) ---
const BETA_DATA_CARTA = {
    title: "Carta de Menjar", 
    subtitle: "",
    icon: "restaurant_menu",
    visible: true,
    recommended: false,
    price: "",
    vat: "",
    infoIntro: "",
    infoAllergy: "",
    showPrice: false,
    showInfo: false,
    showDisclaimer: true,
    disclaimer: "",
    sections: [
        {
            id: "sec_tapas", 
            category: "TAPES · TAPAS", 
            icon: "tapas", 
            items: [
                { nameCa: "Gilda d'anxova de Perellò 1898", nameEs: "Anxova 00, oliva gordal, piparra de Navarra i tomàquet sec (1 unitat).", price: "3.50€", visible: true }
            ]
        }
    ]
};

// --- 3. CARTA VINS BETA DATA (UPDATED 2024) ---
const BETA_DATA_WINE = {
    title: "Carta de Vins", 
    subtitle: "",
    icon: "wine_bar",
    visible: true,
    recommended: false,
    price: "", 
    vat: "", 
    infoIntro: "", 
    infoAllergy: "", 
    showPrice: false, 
    showInfo: false, 
    showDisclaimer: true, 
    disclaimer: "",
    categories: [
        {
            category: "VINS NEGRES", 
            icon: "wine_bar",
            groups: [
                {
                    sub: "D.O. TERRA ALTA", 
                    items: [
                        { name: "Llàgrimes de Tardor", desc: "Garnatxa, Carinyena", price: "18.50€", visible: true }
                    ]
                }
            ]
        }
    ]
};

// --- 4. MENÚ GRUP BETA DATA (UPDATED 2024) ---
const BETA_DATA_GROUP = {
    title: "Menú de Grup", 
    subtitle: "MÍNIM 10 PERSONES",
    icon: "diversity_3",
    visible: true,
    recommended: false,
    price: "35.00€", 
    vat: "IVA INCLÒS", 
    disclaimer: "Mínim 10 persones. Cal reservar amb antelació.",
    sections: [
        {
            title: "PICA-PICA (PER COMPARTIR)", 
            icon: "tapas",
            items: [
                { nameCa: "Assortiment d'embotits ibèrics i formatges", nameEs: "Surtido de embutidos ibéricos y quesos", visible: true }
            ]
        }
    ],
    drinks: ["Aigua mineral", "Vi de la casa (Negre/Blanc)", "Cafès"], 
    infoIntro: "El menú inclou pa, aigua, vi i cafè.", 
    infoAllergy: "Si us plau, consulteu els al·lèrgens al nostre personal."
};

// --- SUB-COMPONENT: MESSAGE CARD ---
const MessageCard: React.FC<{ 
    msg: ContactMessage; 
    onToggleStatus: (id: string, currentStatus: boolean) => void; 
    onDelete: (id: string) => void; 
}> = ({ msg, onToggleStatus, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const TRUNCATE_LENGTH = 150; 
    const isLongMessage = msg.message.length > TRUNCATE_LENGTH;

    return (
        <div className={`rounded-xl border transition-all duration-300 group ${!msg.read ? 'bg-white border-blue-300 shadow-md border-l-[6px] border-l-blue-600' : 'bg-gray-50 border-gray-200 opacity-90 hover:opacity-100'}`}>
            <div className={`px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center border-b rounded-t-xl gap-4 ${!msg.read ? 'bg-blue-50/30 border-blue-100' : 'bg-gray-100/50 border-gray-200'}`}>
                <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-md border shrink-0 ${!msg.read ? 'text-blue-700 bg-blue-100/50 border-blue-200' : 'text-gray-500 bg-gray-200 border-gray-300'}`}>
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{new Date(msg.timestamp).toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    <span className="opacity-30 mx-1">|</span> 
                    <span>{new Date(msg.timestamp).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {!msg.read ? (
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>Nou</div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-gray-200"><span className="material-symbols-outlined text-[10px]">done_all</span>Llegit</div>
                    )}
                    <h4 className={`text-lg truncate w-full ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>{msg.subject || '(Sense assumpte)'}</h4>
                </div>
            </div>
            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${!msg.read ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-200 text-gray-600 border-gray-300'}`}><span className="material-symbols-outlined text-sm">person</span> {msg.name}</span>
                    <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors text-xs font-medium border border-gray-200"><span className="material-symbols-outlined text-sm">alternate_email</span> {msg.email}</a>
                    {msg.phone && (<a href={`tel:${msg.phone}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-gray-600 hover:text-green-600 hover:border-green-300 transition-colors text-xs font-medium border border-gray-200"><span className="material-symbols-outlined text-sm">call</span> {msg.phone}</a>)}
                </div>
                <div className={`rounded-lg p-4 border ${!msg.read ? 'bg-white border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`whitespace-pre-wrap leading-relaxed text-sm break-words break-all ${!msg.read ? 'text-gray-800' : 'text-gray-500'}`}>{expanded ? msg.message : msg.message.substring(0, TRUNCATE_LENGTH) + (isLongMessage ? '...' : '')}</p>
                    {isLongMessage && (<button onClick={() => setExpanded(!expanded)} className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-bold uppercase flex items-center gap-1 hover:underline transition-all">{expanded ? (<>Plegar missatge <span className="material-symbols-outlined text-sm">expand_less</span></>) : (<>Llegir més <span className="material-symbols-outlined text-sm">expand_more</span></>)}</button>)}
                </div>
            </div>
            <div className={`px-6 py-3 rounded-b-xl flex justify-between items-center gap-3 transition-colors ${!msg.read ? 'bg-blue-50/30' : 'bg-gray-100'}`}>
                <button onClick={(e) => { e.stopPropagation(); onToggleStatus(msg.id, msg.read); }} className={`text-xs font-bold uppercase flex items-center gap-1 px-3 py-1.5 rounded transition-colors border ${!msg.read ? 'text-blue-600 hover:text-white hover:bg-blue-600 border-blue-200 bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200 border-gray-300 bg-white'}`} title={!msg.read ? "Moure a Històric" : "Tornar a Pendents"}><span className="material-symbols-outlined text-sm">{!msg.read ? 'mark_email_read' : 'mark_as_unread'}</span> {!msg.read ? 'Marcar com a Llegit' : 'Marcar com a No Llegit'}</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(msg.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold uppercase flex items-center gap-1 px-3 py-1.5 rounded transition-colors"><span className="material-symbols-outlined text-sm">delete</span> Esborrar</button>
            </div>
        </div>
    );
};

export const Operations: React.FC<OperationsProps> = ({ activeTab, config, updateConfig, setLocalConfig, isSuperAdmin = false }) => {
    // --- RESERVATIONS STATE ---
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationFilter, setReservationFilter] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
    
    // --- INBOX STATE ---
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [inboxFilter, setInboxFilter] = useState<'unread' | 'read'>('unread');
    const [searchTerm, setSearchTerm] = useState('');

    // --- BACKUPS STATE ---
    const [backups, setBackups] = useState<BackupItem[]>([]);
    const [creatingBackup, setCreatingBackup] = useState(false);
    
    // --- NEW BACKUP INPUT MODAL STATE ---
    const [showBackupInput, setShowBackupInput] = useState(false);
    const [newBackupName, setNewBackupName] = useState('');

    // --- UI STATES ---
    const [showInjectConfirm, setShowInjectConfirm] = useState<{ show: boolean, type: 'daily' | 'food' | 'wine' | 'group' | null }>({ show: false, type: null });
    const [showFactoryResetConfirm, setShowFactoryResetConfirm] = useState(false);
    const [showSetMasterConfirm, setShowSetMasterConfirm] = useState(false); // NEW
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // --- NEW: GENERIC CONFIRMATION MODAL STATE ---
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'warning' | 'info';
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'info', onConfirm: () => {} });

    // --- LOCAL STATE FOR LIMITS ---
    const [tempMaxMenus, setTempMaxMenus] = useState<string>("10");
    const [tempMaxHeroImages, setTempMaxHeroImages] = useState<string>("5");
    const [tempMaxProduct, setTempMaxProduct] = useState<string>("5"); // New
    const [tempMaxHistoric, setTempMaxHistoric] = useState<string>("5"); // New

    // --- LOCAL STATE FOR SUPPORT BUTTON ---
    const [tempSupportText, setTempSupportText] = useState("");
    const [tempSupportUrl, setTempSupportUrl] = useState("");

    // Sync temp state when config loads
    useEffect(() => {
        if (config?.adminSettings?.maxExtraMenus !== undefined) {
            setTempMaxMenus(config.adminSettings.maxExtraMenus.toString());
        }
        if (config?.adminSettings?.maxHeroImages !== undefined) {
            setTempMaxHeroImages(config.adminSettings.maxHeroImages.toString());
        }
        if (config?.adminSettings?.maxProductImages !== undefined) {
            setTempMaxProduct(config.adminSettings.maxProductImages.toString());
        }
        if (config?.adminSettings?.maxHistoricImages !== undefined) {
            setTempMaxHistoric(config.adminSettings.maxHistoricImages.toString());
        }
        if (config?.supportSettings) {
            setTempSupportText(config.supportSettings.text || "");
            setTempSupportUrl(config.supportSettings.url || "");
        }
    }, [config?.adminSettings, config?.supportSettings]);

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
        // BACKUPS ARE NOW FETCHED IN 'security' TAB FOR EVERYONE
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
    const handleDeleteReservation = (resId: string) => {
        setConfirmModal({
            isOpen: true, title: "Eliminar Reserva", message: "Segur que vols eliminar aquesta reserva?", type: 'danger',
            onConfirm: async () => { try { await remove(ref(db, `reservations/${resId}`)); } catch (e) { console.error(e); } setConfirmModal(prev => ({ ...prev, isOpen: false })); }
        });
    };
    const handleToggleMessageReadStatus = async (messageId: string, currentStatus: boolean) => {
        try { 
            await update(ref(db, `contactMessages/${messageId}`), { read: !currentStatus }); 
            if (!currentStatus) showFeedback('success', "Missatge mogut a l'Històric."); 
            else showFeedback('success', "Missatge retornat a Pendents."); 
        } catch (e) { console.error(e); }
    };
    const handleDeleteMessage = (messageId: string) => {
        setConfirmModal({
            isOpen: true, title: "Eliminar Missatge", message: "Estàs segur que vols esborrar aquest missatge?", type: 'danger',
            onConfirm: async () => { try { await remove(ref(db, `contactMessages/${messageId}`)); } catch (e) { console.error(e); } setConfirmModal(prev => ({ ...prev, isOpen: false })); }
        });
    };
    
    // --- 1. START BACKUP PROCESS (OPEN MODAL) ---
    const handleInitiateBackup = () => {
        if (!config) {
            setConfirmModal({
                isOpen: true, title: "Error", message: "No s'ha pogut llegir la configuració actual.", type: 'danger',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
            return;
        }
        // Set default name and open modal
        const defaultName = `Còpia ${new Date().toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
        setNewBackupName(defaultName);
        setShowBackupInput(true);
    };

    // --- 2. PERFORM BACKUP (NO ALERTS) ---
    const handleConfirmCreateBackup = async () => {
        if (!newBackupName.trim()) return; // Prevent empty names
        
        setShowBackupInput(false); // Close input modal
        setCreatingBackup(true); // Show loader on button

        try { 
            // CRITICAL FIX: Sanitize config to remove 'undefined' values which cause Firebase errors
            const sanitizedConfig = JSON.parse(JSON.stringify(config));

            await push(ref(db, 'backups'), { 
                timestamp: Date.now(), 
                name: newBackupName, 
                data: sanitizedConfig 
            }); 
            
            showFeedback('success', `Còpia "${newBackupName}" creada correctament.`); 
        } catch (e: any) { 
            console.error("Error detallat al crear còpia:", e);
            let errorMsg = "Error desconegut creant la còpia.";
            if (e.code === 'PERMISSION_DENIED') {
                errorMsg = "Permís denegat. Comprova que tens permís d'escriptura a 'backups' a Firebase Rules.";
            } else if (e.message && e.message.includes('undefined')) {
                errorMsg = "Error de dades: La configuració conté camps invàlids.";
            }
            
            // SHOW ERROR IN MODAL, NOT ALERT
            setConfirmModal({
                isOpen: true,
                title: "Error al crear còpia",
                message: errorMsg,
                type: 'danger',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
        } finally {
            setCreatingBackup(false);
        }
    };

    const handleRestoreBackup = (backup: BackupItem) => {
        if (!updateConfig || !setLocalConfig) return;
        setConfirmModal({
            isOpen: true, title: "Restaurar Còpia", message: `Estàs segur de restaurar la còpia "${backup.name}"?`, type: 'warning',
            onConfirm: async () => { try { await updateConfig(backup.data); setLocalConfig(backup.data); showFeedback('success', "Restauració completada."); } catch(e) { showFeedback('error', "Error restaurant."); } setConfirmModal(prev => ({ ...prev, isOpen: false })); }
        });
    };
    const handleDeleteBackup = (backupId: string) => {
        setConfirmModal({
            isOpen: true, title: "Eliminar Còpia", message: "Esborrar aquesta còpia de seguretat permanentment?", type: 'danger',
            onConfirm: async () => { try { await remove(ref(db, `backups/${backupId}`)); } catch(e) { console.error(e); } setConfirmModal(prev => ({ ...prev, isOpen: false })); }
        });
    };

    // --- NEW: MASTER DELIVERY MANAGEMENT ---
    
    // 1. Set current state as MASTER
    const handleSetMasterVersion = async () => {
        if (!config) return;
        try {
            const sanitizedConfig = JSON.parse(JSON.stringify(config));
            // Save to a dedicated node 'websiteConfig_master' OR a dedicated backup slot
            // Using a dedicated backup slot is easier to manage permissions if needed, but separate node is clearer logic
            await set(ref(db, 'backups/master_delivery'), {
                timestamp: Date.now(),
                name: "Versió Entrega (Master)",
                data: sanitizedConfig
            });
            showFeedback('success', "Versió d'Entrega guardada correctament.");
            setShowSetMasterConfirm(false);
        } catch (e) {
            console.error(e);
            showFeedback('error', "Error guardant la versió mestra.");
        }
    };

    // 2. Modified Factory Reset (Restores Master if exists, else Default)
    const performFactoryReset = async () => {
        if (!updateConfig || !setLocalConfig) return;
        
        try {
            // First, try to fetch the Master Delivery version
            const snapshot = await get(ref(db, 'backups/master_delivery'));
            
            if (snapshot.exists()) {
                const masterData = snapshot.val();
                if (masterData && masterData.data) {
                    await updateConfig(masterData.data);
                    setLocalConfig(masterData.data);
                    showFeedback('success', "Restaurada Versió Inicial (Entrega).");
                } else {
                    throw new Error("Master data corrupt");
                }
            } else {
                // Fallback to code defaults if no master exists (Legacy behavior)
                await updateConfig(defaultAppConfig);
                setLocalConfig(defaultAppConfig);
                showFeedback('success', "Restaurat a valors per defecte (Codi).");
            }
            setShowFactoryResetConfirm(false);
        } catch (e) {
            console.error(e);
            // Fallback safety
            try {
                await updateConfig(defaultAppConfig);
                setLocalConfig(defaultAppConfig);
                showFeedback('success', "Restaurat a valors per defecte (Fallback).");
            } catch (err) {
                showFeedback('error', "Error crític al restaurar.");
            }
            setShowFactoryResetConfirm(false);
        }
    };

    // --- LIMITS SAVING ---
    const handleSaveLimits = async () => {
        // ... (Limits logic unchanged)
        const menusNum = parseInt(tempMaxMenus, 10);
        const heroNum = parseInt(tempMaxHeroImages, 10);
        const prodNum = parseInt(tempMaxProduct, 10);
        const histNum = parseInt(tempMaxHistoric, 10);

        if (isNaN(menusNum) || menusNum < 0 || isNaN(heroNum) || heroNum < 0 || isNaN(prodNum) || prodNum < 0 || isNaN(histNum) || histNum < 0) {
             setConfirmModal({
                isOpen: true, title: "Error", message: "Si us plau, introdueix números vàlids.", type: 'warning',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
            return;
        }

        const newSettings = {
            ...(config?.adminSettings || defaultAppConfig.adminSettings),
            maxExtraMenus: menusNum,
            maxHeroImages: heroNum,
            maxProductImages: prodNum,
            maxHistoricImages: histNum
        };

        if (setLocalConfig) setLocalConfig((prev: any) => ({ ...prev, adminSettings: newSettings }));
        if (updateConfig) {
            try { await updateConfig({ adminSettings: newSettings }); showFeedback('success', "Límits actualitzats."); } 
            catch(e) { showFeedback('error', "Error guardant els límits."); }
        }
    };

    // --- SUPPORT SAVING ---
    const handleSaveSupport = async () => {
        const newSupportSettings = {
            text: tempSupportText,
            url: tempSupportUrl
        };

        if (setLocalConfig) setLocalConfig((prev: any) => ({ ...prev, supportSettings: newSupportSettings }));
        if (updateConfig) {
            try { await updateConfig({ supportSettings: newSupportSettings }); showFeedback('success', "Dades de suport actualitzades."); } 
            catch(e) { showFeedback('error', "Error guardant les dades de suport."); }
        }
    };

    // --- GRANULAR BETA INJECTION ---
    const performBetaInjection = async () => {
        const type = showInjectConfirm.type;
        if (!type) return;
        let path = ''; let data: any = null; let successMsg = '';
        if (type === 'daily') { path = 'dailyMenu'; data = BETA_DATA_DAILY; successMsg = "MENUDIARI_BETA carregat correctament."; } 
        else if (type === 'food') { path = 'foodMenu'; data = BETA_DATA_CARTA; successMsg = "CARTA_BETA carregada correctament."; } 
        else if (type === 'wine') { path = 'wineMenu'; data = BETA_DATA_WINE; successMsg = "CARTAVINS_BETA carregada correctament."; } 
        else if (type === 'group') { path = 'groupMenu'; data = BETA_DATA_GROUP; successMsg = "MENUGRUP_BETA carregat correctament."; }
        try {
            const dbRef = ref(db, `websiteConfig/${path}`); await set(dbRef, data);
            if (setLocalConfig) setLocalConfig((prev: any) => ({ ...prev, [path]: data }));
            if (updateConfig) await updateConfig({ [path]: data });
            setShowInjectConfirm({ show: false, type: null }); showFeedback('success', successMsg);
        } catch (e) { console.error(e); showFeedback('error', "Error injectant les dades."); }
    };

    // --- SHARED MODAL RENDERER ---
    const renderConfirmModal = () => (
        confirmModal.isOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                <div className={`bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 text-center ${confirmModal.type === 'danger' ? 'border-red-600' : 'border-yellow-500'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}><span className="material-symbols-outlined text-3xl">warning</span></div>
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">{confirmModal.title}</h3>
                    <p className="text-gray-500 mb-6 text-sm leading-relaxed">{confirmModal.message}</p>
                    <div className="flex gap-3">
                        {confirmModal.type !== 'info' && (
                            <button onClick={() => setConfirmModal(prev => ({...prev, isOpen: false}))} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">Cancel·lar</button>
                        )}
                        <button onClick={confirmModal.onConfirm} className={`flex-1 py-3 text-white rounded font-bold uppercase text-xs shadow-md transition-colors ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : confirmModal.type === 'info' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                            {confirmModal.type === 'info' ? 'Entesos' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    // --- RENDER ---
    if (activeTab === 'reservations') {
        // ... (Existing Reservations UI unchanged)
        const filtered = reservations.filter(r => r.status === reservationFilter);
        const counts = { pending: reservations.filter(r => r.status === 'pending').length, confirmed: reservations.filter(r => r.status === 'confirmed').length, cancelled: reservations.filter(r => r.status === 'cancelled').length };
        return (
            <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6"><h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2"><span className="material-symbols-outlined text-red-600">book_online</span> Gestió de Reserves</h3></div>
                <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">{(['pending', 'confirmed', 'cancelled'] as const).map(status => (<button key={status} onClick={() => setReservationFilter(status)} className={`pb-2 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${reservationFilter === status ? (status === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-500' : status === 'confirmed' ? 'text-green-600 border-b-2 border-green-500' : 'text-red-400 border-b-2 border-red-400') : 'text-gray-400 hover:text-gray-600'}`}>{status === 'pending' ? 'Pendents' : status === 'confirmed' ? 'Confirmades' : 'Cancel·lades'} {counts[status] > 0 && <span className="ml-2 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{counts[status]}</span>}</button>))}</div>
                {filtered.length === 0 ? (<div className="text-center py-20 opacity-50 bg-white rounded-lg border border-gray-200 border-dashed"><span className="material-symbols-outlined text-6xl mb-4 text-gray-300">event_busy</span><p className="text-lg text-gray-400">No hi ha reserves en aquesta safata.</p></div>) : (<div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left border-collapse table-fixed"><thead><tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider"><th className="p-4 w-24">Estat</th><th className="p-4 w-32">Dia i Hora</th><th className="p-4 w-20">Pax</th><th className="p-4 w-40">Nom</th><th className="p-4 w-32">Telèfon</th><th className="p-4">Notes</th><th className="p-4 text-right w-32">Accions</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((res) => (<tr key={res.id} className={`hover:bg-gray-50 transition-colors ${res.status === 'pending' ? 'bg-yellow-50/10' : ''}`}><td className="p-4 align-middle"><span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${res.status === 'pending' ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : res.status === 'confirmed' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-400 border border-red-100 decoration-line-through"}`}>{res.status === 'pending' ? "PENDENT" : res.status === 'confirmed' ? "CONFIRMADA" : "CANCEL·LADA"}</span></td><td className="p-4 align-middle"><div className="flex flex-col"><span className="font-bold text-gray-800">{new Date(res.date).toLocaleDateString('ca-ES')}</span><span className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded w-fit">{res.time}</span></div></td><td className="p-4 align-middle font-bold text-lg text-secondary">{res.pax} <span className="text-xs font-normal text-gray-400">pers.</span></td><td className="p-4 align-middle font-medium text-gray-700 truncate" title={res.name}>{res.name}</td><td className="p-4 align-middle truncate"><a href={`tel:${res.phone}`} className="text-primary hover:underline font-mono text-sm">{res.phone}</a></td><td className="p-4 align-middle text-sm text-gray-500 truncate" title={res.notes}>{res.notes || '-'}</td><td className="p-4 align-middle text-right"><div className="flex justify-end gap-2">{res.status === 'pending' && (<><button onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">check</span></button><button onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')} className="bg-red-400 hover:bg-red-500 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">close</span></button></>)}{res.status === 'confirmed' && (<button onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')} className="border border-red-300 text-red-400 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">block</span></button>)}{res.status === 'cancelled' && (<button onClick={() => handleUpdateReservationStatus(res.id, 'pending')} title="Tornar a Pendent" className="border border-yellow-300 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 p-2 rounded transition-colors"><span className="material-symbols-outlined text-sm">restore</span></button>)}<button onClick={() => handleDeleteReservation(res.id)} className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors" title="Esborrar definitivament"><span className="material-symbols-outlined text-sm">delete</span></button></div></td></tr>))}</tbody></table></div></div>)}
                {renderConfirmModal()}
            </div>
        );
    }

    if (activeTab === 'inbox') {
        const unreadMsgs = messages.filter(m => !m.read);
        const readMsgs = messages.filter(m => m.read);
        
        let displayedMsgs = [];

        // GLOBAL SEARCH LOGIC
        if (searchTerm.trim() !== '') {
            const lowerTerm = searchTerm.toLowerCase();
            displayedMsgs = messages.filter(m => 
                m.name.toLowerCase().includes(lowerTerm) || 
                m.email.toLowerCase().includes(lowerTerm) || 
                (m.phone && m.phone.includes(lowerTerm)) || 
                m.subject.toLowerCase().includes(lowerTerm) || 
                (m.message && m.message.toLowerCase().includes(lowerTerm))
            );
        } else {
            // STANDARD FILTER LOGIC
            displayedMsgs = inboxFilter === 'unread' ? unreadMsgs : readMsgs;
        }

        return (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-2"><h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2"><span className="material-symbols-outlined text-blue-600">mail</span> Bústia de Missatges</h3></div>
                {feedback && (<div className={`fixed top-4 right-4 z-[200] px-6 py-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-[fadeIn_0.3s_ease-out] ${feedback.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 text-white border-red-700'}`}><span className="material-symbols-outlined text-2xl">{feedback.type === 'success' ? 'check_circle' : 'error'}</span><span className="font-bold">{feedback.msg}</span></div>)}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"><div className="flex gap-2 w-full md:w-auto p-1 bg-gray-50 rounded-lg"><button onClick={() => setInboxFilter('unread')} className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${inboxFilter === 'unread' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}><span className="material-symbols-outlined text-lg">inbox</span>Pendents{unreadMsgs.length > 0 && <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">{unreadMsgs.length}</span>}</button><button onClick={() => setInboxFilter('read')} className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${inboxFilter === 'read' ? 'bg-white text-green-600 shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}><span className="material-symbols-outlined text-lg">history</span>Històric<span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{readMsgs.length}</span></button></div><div className="relative w-full md:w-64"><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar (global)..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"/><span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>{searchTerm && (<button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-base">close</span></button>)}</div></div>
                {displayedMsgs.length === 0 ? (<div className="text-center py-24 bg-white rounded-xl border border-blue-100 border-dashed shadow-sm"><div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${inboxFilter === 'unread' ? 'bg-blue-50 text-blue-300' : 'bg-gray-50 text-gray-300'}`}><span className="material-symbols-outlined text-4xl">{inboxFilter === 'unread' ? 'mark_email_read' : 'history_edu'}</span></div><p className="text-lg text-gray-400 font-medium">{searchTerm ? 'No s\'han trobat resultats a cap bústia.' : (inboxFilter === 'unread' ? "No tens missatges pendents. Bona feina!" : "No hi ha missatges a l'històric.")}</p></div>) : (<div className="space-y-4">{displayedMsgs.map((msg) => (<MessageCard key={msg.id} msg={msg} onToggleStatus={handleToggleMessageReadStatus} onDelete={handleDeleteMessage} />))}</div>)}
                {renderConfirmModal()}
            </div>
        );
    }

    // --- SECURITY TAB (Backups & Beta Restore - Public to all admins) ---
    if (activeTab === 'security') {
        return (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto relative">
                
                {feedback && (<div className={`fixed top-4 right-4 z-[200] px-6 py-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-[fadeIn_0.3s_ease-out] ${feedback.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 text-white border-red-700'}`}><span className="material-symbols-outlined text-2xl">{feedback.type === 'success' ? 'check_circle' : 'error'}</span><span className="font-bold">{feedback.msg}</span></div>)}

                {/* --- BACKUPS SECTION --- */}
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4"><span className="material-symbols-outlined text-3xl text-primary">security</span><div><h3 className="font-serif text-xl font-bold text-gray-800">Còpies de Seguretat</h3><p className="text-gray-500 text-sm">Crea fotos de l'estat actual de la web.</p></div></div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3"><span className="material-symbols-outlined text-blue-500">info</span><p className="text-sm text-blue-700"><strong>Nota:</strong> Les còpies guarden la configuració visual (textos, fotos, menús). No guarden les reserves.</p></div>
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-700">Historial</h4>
                        {/* CHANGED TO USE handleInitiateBackup (Modal flow) instead of direct call */}
                        <button 
                            onClick={handleInitiateBackup} 
                            disabled={creatingBackup}
                            className={`bg-primary hover:bg-accent text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-md transition-all ${creatingBackup ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {creatingBackup ? (
                                <><span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></span> Guardant...</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm">save</span> Crear còpia</>
                            )}
                        </button>
                    </div>
                    {backups.length === 0 ? <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg"><p className="text-gray-400">No hi ha còpies.</p></div> : <div className="space-y-3">{backups.map((backup) => (<div key={backup.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200 hover:shadow-md transition-shadow"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-gray-400">backup</span><div><p className="font-bold text-gray-800 text-sm">{backup.name}</p><p className="text-xs text-gray-500 font-mono">{new Date(backup.timestamp).toLocaleString()}</p></div></div><div className="flex gap-2"><button onClick={() => handleRestoreBackup(backup)} className="text-blue-600 hover:text-blue-800 text-[10px] font-bold uppercase border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">Restaurar</button><button onClick={() => handleDeleteBackup(backup.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button></div></div>))}</div>}
                </div>
                
                {/* --- RESTORE BETA SECTION --- */}
                <div className="bg-green-50 p-6 rounded shadow-sm border border-green-200">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined">menu_book</span> RESTAURACIÓ CARTA BETA (ORIGINAL)</h4>
                    <p className="text-xs text-green-700 mb-4">Utilitza aquests botons per recuperar les versions originals (Beta) dels 4 menús principals si s'han esborrat.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'daily'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all"><span className="material-symbols-outlined text-2xl">lunch_dining</span>Carregar MENUDIARI_BETA</button>
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'food'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all"><span className="material-symbols-outlined text-2xl">restaurant_menu</span>Carregar CARTA_BETA</button>
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'wine'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all"><span className="material-symbols-outlined text-2xl">wine_bar</span>Carregar CARTAVINS_BETA</button>
                        <button onClick={() => setShowInjectConfirm({show: true, type: 'group'})} className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-2 py-4 rounded text-xs font-bold uppercase shadow-sm flex flex-col items-center gap-2 transition-all"><span className="material-symbols-outlined text-2xl">diversity_3</span>Carregar MENUGRUP_BETA</button>
                    </div>
                </div>

                {renderConfirmModal()}
                
                {/* BACKUP INPUT MODAL */}
                {showBackupInput && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 border-primary text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <span className="material-symbols-outlined text-3xl">save</span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Nom de la Còpia</h3>
                            <p className="text-gray-500 mb-4 text-xs">Tria un nom per identificar aquest punt de restauració.</p>
                            
                            <input 
                                type="text" 
                                value={newBackupName} 
                                onChange={(e) => setNewBackupName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary mb-6 text-center font-bold"
                                placeholder="Ex: Còpia Dimarts"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button onClick={() => setShowBackupInput(false)} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">Cancel·lar</button>
                                <button onClick={handleConfirmCreateBackup} className="flex-1 py-3 bg-primary text-white rounded font-bold uppercase text-xs hover:bg-accent shadow-md transition-colors">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONFIRM BETA RESTORE MODAL */}
                {showInjectConfirm.show && (<div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"><div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 border-green-600 text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><span className="material-symbols-outlined text-3xl">{showInjectConfirm.type === 'food' ? 'restaurant_menu' : showInjectConfirm.type === 'wine' ? 'wine_bar' : showInjectConfirm.type === 'group' ? 'diversity_3' : 'lunch_dining'}</span></div><h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{showInjectConfirm.type === 'food' ? 'Carregar CARTA_BETA?' : showInjectConfirm.type === 'wine' ? 'Carregar CARTAVINS_BETA?' : showInjectConfirm.type === 'group' ? 'Carregar MENUGRUP_BETA?' : 'Carregar MENUDIARI_BETA?'}</h3><p className="text-gray-500 mb-6 text-sm leading-relaxed">Això <strong className="text-gray-800">sobrescriurà només aquesta secció</strong> amb la versió original/beta. Els altres menús no es tocaran.</p><div className="flex gap-3"><button onClick={() => setShowInjectConfirm({ show: false, type: null })} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">Cancel·lar</button><button onClick={performBetaInjection} className="flex-1 py-3 bg-green-600 text-white rounded font-bold uppercase text-xs hover:bg-green-700 shadow-md transition-colors">Sí, Restaurar</button></div></div></div>)}
            </div>
        );
    }

    // --- SUPER ADMIN TAB (Exclusive Features) ---
    if (activeTab === 'superadmin' && isSuperAdmin) {
        return (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto relative">
                
                {feedback && (<div className={`fixed top-4 right-4 z-[200] px-6 py-4 rounded-lg shadow-2xl border flex items-center gap-3 animate-[fadeIn_0.3s_ease-out] ${feedback.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 text-white border-red-700'}`}><span className="material-symbols-outlined text-2xl">{feedback.type === 'success' ? 'check_circle' : 'error'}</span><span className="font-bold">{feedback.msg}</span></div>)}

                <div className="bg-purple-50 p-8 rounded-xl shadow-lg border-l-8 border-purple-600 border-t border-r border-b border-purple-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl">admin_panel_settings</span>
                    </div>

                    <div className="flex items-center gap-3 mb-8 border-b-2 border-purple-200 pb-4">
                        <span className="material-symbols-outlined text-4xl text-purple-700">admin_panel_settings</span>
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-purple-900">Zona Super Admin & Desenvolupament</h3>
                            <p className="text-purple-700 text-sm">Configuració tècnica, límits i gestió de versions mestres.</p>
                        </div>
                    </div>

                    <div className="space-y-12 relative z-10">
                        
                        {/* 1. LIMITS */}
                        <div>
                            <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <span className="material-symbols-outlined text-lg">tune</span> Límits del Sistema
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/60 p-4 rounded-lg border border-purple-100">
                                <div className="flex items-center justify-between pb-2 border-b border-purple-100"><div><label className="block text-xs font-bold text-purple-800">Max Menús Extra</label></div><input type="number" min="0" max="50" value={tempMaxMenus} onChange={(e) => setTempMaxMenus(e.target.value)} className="w-16 border border-purple-300 rounded px-2 py-1 text-center font-bold text-purple-900 focus:border-purple-500 outline-none text-xs" /></div>
                                <div className="flex items-center justify-between pb-2 border-b border-purple-100"><div><label className="block text-xs font-bold text-purple-800">Max Slide Portada</label></div><input type="number" min="1" max="20" value={tempMaxHeroImages} onChange={(e) => setTempMaxHeroImages(e.target.value)} className="w-16 border border-purple-300 rounded px-2 py-1 text-center font-bold text-purple-900 focus:border-purple-500 outline-none text-xs" /></div>
                                <div className="flex items-center justify-between"><div><label className="block text-xs font-bold text-purple-800">Max Slide Producte</label></div><input type="number" min="1" max="20" value={tempMaxProduct} onChange={(e) => setTempMaxProduct(e.target.value)} className="w-16 border border-purple-300 rounded px-2 py-1 text-center font-bold text-purple-900 focus:border-purple-500 outline-none text-xs" /></div>
                                <div className="flex items-center justify-between"><div><label className="block text-xs font-bold text-purple-800">Max Slide Història</label></div><input type="number" min="1" max="20" value={tempMaxHistoric} onChange={(e) => setTempMaxHistoric(e.target.value)} className="w-16 border border-purple-300 rounded px-2 py-1 text-center font-bold text-purple-900 focus:border-purple-500 outline-none text-xs" /></div>
                            </div>
                            <div className="mt-2 text-right">
                                <button onClick={handleSaveLimits} className="text-[10px] font-bold text-purple-700 hover:text-purple-900 uppercase underline">Guardar Límits</button>
                            </div>
                        </div>

                        {/* 2. SUPPORT CONFIG */}
                        <div>
                            <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <span className="material-symbols-outlined text-lg">contact_support</span> Configuració Suport Tècnic
                            </h4>
                            <div className="bg-white/60 p-4 rounded-lg border border-purple-100 flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-purple-800 mb-1">Text Botó</label>
                                    <input type="text" value={tempSupportText} onChange={(e) => setTempSupportText(e.target.value)} className="w-full border border-purple-200 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-purple-500" placeholder="Ex: Contactar..." />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-purple-800 mb-1">URL / Mailto</label>
                                    <input type="text" value={tempSupportUrl} onChange={(e) => setTempSupportUrl(e.target.value)} className="w-full border border-purple-200 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-purple-500 font-mono" placeholder="mailto:..." />
                                </div>
                                <div className="flex items-end">
                                    <button onClick={handleSaveSupport} className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase px-4 py-2 rounded shadow-sm transition-colors">Guardar</button>
                                </div>
                            </div>
                        </div>

                        {/* 3. DELIVERY MANAGEMENT (COMBINED) */}
                        <div>
                            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <span className="material-symbols-outlined text-lg">verified</span> Gestió de l'Entrega (Master Version)
                            </h4>
                            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* SET MASTER */}
                                <div>
                                    <h5 className="font-bold text-indigo-800 text-xs mb-2">OPCIÓ A: DEFINIR MASTER (GUARDAR)</h5>
                                    <p className="text-[11px] text-indigo-700 mb-4 leading-relaxed">
                                        Guarda l'estat actual de la web com a "Versió d'Entrega". Utilitza això quan acabis el desenvolupament o facis una actualització major.
                                    </p>
                                    <button 
                                        onClick={() => setShowSetMasterConfirm(true)} 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-xs font-bold uppercase shadow-sm flex items-center gap-2 transition-colors w-full justify-center"
                                    >
                                        <span className="material-symbols-outlined text-base">save_as</span> Definir estat actual com a Master
                                    </button>
                                </div>

                                {/* RESTORE MASTER */}
                                <div className="border-t md:border-t-0 md:border-l border-indigo-200 pt-6 md:pt-0 md:pl-8">
                                    <h5 className="font-bold text-red-800 text-xs mb-2">OPCIÓ B: RESTAURAR MASTER (CARREGAR)</h5>
                                    <p className="text-[11px] text-red-700 mb-4 leading-relaxed">
                                        Esborra tots els canvis fets pel client i retorna la web a l'últim punt "Master" guardat. <strong className="underline">Acció destructiva.</strong>
                                    </p>
                                    <button 
                                        onClick={() => setShowFactoryResetConfirm(true)} 
                                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded text-xs font-bold uppercase shadow-sm flex items-center gap-2 transition-colors w-full justify-center"
                                    >
                                        <span className="material-symbols-outlined text-base">history</span> Restaurar Versió Master
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {renderConfirmModal()}
                
                {/* FACTORY RESET CONFIRM */}
                {showFactoryResetConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 border-red-600 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <span className="material-symbols-outlined text-3xl">history</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Restaurar Versió Entrega?</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                <strong className="text-red-600 block mb-2">ATENCIÓ: Això esborrarà TOTA la configuració actual.</strong> 
                                La web tornarà a estar exactament com el dia que es va entregar al client.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowFactoryResetConfirm(false)} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">Cancel·lar</button>
                                <button onClick={performFactoryReset} className="flex-1 py-3 bg-red-600 text-white rounded font-bold uppercase text-xs hover:bg-red-700 shadow-md transition-colors">Sí, Restaurar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SET MASTER CONFIRM */}
                {showSetMasterConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border-t-4 border-indigo-600 text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <span className="material-symbols-outlined text-3xl">save_as</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Definir Versió Mestra?</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                Estàs a punt de guardar l'estat actual com a <strong>Punt de Restauració d'Entrega</strong>. 
                                <br/><br/>
                                <span className="italic text-xs">Si en el futur es prem "Restaurar Versió Inicial", es carregarà exactament el que veus ara a la web.</span>
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSetMasterConfirm(false)} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors">Cancel·lar</button>
                                <button onClick={handleSetMasterVersion} className="flex-1 py-3 bg-indigo-600 text-white rounded font-bold uppercase text-xs hover:bg-indigo-700 shadow-md transition-colors">Confirmar i Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
};