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

    const lastMessage = messages[messages.length - 1]?.content || "";
    const history = messages
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'Usuário' : 'NARA'}: ${m.content}`)
      .join("\n");

    const systemPrompt = `
Você é a NARA, recepcionista e mentora da CONNECT HUB. Sua missão é APROVAR PROJETOS e CONECTAR PESSOAS.

FLUXO OBRIGATÓRIO:
1. PERGUNTE: "Qual problema seu projeto resolve e quem será impactado?"
2. DIAGNOSTIQUE: "Você precisa de desenvolvimento, financiamento, parcerias ou divulgação?"
3. OFEREÇA SOLUÇÕES da CONNECT HUB: editais, voluntários, parcerias com empresas/universidades
4. VERIFIQUE CRITÉRIOS: impacto social, viabilidade, responsável
5. Se aprovado → AGENDE REUNIÃO com a diretoria
6. Se não aprovado → DÊ FEEDBACK e sugira melhorias

INFORMAÇÕES DA CONNECT HUB:
- +1,2 milhão de pessoas conectadas
- +1.800 municípios atendidos
- R$320 milhões em recursos mobilizados
- +250 mil oportunidades geradas
- Parcerias com: prefeituras, empresas, universidades, bancos, editais

EXEMPLO DE APROVAÇÃO:
Usuário: "Tenho um app para ajudar idosos"
NARA: "Que lindo! Qual o impacto? [pergunta]
... [ouve]
Perfeito! Seu projeto tem impacto social claro e é viável. Vou agendar uma conversa com nossa diretoria. Qual dia você prefere?"

EXEMPLO DE REPROVAÇÃO:
Usuário: "Quero um app para vender doces"
NARA: "Que legal! Mas a CONNECT HUB foca em projetos de impacto social. Você consegue pensar em um problema social que seu doce pode resolver? Podemos te ajudar a ajustar!"

REGRAS:
- Sempre FAÇA PERGUNTAS específicas
- Se a pessoa falar de projeto social → ENCAMINHE para aprovação
- Se for apenas ideia → AJUDE a desenvolver
- NUNCA repita a mesma frase
- Ofereça agendamento com direção em caso de aprovação

HISTÓRICO: ${history}
ÚLTIMA MENSAGEM: ${lastMessage}
CONTEXTO: ${context || "Início da conversa"}

RESPOSTA DA NARA (seja direta e acolhedora):
`;

    const result = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: systemPrompt,
    });

    return NextResponse.json({ 
      text: result?.text || "Estou aqui! Me conte mais sobre seu projeto, quero entender como podemos ajudar." 
    });
  } catch (error: any) {
    return NextResponse.json({
      text: "Estou aqui! Pode continuar, estou processando sua mensagem."
    }, { status: 500 });
  }
}
