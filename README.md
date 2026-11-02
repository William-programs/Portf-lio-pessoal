# Portfólio de Programação

Site estático feito só com HTML, CSS e JavaScript (sem frameworks, sem instalação).
As 110 pastas semanais são geradas automaticamente a partir de `js/data.js`.

## Estrutura

```
portfolio/
├── index.html        # estrutura base (cabeçalho, menu, rodapé)
├── css/
│   └── style.css     # identidade visual e responsividade
├── js/
│   ├── data.js       # TODO o conteúdo editável (perfil, disciplinas, atividades, projetos)
│   └── app.js        # páginas, rotas e interações (não precisa editar)
└── assets/
    ├── foto.jpg      # SUA FOTO (crie/coloque este arquivo)
    └── imagens/      # capturas de tela dos projetos (crie esta pasta)
```

## Como executar

Opção 1: dê dois cliques em `index.html` (funciona direto no navegador).

Opção 2: servidor local, por exemplo `python -m http.server 8000` dentro da pasta
e abra http://localhost:8000.

## Como colocar sua foto

Salve sua foto como `assets/foto.jpg`. Para outro nome ou formato, altere `perfil.foto` em `js/data.js`.
Enquanto o arquivo não existir, o site mostra um espaço reservado escrito "FOTO".

## Como editar seus dados

Abra `js/data.js`:

- `perfil`: nome, frase de impacto, apresentação, trajetória, aprendizados, habilidades, objetivos e contatos.
  Os textos atuais são provisórios.
- `disciplinas`: nome e quantidade de semanas (28, 28, 28 e 26 = 110 pastas).

## Como adicionar atividades a uma semana

Em `atividades`, acrescente um bloco (há um modelo comentado no arquivo):

```js
{
  disciplina: "frontend",   // frontend | backend | banco-de-dados | versionamento
  semana: 5,
  descricao: "O que foi estudado.",
  atividades: [
    {
      titulo: "Página de login",
      descricao: "O que você fez.",
      imagem: "assets/imagens/login.png",
      imagemAlt: "Tela de login",
      codigo: { linguagem: "html", texto: "<h1>Olá</h1>" },
      demo: "https://...",
      github: "https://github.com/..."
    }
  ]
}
```

Campos de imagem, código, demo e GitHub são opcionais. Semanas sem bloco aparecem como "Conteúdo em breve".
Para remover, apague o bloco.

## Como adicionar um projeto

A página Projetos é independente das disciplinas: serve para o TCC e outros trabalhos importantes.
Cada projeto vira uma linha (foto de um lado, resumo do outro, alternando). Em `projetos`:

```js
{
  nome: "Nome do projeto",
  descricao: "Resumo do projeto.",
  tecnologias: ["HTML", "CSS", "JavaScript"],   // opcional
  imagem: "assets/imagens/meu-projeto.png",     // opcional
  demo: "https://...",                          // opcional (botão "Ver projeto")
  github: "https://github.com/..."              // opcional
}
```

O exemplo "IA Finance — TCC" já vem cadastrado com texto provisório; edite ou apague.

## Meu Progresso, Experiência e página inicial

Tudo é editado em `js/data.js` (modelos comentados em cada seção). Campos vazios não aparecem no site.

- `perfil.resumo` e `perfil.interesses`: aparecem na página inicial (e os interesses também em Sobre mim).
- `trajetoria`: caminho sinuoso com um ponto por marco (em Meu Progresso e na página inicial). Clicar no ponto abre o cartão
  com os detalhes. Os marcos são ordenados pelo campo `data`; o status (`concluido`, `andamento` ou `planejado`) muda o
  estilo do ponto e do trecho (cheio, em andamento ou pontilhado). Basta adicionar um item para surgir um novo ponto.
  Enquanto `trajetoria` estiver vazia, a página mostra 4 marcos de exemplo (identificados como tal) para você ver o caminho.
- `metas`: curto, médio e longo prazo. Se a meta tiver `etapas`, a barra mostra etapas feitas / total;
  sem etapas, aparece só o status em texto. O site não calcula nenhuma porcentagem geral.
- `conquistas`: com link de evidência (pode ser interno, como `#/projetos` ou `#/atividades/frontend/5`, ou externo).
- `proximosPassos`: ação, objetivo, prioridade, status e próxima etapa.
- `experiencias`: empresa/projeto, cargo, tipo, período, atividades, tecnologias, competências, resultados e links.

A página inicial mostra uma prévia (3 marcos, 3 conquistas, 2 experiências) a partir desses mesmos dados.
Enquanto você não preencher, cada seção mostra um aviso de "nenhum item cadastrado" em vez de conteúdo fictício.

**Limitação:** os dados ficam no arquivo `data.js`; não há edição pelo navegador nem sincronização.
Para atualizar, edite o arquivo e publique de novo.

## Como colocar os arquivos das atividades (jeito mais fácil)

1. Abra `assets/atividades/`. Já existem as 110 pastas prontas, uma por semana:
   `assets/atividades/frontend/semana-05/`, `backend/semana-12/`, `banco-de-dados/semana-03/`, `versionamento/semana-20/`...
2. Copie os arquivos daquela semana para a pasta (PDF, imagens, ZIP, HTML, SQL, código...).
   Uma pasta de site completo (com `index.html`) também pode ser copiada inteira: vira um botão **Abrir**.
3. Rode `atualizar-atividades.bat` (clique duas vezes; precisa do Python instalado) ou `python atualizar-atividades.py`.
4. Abra ou atualize o `index.html`. A semana passa a mostrar os arquivos (imagens em galeria; botões Abrir e Baixar)
   e deixa de mostrar "Conteúdo em breve".

Sempre que colocar arquivos novos, rode o passo 3 de novo. Não renomeie as pastas `semana-NN`.
Para acrescentar descrição, link de demonstração ou GitHub a uma semana, use `atividades` em `js/data.js`
(cada atividade também aceita `arquivos: [{ nome: "Relatório", url: "assets/atividades/frontend/semana-05/relatorio.pdf" }]`).

### Prévia dos projetos e das atividades teóricas

Na página da semana, cada item aparece assim:

- **Site (pasta com `index.html`):** cartão com uma imagem de prévia e o botão "Abrir o site". Para a prévia, tire um print
  do site e salve **dentro da pasta do site** com o nome `preview.png` (também vale `capa`, `print`, `screenshot`, `cover` ou `thumb`,
  em png, jpg ou webp). Sem esse print, o cartão mostra "Sem prévia".
- **Atividade teórica (tabela do Canva ou Word):** exporte como **imagem (PNG/JPG)**: aparece direto como visualização, e
  clicar abre em tamanho grande. Ou exporte como **PDF**: aparece o botão "Ver prévia", que mostra o PDF dentro da própria página.
- Outros arquivos (ZIP, SQL, código...) aparecem na lista com "Baixar".

Depois de adicionar prints ou arquivos, rode `atualizar-atividades.bat` de novo.

## Certificados

Em **Meu Progresso › Certificados**. Coloque os PDFs ou imagens em `assets/certificados/` e rode o
`atualizar-atividades.bat`: cada arquivo vira um cartão (o nome do arquivo é o título).
Para incluir instituição, data, carga horária ou link de verificação, cadastre em `js/certificados.js` (há um modelo lá).

**Limitação:** o site não lista pastas sozinho (é um site estático); por isso o programa `atualizar-atividades`
precisa ser rodado depois de copiar arquivos. Se preferir não usar Python, cadastre os arquivos manualmente em `js/data.js` e `js/certificados.js`.

## Publicar (opcional)

Como é um site estático, pode ser hospedado de graça no GitHub Pages: envie a pasta para um repositório
e ative Pages nas configurações.
