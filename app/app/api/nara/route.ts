import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Pega a chave que vamos colocar na Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pega a última coisa que o usuário escreveu
    const lastMessage = messages[messages.length - 1].content;

    // Pede para o Gemini responder
    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: "NARA está refletindo... tente novamente em instantes." }, { status: 500 });
  }
}
