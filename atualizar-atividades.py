#!/usr/bin/env python3
"""
Atualiza o portfólio com os arquivos que você colocou nas pastas.

  assets/atividades/<disciplina>/semana-NN/   -> arquivos de cada semana
  assets/certificados/                        -> certificados (PDF ou imagem)

Como usar: copie seus arquivos para as pastas e rode este programa
(clique duas vezes em atualizar-atividades.bat no Windows, ou: python atualizar-atividades.py).
Ele gera js/arquivos-auto.js, que o site lê. Depois é só abrir/atualizar o index.html.

Regras:
  - Arquivo solto na pasta da semana  -> aparece na lista da semana (Abrir / Baixar).
  - Imagens (png, jpg...)             -> aparecem como galeria.
  - Pasta que tenha index.html        -> vira "projeto web" com botão Abrir.
                                         Se tiver dentro dela uma imagem chamada preview.png (ou capa, print,
                                         screenshot...), essa imagem aparece como prévia do site.
  - Outras pastas                     -> seus arquivos são listados com o nome da pasta na frente.
"""
import json
import os
import re
import sys
from urllib.parse import quote

RAIZ = os.path.dirname(os.path.abspath(__file__))
ATIVIDADES = os.path.join(RAIZ, "assets", "atividades")
CERTIFICADOS = os.path.join(RAIZ, "assets", "certificados")
SAIDA = os.path.join(RAIZ, "js", "arquivos-auto.js")
IGNORAR = {"LEIAME.txt", "leiame.txt", "Thumbs.db", ".DS_Store", "desktop.ini"}


def url(caminho):
    rel = os.path.relpath(caminho, RAIZ).replace(os.sep, "/")
    return quote(rel, safe="/")


EXT_IMAGEM = (".png", ".jpg", ".jpeg", ".webp", ".gif")
NOMES_PREVIA = ("preview", "previa", "prévia", "capa", "cover", "screenshot", "print", "thumb", "thumbnail")


def achar_previa(pasta):
    """Procura, dentro da pasta do site, uma imagem chamada preview/capa/print/etc."""
    for nome in sorted(os.listdir(pasta), key=str.lower):
        base, ext = os.path.splitext(nome)
        if ext.lower() in EXT_IMAGEM and base.lower() in NOMES_PREVIA and os.path.isfile(os.path.join(pasta, nome)):
            return os.path.join(pasta, nome)
    return None


def listar(pasta, prefixo=""):
    itens = []
    if not os.path.isdir(pasta):
        return itens
    for nome in sorted(os.listdir(pasta), key=str.lower):
        if nome in IGNORAR or nome.startswith("."):
            continue
        caminho = os.path.join(pasta, nome)
        if os.path.isfile(caminho):
            itens.append({"nome": prefixo + nome, "url": url(caminho)})
        elif os.path.isdir(caminho):
            indice = os.path.join(caminho, "index.html")
            if os.path.isfile(indice):
                item = {"nome": prefixo + nome + "/ (projeto web)", "url": url(indice), "tipo": "projeto"}
                previa = achar_previa(caminho)
                if previa:
                    item["previa"] = url(previa)
                itens.append(item)
            else:
                itens.extend(listar(caminho, prefixo + nome + "/"))
    return itens


def main():
    dados = {}
    total = 0
    if os.path.isdir(ATIVIDADES):
        for disciplina in sorted(os.listdir(ATIVIDADES)):
            pasta_disc = os.path.join(ATIVIDADES, disciplina)
            if not os.path.isdir(pasta_disc):
                continue
            for pasta_sem in sorted(os.listdir(pasta_disc)):
                m = re.match(r"^semana[-_ ]?0*(\d+)$", pasta_sem, re.IGNORECASE)
                caminho = os.path.join(pasta_disc, pasta_sem)
                if not m or not os.path.isdir(caminho):
                    continue
                itens = listar(caminho)
                if itens:
                    dados["%s/%d" % (disciplina, int(m.group(1)))] = itens
                    total += len(itens)
                    print("  %s, semana %d: %d arquivo(s)" % (disciplina, int(m.group(1)), len(itens)))
    certs = listar(CERTIFICADOS)
    if certs:
        dados["certificados"] = certs
        print("  certificados: %d arquivo(s)" % len(certs))

    with open(SAIDA, "w", encoding="utf-8") as f:
        f.write("/* Gerado automaticamente por atualizar-atividades.py. Não edite à mão. */\n")
        f.write("window.ARQUIVOS_AUTO = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n")
    print("Pronto: %d arquivo(s) de atividades e %d certificado(s). Atualize o index.html no navegador." % (total, len(certs)))


if __name__ == "__main__":
    try:
        main()
    except Exception as erro:  # mensagem simples para quem não programa em Python
        print("Erro:", erro)
        sys.exit(1)
