import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db, auth } from '../firebase';
import { ref, onValue } from 'firebase/database'; // Removed 'get', added 'onValue'
import { ConfigTab } from './admin/ConfigTab';
import { MenuManager } from './admin/MenuManager';
import { Operations } from './admin/Operations';
import { ProfileTab } from './admin/ProfileTab';

interface AdminPanelProps {
  onSaveSuccess: () => void;
  onClose: () => void;
  initialTab?: 'config' | 'inbox' | 'reservations'; 
}

// Helper to validate if an image URL actually loads
const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!url || url.trim() === '') {
            resolve(false);
            return;
        }
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
};

const filterValidImages = async (images: string[]): Promise<string[]> => {
    if (!Array.isArray(images)) return [];
    
    const validImages: string[] = [];
    
    const checks = images.map(async (url) => {
        const isValid = await validateImageUrl(url);
        return isValid ? url : null;
    });

    const results = await Promise.all(checks);
    return results.filter((url): url is string => url !== null);
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSaveSuccess, onClose, initialTab = 'config' }) => {
  const { config, updateConfig } = useConfig();
  
  // Local state for edits (Website Config)
  const [localConfig, setLocalConfig] = useState(() => {
      const initial = JSON.parse(JSON.stringify(config));
      // Hydrate defaults if missing
      const defaultDesc = "Descobreix els sabors autèntics de la nostra terra.";
      if(initial.specialties?.items) {
          initial.specialties.items = initial.specialties.items.map((item: any) => ({
              ...item,
              description: item.description || defaultDesc
          }));
      }
      // SAFETY: Force extraMenus to be an array if it came in as object
      if (initial.extraMenus && !Array.isArray(initial.extraMenus)) {
          initial.extraMenus = Object.values(initial.extraMenus);
      } else if (!initial.extraMenus) {
          initial.extraMenus = [];
      }
      return initial;
  });

  // NEW: Local state for Personal Admin Profile (Display Name)
  const [personalAdminName, setPersonalAdminName] = useState("");
  
  // Refs for change detection (Config Only)
  const initialConfigRef = useRef(JSON.stringify(localConfig));
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Error Modal State (No Browser Alerts)
  const [errorModal, setErrorModal] = useState<{show: boolean, message: string}>({show: false, message: ''});
  
  // Fetch Personal Profile - REAL TIME LISTENER
  useEffect(() => {
      if (auth.currentUser) {
          const uid = auth.currentUser.uid;
          const profileRef = ref(db, `adminProfiles/${uid}/displayName`);
          
          // Listen to changes (onValue) instead of fetching once (get)
          const unsubscribe = onValue(profileRef, (snapshot) => {
              if (snapshot.exists()) {
                  setPersonalAdminName(snapshot.val());
              } else {
                  setPersonalAdminName("");
              }
          });

          return () => unsubscribe();
      }
  }, []);

  // Update changes detection (GLOBAL CONFIG ONLY)
  useEffect(() => {
    const configChanged = JSON.stringify(localConfig) !== initialConfigRef.current;
    setHasChanges(configChanged);
  }, [localConfig]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'config' | 'inbox' | 'menu' | 'reservations' | 'security' | 'profile'>(
      initialTab === 'inbox' ? 'inbox' : initialTab === 'reservations' ? 'reservations' : 'config'
  );

  // Counters for badges
  const [counts, setCounts] = useState({ messages: 0, reservations: 0 });

  useEffect(() => {
      const msgRef = ref(db, 'contactMessages');
      const resRef = ref(db, 'reservations');
      
      const unsubMsg = onValue(msgRef, (snap) => {
          const c = snap.exists() ? Object.values(snap.val()).filter((m:any) => !m.read).length : 0;
          setCounts(prev => ({...prev, messages: c}));
      });
      const unsubRes = onValue(resRef, (snap) => {
          const c = snap.exists() ? Object.values(snap.val()).filter((r:any) => r.status === 'pending').length : 0;
          setCounts(prev => ({...prev, reservations: c}));
      });
      return () => { unsubMsg(); unsubRes(); };
  }, []);

  // Menu Manager State
  const [menuViewState, setMenuViewState] = useState<'dashboard' | 'type_selection' | 'editor'>('dashboard');
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  // --- SAVE FLOW (WEBSITE CONFIG ONLY) ---
  const handleSaveClick = () => {
      if (!hasChanges) return;
      setShowSaveConfirmation(true);
  };

  const confirmSave = async () => {
      setIsSaving(true);
      try {
          if (JSON.stringify(localConfig) !== initialConfigRef.current) {
              // --- DATA SANITIZATION ---
              const configToSave = JSON.parse(JSON.stringify(localConfig));

              if (configToSave.hero && Array.isArray(configToSave.hero.backgroundImages)) {
                  configToSave.hero.backgroundImages = await filterValidImages(configToSave.hero.backgroundImages);
              }

              if (configToSave.philosophy) {
                  if (Array.isArray(configToSave.philosophy.productImages)) {
                      configToSave.philosophy.productImages = await filterValidImages(configToSave.philosophy.productImages);
                  }
                  if (Array.isArray(configToSave.philosophy.historicImages)) {
                      configToSave.philosophy.historicImages = await filterValidImages(configToSave.philosophy.historicImages);
                  }
              }

              await updateConfig(configToSave);
              
              setLocalConfig(configToSave);
              initialConfigRef.current = JSON.stringify(configToSave);
          }
          
          setHasChanges(false);
          setShowSaveConfirmation(false);
          onSaveSuccess();
      } catch (e) {
          console.error(e);
          setErrorModal({ show: true, message: "Error guardant els canvis. Si us plau, revisa la connexió a internet." });
          setIsSaving(false);
          setShowSaveConfirmation(false);
      }
  };

  const handleMenuDelete = (targetId?: string) => {
      const idToDelete = targetId || editingMenuId;
      if (!idToDelete?.startsWith('extra_')) return;
      
      const index = parseInt(idToDelete.replace('extra_', ''));
      setLocalConfig((prev:any) => {
          const newExtras = [...(prev.extraMenus || [])];
          newExtras.splice(index, 1);
          return { ...prev, extraMenus: newExtras };
      });
      
      if (menuViewState === 'editor') {
          setMenuViewState('dashboard');
          setEditingMenuId(null);
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4">
      
      {/* Main Container */}
      <div className="bg-beige text-secondary rounded-lg shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col relative border border-primary/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-primary/20 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          
          {/* LEFT SIDE: Title + User Info + PROFILE BUTTON (Separated) */}
          <div className="flex flex-col">
            <h2 className="font-serif text-2xl font-bold text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings_suggest</span>
              Panell d'Administrador
            </h2>
            <div className="flex items-center gap-4 ml-9 mt-1">
                <span className="text-xs text-gray-400 font-mono">{auth.currentUser?.email}</span>
                
                {/* --- INDIVIDUAL PROFILE BUTTON --- */}
                <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 px-3 py-1 rounded transition-all border shadow-sm
                        ${activeTab === 'profile' 
                            ? 'bg-green-600 text-white border-green-700 ring-2 ring-green-100' 
                            : 'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300'
                        }`}
                >
                    <span className="material-symbols-outlined text-sm">person</span>
                    El meu Perfil
                </button>
            </div>
          </div>
          
          {/* RIGHT SIDE: Content Navigation Tabs (Clean) */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
             <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'config' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>General</button>
             <button onClick={() => { setActiveTab('menu'); setMenuViewState('dashboard'); }} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'menu' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>Menús</button>
             <button onClick={() => setActiveTab('reservations')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all relative whitespace-nowrap ${activeTab === 'reservations' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}>
                 Reserves {counts.reservations > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 rounded-full">{counts.reservations}</span>}
             </button>
             <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all relative whitespace-nowrap ${activeTab === 'inbox' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
                 Missatges {counts.messages > 0 && <span className="ml-1 bg-blue-500 text-white text-[9px] px-1.5 rounded-full">{counts.messages}</span>}
             </button>
             <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Seguretat</button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-beige/50 pb-24 relative">
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

            {/* PROFILE TAB RENDER */}
            {activeTab === 'profile' && (
                <ProfileTab 
                    currentName={personalAdminName}
                    setCurrentName={setPersonalAdminName}
                />
            )}

            {(activeTab === 'reservations' || activeTab === 'inbox' || activeTab === 'security') && (
                <Operations 
                    activeTab={activeTab} 
                    config={config} 
                    updateConfig={updateConfig} 
                    setLocalConfig={setLocalConfig} 
                />
            )}
        </div>

        {/* Footer - HIDE IF IN PROFILE TAB */}
        {activeTab !== 'profile' && (
            <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex justify-end gap-3 items-center z-10 relative">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded text-sm font-bold uppercase hover:bg-gray-50">Tancar</button>
            
            <button 
                    onClick={handleSaveClick} 
                    disabled={!hasChanges} 
                    className={`px-8 py-2 rounded shadow text-sm font-bold uppercase transition-all flex items-center gap-2
                        ${hasChanges ? 'bg-primary text-white hover:bg-accent cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'}`}
                >
                    Guardar Canvis
                    {hasChanges && <span className="material-symbols-outlined text-lg">save</span>}
            </button>
            </div>
        )}
        
        {/* Footer for Profile Tab - Just Close Button */}
        {activeTab === 'profile' && (
            <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex justify-end gap-3 items-center z-10 relative">
                <div className="mr-auto text-xs text-green-700 italic flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">security</span>
                    La configuració del perfil es guarda automàticament al teu compte privat.
                </div>
                <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded text-sm font-bold uppercase hover:bg-gray-50">Tancar</button>
            </div>
        )}

        {/* --- CONFIRMATION MODAL --- */}
        {showSaveConfirmation && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center border-t-4 border-primary">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">save</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">S'han realitzat canvis</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Estàs segur que desitges guardar-los i aplicar-los a la web pública?
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShowSaveConfirmation(false)}
                            className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold uppercase text-xs hover:bg-gray-50 transition-colors"
                        >
                            Rebutjar
                        </button>
                        <button 
                            onClick={confirmSave}
                            disabled={isSaving}
                            className="flex-1 py-3 bg-primary text-white rounded font-bold uppercase text-xs hover:bg-accent shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? 'Validant...' : 'Acceptar'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- ERROR MODAL --- */}
        {errorModal.show && (
            <div className="absolute inset-0 bg-black/60 z-[150] flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center border-t-4 border-red-500">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">Error Guardant</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                        {errorModal.message}
                    </p>
                    <button 
                        onClick={() => setErrorModal({ show: false, message: '' })}
                        className="w-full py-3 bg-red-500 text-white rounded font-bold uppercase text-xs hover:bg-red-600 shadow-md transition-colors"
                    >
                        Entesos, Tancar
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};