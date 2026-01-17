import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { ref, set } from 'firebase/database';

interface ProfileTabProps {
    currentName: string;
    setCurrentName: (name: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ currentName, setCurrentName }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    const handleSaveProfile = async () => {
        if (!auth.currentUser) return;
        
        setIsSaving(true);
        setStatus('idle');
        setErrorDetails(null);

        const nameToSave = (currentName || "").trim();

        try {
            // THE RIGHT WAY: Save directly to Firebase Database.
            // No local storage fallbacks.
            await set(ref(db, `adminProfiles/${auth.currentUser.uid}/displayName`), nameToSave);
            
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);

        } catch (error: any) {
            console.error("Firebase save failed:", error);
            setStatus('error');
            
            if (error.code === 'PERMISSION_DENIED') {
                setErrorDetails('rules_issue');
            } else {
                setErrorDetails(error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] max-w-3xl mx-auto">
            
            {/* Header Card */}
            <div className="bg-green-50 p-8 rounded-xl shadow-sm border border-green-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                        <span className="material-symbols-outlined text-3xl">person_edit</span>
                    </div>
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-green-900">El Teu Perfil</h3>
                        <p className="text-green-700/70 text-sm">Gestiona com et veu el sistema.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm space-y-6">
                    
                    {/* Read Only Email */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Correu Electrònic (ID)</label>
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-3 rounded border border-gray-200">
                            <span className="material-symbols-outlined text-lg">mail</span>
                            <span className="font-mono text-sm">{auth.currentUser?.email}</span>
                            <span className="ml-auto text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-500 font-bold uppercase">No editable</span>
                        </div>
                    </div>

                    {/* Editable Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nom a mostrar (Navbar)</label>
                        <div className="relative">
                            <input
                                type="text"
                                maxLength={20}
                                value={currentName}
                                onChange={(e) => setCurrentName(e.target.value)}
                                className="block w-full border border-green-300 rounded px-4 py-3 text-base focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none pr-12 transition-all"
                                placeholder="Ex: Elena"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">
                                {currentName.length}/20
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">info</span>
                            Aquest nom apareixerà a la part superior dreta de la web quan tinguis la sessió iniciada.
                        </p>
                    </div>

                    {/* Save Action Area */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm">
                            {status === 'success' && (
                                <span className="text-green-600 font-bold flex items-center gap-1 animate-[fadeIn_0.3s_ease-out]">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    Guardat al núvol correctament!
                                </span>
                            )}
                            {status === 'error' && (
                                <div className="flex items-center gap-1 text-red-500 font-bold animate-[fadeIn_0.3s_ease-out]">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    Error al guardar.
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className={`px-6 py-2.5 rounded shadow-md text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                                ${isSaving 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-0.5'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                    Guardant...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    Guardar Perfil
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ERROR HANDLING GUIDE: FIREBASE RULES */}
            {status === 'error' && errorDetails === 'rules_issue' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded shadow-md animate-[fadeIn_0.5s_ease-out]">
                    <h4 className="text-red-800 font-bold flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined">security</span>
                        Bloquejat per Firebase (Permís Denegat)
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                        La base de dades no permet escriure a la carpeta <code>adminProfiles</code>. Això és normal si no has actualitzat les regles de seguretat.
                    </p>
                    
                    <div className="bg-white border border-red-200 rounded p-4">
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">SOLUCIÓ: Copia això a les "Rules" de Firebase Database:</p>
                        <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto font-mono">
{`"adminProfiles": {
  "$uid": {
    ".read": "auth != null",
    ".write": "$uid === auth.uid"
  }
},
"websiteConfig": { ... }`}
                        </pre>
                    </div>
                    <p className="text-xs text-red-600 mt-3 italic">
                        * Això permet que cada administrador pugui editar exclusivament el seu propi perfil.
                    </p>
                </div>
            )}

            <div className="text-center text-gray-400 text-xs italic">
                * Les dades es guarden de forma segura a Firebase vinculades al teu UID únic.
            </div>
        </div>
    );
};
