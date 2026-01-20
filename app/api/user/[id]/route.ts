import { NextResponse } from "next/server";
import { database } from "../../../service/firebase/firebaseConfig"; // Lưu ý đường dẫn import có thể thay đổi tùy cấu trúc folder (thêm ../)
import { ref, get, update, remove, serverTimestamp } from "firebase/database";

// Hàm helper để lấy tham số ID từ URL
// Context { params } chứa id dynamic
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const itemRef = ref(database, `users/${id}`);

    try {
        const snapshot = await get(itemRef);
        if (snapshot.exists()) {
            return NextResponse.json({ id, ...snapshot.val() }, { status: 200 });
        } else {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error fetching user detail" }, { status: 500 });
    }
}

// PUT: Cập nhật thông tin User
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    const itemRef = ref(database, `users/${id}`);

    // Kiểm tra xem user có tồn tại không trước khi update
    const snapshot = await get(itemRef);
    if (!snapshot.exists()) {
       return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Chuẩn bị dữ liệu update
    // Dùng update() thay vì set() để chỉ cập nhật các trường được gửi lên, giữ nguyên các trường khác (như createdAt)
    const updateData = {
      ...body,
      updatedAt: serverTimestamp() // Thêm thời gian cập nhật
    };

    // Loại bỏ trường id nếu lỡ có trong body để tránh ghi đè key
    delete updateData.id; 

    await update(itemRef, updateData);

    return NextResponse.json({ message: "User updated successfully", id, ...updateData }, { status: 200 });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

// DELETE: Xóa User
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const itemRef = ref(database, `users/${id}`);

    // Kiểm tra tồn tại (tùy chọn, remove() không lỗi nếu không tồn tại nhưng check để báo 404 cho đúng logic)
    const snapshot = await get(itemRef);
    if (!snapshot.exists()) {
       return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await remove(itemRef);

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}