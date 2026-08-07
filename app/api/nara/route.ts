import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    
    // Pega a chave que você colocou na Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const lastMessage = messages[messages.length - 1].content;

    // Instrução mestre para a NARA (Parte 6 do nosso plano)
    const promptMestre = `Você é a NARA, a Maestrina e Mentora da CONNECT HUB. 
    Contexto do usuário: ${context}. 
    Seu tom é acolhedor, estratégico e humano. 
    Ouça o usuário e ajude-o a estruturar suas ideias.
    Mensagem do usuário: ${lastMessage}`;

    const result = await model.generateContent(promptMestre);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ text: "NARA está refletindo... pode falar mais um pouco?" }, { status: 500 });
  }
}
