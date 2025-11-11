import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Đọc các biến môi trường từ file .env.local
// Đây là cách làm an toàn và chuẩn cho Next.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// --- Khởi tạo (Singleton Pattern) ---
// Kiểm tra xem app đã được khởi tạo chưa, nếu chưa thì mới khởi tạo
// Điều này ngăn lỗi "Firebase app named '[DEFAULT]' already exists" trong Next.js dev mode
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo các dịch vụ bạn cần
// Chúng ta export các service này để gọi ở bất kỳ đâu trong app
const database = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app); // Bỏ comment nếu bạn cần dùng Analytics

// Export các dịch vụ đã khởi tạo
export { app, database, auth, firestore, storage };