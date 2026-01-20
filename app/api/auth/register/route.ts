import { NextResponse } from "next/server";
// Sử dụng đường dẫn import mới của bạn
import { database,auth } from "../../../service/firebase/firebaseConfig"; 
import { ref, get, set, push, serverTimestamp } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Tạo một ID mới bằng push()
    
    const newUser = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      createdAt: serverTimestamp()
    };
    const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
    const user = userCredential.user;

    // 3. (Tùy chọn) Lấy ID Token sau khi đăng ký thành công
    const token = await user.getIdToken();

    // 4. Trả về thông báo thành công
    return NextResponse.json({ 
      message: "Đăng ký thành công!",
      uid: user.uid,
      email: user.email,
      token: token
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
