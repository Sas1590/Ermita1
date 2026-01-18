import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useConfig } from '../context/ConfigContext';
import { ConfigTab } from './admin/ConfigTab';
import { MenuManager } from './admin/MenuManager';
import { ProfileTab } from './admin/ProfileTab';
import { Operations } from './admin/Operations';
import { ref, get, onValue } from 'firebase/database';

// AFEGEIX AQUÍ ELS EMAILS QUE PODEN VEURE LA PESTANYA "SEGURETAT" (Còpies, Restaurar, Límits)
const SUPER_ADMIN_EMAILS = [
    'umc_admin@proton.me'
];

interface AdminPanelProps {
    initialTab?: string;
    onSaveSuccess: () => void;
    onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ initialTab = 'config', onSaveSuccess, onClose }) => {
    const { config, updateConfig } = useConfig();
    const [localConfig, setLocalConfig] = useState(config);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    
    // Notification Counts State
    const [counts, setCounts] = useState({ inbox: 0, reservations: 0 });
    
    // Menu Manager State
    const [menuViewState, setMenuViewState] = useState<'dashboard' | 'type_selection' | 'editor'>('dashboard');
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

    // Profile State
    const [personalAdminName, setPersonalAdminName] = useState("");

    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    useEffect(() => {
        if (auth.currentUser) {
            // CHECK IF USER IS SUPER ADMIN BASED ON EMAIL
            const userEmail = auth.currentUser.email || '';
            const isSuper = SUPER_ADMIN_EMAILS.includes(userEmail);
            setIsSuperAdmin(isSuper);

            // Fetch profile name
            const uid = auth.currentUser.uid;
            get(ref(db, `adminProfiles/${uid}/displayName`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setPersonalAdminName(snapshot.val());
                }
            });

            // --- REALTIME LISTENERS FOR NOTIFICATIONS ---
            const messagesRef = ref(db, 'contactMessages');
            const reservationsRef = ref(db, 'reservations');

            const unsubMsg = onValue(messagesRef, (snapshot) => {
                let count = 0;
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Count unread messages
                    count = Object.values(data).filter((m: any) => !m.read).length;
                }
                setCounts(prev => ({ ...prev, inbox: count }));
            });

            const unsubRes = onValue(reservationsRef, (snapshot) => {
                let count = 0;
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Count pending reservations
                    count = Object.values(data).filter((r: any) => r.status === 'pending').length;
                }
                setCounts(prev => ({ ...prev, reservations: count }));
            });

            return () => {
                unsubMsg();
                unsubRes();
            };
        }
    }, []);

    // Redirect if active tab is security but user is not superadmin
    useEffect(() => {
        if (activeTab === 'security' && !isSuperAdmin && auth.currentUser) {
            setActiveTab('config');
        }
    }, [activeTab, isSuperAdmin]);

    const handleSave = async () => {
        await updateConfig(localConfig);
        onSaveSuccess();
    };

    const handleMenuDelete = (menuId: string) => {
        if (menuId.startsWith('extra_')) {
            const index = parseInt(menuId.replace('extra_', ''));
            const newExtras = [...(localConfig.extraMenus || [])];
            newExtras.splice(index, 1);
            setLocalConfig({ ...localConfig, extraMenus: newExtras });
            setMenuViewState('dashboard');
            setEditingMenuId(null);
        }
    };

    // Define Base Tabs
    const tabs = [
        { id: 'config', label: 'Contingut Web', icon: 'edit_document' },
        { id: 'menu', label: 'Gestor Cartes', icon: 'restaurant_menu' },
        { id: 'inbox', label: 'Missatges', icon: 'mail' },
        { id: 'reservations', label: 'Reserves', icon: 'book_online' },
        { id: 'profile', label: 'El Meu Perfil', icon: 'person' },
    ];

    // Only add Security tab if Super Admin
    if (isSuperAdmin) {
        tabs.push({ id: 'security', label: 'Seguretat', icon: 'security' });
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 animate-[fadeIn_0.2s_ease-out]">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="bg-[#fdfbf7] w-full max-w-[98vw] h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative z-10 border border-white/20">
                
                {/* Header */}
                <div className="bg-[#1a1816] text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-black shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl">settings</span>
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-bold tracking-wide">Panell d'Administració</h2>
                            <p className="text-xs text-gray-400">Gestiona el contingut i les operacions</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-green-900/20"
                        >
                            <span className="material-symbols-outlined text-lg">save</span>
                            Guardar Canvis
                        </button>
                        <button 
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-20 md:w-64 bg-[#2c241b] flex-shrink-0 flex flex-col border-r border-white/5">
                        
                        {/* User Profile - Top Position - Minimalist Green Email */}
                        <div className="p-5 border-b border-white/5 mb-2 hidden md:block">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">LOGEJAT COM:</p>
                            <p className="text-xs font-bold text-green-400 truncate" title={auth.currentUser?.email || ''}>
                                {auth.currentUser?.email}
                            </p>
                            {isSuperAdmin && (
                                <span className="inline-block mt-2 text-[9px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded border border-purple-700 uppercase tracking-widest">
                                    Super Admin
                                </span>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto py-2 space-y-2 px-3">
                            {tabs.map(tab => {
                                // Calculate badges
                                let badgeCount = 0;
                                let badgeColor = "";
                                
                                if (tab.id === 'inbox') {
                                    badgeCount = counts.inbox;
                                    badgeColor = "bg-blue-500";
                                } else if (tab.id === 'reservations') {
                                    badgeCount = counts.reservations;
                                    badgeColor = "bg-red-500";
                                }

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative
                                            ${activeTab === tab.id 
                                                ? 'bg-primary text-black font-bold shadow-md' 
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? 'text-black' : 'text-gray-500 group-hover:text-white'}`}>{tab.icon}</span>
                                        <span className="text-sm uppercase tracking-wider hidden md:block flex-1 text-left">{tab.label}</span>
                                        
                                        {/* Notification Badge */}
                                        {badgeCount > 0 && (
                                            <span className={`${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ml-2 hidden md:flex items-center justify-center min-w-[20px]`}>
                                                {badgeCount}
                                            </span>
                                        )}
                                        
                                        {/* Mobile Dot Notification (only visible if sidebar is collapsed/small) */}
                                        {badgeCount > 0 && (
                                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${badgeColor} md:hidden`}></div>
                                        )}

                                        {activeTab === tab.id && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full hidden md:block"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-[#fdfbf7] relative scroll-smooth">
                        <div className="max-w-[1600px] w-full mx-auto p-6 md:p-8 pb-24">
                            {activeTab === 'config' && (
                                <ConfigTab 
                                    localConfig={localConfig} 
                                    setLocalConfig={setLocalConfig} 
                                    userEmail={auth.currentUser?.email || ''} 
                                />
                            )}
                            
                            {activeTab === 'menu' && (
                                <MenuManager 
                                    localConfig={localConfig} 
                                    setLocalConfig={setLocalConfig}
                                    menuViewState={menuViewState}
                                    setMenuViewState={setMenuViewState}
                                    editingMenuId={editingMenuId}
                                    setEditingMenuId={setEditingMenuId}
                                    onDeleteCard={handleMenuDelete}
                                />
                            )}

                            {activeTab === 'profile' && (
                                <ProfileTab 
                                    currentName={personalAdminName}
                                    setCurrentName={setPersonalAdminName}
                                />
                            )}

                            {(activeTab === 'reservations' || activeTab === 'inbox') && (
                                <Operations 
                                    activeTab={activeTab} 
                                    config={config} 
                                    updateConfig={updateConfig} 
                                    setLocalConfig={setLocalConfig} 
                                />
                            )}

                            {activeTab === 'security' && isSuperAdmin && (
                                <Operations 
                                    activeTab='security' 
                                    config={config} 
                                    updateConfig={updateConfig} 
                                    setLocalConfig={setLocalConfig} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};