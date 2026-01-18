import React, { useState } from 'react';
import { auth } from '../firebase';
// Fix: Handle firebase/auth import errors by casting to any
import * as firebaseAuth from 'firebase/auth';

const { signInWithEmailAndPassword, sendPasswordResetEmail } = firebaseAuth as any;

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Correu o contrasenya incorrectes.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Massa intents fallits. Prova-ho més tard.');
      } else {
        setError('Error al iniciar sessió. Comprova la connexió.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Escriu el teu correu electrònic per restablir la contrasenya.');
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('Correu de recuperació enviat! Revisa la teva bústia.');
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('No s\'ha pogut enviar el correu. Comprova que l\'adreça sigui correcta.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-8 animate-[fadeIn_0.3s_ease-out]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">lock</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-secondary">Accés Administrador</h2>
          <p className="text-gray-500 text-sm mt-1">Introdueix les teves credencials per gestionar la web.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Correu Electrònic</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="admin@ermita.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contrasenya</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded flex items-center gap-2">
               <span className="material-symbols-outlined text-lg">error</span>
               {error}
            </div>
          )}

          {info && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded flex items-center gap-2">
               <span className="material-symbols-outlined text-lg">check_circle</span>
               {info}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded shadow transition-all flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Accedint...' : 'Entrar al Panell'}
            {!isLoading && <span className="material-symbols-outlined">login</span>}
          </button>
        </form>

        <div className="mt-6 flex justify-between items-center text-sm">
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">Cancel·lar</button>
           <button 
             onClick={handleResetPassword}
             className="text-primary hover:text-accent font-medium hover:underline"
           >
             He oblidat la contrasenya
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
