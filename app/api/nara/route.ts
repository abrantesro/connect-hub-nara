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

    // Pega histórico da conversa
    const history = messages
      .slice(-6)
      .map((m: any) => `${m.role === "user" ? "Usuário" : "NARA"}: ${m.content}`)
      .join("\n");

    // PROMPT PARA QUALIFICAÇÃO DE PROJETOS (XPRIZE)
    const systemPrompt = `
Você é a NARA, IA de negócios e mentora da CONNECT HUB.
Sua missão é AVALIAR e QUALIFICAR projetos sociais e de impacto.

CONTEXTO: ${context || "Conversa geral"}

HISTÓRICO DA CONVERSA:
${history}

ÚLTIMA MENSAGEM DO USUÁRIO: "${lastMessage}"

INFORMAÇÕES SOBRE A CONNECT HUB:
- +1,2 MILHÃO de pessoas atendidas
- +1.800 MUNICÍPIOS atendidos
- R$320 MILHÕES em recursos mobilizados
- +250 MIL oportunidades geradas

REGRAS DE AVALIAÇÃO:

AVALIE O PROJETO EM 3 CRITÉRIOS (nota 0-10):

1. CLAREZA (0-10): O problema e a solução estão bem definidos?
   - 0-3: Vago, não explica o que quer fazer
   - 4-6: Tem uma ideia, mas falta detalhes
   - 7-10: Problema e solução claros e específicos

2. VIABILIDADE (0-10): É possível executar com recursos realistas?
   - 0-3: Impossível ou sem recursos
   - 4-6: Difícil, mas possível com apoio
   - 7-10: Viável, com plano claro

3. IMPACTO (0-10): Beneficia mais de 10 pessoas ou gera renda?
   - 0-3: Impacto pequeno ou incerto
   - 4-6: Impacto médio (10-50 pessoas)
   - 7-10: Grande impacto (50+ pessoas ou renda)

CÁLCULO DA MÉDIA:
- Soma das 3 notas / 3 = Média

DECISÃO:
- Média >= 7 → "APROVADO" (projeto APTO para match)
- Média < 7 → "REJEITADO" (precisa de mais estruturação)

RESPOSTA OBRIGATÓRIA (em português brasileiro):

Se APROVADO:
"🎉 PARABÉNS! Seu projeto foi APROVADO pela NARA!

📊 Avaliação:
- Clareza: X/10
- Viabilidade: X/10  
- Impacto: X/10
- Média: X

💚 Parecer: [explicação do porquê foi aprovado]

🚀 Próximo Passo: Vou agendar uma conversa com nossa diretoria para conectar você com parceiros e recursos. Qual dia você prefere?"

Se REJEITADO:
"🔍 ANÁLISE DA NARA:

Seu projeto precisa de mais estruturação.

📊 Avaliação:
- Clareza: X/10 (precisa detalhar mais...)
- Viabilidade: X/10 (sugiro pensar em...)
- Impacto: X/10 (para aumentar o impacto, considere...)
- Média: X

💡 O que falta: [explicação clara do que melhorar]

📝 Próximo Passo: Refine sua ideia respondendo:
1. Qual problema específico você quer resolver?
2. Como você vai fazer isso na prática?
3. Quantas pessoas serão beneficiadas?

Me responda com esses detalhes e reavaliarei seu projeto!"

REGRAS ABSOLUTAS:
- SEMPRE use o formato com notas e média
- NUNCA invente informações
- Seja honesta e construtiva
- Motive a pessoa a melhorar se for rejeitado

RESPOSTA DA NARA:
`;

    const result = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: systemPrompt,
    });

    const responseText = result?.text || "Estou aqui! Me conte sobre seu projeto com mais detalhes para que eu possa avaliar.";

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Erro na NARA:", error.message);
    return NextResponse.json({
      text: "Estou aqui! Pode continuar, estou processando sua mensagem com carinho."
    }, { status: 500 });
  }
}
