/* =====================================================================
   CERTIFICADOS (opcional)
   Jeito mais fácil: coloque os arquivos (PDF ou imagem) na pasta
   assets/certificados/ e rode atualizar-atividades.bat (ou .py).
   Cada arquivo vira um cartão, usando o nome do arquivo como título.

   Se quiser mais informações (instituição, data, carga horária, link de
   verificação), cadastre aqui. Cartões cadastrados aqui não se repetem
   com o arquivo da pasta se "arquivo" apontar para o mesmo caminho.
   Não invente dados: preencha só o que você tem no certificado.

   Modelo (copie, cole dentro dos colchetes e preencha):

   {
     titulo: "Nome do curso ou certificado",
     instituicao: "Quem emitiu",              // opcional
     data: "Mar/2025",                        // opcional
     cargaHoraria: "40 horas",                // opcional
     descricao: "Breve descrição.",           // opcional
     arquivo: "assets/certificados/meu-certificado.pdf",   // PDF ou imagem
     imagem: "assets/certificados/meu-certificado.png",    // opcional: prévia no cartão
     link: "https://..."                      // opcional: link para verificar autenticidade
   },
   ===================================================================== */

window.PORTFOLIO = window.PORTFOLIO || {};
window.PORTFOLIO.certificados = [
];
