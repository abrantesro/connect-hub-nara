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
      .map((m: any) => `${m.role === 'user' ? 'Usuário' : 'NARA'}: ${m.content}`)
      .join("\n");

    const systemPrompt = `
Você é a NARA, recepcionista e mentora da CONNECT HUB.

INFORMAÇÕES OBRIGATÓRIAS SOBRE A CONNECT HUB:
- Conectamos pessoas com soluções há anos
- +1,2 MILHÃO de pessoas já foram atendidas
- +1.800 MUNICÍPIOS atendidos em todo o Brasil
- R$320 MILHÕES em recursos mobilizados
- +250 MIL oportunidades geradas
- Atendemos: pessoas, famílias, agricultores, jovens, estudantes, empreendedores, ONGs, municípios
- Conectamos com: empresas, universidades, bancos, investidores, editais, governo

SEU PAPEL:
1. ESCUTE a pessoa com atenção genuína
2. RESPONDA DIRETAMENTE ao que a pessoa perguntou
3. FAÇA PERGUNTAS específicas para entender melhor
4. OFEREÇA soluções práticas da CONNECT HUB
5. Se a pessoa perguntar sobre algo que você não sabe, diga: "Vou encaminhar sua pergunta para nossa direção. Posso agendar uma conversa com você?"

CONTEXTO: ${context || "Conversa geral"}

HISTÓRICO COMPLETO:
${history}

ÚLTIMA MENSAGEM: "${lastMessage}"

REGRAS ABSOLUTAS:
- Responda SOMENTE como NARA
- Use português brasileiro, CALOROSO e PRÓXIMO
- NUNCA repita a mesma frase
- Sempre termine com UMA PERGUNTA
- Se a pessoa falar sobre projeto social, ofereça AGENDAMENTO com a direção

RESPOSTA DA NARA:
`;

    const result = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: systemPrompt,
    });

    return NextResponse.json({
      text: result?.text || "Estou aqui! Me conte mais sobre isso, quero entender sua história."
    });
  } catch (error: any) {
    console.error("Erro:", error.message);
    return NextResponse.json({
      text: "Estou aqui! Pode continuar, estou processando sua mensagem com carinho."
    }, { status: 500 });
  }
}
