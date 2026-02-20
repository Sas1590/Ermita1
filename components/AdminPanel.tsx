import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { useConfig } from '../context/ConfigContext';
import { ConfigTab } from './admin/ConfigTab';
import { MenuManager } from './admin/MenuManager';
import { ProfileTab } from './admin/ProfileTab';
import { Operations } from './admin/Operations';
import { ref, get, onValue } from 'firebase/database';

interface AdminPanelProps {
    initialTab?: string;
    onSaveSuccess: () => void;
    onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ initialTab = 'config', onSaveSuccess, onClose }) => {
    const { config, updateConfig } = useConfig();
    const [localConfig, setLocalConfig] = useState(() => JSON.parse(JSON.stringify(config)));
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isDeveloper, setIsDeveloper] = useState(false); 
    const [counts, setCounts] = useState({ inbox: 0, reservations: 0 });
    const [menuViewState, setMenuViewState] = useState<'dashboard' | 'type_selection' | 'editor'>('dashboard');
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [personalAdminName, setPersonalAdminName] = useState("");

    useEffect(() => {
        if (auth.currentUser) {
            const userEmail = auth.currentUser.email || '';
            
            // Dynamic Role Check from Config
            const superAdmins = config.managementSettings?.superAdminEmails || [];
            const devEmails = config.managementSettings?.developerEmails || [];

            // EMERGENCY ACCESS: Allow specific owner email to access Super Admin zone
            // This prevents lockout if the DB config is empty or reset.
            const isOwnerOverride = userEmail.toLowerCase() === 'umc_admin@proton.me';

            const isSuper = superAdmins.includes(userEmail) || isOwnerOverride;
            
            // "Developer" in this context means "Restricted View" (Private data hidden)
            // A Super Admin is never restricted.
            const isDev = devEmails.includes(userEmail) && !isSuper;
            
            setIsSuperAdmin(isSuper);
            setIsDeveloper(isDev);

            const uid = auth.currentUser.uid;
            get(ref(db, `adminProfiles/${uid}/displayName`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setPersonalAdminName(snapshot.val());
                }
            });

            // If user is NOT a restricted developer, fetch private counts
            if (!isDev) {
                const messagesRef = ref(db, 'contactMessages');
                const reservationsRef = ref(db, 'reservations');

                const unsubMsg = onValue(messagesRef, (snapshot) => {
                    let count = 0;
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        count = Object.values(data).filter((m: any) => !m.read).length;
                    }
                    setCounts(prev => ({ ...prev, inbox: count }));
                });

                const unsubRes = onValue(reservationsRef, (snapshot) => {
                    let count = 0;
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        count = Object.values(data).filter((r: any) => r.status === 'pending').length;
                    }
                    setCounts(prev => ({ ...prev, reservations: count }));
                });

                return () => {
                    unsubMsg();
                    unsubRes();
                };
            }
        }
    }, [config.managementSettings]); // Re-run if config changes (e.g. user added to list)

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

    // --- DYNAMIC TABS GENERATION ---
    const tabs = [
        { id: 'config', label: 'Contingut Web', icon: 'edit_document' },
        { id: 'menu', label: 'Gestor Cartes', icon: 'restaurant_menu' },
    ];

    // ONLY SHOW PRIVATE DATA TABS IF NOT RESTRICTED (DEVELOPER)
    if (!isDeveloper) {
        tabs.push(
            { id: 'inbox', label: 'Missatges', icon: 'mail' },
            { id: 'reservations', label: 'Reserves', icon: 'book_online' }
        );
    }

    tabs.push({ id: 'profile', label: 'El Meu Perfil', icon: 'person' });
    
    // Always show security for everyone
    tabs.push({ id: 'security', label: 'Seguretat', icon: 'security' });

    if (isSuperAdmin) {
        tabs.push({ id: 'superadmin', label: 'Zona Super Admin', icon: 'admin_panel_settings' });
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 animate-[fadeIn_0.2s_ease-out]">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-[#fdfbf7] w-full max-w-[98vw] h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative z-10 border border-white/20">
                <div className="bg-[#1a1816] text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-black shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-2xl">settings</span>
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-bold tracking-wide">Panell d'Administració</h2>
                            <p className="text-xs text-gray-400">
                                {isDeveloper ? 'Mode Restringit (Dades Privades Ocultes)' : 'Gestiona el contingut i les operacions'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-green-900/20">
                            <span className="material-symbols-outlined text-lg">save</span> Guardar Canvis
                        </button>
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-20 md:w-64 bg-[#2c241b] flex-shrink-0 flex flex-col border-r border-white/5">
                        <div className="p-5 border-b border-white/5 mb-2 hidden md:block">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">LOGEJAT COM:</p>
                            <p className={`text-xs font-bold truncate ${isDeveloper ? 'text-orange-400' : 'text-green-400'}`} title={auth.currentUser?.email || ''}>
                                {auth.currentUser?.email}
                            </p>
                            {isDeveloper && <p className="text-[9px] text-gray-500 mt-1 italic">Rol: Tècnic (Restringit)</p>}
                            {isSuperAdmin && <p className="text-[9px] text-purple-400 mt-1 italic">Rol: Super Admin</p>}
                        </div>

                        <div className="flex-1 overflow-y-auto py-2 space-y-2 px-3">
                            {tabs.map(tab => {
                                let badgeCount = 0;
                                let badgeColor = "";
                                if (tab.id === 'inbox') { badgeCount = counts.inbox; badgeColor = "bg-blue-500"; } 
                                else if (tab.id === 'reservations') { badgeCount = counts.reservations; badgeColor = "bg-red-500"; }
                                const isSuperAdminTab = tab.id === 'superadmin';
                                
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative ${activeTab === tab.id ? (isSuperAdminTab ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30' : 'bg-primary text-black font-bold shadow-md') : (isSuperAdminTab ? 'text-purple-300 hover:bg-purple-900/20 hover:text-white border border-purple-500/20 mt-4' : 'text-gray-400 hover:bg-white/5 hover:text-white')}`}>
                                        <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? (isSuperAdminTab ? 'text-white' : 'text-black') : (isSuperAdminTab ? 'text-purple-400 group-hover:text-purple-200' : 'text-gray-500 group-hover:text-white')}`}>{tab.icon}</span>
                                        <span className="text-sm uppercase tracking-wider hidden md:block flex-1 text-left">{tab.label}</span>
                                        {badgeCount > 0 && (<span className={`${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ml-2 hidden md:flex items-center justify-center min-w-[20px]`}>{badgeCount}</span>)}
                                        {badgeCount > 0 && (<div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${badgeColor} md:hidden`}></div>)}
                                        {activeTab === tab.id && (<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full hidden md:block"></div>)}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-white/5 mt-auto hidden md:block">
                            <a href={localConfig.supportSettings?.url || "mailto:support@umcideas.com"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wide group">
                                <span className="material-symbols-outlined text-sm group-hover:text-primary transition-colors">help</span>
                                <span className="truncate">{localConfig.supportSettings?.text || "Contactar Suport"}</span>
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-[#fdfbf7] relative scroll-smooth">
                        <div className="max-w-[1600px] w-full mx-auto p-6 md:p-8 pb-24">
                            {activeTab === 'config' && (<ConfigTab localConfig={localConfig} setLocalConfig={setLocalConfig} userEmail={auth.currentUser?.email || ''} />)}
                            {activeTab === 'menu' && (<MenuManager localConfig={localConfig} setLocalConfig={setLocalConfig} menuViewState={menuViewState} setMenuViewState={setMenuViewState} editingMenuId={editingMenuId} setEditingMenuId={setEditingMenuId} onDeleteCard={handleMenuDelete} />)}
                            {activeTab === 'profile' && (<ProfileTab currentName={personalAdminName} setCurrentName={setPersonalAdminName} />)}
                            {/* RENDER BOTH INBOX AND RESERVATIONS via Operations */}
                            {(activeTab === 'inbox' || activeTab === 'reservations') && !isDeveloper && (<Operations activeTab={activeTab} config={config} updateConfig={updateConfig} setLocalConfig={setLocalConfig} />)}
                            {activeTab === 'security' && (<Operations activeTab='security' config={config} updateConfig={updateConfig} setLocalConfig={setLocalConfig} isSuperAdmin={isSuperAdmin} />)}
                            {activeTab === 'superadmin' && isSuperAdmin && (<Operations activeTab='superadmin' config={config} updateConfig={updateConfig} setLocalConfig={setLocalConfig} isSuperAdmin={isSuperAdmin} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};