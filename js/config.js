/* =====================================================================
   CONFIGURAÇÕES — contato e links das atividades.
   É aqui que você edita seu e-mail, telefone, LinkedIn, GitHub e os
   botões da página "Atividades". Nenhum outro arquivo precisa mudar.
   ===================================================================== */

window.PORTFOLIO_CONFIG = {
  /* ---------- CONTATO (aba "Contato") ----------
     Para esconder algum item, deixe o valor vazio: "" */
  contato: {
    email: "williamlisboa414@gmail.com",
    telefone: "11974878036", // só números, com DDD
    linkedin: "https://www.linkedin.com/in/william-lisboa-b29ba3264/",
    github: "https://github.com/William-programs",
  },

  /* ---------- ATIVIDADES (página "Atividades") ----------
     Cada item vira um cartão. Com "url", o cartão ganha o botão que leva ao GitHub.
     Sem "url", o cartão aparece como "em breve".

     Quando começar a faculdade, é só preencher o segundo item: coloque o nome do curso
     em "titulo", o link do repositório em "url" e ajuste a descrição. */
  atividades: [
    {
      titulo: "Ensino técnico — Major Telmo",
      descricao:
        "Todas as atividades que fiz no ensino técnico no Major Telmo, organizadas em pastas no meu repositório do GitHub.",
      areas: ["Front-end", "Back-end", "Banco de Dados", "Versionamento"],
      url: "https://github.com/William-programs/Portif-lio-Major-Telmo",
      rotulo: "Ver atividades no GitHub",
    },
    {
      titulo: "Faculdade de TI",
      status: "planejado", // mostra o selo "Planejado"
      descricao:
        "Curso ainda a definir. Quando eu começar, as atividades da faculdade aparecerão aqui.",
      areas: [],
      url: "",
      rotulo: "Ver atividades no GitHub",
    },
  ],
};
