import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    const lastMessage = messages[messages.length - 1].content;
    
    const result = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: `Contexto: ${context}. Mensagem do usuário: ${lastMessage}`,
    });
    
    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    console.error("Erro NARA:", error.message);
    return NextResponse.json({ 
      text: "NARA está refletindo... pode falar mais um pouco?" 
    }, { status: 500 });
  }
}
