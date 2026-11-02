/* =====================================================================
   DADOS DO PORTFÓLIO — é aqui que você edita o conteúdo do site.
   Nada precisa ser mexido em app.js para adicionar atividades ou projetos.
   ===================================================================== */

window.PORTFOLIO = {

  /* ---------- PERFIL ---------- */
  perfil: {
    nome: "William",
    foto: "assets/foto.jpg", // substitua o arquivo em assets/foto.jpg pela sua foto real
    fraseImpacto: "Conheça quem sou e os projetos que desenvolvi",
    // Textos provisórios: edite livremente.
    // Resumo curto usado na página inicial (a trajetória completa fica em "trajetoria").
    resumo: "Texto provisório: resuma em uma ou duas frases a sua trajetória para a página inicial.",
    interesses: [
      // "Desenvolvimento web", "Finanças pessoais", ...  (preencha com os seus)
    ],
    apresentacao: [
      "Texto provisório: escreva aqui uma apresentação curta sobre você, em duas ou três frases."
    ],
    trajetoria: [
      "Texto provisório: conte como foi o seu caminho na tecnologia, desde as primeiras atividades do curso técnico até os projetos mais recentes."
    ],
    aprendizados: [
      "Texto provisório: liste o que você aprendeu em Front-end.",
      "Texto provisório: liste o que você aprendeu em Back-end.",
      "Texto provisório: liste o que você aprendeu em Banco de Dados.",
      "Texto provisório: liste o que você aprendeu em Versionamento."
    ],
    habilidades: ["Front-end", "Back-end", "Banco de Dados", "Versionamento"], // acrescente as suas
    objetivos: [
      "Texto provisório: descreva seus objetivos profissionais na área de desenvolvimento de software."
    ],
    contatos: [
      // { rotulo: "GitHub", url: "https://github.com/seu-usuario" },
      // { rotulo: "LinkedIn", url: "https://www.linkedin.com/in/seu-perfil" }
    ]
  },

  /* ---------- DISCIPLINAS ----------
     "semanas" define quantas pastas semanais cada disciplina terá.
     Total: 28 + 28 + 28 + 26 = 110 pastas. */
  disciplinas: [
    { id: "frontend",       nome: "Front-end",      semanas: 28, descricao: "Interfaces, HTML, CSS e JavaScript." },
    { id: "backend",        nome: "Back-end",       semanas: 28, descricao: "Lógica de servidor e aplicações." },
    { id: "banco-de-dados", nome: "Banco de Dados", semanas: 28, descricao: "Modelagem, consultas e armazenamento." },
    { id: "versionamento",  nome: "Versionamento",  semanas: 26, descricao: "Git, GitHub e controle de versões." }
  ],

  /* ---------- ATIVIDADES POR SEMANA ----------
     Semanas que não aparecem aqui ficam como "Conteúdo em breve".
     Modelo (copie, cole e preencha):

     {
       disciplina: "frontend",           // id da disciplina acima
       semana: 1,
       descricao: "O que foi estudado nesta semana.",
       atividades: [
         {
           titulo: "Nome da atividade",
           descricao: "O que você fez.",
           imagem: "assets/imagens/frontend-s1.png",   // opcional
           imagemAlt: "Descrição da imagem",           // opcional
           codigo: { linguagem: "html", texto: "<h1>Olá</h1>" }, // opcional
           demo: "https://...",                        // opcional
           github: "https://github.com/..."            // opcional
         }
       ]
     },
  */
  atividades: [
  ],

  /* ---------- LINHA DO TEMPO (Meu Progresso › Minha trajetória) ----------
     Os marcos são ordenados pelo campo "data" (AAAA-MM ou AAAA). Modelo:

     {
       titulo: "Início do curso técnico",
       data: "2024-02",                 // usado só para ordenar
       periodo: "Fev/2024",             // texto exibido
       descricao: "O que aconteceu.",
       categoria: "Formação",           // Formação, Projeto, Experiência...
       status: "concluido",             // concluido | andamento | planejado
       evidencia: { rotulo: "Ver projeto", url: "#/projetos" }   // opcional (interno ou externo)
     },
  */
  trajetoria: [
  ],

  /* ---------- OBJETIVOS E METAS ----------
     prazo: "curto" | "medio" | "longo"
     status: "concluido" | "andamento" | "nao-iniciado"
     "etapas" é opcional: se existir, a barra de progresso = etapas feitas / total.
     Sem etapas, o site mostra só o status em texto (nenhuma porcentagem inventada). Modelo:

     {
       nome: "Nome da meta",
       prazo: "curto",
       descricao: "O que quero alcançar.",
       motivo: "Por que isso importa.",
       prazoEstimado: "Dez/2026",          // opcional
       status: "andamento",
       proximaAcao: "O que fazer agora.",
       etapas: [ { nome: "Etapa 1", feita: true }, { nome: "Etapa 2", feita: false } ],  // opcional
       evidencia: { rotulo: "Ver", url: "#/projetos" },     // opcional (quando concluída)
       relacionado: { rotulo: "Ver atividades", url: "#/atividades/frontend" }  // opcional
     },
  */
  metas: [
  ],

  /* ---------- CONQUISTAS ----------
     Apenas conquistas reais. Modelo:

     {
       titulo: "Nome da conquista",
       tipo: "Projeto concluído",   // Projeto, Conhecimento, Trabalho acadêmico, Entrega, Competência...
       descricao: "O que foi conquistado.",
       evidencia: { rotulo: "Ver projeto", url: "#/projetos" }   // recomendado
     },
  */
  conquistas: [
  ],

  /* ---------- PRÓXIMOS PASSOS ----------
     prioridade: "alta" | "media" | "baixa"
     status: "concluido" | "andamento" | "nao-iniciado". Modelo:

     {
       acao: "Ação a realizar",
       objetivo: "Nome da meta relacionada",
       prioridade: "alta",
       status: "nao-iniciado",
       proximaEtapa: "O primeiro passo concreto."
     },
  */
  proximosPassos: [
  ],

  /* ---------- EXPERIÊNCIAS ----------
     Todos os campos são opcionais, exceto "organizacao". Campos vazios não aparecem. Modelo:

     {
       organizacao: "Empresa, organização ou projeto",
       cargo: "Cargo ou função",
       tipo: "Estágio",     // Profissional, Estágio/Jovem aprendiz, Acadêmica, Trabalho em equipe, Participação em projeto, Outra
       periodo: "Mar/2025 – Dez/2025",
       descricao: "Responsabilidades.",
       atividades: ["..."],
       tecnologias: ["..."],
       competencias: ["..."],
       resultados: ["..."],
       links: [ { rotulo: "Documento", url: "https://..." } ]
     },
  */
  experiencias: [
  ],

  /* ---------- PROJETOS ----------
     Trabalhos importantes feitos à parte das disciplinas semanais (TCC, projetos
     pessoais, atividades avulsas). Não têm relação com Front-end, Back-end etc.
     Cada projeto aparece como uma linha: foto de um lado, resumo do outro
     (o lado alterna automaticamente). Modelo:

     {
       nome: "Nome do projeto",
       descricao: "Resumo do projeto.",
       tecnologias: ["HTML", "CSS", "JavaScript"],   // opcional
       imagem: "assets/imagens/meu-projeto.png",     // opcional
       imagemAlt: "Captura de tela do projeto",      // opcional
       demo: "https://...",                          // opcional (botão "Ver projeto")
       github: "https://github.com/..."              // opcional
     },
  */
  projetos: [
    {
      nome: "IA Finance — TCC",
      descricao: "Aplicação web de finanças pessoais desenvolvida como TCC. Texto provisório: edite este resumo com os objetivos e o resultado do projeto.",
      tecnologias: [],
      imagem: "assets/imagens/ia-finance.png"
    }
  ]
};
