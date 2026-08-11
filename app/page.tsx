'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ChevronRight } from 'lucide-react';

export default function ConnectHubNara() {
  const [step, setStep] = useState('welcome');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const scrollRef = useRef(null);

  // ============================================================
  // OPCÕES FOCADAS EM PROJETOS PARA O XPRIZE
  // ============================================================
  const options = [
    { id: 'projeto_social', icon: '🌱', label: 'Tenho um projeto social' },
    { id: 'projeto_negocio', icon: '💼', label: 'Tenho uma ideia de negócio' },
    { id: 'projeto_comunidade', icon: '🏘️', label: 'Quero ajudar minha comunidade' },
    { id: 'projeto_educacao', icon: '📚', label: 'Quero criar um projeto educativo' },
    { id: 'projeto_meio_ambiente', icon: '🌳', label: 'Quero um projeto sustentável' },
    { id: 'projeto_saude', icon: '❤️', label: 'Tenho um projeto de saúde' },
    { id: 'projeto_cultura', icon: '🎭', label: 'Quero um projeto cultural' },
    { id: 'projeto_emprego', icon: '💼', label: 'Quero gerar emprego/renda' },
    { id: 'projeto_outro', icon: '💬', label: 'Outro tipo de projeto' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // ============================================================
  // INICIA A CONVERSA COM CONTEXTO ESPECÍFICO
  // ============================================================
  const handleStart = (opt) => {
    const contextMap = {
      'projeto_social': 'A pessoa tem um projeto social e quer que a NARA avalie e aprove',
      'projeto_negocio': 'A pessoa tem uma ideia de negócio e quer validação da NARA',
      'projeto_comunidade': 'A pessoa quer criar um projeto para comunidade e precisa de avaliação',
      'projeto_educacao': 'A pessoa quer criar um projeto educativo e quer avaliação da NARA',
      'projeto_meio_ambiente': 'A pessoa quer um projeto sustentável e quer validação da NARA',
      'projeto_saude': 'A pessoa tem um projeto de saúde e quer que a NARA avalie',
      'projeto_cultura': 'A pessoa quer um projeto cultural e precisa de avaliação',
      'projeto_emprego': 'A pessoa quer gerar emprego/renda e quer validação da NARA',
      'projeto_outro': 'A pessoa tem outro tipo de projeto e quer avaliação da NARA',
    };

    setContext(contextMap[opt.id] || opt.label);
    setStep('chat');

    // Mensagem inicial variada
    const boasVindas = [
      `💚 Que bom ter você aqui! Escolher "${opt.label}" é o primeiro passo para transformar uma ideia em realidade.

Sou a NARA, IA de negócios da CONNECT HUB. Vou avaliar seu projeto com base em 3 critérios:
1. **CLAREZA** - O problema e a solução estão definidos?
2. **VIABILIDADE** - É possível executar com recursos realistas?
3. **IMPACTO** - Beneficia mais de 10 pessoas ou gera renda?

Me conte **detalhadamente** sobre seu projeto! 🚀`,

      `🎯 Fico muito feliz em saber que você quer falar sobre "${opt.label}"!

Sou a NARA e minha missão é **avaliar e qualificar projetos** para a CONNECT HUB.

Para começar, me diga:
- **Qual é o problema** que você quer resolver?
- **Como você pretende resolver**?
- **Quem será beneficiado**?

Quanto mais detalhes, melhor será minha avaliação! 💚`
    ];

    const msgIndex = Math.floor(Math.random() * boasVindas.length);
    setMessages([{
      role: 'assistant',
      content: boasVindas[msgIndex]
    }]);
  };

  // ============================================================
  // ENVIA MENSAGEM PARA A NARA (API ROUTE)
  // ============================================================
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/nara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context: context
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Desculpe, tive um pequeno problema. Pode repetir? Estou aqui para avaliar seu projeto! 💚"
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="flex flex-col min-h-screen bg-[#0a192f] text-slate-100 font-sans selection:bg-green-500/30">
      <header className="p-5 border-b border-white/10 bg-[#0a192f]/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20">C</div>
          <span className="font-bold tracking-tight text-xl">CONNECT <span className="text-green-400">HUB</span></span>
        </div>
        <div className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-[10px] text-green-400 font-bold uppercase tracking-tighter">
          NARA • XPRIZE v2.0
        </div>
      </header>

      {step === 'welcome' ? (
        <section className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl relative">
              <Sparkles className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-light mb-4 leading-tight">
            Avalie seu projeto com a <br/>
            <span className="font-bold text-green-400 drop-shadow-sm">NARA • XPRIZE</span>
          </h1>
          <p className="text-blue-100/60 max-w-lg mb-6 text-lg leading-relaxed">
            A NARA vai avaliar seu projeto em <strong>3 critérios</strong> e dar uma nota!
            <br/>
            <span className="text-green-400">Clareza • Viabilidade • Impacto</span>
          </p>
          <p className="text-blue-100/40 max-w-lg mb-10 text-sm">
            Projetos com média ≥ 7 são <span className="text-green-400">APROVADOS</span> e encaminhados para a diretoria.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-5xl">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleStart(opt)}
                className="group flex items-center justify-between p-4 bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-400/50 rounded-2xl transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">{opt.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 py-8 px-2 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {m.role === 'user' ? <User size={20} className="text-white"/> : <Bot size={20} className="text-white"/>}
                </div>
                <div className={`max-w-[80%] p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600/20 text-blue-50 rounded-tr-none border border-blue-500/20' : 'bg-white/5 text-slate-100 rounded-tl-none border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-green-400 ml-14 font-medium italic animate-pulse">
                NARA está avaliando seu projeto...
              </div>
            )}
          </div>
          <div className="p-2 bg-white/5 rounded-3xl border border-white/10 mt-4 flex items-center gap-2 focus-within:border-green-400/50 transition-colors shadow-2xl">
            <input
              className="flex-1 bg-transparent outline-none text-sm px-4 py-3 placeholder:text-white/20 text-white"
              placeholder="Descreva seu projeto detalhadamente..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 bg-green-500 rounded-2xl hover:bg-green-400 disabled:opacity-50 transition-all text-black shadow-lg shadow-green-500/20"
            >
              <Send size={18} />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
