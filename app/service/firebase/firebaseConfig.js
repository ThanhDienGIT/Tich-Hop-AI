// ... các dòng import giữ nguyên

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

// 1. Kiểm tra biến quan trọng nhất trước khi khởi tạo
if (!firebaseConfig.databaseURL && typeof window !== 'undefined') {
    console.warn("Firebase Database URL is missing. Check your .env.local file.");
}

// 2. Singleton Pattern
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 3. Khởi tạo các dịch vụ
// Nếu databaseURL bị thiếu khi build, truyền trực tiếp vào getDatabase để ép buộc nó nhận giá trị
const database = getDatabase(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, database, auth, firestore, storage };