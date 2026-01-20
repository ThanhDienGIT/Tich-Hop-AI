import { NextResponse } from "next/server";
// Sử dụng đường dẫn import Firebase config của bạn
import { database } from "../../../service/firebase/firebaseConfig"; 
import { ref, get, update, remove } from "firebase/database";

// Helper function để lấy ref sản phẩm
const getProductRef = (id: string) => ref(database, `products/${id}`);

/**
 * GET: Lấy một sản phẩm theo ID
 */
export async function GET(
  request: Request,
  // Sửa ở đây: params là Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sửa ở đây: cần await params trước khi dùng
    const { id } = await params;
    
    const productRef = getProductRef(id);
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      return NextResponse.json({ id: snapshot.key, ...snapshot.val() });
    } else {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

/**
 * PUT: Cập nhật một sản phẩm
 */
export async function PUT(
  request: Request,
  // Sửa ở đây: params là Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // await params
    const productData = await request.json();
    const productRef = getProductRef(id);

    // Kiểm tra xem sản phẩm có tồn tại không trước khi update
    const snapshot = await get(productRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Xóa trường ID khỏi data (không lưu ID bên trong chính nó)
    if (productData.id) delete productData.id; 

    // Thực hiện cập nhật
    await update(productRef, productData);
    
    return NextResponse.json({ message: "Product updated successfully", id: id, ...productData });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

/**
 * DELETE: Xóa một sản phẩm
 */
export async function DELETE(
  request: Request,
  // Sửa ở đây: params là Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // await params
    const productRef = getProductRef(id);

    // Kiểm tra xem sản phẩm có tồn tại không trước khi xóa
    const snapshot = await get(productRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Thực hiện xóa
    await remove(productRef);
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}