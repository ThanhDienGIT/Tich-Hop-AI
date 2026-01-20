import { NextResponse } from "next/server";
// Sử dụng đường dẫn import mới của bạn
import { database,auth } from "../../service/firebase/firebaseConfig"; 
import { ref, get, set, push, serverTimestamp } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

const userRef = ref(database, 'users');

