import React, { useState, useRef, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { db, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { ConfigTab } from './admin/ConfigTab';
import { MenuManager } from './admin/MenuManager';
import { Operations } from './admin/Operations';

interface AdminPanelProps {
  onSaveSuccess: () => void; // Changed from onSaveAndClose to explicit success handler
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
    // Process in parallel for speed, but preserve order logic if needed
    // However, checking sequentially is safer to avoid browser limit issues if many images
    // Given max 10 images, Promise.all is fine.
    
    const checks = images.map(async (url) => {
        const isValid = await validateImageUrl(url);
        return isValid ? url : null;
    });

    const results = await Promise.all(checks);
    return results.filter((url): url is string => url !== null);
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSaveSuccess, onClose, initialTab = 'config' }) => {
  const { config, updateConfig } = useConfig();
  
  // Local state for edits
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

  const initialConfigRef = useRef(JSON.stringify(localConfig));
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Update changes detection
  useEffect(() => {
    const currentString = JSON.stringify(localConfig);
    setHasChanges(currentString !== initialConfigRef.current);
  }, [localConfig]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'config' | 'inbox' | 'menu' | 'reservations' | 'security'>(
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

  // Menu Manager State (Lifted here to keep panel consistent)
  const [menuViewState, setMenuViewState] = useState<'dashboard' | 'type_selection' | 'editor'>('dashboard');
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  // --- SAVE FLOW ---
  
  // 1. Click "Guardar Canvis" Button
  const handleSaveClick = () => {
      if (!hasChanges) return;
      setShowSaveConfirmation(true);
  };

  // 2. Confirm in Modal
  const confirmSave = async () => {
      setIsSaving(true);
      try {
          // --- DATA SANITIZATION (CLEANUP BEFORE SAVE) ---
          const configToSave = JSON.parse(JSON.stringify(localConfig));

          // Validar i netejar Imatges de Fons (Hero)
          if (configToSave.hero && Array.isArray(configToSave.hero.backgroundImages)) {
              configToSave.hero.backgroundImages = await filterValidImages(configToSave.hero.backgroundImages);
          }

          // Validar i netejar Imatges Filosofia (Producte i Història)
          if (configToSave.philosophy) {
              if (Array.isArray(configToSave.philosophy.productImages)) {
                  configToSave.philosophy.productImages = await filterValidImages(configToSave.philosophy.productImages);
              }
              if (Array.isArray(configToSave.philosophy.historicImages)) {
                  configToSave.philosophy.historicImages = await filterValidImages(configToSave.philosophy.historicImages);
              }
          }

          // --- SAVE PROCESS ---
          await updateConfig(configToSave);
          
          // Update ref to new saved state (using the cleaned version)
          setLocalConfig(configToSave);
          initialConfigRef.current = JSON.stringify(configToSave);
          
          setHasChanges(false);
          setShowSaveConfirmation(false);
          // Trigger success on parent (which closes panel and shows checkmark)
          onSaveSuccess();
      } catch (e) {
          console.error(e);
          alert("Error guardant. Si us plau, revisa la connexió.");
          setIsSaving(false);
          setShowSaveConfirmation(false);
      }
  };

  const handleMenuDelete = (targetId?: string) => {
      // Determine which ID to delete: the one passed directly (dashboard) or the one being edited
      const idToDelete = targetId || editingMenuId;
      
      if (!idToDelete?.startsWith('extra_')) return;
      
      // Removed window.confirm - Deletion is immediate in local state
      const index = parseInt(idToDelete.replace('extra_', ''));
      setLocalConfig((prev:any) => {
          const newExtras = [...(prev.extraMenus || [])];
          newExtras.splice(index, 1);
          return { ...prev, extraMenus: newExtras };
      });
      
      // Only reset view state if we were inside the editor
      if (menuViewState === 'editor') {
          setMenuViewState('dashboard');
          setEditingMenuId(null);
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4">
      
      {/* Main Container - Increased to max-w-7xl to support 4 columns on laptops */}
      <div className="bg-beige text-secondary rounded-lg shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col relative border border-primary/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-primary/20 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <div>
            <h2 className="font-serif text-2xl font-bold text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings_suggest</span>
              Panell d'Administrador
            </h2>
            <span className="text-xs text-gray-400 font-mono ml-9">{auth.currentUser?.email}</span>
          </div>
          
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
             <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all ${activeTab === 'config' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>General</button>
             <button onClick={() => { setActiveTab('menu'); setMenuViewState('dashboard'); }} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all ${activeTab === 'menu' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>Menús</button>
             <button onClick={() => setActiveTab('reservations')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all relative ${activeTab === 'reservations' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}>
                 Reserves {counts.reservations > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 rounded-full">{counts.reservations}</span>}
             </button>
             <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all relative ${activeTab === 'inbox' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
                 Missatges {counts.messages > 0 && <span className="ml-1 bg-blue-500 text-white text-[9px] px-1.5 rounded-full">{counts.messages}</span>}
             </button>
             <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-all ${activeTab === 'security' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Seguretat</button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-beige/50 pb-24 relative">
            {activeTab === 'config' && <ConfigTab localConfig={localConfig} setLocalConfig={setLocalConfig} />}
            
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

            {(activeTab === 'reservations' || activeTab === 'inbox' || activeTab === 'security') && (
                <Operations 
                    activeTab={activeTab} 
                    config={config} 
                    updateConfig={updateConfig} 
                    setLocalConfig={setLocalConfig} 
                />
            )}
        </div>

        {/* Footer */}
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

        {/* --- CENTRAL CONFIRMATION MODAL --- */}
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

      </div>
    </div>
  );
};