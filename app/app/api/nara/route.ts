import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const lastMessage = messages[messages.length - 1].content;
    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ text: "NARA está refletindo..." }, { status: 500 });
  }
}
