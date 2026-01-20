import { NextResponse } from "next/server";
// Sử dụng đường dẫn import mới của bạn
import { database,auth } from "../../../service/firebase/firebaseConfig"; 
import { ref, get, set, push, serverTimestamp } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json(); 

    if (!email || !password) {
      return NextResponse.json(
        { message: "Vui lòng cung cấp đầy đủ email và password." },
        { status: 400 } // Lỗi thiếu dữ liệu
      );
    }

    // ⭐ Lệnh chính: Xác thực người dùng với Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy ID Token sau khi đăng nhập thành công
    const token = await user.getIdToken();

    // Trả về thông tin cần thiết và Token cho Client
    return NextResponse.json({ 
      message: "Đăng nhập thành công!",
      uid: user.uid,
      email: user.email,
      token: token 
    }, { status: 200 });

  } catch (error : any) {
    let errorMessage = "Email hoặc mật khẩu không đúng.";
    
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      errorMessage = "Email hoặc mật khẩu không đúng.";
    } 
    
    console.error("Lỗi Firebase Auth:", error.code, error.message);

    // Trả về lỗi 401 Unauthorized khi đăng nhập thất bại
    return NextResponse.json({ 
      message: errorMessage 
    }, { status: 401 }); 
  }
}