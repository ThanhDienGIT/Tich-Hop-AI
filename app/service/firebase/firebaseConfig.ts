// service/firebase/firebaseConfig.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Khởi tạo App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Khởi tạo Auth (Auth thường không gây lỗi Fatal khi thiếu URL)
export const auth = getAuth(app);

// SỬA TẠI ĐÂY: Tạo một hàm getter cho database
export const getFirebaseDB = () => {
  const url = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!url) {
    console.error("Firebase Database URL is missing!");
    return null;
  }
  return getDatabase(app, url);
};

// Vẫn giữ export cũ để không phải sửa quá nhiều file, nhưng gán an toàn
export const database = typeof window !== 'undefined' || process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? getDatabase(app) : null)
  : null;