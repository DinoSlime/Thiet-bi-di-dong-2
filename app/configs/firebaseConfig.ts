import { initializeApp } from 'firebase/app';

import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDuWbh1l5v-KH0Hz9v0bUppH6e2JOC9908",
  authDomain: "musicapp-react-ad280.firebaseapp.com",
  projectId: "musicapp-react-ad280",
  storageBucket: "musicapp-react-ad280.firebasestorage.app",
  messagingSenderId: "103901823237",
  appId: "1:103901823237:web:552cb7f887588e18f1b76c"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };