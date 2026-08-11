import { GoogleGmail } from "@google/gmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Chave da API Gemini não encontrada");
    }

    const ai = new GoogleGmail({ apiKey });

    // Pega a última mensagem do usuário
    const lastMessage = messages[messages.length - 1]?.content || "";

    // Pega as últimas 10 mensagens para contexto completo
    const history = messages
      .slice(-10)
      .map((m: any) => `${m.role === "user" ? "Usuário" : "NARA"}: ${m.content}`)
      .join("\n");

    const systemPrompt = `
Você é a NARA, recepcionista e mentora da CONNECT HUB.

INFORMAÇÕES SOBRE A CONNECT HUB:
- +1,2 MILHÃO de pessoas atendidas
- +1.800 MUNICÍPIOS atendidos
- R$320 MILHÕES em recursos mobilizados
- +250 MIL oportunidades geradas

CONTEXTO: ${context || "Conversa geral"}

HISTÓRICO DA CONVERSA:
${history}

ÚLTIMA MENSAGEM DO USUÁRIO: "${lastMessage}"

REGRAS:
- Responda em português brasileiro, com tom caloroso
- NUNCA repita a mesma frase
- Sempre faça uma pergunta no final

RESPOSTA DA NARA:
`;

    const result = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: systemPrompt,
    });

    return NextResponse.json({
      text: result?.text || "Estou aqui! Me conte mais sobre isso."
    });
  } catch (error: any) {
    console.error("Erro na NARA:", error.message);
    return NextResponse.json({
      text: "Estou aqui! Pode continuar, estou processando sua mensagem com carinho."
    }, { status: 500 });
  }
}
