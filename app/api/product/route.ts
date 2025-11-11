import { NextResponse } from "next/server";
// Sử dụng đường dẫn import mới của bạn
import { database } from "../../service/firebase/firebaseConfig"; 
import { ref, get, set, push, serverTimestamp } from "firebase/database";

const productsRef = ref(database, 'products');

// GET: Lấy tất cả sản phẩm
export async function GET() {
  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Chuyển đổi object từ Firebase thành array
      const products = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      return NextResponse.json(products);
    } else {
      return NextResponse.json([]); // Trả về mảng rỗng nếu không có dữ liệu
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Tạo một sản phẩm mới (Đây là phần bị thiếu gây lỗi 405)
export async function POST(request: Request) {
  try {
    const productData = await request.json();
    
    // Tạo một ID mới bằng push()
    const newProductRef = push(productsRef);
    
    const newProduct = {
      ...productData,
      countSale: productData.countSale || 0,
      countEvaluate: productData.countEvaluate || 0,
      start: productData.start || 0,
      createdAt: serverTimestamp() 
    };

    await set(newProductRef, newProduct);
    
    return NextResponse.json({ id: newProductRef.key, ...newProduct }, { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}