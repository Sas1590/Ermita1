import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Configuración extraída directamente de tu consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2c6eCAQiAc1GuiXZCznPXH9s0CkgFuAU",
  authDomain: "restaurante-web-3648e.firebaseapp.com",
  databaseURL: "https://restaurante-web-3648e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "restaurante-web-3648e",
  storageBucket: "restaurante-web-3648e.firebasestorage.app",
  messagingSenderId: "1072550513164",
  appId: "1:1072550513164:web:f256c81d86a78ba9cc3c29"
};

const app = initializeApp(firebaseConfig);

// Exportamos la instancia de Realtime Database
export const db = getDatabase(app);
// Exportamos la instancia de Authentication con tipado correcto
export const auth = getAuth(app);