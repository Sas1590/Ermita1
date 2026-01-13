import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update, remove, push } from 'firebase/database';
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

export const Operations: React.FC<OperationsProps> = ({ activeTab, config, updateConfig, setLocalConfig }) => {
    // --- RESERVATIONS STATE ---
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationFilter, setReservationFilter] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
    
    // --- INBOX STATE ---
    const [messages, setMessages] = useState<ContactMessage[]>([]);

    // --- BACKUPS STATE ---
    const [backups, setBackups] = useState<BackupItem[]>([]);

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

    // --- ACTIONS ---
    const handleUpdateReservationStatus = async (resId: string, newStatus: 'confirmed' | 'cancelled') => {
        try { await update(ref(db, `reservations/${resId}`), { status: newStatus }); } catch (e) { console.error(e); }
    };
    const handleDeleteReservation = async (resId: string) => {
        if(window.confirm("Segur que vols eliminar aquesta reserva?")) {
            try { await remove(ref(db, `reservations/${resId}`)); } catch (e) { console.error(e); }
        }
    };
    const handleMarkAsRead = async (messageId: string) => {
        try { await update(ref(db, `contactMessages/${messageId}`), { read: true }); } catch (e) { console.error(e); }
    };
    const handleDeleteMessage = async (messageId: string) => {
        if(window.confirm("Estàs segur que vols esborrar aquest missatge?")) {
            try { await remove(ref(db, `contactMessages/${messageId}`)); } catch (e) { console.error(e); }
        }
    };
    const handleCreateBackup = async () => {
        if (!config) return;
        try {
            await push(ref(db, 'backups'), { timestamp: Date.now(), name: `Còpia ${new Date().toLocaleString()}`, data: config });
            alert("Còpia de seguretat creada correctament.");
        } catch (e) { alert("Error creant la còpia."); }
    };
    const handleRestoreBackup = async (backup: BackupItem) => {
        if (!updateConfig || !setLocalConfig) return;
        if(window.confirm(`Estàs segur de restaurar la còpia: ${backup.name}? Es perdran els canvis no guardats.`)) {
            try { await updateConfig(backup.data); setLocalConfig(backup.data); alert("Restauració completada."); } catch(e) { alert("Error restaurant."); }
        }
    };
    const handleFactoryReset = async () => {
        if (!updateConfig || !setLocalConfig) return;
        if (window.confirm("ATENCIÓ: Aquesta acció esborrarà TOTA la configuració. Estàs segur?")) {
            try { await updateConfig(defaultAppConfig); setLocalConfig(defaultAppConfig); alert("Restaurat a fàbrica."); } catch (e) { console.error(e); }
        }
    };

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
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider"><th className="p-4">Estat</th><th className="p-4">Dia i Hora</th><th className="p-4">Pax</th><th className="p-4">Nom</th><th className="p-4">Telèfon</th><th className="p-4">Notes</th><th className="p-4 text-right">Accions</th></tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((res) => (
                                        <tr key={res.id} className={`hover:bg-gray-50 transition-colors ${res.status === 'pending' ? 'bg-yellow-50/10' : ''}`}>
                                            <td className="p-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${res.status === 'pending' ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : res.status === 'confirmed' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-400 border border-red-100 decoration-line-through"}`}>{res.status === 'pending' ? "PENDENT" : res.status === 'confirmed' ? "CONFIRMADA" : "CANCEL·LADA"}</span></td>
                                            <td className="p-4"><div className="flex flex-col"><span className="font-bold text-gray-800">{new Date(res.date).toLocaleDateString('ca-ES')}</span><span className="text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded w-fit">{res.time}</span></div></td>
                                            <td className="p-4 font-bold text-lg text-secondary">{res.pax} <span className="text-xs font-normal text-gray-400">pers.</span></td>
                                            <td className="p-4 font-medium text-gray-700">{res.name}</td>
                                            <td className="p-4"><a href={`tel:${res.phone}`} className="text-primary hover:underline font-mono text-sm">{res.phone}</a></td>
                                            <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={res.notes}>{res.notes || '-'}</td>
                                            <td className="p-4 text-right"><div className="flex justify-end gap-2">
                                                {res.status === 'pending' && (<><button onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">check</span></button><button onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')} className="bg-red-400 hover:bg-red-500 text-white p-2 rounded shadow-sm transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">close</span></button></>)}
                                                {res.status === 'confirmed' && (<button onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')} className="border border-red-300 text-red-400 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">block</span></button>)}
                                                {res.status === 'cancelled' && (<button onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')} className="border border-gray-300 text-gray-400 hover:text-green-600 hover:bg-green-50 p-2 rounded transition-colors"><span className="material-symbols-outlined text-sm">restore</span></button>)}
                                                <button onClick={() => handleDeleteReservation(res.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors ml-2"><span className="material-symbols-outlined text-sm">delete</span></button>
                                            </div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (activeTab === 'inbox') {
        return (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto">
                <div className="flex justify-between items-center"><h3 className="font-serif text-2xl font-bold text-gray-800 flex items-center gap-2"><span className="material-symbols-outlined text-blue-600">mail</span> Bústia de Missatges</h3><div className="text-xs font-bold text-blue-600 bg-white px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">Total: {messages.length}</div></div>
                {messages.length === 0 ? (<div className="text-center py-24 bg-white rounded-xl border border-blue-100 border-dashed shadow-sm"><div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-4xl text-blue-300">inbox</span></div><p className="text-lg text-gray-400 font-medium">La bústia està buida.</p></div>) : (<div className="space-y-4">{messages.map((msg) => (<div key={msg.id} className={`rounded-xl border transition-all duration-300 group ${!msg.read ? 'bg-white border-blue-300 shadow-md border-l-[6px] border-l-blue-600' : 'bg-white/80 border-gray-200 shadow-sm hover:shadow-md'}`}><div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 bg-gray-50/30 rounded-t-xl gap-2"><div className="flex items-center gap-3">{!msg.read && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}<h4 className={`text-lg ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>{msg.subject || '(Sense assumpte)'}</h4></div><div className="flex items-center gap-2 text-xs text-gray-400 font-mono"><span className="material-symbols-outlined text-sm">schedule</span>{new Date(msg.timestamp).toLocaleString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div></div><div className="p-6"><div className="flex flex-wrap gap-2 mb-4"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"><span className="material-symbols-outlined text-sm">person</span> {msg.name}</span><a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium border border-gray-200"><span className="material-symbols-outlined text-sm">alternate_email</span> {msg.email}</a>{msg.phone && (<a href={`tel:${msg.phone}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors text-xs font-medium border border-gray-200"><span className="material-symbols-outlined text-sm">call</span> {msg.phone}</a>)}</div><div className="bg-gray-50 rounded-lg p-4 border border-gray-100"><p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{msg.message}</p></div></div><div className="px-6 py-3 bg-gray-50 rounded-b-xl flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">{!msg.read && (<button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 transition-colors"><span className="material-symbols-outlined text-sm">mark_email_read</span> Marcar llegit</button>)}<button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"><span className="material-symbols-outlined text-sm">delete</span> Esborrar</button></div></div>))}</div>)}
            </div>
        );
    }

    if (activeTab === 'security') {
        return (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">security</span>
                        <div><h3 className="font-serif text-xl font-bold text-gray-800">Còpies de Seguretat</h3><p className="text-gray-500 text-sm">Gestiona la seguretat de les dades.</p></div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3"><span className="material-symbols-outlined text-blue-500">info</span><p className="text-sm text-blue-700"><strong>Important:</strong> Les còpies guarden la configuració visual (textos, fotos). No guarden les reserves.</p></div>
                    <div className="flex justify-between items-center mb-6"><h4 className="font-bold text-gray-700">Historial</h4><button onClick={handleCreateBackup} className="bg-primary hover:bg-accent text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 shadow-md transition-all"><span className="material-symbols-outlined text-sm">save</span> Crear còpia</button></div>
                    {backups.length === 0 ? <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg"><p className="text-gray-400">No hi ha còpies.</p></div> : <div className="space-y-3">{backups.map((backup) => (<div key={backup.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200"><div className="flex items-center gap-3"><span className="material-symbols-outlined text-gray-400">backup</span><div><p className="font-bold text-gray-800 text-sm">{backup.name}</p><p className="text-xs text-gray-500 font-mono">{new Date(backup.timestamp).toLocaleString()}</p></div></div><button onClick={() => handleRestoreBackup(backup)} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">Restaurar</button></div>))}</div>}
                </div>
                <div className="bg-red-50 p-6 rounded shadow-sm border border-red-200">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><span className="material-symbols-outlined">warning</span> Zona de Perill</h4>
                    <button onClick={handleFactoryReset} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold uppercase shadow flex items-center gap-2 w-full justify-center sm:w-auto"><span className="material-symbols-outlined text-sm">restart_alt</span> Restaurar Fàbrica</button>
                </div>
            </div>
        );
    }

    return null;
};