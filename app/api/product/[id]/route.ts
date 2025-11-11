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
  { params }: { params: { id: string } }
) {
  try {
    const productRef = getProductRef(params.id);
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      // Trả về dữ liệu sản phẩm bao gồm cả ID
      return NextResponse.json({ id: snapshot.key, ...snapshot.val() });
    } else {
      // Trả về lỗi 404 nếu không tìm thấy
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
  { params }: { params: { id: string } }
) {
  try {
    const productData = await request.json();
    const productRef = getProductRef(params.id);

    // Kiểm tra xem sản phẩm có tồn tại không trước khi update
    const snapshot = await get(productRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Xóa trường ID khỏi data (không lưu ID bên trong chính nó)
    delete productData.id; 

    // Thực hiện cập nhật
    await update(productRef, productData);
    
    // Trả về dữ liệu đã cập nhật
    return NextResponse.json({ message: "Product updated successfully", id: params.id, ...productData });
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
  { params }: { params: { id: string } }
) {
  try {
    const productRef = getProductRef(params.id);

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