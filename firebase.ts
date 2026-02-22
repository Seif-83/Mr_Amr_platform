import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCzXXpAq7oBQCg5U-XELtjPhX_Cz12wnz0",
    authDomain: "amr-platform.firebaseapp.com",
    databaseURL: "https://amr-platform-default-rtdb.firebaseio.com",
    projectId: "amr-platform",
    storageBucket: "amr-platform.firebasestorage.app",
    messagingSenderId: "702351737173",
    appId: "1:702351737173:web:2e87818977f7bfb78cefdc",
    measurementId: "G-YBNZM0CP0V"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app, firebaseConfig.databaseURL);
