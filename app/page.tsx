const handleStart = (opt) => {
  const contextMap = {
    'sonho': 'A pessoa tem um sonho ou ideia e quer ajuda para realizá-lo',
    'colaborar': 'A pessoa quer colaborar com projetos sociais ou comunitários',
    'conhecimento': 'A pessoa quer compartilhar conhecimento ou experiência',
    'investir': 'A pessoa quer investir ou apoiar iniciativas',
    'empresa': 'A pessoa representa uma empresa ou instituição',
    'gestor': 'A pessoa é gestor público e quer parcerias',
    'oportunidade': 'A pessoa procura oportunidades de cursos ou trabalho',
    'conhecer': 'A pessoa quer conhecer melhor a CONNECT HUB',
    'outro': 'A pessoa tem outro assunto'
  };
  
  setContext(contextMap[opt.id] || opt.label);
  setStep('chat');

  // Respostas iniciais variadas
  const boasVindas = [
    `Que incrível! 💚 Escolher "${opt.label}" é um passo muito importante. Sou a NARA, sua mentora na CONNECT HUB. 

Conte-me mais sobre isso! Quero entender sua história e ver como podemos te ajudar.`,

    `Fico muito feliz em saber que você quer falar sobre "${opt.label}"! 💚

A CONNECT HUB está aqui para conectar pessoas e soluções. Me diga: o que te trouxe até esse caminho hoje?`,

    `Que escolha especial! "${opt.label}" é um tema que a CONNECT HUB adora trabalhar. 💚

Sou a NARA e estou aqui para te escutar de verdade. Pode começar a me contar sua história...`
  ];

  const msgIndex = Math.floor(Math.random() * boasVindas.length);
  
  const firstMsg = {
    role: 'assistant',
    content: boasVindas[msgIndex]
  };
  setMessages([firstMsg]);
};
