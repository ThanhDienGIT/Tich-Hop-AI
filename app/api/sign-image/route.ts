import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Cấu hình Cloudinary bằng các biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    console.log(request);

    if (!image) {
      return NextResponse.json({ message: "Missing paramsToSign" }, { status: 400 });
    }

    // Tạo chữ ký an toàn ở server
    const signature = cloudinary.utils.api_sign_request(
      image,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Error signing upload:", error);
    return NextResponse.json({ message: "Failed to sign upload" }, { status: 500 });
  }
}