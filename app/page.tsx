'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ChevronRight } from 'lucide-react';

export default function ConnectHubNara() {
  const [step, setStep] = useState('welcome'); // welcome | chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const scrollRef = useRef(null);

  // As 9 opções estratégicas da CONNECT HUB
  const options = [
    { id: 'sonho', icon: '🌱', label: 'Tenho um sonho ou uma ideia' },
    { id: 'colaborar', icon: '🤝', label: 'Quero colaborar com um projeto' },
    { id: 'conhecimento', icon: '🎓', label: 'Quero compartilhar conhecimento' },
    { id: 'investir', icon: '💰', label: 'Quero investir ou apoiar iniciativas' },
    { id: 'empresa', icon: '🏢', label: 'Represento uma instituição/empresa' },
    { id: 'gestor', icon: '🏛', label: 'Sou gestor público' },
    { id: 'oportunidade', icon: '🔎', label: 'Procuro oportunidades ou cursos' },
    { id: 'conhecer', icon: '📚', label: 'Quero conhecer a CONNECT HUB' },
    { id: 'outro', icon: '💬', label: 'Outro assunto' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleStart = (opt) => {
    setContext(opt.label);
    setStep('chat');
    const firstMsg = {
      role: 'assistant',
      content: `Seja muito bem-vindo(a)! Escolher o caminho "${opt.label}" é um passo importante. Sou a NARA, sua mentora aqui no ecossistema. Estou pronta para te ouvir com toda atenção. Conte para mim, do seu jeito: o que trouxe você até aqui hoje?`
    };
    setMessages([firstMsg]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/nara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], context }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Estou aqui te ouvindo, pode continuar..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#0a192f] text-slate-100 font-sans">
      <header className="p-5 border-b border-white/10 bg-[#0a192f]/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">C</div>
          <span className="font-bold tracking-tight text-xl text-white">CONNECT <span className="text-green-400">HUB</span></span>
        </div>
        <div className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-[10px] text-green-400 font-bold uppercase tracking-tighter">
          NARA • Maestrina v1.0
        </div>
      </header>

      {step === 'welcome' ? (
        <section className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl mb-10 relative">
             <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
             <Sparkles className="text-white w-10 h-10 relative z-10" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-light mb-4 leading-tight text-white">
            Seja muito bem-vindo(a) à <br/>
            <span className="font-bold text-green-400">CONNECT HUB! 💚</span>
          </h1>
          <p className="text-blue-100/60 max-w-lg mb-10 text-lg">
            Acreditamos que toda grande transformação começa com uma boa ideia. O que trouxe você até aqui hoje?
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
                  <span className="text-sm font-medium text-slate-200">{opt.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 py-8 px-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {m.role === 'user' ? <User size={20} className="text-white"/> : <Bot size={20} className="text-white"/>}
                </div>
                <div className={`max-w-[80%] p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600/20 text-blue-50 border border-blue-500/20' : 'bg-white/5 text-slate-100 border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-green-400 ml-14 font-medium italic animate-pulse">
                NARA está refletindo...
              </div>
            )}
          </div>
          
          <div className="p-2 bg-white/5 rounded-3xl border border-white/10 mt-4 flex items-center gap-2 focus-within:border-green-400/50 transition-colors shadow-2xl">
            <input 
              className="flex-1 bg-transparent outline-none text-sm px-4 py-3 text-white placeholder:text-white/20"
              placeholder="Fale com a NARA..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              className="p-3 bg-green-500 rounded-2xl hover:bg-green-400 disabled:opacity-50 transition-all text-black shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-3 text-white/20">
            A NARA é sua mentora digital. As conversas são orientativas.
          </p>
        </section>
      )}
    </main>
  );
}
