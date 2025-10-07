// File: app/api/hello/route.ts

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
/**
 * @description Xử lý yêu cầu GET đến /api/hello
 * Hàm này sẽ được gọi mỗi khi có một request GET tới đường dẫn này.
 * @param {Request} request - Đối tượng request chứa thông tin về yêu cầu gửi đến.
 */

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCMp8nnCwZsur31PLQU8a7HEbb9S6356OE",
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);

    const data = {
      message: response.text,
      timestamp: new Date().toISOString(),
    };

    // Sử dụng NextResponse.json() để trả về một phản hồi dạng JSON.
    // Next.js sẽ tự động thiết lập header 'Content-Type': 'application/json' cho bạn.
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Error occurred", error: err },
      { status: 500 }
    );
  }
}
