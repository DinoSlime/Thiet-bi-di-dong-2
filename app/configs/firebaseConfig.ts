import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCouda95nbZbhYQ6tv8doa3fQ6Ic_tAKe8",
  authDomain: "musicapp-final.firebaseapp.com",
  projectId: "musicapp-final",
  storageBucket: "musicapp-final.firebasestorage.app",
  messagingSenderId: "737633783109",
  appId: "1:737633783109:web:402b604b33316269a1822c"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);
export { auth ,db};
