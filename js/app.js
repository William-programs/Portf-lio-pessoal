/* Portfólio — lógica do site (roteamento por hash, sem dependências).
   Os dados ficam em js/data.js. */
(function () {
  "use strict";

  var D = window.PORTFOLIO;
  var P = D.perfil;
  var app = document.getElementById("conteudo");

  /* ---------- utilitários ---------- */
  function h(tag, props) {
    var el = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2);
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    });
    (function add(list) {
      list.forEach(function (c) {
        if (c === null || c === undefined || c === false) return;
        if (Array.isArray(c)) return add(c);
        el.append(c.nodeType ? c : document.createTextNode(String(c)));
      });
    })(kids);
    return el;
  }

  function svg(html, cls) {
    var s = document.createElement("span");
    s.innerHTML = html; // strings fixas definidas neste arquivo
    var node = s.firstChild;
    if (cls) node.setAttribute("class", cls);
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  var ICONE_PASTA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.2l2 2.5h8.8A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/></svg>';
  var ICONE_SETA =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  function disciplina(id) {
    return D.disciplinas.filter(function (d) {
      return d.id === id;
    })[0];
  }
  function dadosSemana(discId, n) {
    return D.atividades.filter(function (a) {
      return a.disciplina === discId && a.semana === n;
    })[0];
  }
  // Arquivos colocados em assets/atividades/<disciplina>/semana-NN/ (gerado por atualizar-atividades.py)
  function arquivosAuto(discId, n) {
    return (window.ARQUIVOS_AUTO || {})[discId + "/" + n] || [];
  }
  function temConteudo(discId, n) {
    var s = dadosSemana(discId, n);
    return (
      !!(s && (s.descricao || (s.atividades && s.atividades.length))) ||
      arquivosAuto(discId, n).length > 0
    );
  }
  function totalSemanas() {
    return D.disciplinas.reduce(function (t, d) {
      return t + d.semanas;
    }, 0);
  }
  function semanasPreenchidas(d) {
    var c = 0;
    for (var i = 1; i <= d.semanas; i++) if (temConteudo(d.id, i)) c++;
    return c;
  }
  function paragrafos(lista) {
    return (lista || []).map(function (t) {
      return h("p", { text: t });
    });
  }

  /* ---------- peças reutilizáveis ---------- */
  function foto(classe) {
    var wrap = h("div", { class: "foto " + (classe || "") });
    var img = h("img", { src: P.foto, alt: "Foto de " + P.nome });
    img.addEventListener("error", function () {
      wrap.classList.add("sem-foto");
      img.remove();
      wrap.append(h("span", { "aria-hidden": "true", text: "FOTO" }));
      wrap.setAttribute("role", "img");
      wrap.setAttribute(
        "aria-label",
        "Espaço reservado para a foto de " + P.nome,
      );
    });
    wrap.append(img);
    return wrap;
  }

  function breadcrumb(itens) {
    var ol = h("ol");
    itens.forEach(function (it, i) {
      var ultimo = i === itens.length - 1;
      ol.append(
        h(
          "li",
          null,
          ultimo || !it.href
            ? h("span", {
                "aria-current": ultimo ? "page" : null,
                text: it.rotulo,
              })
            : h("a", { href: it.href, text: it.rotulo }),
        ),
      );
    });
    return h(
      "nav",
      { class: "breadcrumb container", "aria-label": "Você está em" },
      ol,
    );
  }

  /* Projeto em linha: foto de um lado e resumo do outro (alterna a cada projeto). */
  function linhaProjeto(p, indice) {
    var img = h("div", { class: "projeto__img" });
    if (p.imagem) {
      var im = h("img", {
        src: p.imagem,
        alt: p.imagemAlt || "Captura de tela do projeto " + p.nome,
        loading: "lazy",
      });
      im.addEventListener("error", function () {
        im.remove();
        img.append(h("span", { text: "Foto do Projeto " + (indice + 1) }));
      });
      img.append(im);
    } else {
      img.append(h("span", { text: "Foto do Projeto " + (indice + 1) }));
    }
    var botoes = h(
      "div",
      { class: "projeto__acoes" },
      p.demo
        ? h("a", {
            class: "btn",
            href: p.demo,
            target: "_blank",
            rel: "noopener noreferrer",
            text: "Ver projeto",
          })
        : null,
      p.github
        ? h("a", {
            class: "btn btn--ghost",
            href: p.github,
            target: "_blank",
            rel: "noopener noreferrer",
            text: "GitHub",
          })
        : null,
    );
    return h(
      "article",
      {
        class:
          "projeto-linha" + (indice % 2 ? " projeto-linha--invertida" : ""),
      },
      h(
        "div",
        { class: "projeto__midia" },
        img,
        botoes.children.length ? botoes : null,
      ),
      h(
        "div",
        { class: "projeto__texto" },
        h("h2", { text: p.nome }),
        p.descricao ? h("p", { text: p.descricao }) : null,
        p.tecnologias && p.tecnologias.length
          ? h(
              "ul",
              { class: "chips", "aria-label": "Tecnologias" },
              p.tecnologias.map(function (t) {
                return h("li", { class: "chip", text: t });
              }),
            )
          : null,
      ),
    );
  }

  /* ---------- páginas ---------- */
  /* ---------- peças das novas páginas ---------- */
  var ROTULO_STATUS = {
    concluido: "Concluído",
    andamento: "Em andamento",
    planejado: "Planejado",
    "nao-iniciado": "Não iniciada",
  };
  var ROTULO_PRIORIDADE = { alta: "Alta", media: "Média", baixa: "Baixa" };

  function ligacao(ev, classe) {
    if (!ev || !ev.url) return null;
    var ext = /^https?:/i.test(ev.url);
    return h("a", {
      class: classe || "",
      href: ev.url,
      target: ext ? "_blank" : null,
      rel: ext ? "noopener noreferrer" : null,
      text: ev.rotulo || "Ver evidência",
    });
  }

  function selo(status) {
    return h("span", {
      class: "selo selo--" + status,
      text: ROTULO_STATUS[status] || status,
    });
  }

  function vazioEditavel(msg) {
    return h("div", { class: "vazio" }, h("p", { text: msg }));
  }

  function ordenarPorData(lista) {
    return (lista || [])
      .map(function (m, i) {
        return { m: m, i: i };
      })
      .sort(function (a, b) {
        var da = a.m.data || "",
          db = b.m.data || "";
        return da === db ? a.i - b.i : da < db ? -1 : 1;
      })
      .map(function (x) {
        return x.m;
      });
  }

  /* Caminho da trajetória: estrada sinuosa com um ponto por marco.
     Clicar no ponto abre um cartão com os detalhes (um aberto por vez). */
  var marcoAberto = null;
  function fecharMarco(devolverFoco) {
    if (!marcoAberto) return;
    marcoAberto.no.setAttribute("aria-expanded", "false");
    marcoAberto.painel.hidden = true;
    marcoAberto.li.classList.remove("aberto");
    if (devolverFoco) marcoAberto.no.focus();
    marcoAberto = null;
  }
  document.addEventListener("click", function (e) {
    if (marcoAberto && !marcoAberto.li.contains(e.target)) fecharMarco(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharMarco(true);
  });

  function trecho(d, status) {
    var NS = "http://www.w3.org/2000/svg";
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "trecho trecho--" + (status || "planejado"));
    return path;
  }

  function caminho(marcos) {
    var NS = "http://www.w3.org/2000/svg";
    var ol = h("ol", { class: "caminho" });
    marcos.forEach(function (m, i) {
      var esquerda = i % 2 === 0;
      var x = esquerda ? 25 : 75;
      var id = "marco-" + i + "-" + Math.random().toString(36).slice(2, 7);
      var status = m.status || "planejado";

      var svgEl = document.createElementNS(NS, "svg");
      svgEl.setAttribute("class", "caminho__estrada");
      svgEl.setAttribute("viewBox", "0 0 100 100");
      svgEl.setAttribute("preserveAspectRatio", "none");
      svgEl.setAttribute("aria-hidden", "true");
      svgEl.appendChild(
        trecho("M50 0 C50 28, " + x + " 22, " + x + " 50", status),
      );
      if (i < marcos.length - 1) {
        svgEl.appendChild(
          trecho(
            "M" + x + " 50 C" + x + " 78, 50 72, 50 100",
            marcos[i + 1].status,
          ),
        );
      }

      var painel = h(
        "div",
        {
          class: "caminho__painel",
          id: id,
          role: "region",
          "aria-labelledby": id + "-t",
          hidden: "hidden",
        },
        h(
          "button",
          {
            class: "caminho__fechar",
            type: "button",
            "aria-label": "Fechar detalhes",
          },
          "×",
        ),
        h(
          "div",
          { class: "marco__cab" },
          m.periodo
            ? h("span", { class: "marco__periodo", text: m.periodo })
            : null,
          m.categoria ? h("span", { class: "chip", text: m.categoria }) : null,
          selo(status),
        ),
        h("h3", { id: id + "-t", text: m.titulo }),
        m.descricao
          ? h("p", { text: m.descricao })
          : h("p", {
              class: "projeto__meta",
              text: "Descrição ainda não cadastrada.",
            }),
        ligacao(m.evidencia, "btn btn--ghost"),
      );

      var no = h("button", {
        class: "caminho__no caminho__no--" + status,
        type: "button",
        style: "left:" + x + "%",
        "aria-expanded": "false",
        "aria-controls": id,
        "aria-label":
          (m.periodo ? m.periodo + ": " : "") +
          m.titulo +
          " (" +
          (ROTULO_STATUS[status] || status) +
          ")",
      });

      var rotulo = h(
        "div",
        {
          class:
            "caminho__rotulo " +
            (esquerda ? "caminho__rotulo--dir" : "caminho__rotulo--esq"),
          style: esquerda
            ? "left:calc(" + x + "% + 26px)"
            : "right:calc(" + (100 - x) + "% + 26px)",
        },
        m.periodo
          ? h("span", { class: "marco__periodo", text: m.periodo })
          : null,
        h("strong", { text: m.titulo }),
      );

      var li = h("li", { class: "caminho__item" }, svgEl, rotulo, no, painel);
      var info = { li: li, no: no, painel: painel };

      function alternar() {
        var jaAberto = marcoAberto === info;
        fecharMarco(false);
        if (jaAberto) return;
        painel.hidden = false;
        no.setAttribute("aria-expanded", "true");
        li.classList.add("aberto");
        marcoAberto = info;
        if (painel.scrollIntoView)
          painel.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      no.addEventListener("click", alternar);
      rotulo.addEventListener("click", alternar);
      painel
        .querySelector(".caminho__fechar")
        .addEventListener("click", function () {
          fecharMarco(true);
        });
      ol.append(li);
    });

    return h(
      "div",
      { class: "caminho-wrap" },
      h(
        "ul",
        { class: "caminho__legenda", "aria-label": "Legenda" },
        ["concluido", "andamento", "planejado"].map(function (st) {
          return h(
            "li",
            null,
            h("span", {
              class: "caminho__no caminho__no--" + st + " caminho__no--mini",
              "aria-hidden": "true",
            }),
            ROTULO_STATUS[st],
          );
        }),
      ),
      h("p", {
        class: "projeto__meta",
        text: "Clique em um ponto do caminho para ver o marco.",
      }),
      ol,
    );
  }

  /* ---------- arquivos (atividades) e certificados ---------- */
  var EXT_IMG = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;
  var EXT_ABRIR = /\.(pdf|html?|txt|md)$/i;
  function extensao(url) {
    var m = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(url || "");
    return m ? m[1].toUpperCase() : "ARQ";
  }
  function semCodificar(u) {
    try {
      return decodeURI(u);
    } catch (e) {
      return u;
    }
  }

  function cartaoSite(a) {
    var titulo = (a.nome || "Projeto")
      .replace(/\/?\s*\(projeto web\)\s*$/i, "")
      .replace(/\/$/, "");
    var previa = h("div", { class: "site-previa" });
    if (a.previa) {
      var im = h("img", {
        src: a.previa,
        alt: "Prévia do projeto " + titulo,
        loading: "lazy",
      });
      im.addEventListener("error", function () {
        im.remove();
        previa.append(h("span", { text: "Prévia indisponível" }));
      });
      previa.append(im);
    } else {
      previa.append(h("span", { text: "Sem prévia" }));
      previa.append(
        h("small", {
          text: "Coloque um print chamado preview.png dentro da pasta do site",
        }),
      );
    }
    return h(
      "article",
      { class: "site-cartao" },
      h(
        "a",
        {
          class: "site-previa__link",
          href: a.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": "Abrir o projeto " + titulo,
        },
        previa,
      ),
      h(
        "div",
        { class: "site-cartao__corpo" },
        h("h3", { text: titulo }),
        h("a", {
          class: "btn",
          href: a.url,
          target: "_blank",
          rel: "noopener noreferrer",
          text: "Abrir o site",
        }),
      ),
    );
  }

  function linhaArquivo(a) {
    var nome = a.nome || a.rotulo || a.url;
    var ehPdf = /\.pdf$/i.test(a.url);
    var quadro = null;
    var botoes = [];
    if (ehPdf) {
      var aberto = false;
      var btn = h("button", {
        class: "btn btn--ghost",
        type: "button",
        "aria-expanded": "false",
        text: "Ver prévia",
      });
      btn.addEventListener("click", function () {
        aberto = !aberto;
        btn.textContent = aberto ? "Fechar prévia" : "Ver prévia";
        btn.setAttribute("aria-expanded", aberto ? "true" : "false");
        if (aberto && !quadro.firstChild)
          quadro.append(
            h("iframe", {
              src: a.url,
              title: "Prévia de " + nome,
              loading: "lazy",
            }),
          );
        quadro.hidden = !aberto;
      });
      botoes.push(btn);
      quadro = h("div", { class: "arquivo__quadro", hidden: "hidden" });
    }
    if (EXT_ABRIR.test(a.url))
      botoes.push(
        h("a", {
          class: "btn btn--ghost",
          href: a.url,
          target: "_blank",
          rel: "noopener noreferrer",
          text: "Abrir",
        }),
      );
    botoes.push(
      h("a", {
        class: "btn btn--ghost",
        href: a.url,
        download: "",
        text: "Baixar",
      }),
    );
    return h(
      "li",
      { class: "arquivo" },
      h("span", { class: "chip", text: extensao(a.url) }),
      h("span", { class: "arquivo__nome", text: nome }),
      h("span", { class: "arquivo__acoes" }, botoes),
      quadro,
    );
  }

  function blocoArquivos(lista) {
    if (!lista || !lista.length) return null;
    var sites = lista.filter(function (a) {
      return a.tipo === "projeto";
    });
    var imagens = lista.filter(function (a) {
      return a.tipo !== "projeto" && EXT_IMG.test(a.url);
    });
    var outros = lista.filter(function (a) {
      return a.tipo !== "projeto" && !EXT_IMG.test(a.url);
    });
    return h(
      "div",
      { class: "arquivos" },
      sites.length ? h("div", { class: "sites" }, sites.map(cartaoSite)) : null,
      imagens.length
        ? h(
            "div",
            { class: "galeria" },
            imagens.map(function (a) {
              var nome = a.nome || a.rotulo || "Imagem";
              return h(
                "a",
                {
                  href: a.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  title: "Abrir imagem",
                },
                h("img", { src: a.url, alt: a.alt || nome, loading: "lazy" }),
                h("span", { text: nome }),
              );
            }),
          )
        : null,
      outros.length
        ? h("ul", { class: "arquivos__lista" }, outros.map(linhaArquivo))
        : null,
    );
  }

  // Certificados cadastrados em js/certificados.js + arquivos soltos em assets/certificados/
  function listaCertificados() {
    var manual = D.certificados || [];
    var usados = {};
    manual.forEach(function (c) {
      if (c.arquivo) usados[semCodificar(c.arquivo)] = true;
      if (c.imagem) usados[semCodificar(c.imagem)] = true;
    });
    var auto = ((window.ARQUIVOS_AUTO || {}).certificados || [])
      .filter(function (a) {
        return !usados[semCodificar(a.url)];
      })
      .map(function (a) {
        var titulo = a.nome
          .replace(/\.[^.]+$/, "")
          .replace(/_+/g, " ")
          .replace(/([^\s-])-(?=[^\s-])/g, "$1 ");
        return EXT_IMG.test(a.url)
          ? { titulo: titulo, imagem: a.url, arquivo: a.url }
          : { titulo: titulo, arquivo: a.url };
      });
    return manual.concat(auto);
  }

  function cartaoCertificado(c) {
    var previa =
      c.imagem || (c.arquivo && EXT_IMG.test(c.arquivo) ? c.arquivo : null);
    var alvo = c.arquivo || c.imagem;
    var figura = null;
    if (previa) {
      var im = h("img", {
        src: previa,
        alt: "Certificado: " + c.titulo,
        loading: "lazy",
      });
      im.addEventListener("error", function () {
        im.remove();
      });
      figura = h(
        "a",
        {
          class: "certificado__previa",
          href: alvo,
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Abrir certificado",
        },
        im,
      );
    } else if (alvo) {
      figura = h(
        "a",
        {
          class: "certificado__previa certificado__previa--arquivo",
          href: alvo,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        extensao(alvo),
      );
    }
    return h(
      "article",
      { class: "bloco certificado" },
      figura,
      h("h3", { text: c.titulo, style: "margin-top:.8em" }),
      [c.instituicao, c.data, c.cargaHoraria].filter(Boolean).length
        ? h("p", {
            class: "exp__sub",
            text: [c.instituicao, c.data, c.cargaHoraria]
              .filter(Boolean)
              .join(" · "),
          })
        : null,
      c.descricao ? h("p", { text: c.descricao }) : null,
      h(
        "div",
        { class: "projeto__acoes" },
        alvo
          ? h("a", {
              class: "btn",
              href: alvo,
              target: "_blank",
              rel: "noopener noreferrer",
              text: "Ver certificado",
            })
          : null,
        ligacao(
          c.link ? { rotulo: "Verificar autenticidade", url: c.link } : null,
          "btn btn--ghost",
        ),
      ),
    );
  }

  function listaTexto(titulo, itens) {
    if (!itens || !itens.length) return null;
    return h(
      "div",
      { class: "exp__campo" },
      h("h4", { text: titulo }),
      h(
        "ul",
        null,
        itens.map(function (t) {
          return h("li", { text: t });
        }),
      ),
    );
  }

  function chipsLista(titulo, itens) {
    if (!itens || !itens.length) return null;
    return h(
      "div",
      { class: "exp__campo" },
      h("h4", { text: titulo }),
      h(
        "ul",
        { class: "chips" },
        itens.map(function (t) {
          return h("li", { class: "chip", text: t });
        }),
      ),
    );
  }

  function cartaoExperiencia(e, resumido) {
    return h(
      "article",
      { class: "bloco exp" },
      h("h3", { text: e.organizacao }),
      h(
        "p",
        { class: "exp__sub" },
        [e.cargo, e.tipo, e.periodo].filter(Boolean).join(" · "),
      ),
      e.descricao ? h("p", { text: e.descricao }) : null,
      resumido
        ? null
        : [
            listaTexto("Atividades realizadas", e.atividades),
            chipsLista("Ferramentas e tecnologias", e.tecnologias),
            chipsLista("Competências desenvolvidas", e.competencias),
            listaTexto("Resultados e contribuições", e.resultados),
            e.links && e.links.length
              ? h(
                  "div",
                  { class: "projeto__acoes" },
                  e.links.map(function (l) {
                    return ligacao(l, "btn btn--ghost");
                  }),
                )
              : null,
          ],
    );
  }

  function cartaoMeta(m) {
    var etapas = m.etapas || [];
    var feitas = etapas.filter(function (e) {
      return e.feita;
    }).length;
    var barra = null;
    if (etapas.length) {
      barra = h(
        "div",
        { class: "progresso" },
        h("div", {
          class: "progresso__rotulo",
          text: feitas + " de " + etapas.length + " etapas concluídas",
        }),
        h(
          "div",
          {
            class: "progresso__trilho",
            role: "progressbar",
            "aria-valuemin": "0",
            "aria-valuemax": String(etapas.length),
            "aria-valuenow": String(feitas),
            "aria-label": "Etapas concluídas da meta " + m.nome,
          },
          h("div", {
            class: "progresso__barra",
            style: "width:" + Math.round((feitas / etapas.length) * 100) + "%",
          }),
        ),
        h(
          "ul",
          { class: "etapas" },
          etapas.map(function (e) {
            return h("li", {
              class: e.feita ? "feita" : "",
              text: (e.feita ? "✓ " : "○ ") + e.nome,
            });
          }),
        ),
      );
    }
    return h(
      "article",
      { class: "bloco meta" },
      h(
        "div",
        { class: "marco__cab" },
        selo(m.status || "nao-iniciado"),
        m.prazoEstimado
          ? h("span", {
              class: "marco__periodo",
              text: "Prazo: " + m.prazoEstimado,
            })
          : null,
      ),
      h("h3", { text: m.nome }),
      m.descricao ? h("p", { text: m.descricao }) : null,
      m.motivo
        ? h("p", null, h("strong", { text: "Por quê: " }), m.motivo)
        : null,
      m.proximaAcao
        ? h("p", null, h("strong", { text: "Próxima ação: " }), m.proximaAcao)
        : null,
      barra,
      h(
        "div",
        { class: "projeto__acoes" },
        ligacao(m.evidencia, "btn btn--ghost"),
        ligacao(m.relacionado, "btn btn--ghost"),
      ),
    );
  }

  function cartaoConquista(c) {
    return h(
      "article",
      { class: "bloco" },
      c.tipo ? h("span", { class: "chip", text: c.tipo }) : null,
      h("h3", { text: c.titulo, style: "margin-top:.6em" }),
      c.descricao ? h("p", { text: c.descricao }) : null,
      ligacao(c.evidencia, "btn btn--ghost"),
    );
  }

  /* ---------- Início ---------- */
  function paginaInicio() {
    var marcos = ordenarPorData(D.trajetoria).slice(0, 3);
    var conquistas = (D.conquistas || []).slice(0, 3);
    var experiencias = (D.experiencias || []).slice(0, 2);

    return [
      h(
        "section",
        { class: "hero" },
        h(
          "div",
          { class: "hero__inner" },
          h(
            "div",
            null,
            h("p", {
              class: "hero__etiqueta",
              text: "Portfólio de programação",
            }),
            h(
              "h1",
              null,
              P.fraseImpacto + " — eu sou ",
              h("span", { class: "nome", text: P.nome }),
            ),
            h("p", {
              class: "lead",
              text: (P.apresentacao && P.apresentacao[0]) || "",
            }),
            h(
              "div",
              { class: "hero__acoes" },
              h("a", {
                class: "btn",
                href: "#/progresso",
                text: "Meu Progresso",
              }),
              h("a", {
                class: "btn btn--ghost",
                href: "#/sobre",
                text: "Minha trajetória completa",
              }),
            ),
          ),
          h("div", { class: "hero__foto" }, foto()),
        ),
      ),
      h(
        "button",
        {
          class: "seta",
          type: "button",
          "aria-label": "Rolar para a trajetória",
          onclick: function () {
            var alvo = document.getElementById("trajetoria");
            if (alvo) {
              alvo.scrollIntoView({ behavior: "smooth" });
              alvo.focus({ preventScroll: true });
            }
          },
        },
        svg(ICONE_SETA),
      ),

      h(
        "section",
        { class: "secao secao--escura" },
        h(
          "div",
          { class: "container" },
          h("h2", {
            id: "trajetoria",
            tabindex: "-1",
            text: "Minha trajetória",
          }),
          P.resumo ? h("p", { text: P.resumo }) : null,
          marcos.length
            ? caminho(marcos)
            : vazioEditavel(
                "Os marcos da sua trajetória aparecerão aqui. Cadastre-os em js/data.js (trajetoria).",
              ),
          h(
            "p",
            { style: "margin-top:1rem" },
            h("a", {
              class: "btn btn--ghost",
              href: "#/progresso",
              text: "Ver trajetória completa →",
            }),
          ),
        ),
      ),

      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h(
            "div",
            { class: "blocos blocos--inicio" },
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "Quem sou eu?" }),
              paragrafos((P.apresentacao || []).slice(0, 1)),
              P.interesses && P.interesses.length
                ? h(
                    "ul",
                    {
                      class: "chips",
                      "aria-label": "Interesses em tecnologia",
                    },
                    P.interesses.map(function (t) {
                      return h("li", { class: "chip", text: t });
                    }),
                  )
                : h("p", {
                    text: "Interesses em tecnologia: cadastre em js/data.js (perfil.interesses).",
                  }),
            ),
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "O que já fiz e aprendi?" }),
              conquistas.length
                ? h(
                    "ul",
                    null,
                    conquistas.map(function (c) {
                      return h(
                        "li",
                        null,
                        c.titulo,
                        " ",
                        c.evidencia && c.evidencia.url
                          ? ligacao({ rotulo: "(ver)", url: c.evidencia.url })
                          : null,
                      );
                    }),
                  )
                : h("p", {
                    text: "As conquistas aparecerão aqui (js/data.js › conquistas).",
                  }),
              h("a", {
                href: "#/progresso",
                text: "Ver todas as conquistas →",
              }),
            ),
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "Aonde quero chegar?" }),
              paragrafos((P.objetivos || []).slice(0, 1)),
              h("a", { href: "#/progresso", text: "Ver objetivos e metas →" }),
            ),
          ),
        ),
      ),

      h(
        "section",
        { class: "secao secao--escura" },
        h(
          "div",
          { class: "container" },
          h("h2", { text: "Experiência" }),
          experiencias.length
            ? h(
                "div",
                { class: "blocos" },
                experiencias.map(function (e) {
                  return cartaoExperiencia(e, true);
                }),
              )
            : vazioEditavel(
                "Suas experiências aparecerão aqui (js/data.js › experiencias).",
              ),
          h(
            "p",
            { style: "margin-top:1rem" },
            h("a", {
              class: "btn btn--ghost",
              href: "#/experiencia",
              text: "Ver toda a experiência →",
            }),
          ),
        ),
      ),

      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h(
            "div",
            { class: "bloco", style: "text-align:center" },
            h("h3", { text: "Conheça meus projetos" }),
            h("p", {
              text: "O TCC e outros trabalhos importantes que desenvolvi.",
            }),
            h(
              "div",
              { class: "hero__acoes", style: "justify-content:center" },
              h("a", {
                class: "btn",
                href: "#/projetos",
                text: "Ver projetos",
              }),
              h("a", {
                class: "btn btn--ghost",
                href: "#/atividades",
                text: "Ver atividades por disciplina",
              }),
            ),
          ),
        ),
      ),
    ];
  }

  /* ---------- Meu Progresso ---------- */
  // Marcos de exemplo, exibidos só enquanto "trajetoria" em data.js estiver vazia.
  var MARCOS_EXEMPLO = [
    {
      titulo: "Exemplo: início da formação",
      periodo: "Exemplo",
      categoria: "Formação",
      status: "concluido",
      descricao:
        "Marco de exemplo, não é real. Cadastre os seus em js/data.js (trajetoria) e este exemplo desaparece.",
    },
    {
      titulo: "Exemplo: primeiro projeto",
      periodo: "Exemplo",
      categoria: "Projeto",
      status: "concluido",
      descricao:
        "Marco de exemplo, não é real. Clique em cada ponto para ver os detalhes.",
    },
    {
      titulo: "Exemplo: projeto atual",
      periodo: "Exemplo",
      categoria: "Projeto",
      status: "andamento",
      descricao:
        "Marco de exemplo, não é real. Pontos em andamento têm um anel que pulsa.",
    },
    {
      titulo: "Exemplo: objetivo futuro",
      periodo: "Exemplo",
      categoria: "Carreira",
      status: "planejado",
      descricao:
        "Marco de exemplo, não é real. Marcos planejados aparecem com o trecho pontilhado.",
    },
  ];

  function paginaProgresso() {
    var marcos = ordenarPorData(D.trajetoria);
    var exemplo = !marcos.length;
    if (exemplo) marcos = MARCOS_EXEMPLO;
    var metas = D.metas || [];
    var grupos = [
      ["curto", "Curto prazo"],
      ["medio", "Médio prazo"],
      ["longo", "Longo prazo"],
    ];
    var conquistas = D.conquistas || [];
    var passos = D.proximosPassos || [];
    var certs = listaCertificados();

    return [
      breadcrumb([
        { rotulo: "Início", href: "#/" },
        { rotulo: "Meu Progresso" },
      ]),
      h(
        "section",
        { class: "container titulo-pagina" },
        h("h1", { text: "Meu Progresso" }),
        h("p", {
          text: "O que já conquistei, o que estou desenvolvendo e quais são os próximos objetivos.",
        }),
        h(
          "nav",
          { class: "ancoras", "aria-label": "Seções da página" },
          [
            "trajetoria-sec:Trajetória",
            "metas-sec:Objetivos e metas",
            "conquistas-sec:Conquistas",
            "certificados-sec:Certificados",
            "passos-sec:Próximos passos",
          ].map(function (x) {
            var p = x.split(":");
            return h("button", {
              class: "chip",
              type: "button",
              text: p[1],
              onclick: function () {
                var el = document.getElementById(p[0]);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  el.focus({ preventScroll: true });
                }
              },
            });
          }),
        ),
      ),

      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h("h2", {
            id: "trajetoria-sec",
            tabindex: "-1",
            text: "Minha trajetória",
          }),
          exemplo
            ? h("p", {
                class: "aviso-exemplo",
                role: "note",
                text: "Estes são marcos de exemplo, só para mostrar como o caminho funciona. Cadastre os seus em js/data.js (trajetoria) e eles serão substituídos.",
              })
            : null,
          caminho(marcos),
        ),
      ),

      h(
        "section",
        { class: "secao secao--escura" },
        h(
          "div",
          { class: "container" },
          h("h2", {
            id: "metas-sec",
            tabindex: "-1",
            text: "Objetivos e metas",
          }),
          metas.length
            ? grupos.map(function (g) {
                var lista = metas.filter(function (m) {
                  return m.prazo === g[0];
                });
                return h(
                  "div",
                  { style: "margin-bottom:1.6rem" },
                  h("h3", { text: g[1], class: "grupo-titulo" }),
                  lista.length
                    ? h("div", { class: "blocos" }, lista.map(cartaoMeta))
                    : h("p", {
                        class: "projeto__meta",
                        text:
                          "Nenhuma meta de " +
                          g[1].toLowerCase() +
                          " cadastrada.",
                      }),
                );
              })
            : vazioEditavel(
                "Nenhuma meta cadastrada ainda. Adicione em js/data.js (metas).",
              ),
        ),
      ),

      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h("h2", {
            id: "conquistas-sec",
            tabindex: "-1",
            text: "O que já conquistei",
          }),
          conquistas.length
            ? h("div", { class: "blocos" }, conquistas.map(cartaoConquista))
            : vazioEditavel(
                "Nenhuma conquista cadastrada ainda. Adicione em js/data.js (conquistas).",
              ),
        ),
      ),

      h(
        "section",
        { class: "secao secao--escura" },
        h(
          "div",
          { class: "container" },
          h("h2", {
            id: "certificados-sec",
            tabindex: "-1",
            text: "Certificados",
          }),
          certs.length
            ? h("div", { class: "blocos" }, certs.map(cartaoCertificado))
            : vazioEditavel(
                "Nenhum certificado ainda. Coloque os arquivos em assets/certificados/ e rode atualizar-atividades (ou cadastre em js/certificados.js).",
              ),
        ),
      ),

      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h("h2", {
            id: "passos-sec",
            tabindex: "-1",
            text: "Próximos passos",
          }),
          passos.length
            ? h(
                "div",
                { class: "blocos" },
                passos.map(function (p) {
                  return h(
                    "article",
                    { class: "bloco" },
                    h(
                      "div",
                      { class: "marco__cab" },
                      selo(p.status || "nao-iniciado"),
                      p.prioridade
                        ? h("span", {
                            class: "chip",
                            text:
                              "Prioridade " +
                              (
                                ROTULO_PRIORIDADE[p.prioridade] || p.prioridade
                              ).toLowerCase(),
                          })
                        : null,
                    ),
                    h("h3", { text: p.acao }),
                    p.objetivo
                      ? h(
                          "p",
                          null,
                          h("strong", { text: "Objetivo: " }),
                          p.objetivo,
                        )
                      : null,
                    p.proximaEtapa
                      ? h(
                          "p",
                          null,
                          h("strong", { text: "Próxima etapa: " }),
                          p.proximaEtapa,
                        )
                      : null,
                  );
                }),
              )
            : vazioEditavel(
                "Nenhum próximo passo cadastrado ainda. Adicione em js/data.js (proximosPassos).",
              ),
        ),
      ),
    ];
  }

  /* ---------- Experiência ---------- */
  function paginaExperiencia() {
    var lista = D.experiencias || [];
    return [
      breadcrumb([{ rotulo: "Início", href: "#/" }, { rotulo: "Experiência" }]),
      h(
        "section",
        { class: "container titulo-pagina" },
        h("h1", { text: "Experiência" }),
        h("p", {
          text: "Minhas vivências profissionais, acadêmicas e práticas, e o que cada uma acrescentou à minha formação.",
        }),
      ),
      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          lista.length
            ? h(
                "div",
                { class: "lista-exp" },
                lista.map(function (e) {
                  return cartaoExperiencia(e, false);
                }),
              )
            : vazioEditavel(
                "Nenhuma experiência cadastrada ainda. Adicione em js/data.js (experiencias).",
              ),
        ),
      ),
    ];
  }

  function paginaSobre() {
    return [
      h(
        "section",
        { class: "hero" },
        h(
          "div",
          { class: "hero__inner" },
          h(
            "div",
            null,
            h("p", { class: "hero__etiqueta", text: "Sobre mim" }),
            h("h1", {
              class: "nome",
              text: P.nome,
              style: "color:var(--cyan)",
            }),
            h("div", { class: "lead" }, paragrafos(P.apresentacao)),
          ),
          h("div", { class: "hero__foto" }, foto()),
        ),
      ),
      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h(
            "div",
            { class: "blocos" },
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "Minha trajetória" }),
              paragrafos(P.trajetoria),
            ),
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "O que aprendi no curso técnico" }),
              h(
                "ul",
                null,
                (P.aprendizados || []).map(function (t) {
                  return h("li", { text: t });
                }),
              ),
            ),
            P.interesses && P.interesses.length
              ? h(
                  "div",
                  { class: "bloco" },
                  h("h3", { text: "Interesses em tecnologia" }),
                  h(
                    "ul",
                    { class: "chips" },
                    P.interesses.map(function (t) {
                      return h("li", { class: "chip", text: t });
                    }),
                  ),
                )
              : null,
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "Principais habilidades" }),
              h(
                "ul",
                { class: "chips" },
                (P.habilidades || []).map(function (t) {
                  return h("li", { class: "chip", text: t });
                }),
              ),
            ),
            h(
              "div",
              { class: "bloco" },
              h("h3", { text: "Objetivos profissionais" }),
              paragrafos(P.objetivos),
            ),
            P.contatos && P.contatos.length
              ? h(
                  "div",
                  { class: "bloco" },
                  h("h3", { text: "Contato" }),
                  h(
                    "ul",
                    null,
                    P.contatos.map(function (c) {
                      return h(
                        "li",
                        null,
                        h("a", {
                          href: c.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          text: c.rotulo,
                        }),
                      );
                    }),
                  ),
                )
              : null,
          ),
        ),
      ),
    ];
  }

  function cardDisciplina(d) {
    var pre = semanasPreenchidas(d);
    return h(
      "a",
      { class: "pasta pasta-disciplina", href: "#/atividades/" + d.id },
      svg(ICONE_PASTA, "pasta__icone"),
      h("span", { class: "pasta__titulo", text: d.nome }),
      h("span", { class: "pasta__meta", text: d.descricao }),
      h("span", {
        class: "selo" + (pre ? "" : " selo--breve"),
        text: d.semanas + " semanas · " + pre + " com conteúdo",
      }),
    );
  }

  function paginaAtividades() {
    return [
      breadcrumb([{ rotulo: "Início", href: "#/" }, { rotulo: "Atividades" }]),
      h(
        "section",
        { class: "container titulo-pagina" },
        h("h1", { text: "Atividades" }),
        h("p", {
          text: "Escolha uma disciplina para ver as pastas semanais, da primeira à última semana.",
        }),
      ),
      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h(
            "ul",
            { class: "grade grade--grande" },
            D.disciplinas.map(function (d) {
              return h("li", null, cardDisciplina(d));
            }),
          ),
        ),
      ),
    ];
  }

  function paginaDisciplina(d) {
    var itens = [];
    for (var i = 1; i <= d.semanas; i++) itens.push(i);
    return [
      breadcrumb([
        { rotulo: "Início", href: "#/" },
        { rotulo: "Atividades", href: "#/atividades" },
        { rotulo: d.nome },
      ]),
      h(
        "section",
        { class: "container titulo-pagina" },
        h("h1", { text: d.nome }),
        h("p", { text: d.descricao + " " + d.semanas + " pastas semanais." }),
      ),
      h(
        "section",
        { class: "secao" },
        h(
          "div",
          { class: "container" },
          h(
            "ul",
            { class: "grade" },
            itens.map(function (n) {
              var cheio = temConteudo(d.id, n);
              var s = dadosSemana(d.id, n);
              var qtd =
                (s && s.atividades ? s.atividades.length : 0) +
                arquivosAuto(d.id, n).length;
              return h(
                "li",
                null,
                h(
                  "a",
                  {
                    class: "pasta" + (cheio ? "" : " pasta--vazia"),
                    href: "#/atividades/" + d.id + "/" + n,
                    "aria-label":
                      d.nome +
                      " — Semana " +
                      n +
                      (cheio ? "" : " (conteúdo em breve)"),
                  },
                  svg(ICONE_PASTA, "pasta__icone"),
                  h("span", {
                    class: "pasta__titulo",
                    text: d.nome + " — Semana " + n,
                  }),
                  h("span", {
                    class: "selo" + (cheio ? "" : " selo--breve"),
                    text: cheio
                      ? qtd
                        ? qtd + (qtd === 1 ? " item" : " itens")
                        : "Com conteúdo"
                      : "Conteúdo em breve",
                  }),
                ),
              );
            }),
          ),
        ),
      ),
    ];
  }

  function paginaSemana(d, n) {
    var s = dadosSemana(d.id, n);
    var cheio = temConteudo(d.id, n);
    var corpo = [];

    if (s && s.descricao) {
      corpo.push(
        h(
          "div",
          { class: "bloco", style: "margin-bottom:18px" },
          h("h3", { text: "Conteúdo estudado" }),
          h("p", { text: s.descricao }),
        ),
      );
    }

    if (s && s.atividades && s.atividades.length) {
      corpo.push(h("h2", { text: "Atividades realizadas" }));
      s.atividades.forEach(function (a) {
        var im = null;
        if (a.imagem) {
          im = h("img", {
            src: a.imagem,
            alt: a.imagemAlt || "Captura de tela: " + a.titulo,
            loading: "lazy",
          });
          im.addEventListener("error", function () {
            im.remove();
          });
        }
        corpo.push(
          h(
            "article",
            { class: "atividade" },
            h("h3", { text: a.titulo }),
            a.descricao ? h("p", { text: a.descricao }) : null,
            im,
            a.codigo
              ? h(
                  "pre",
                  {
                    class: "codigo",
                    tabindex: "0",
                    "aria-label": "Trecho de código",
                  },
                  h("code", { text: a.codigo.texto }),
                )
              : null,
            blocoArquivos(a.arquivos),
            h(
              "div",
              { class: "projeto__acoes" },
              a.demo
                ? h("a", {
                    class: "btn",
                    href: a.demo,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    text: "Ver demonstração",
                  })
                : null,
              a.github
                ? h("a", {
                    class: "btn btn--ghost",
                    href: a.github,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    text: "Repositório no GitHub",
                  })
                : null,
            ),
          ),
        );
      });
    }

    var auto = arquivosAuto(d.id, n);
    if (auto.length) {
      corpo.push(
        h("h2", {
          text: "Arquivos desta semana",
          style: corpo.length ? "margin-top:1.5rem" : null,
        }),
      );
      corpo.push(blocoArquivos(auto));
    }

    if (!cheio) {
      corpo.push(
        h(
          "div",
          { class: "vazio" },
          h("p", {
            text: "Conteúdo em breve",
            style: "font-size:1.2rem;color:var(--text)",
          }),
          h("p", { text: "Esta pasta ainda não tem atividades cadastradas." }),
        ),
      );
    }

    var nav = h(
      "div",
      { class: "navegacao-semana" },
      h("a", {
        class: "btn btn--ghost",
        href: "#/atividades/" + d.id,
        text: "← Voltar para as semanas",
      }),
      h(
        "span",
        { style: "display:flex;gap:10px;flex-wrap:wrap" },
        n > 1
          ? h("a", {
              class: "btn btn--ghost",
              href: "#/atividades/" + d.id + "/" + (n - 1),
              text: "← Semana " + (n - 1),
            })
          : null,
        n < d.semanas
          ? h("a", {
              class: "btn",
              href: "#/atividades/" + d.id + "/" + (n + 1),
              text: "Semana " + (n + 1) + " →",
            })
          : null,
      ),
    );

    return [
      breadcrumb([
        { rotulo: "Início", href: "#/" },
        { rotulo: "Atividades", href: "#/atividades" },
        { rotulo: d.nome, href: "#/atividades/" + d.id },
        { rotulo: "Semana " + n },
      ]),
      h(
        "section",
        { class: "container titulo-pagina" },
        h("h1", { text: d.nome + " — Semana " + n }),
      ),
      h(
        "section",
        { class: "secao" },
        h("div", { class: "container" }, corpo, nav),
      ),
    ];
  }

  function paginaProjetos() {
    var lista = D.projetos.map(linhaProjeto);
    return [
      breadcrumb([{ rotulo: "Início", href: "#/" }, { rotulo: "Projetos" }]),
      h(
        "section",
        { class: "container titulo-pagina" },
        h("h1", { text: "Projetos" }),
        h("p", {
          text: "Trabalhos importantes que desenvolvi, como o TCC e outras atividades feitas à parte das disciplinas semanais.",
        }),
      ),
      h(
        "section",
        { class: "secao" },
        lista.length
          ? h("div", { class: "projetos-lista" }, lista)
          : h(
              "div",
              { class: "container" },
              h(
                "div",
                { class: "vazio" },
                h("p", {
                  text: "Nenhum projeto cadastrado ainda. Adicione em js/data.js.",
                }),
              ),
            ),
      ),
    ];
  }

  function pagina404() {
    return [
      h(
        "section",
        { class: "container titulo-pagina secao" },
        h("h1", { text: "Página não encontrada" }),
        h(
          "p",
          null,
          h("a", { class: "btn", href: "#/", text: "Voltar ao início" }),
        ),
      ),
    ];
  }

  /* ---------- roteamento ---------- */
  function rota() {
    return (location.hash || "#/")
      .replace(/^#\/?/, "")
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
  }

  function render(primeira) {
    var p = rota();
    var secao = p[0] || "inicio";
    var conteudo,
      titulo = "Portfólio de Programação";

    if (secao === "inicio") {
      conteudo = paginaInicio();
    } else if (secao === "sobre") {
      conteudo = paginaSobre();
      titulo = "Sobre mim";
    } else if (secao === "projetos") {
      conteudo = paginaProjetos();
      titulo = "Projetos";
    } else if (secao === "progresso") {
      conteudo = paginaProgresso();
      titulo = "Meu Progresso";
    } else if (secao === "experiencia") {
      conteudo = paginaExperiencia();
      titulo = "Experiência";
    } else if (secao === "atividades") {
      var d = p[1] && disciplina(p[1]);
      if (!p[1]) {
        conteudo = paginaAtividades();
        titulo = "Atividades";
      } else if (!d) {
        conteudo = pagina404();
        secao = "";
      } else if (!p[2]) {
        conteudo = paginaDisciplina(d);
        titulo = d.nome;
      } else {
        var n = parseInt(p[2], 10);
        if (!(n >= 1 && n <= d.semanas) || String(n) !== p[2]) {
          conteudo = pagina404();
        } else {
          conteudo = paginaSemana(d, n);
          titulo = d.nome + " — Semana " + n;
        }
      }
    } else {
      conteudo = pagina404();
      secao = "";
    }

    marcoAberto = null;
    app.textContent = "";
    conteudo.forEach(function (el) {
      app.append(el);
    });
    document.title =
      titulo + (titulo === "Portfólio de Programação" ? "" : " | " + P.nome);

    Array.prototype.forEach.call(
      document.querySelectorAll(".menu a"),
      function (a) {
        if (a.getAttribute("data-rota") === secao)
          a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      },
    );

    fecharMenu();
    window.scrollTo(0, 0);
    if (!primeira) app.focus({ preventScroll: true });
  }

  /* ---------- menu mobile ---------- */
  var menu = document.getElementById("menu");
  var toggle = document.getElementById("menu-toggle");
  function fecharMenu() {
    menu.classList.remove("aberto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }
  toggle.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    toggle.setAttribute("aria-expanded", aberto ? "true" : "false");
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharMenu();
  });

  /* ---------- cabeçalho e rodapé ---------- */
  document.getElementById("marca-nome").textContent = P.nome;
  (function avatar() {
    var box = document.getElementById("marca-avatar");
    var img = h("img", { src: P.foto, alt: "" });
    img.addEventListener("error", function () {
      img.remove();
      box.textContent = (P.nome || "?").charAt(0).toUpperCase();
    });
    box.append(img);
  })();
  document.getElementById("rodape-texto").textContent =
    "© " +
    new Date().getFullYear() +
    " " +
    P.nome +
    " · Portfólio de programação";

  window.addEventListener("hashchange", function () {
    render(false);
  });
  render(true);
})();
