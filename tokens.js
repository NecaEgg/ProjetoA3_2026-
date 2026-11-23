// tokens.js
// Regras léxicas da linguagem Traço (Fase 1).
//
// Cada regra tem:
//   tipo    -> nome do token
//   padrao  -> expressão regular com a flag "y" (sticky), que casa apenas
//              na posição atual do ponteiro do analisador léxico
//   ignorar -> true quando o token é reconhecido mas não vai para a lista
//
// A ORDEM das regras importa: a primeira que casar vence.
//   * O comentário "--" vem antes de tudo.
//   * As palavras-chave vêm antes das cores e dos números.
//   * Toda palavra-chave e todo nome de cor terminam com (?![A-Za-z0-9_]),
//     para que "linha" não case com o começo de "linhas" nem "azul" com "azulado".
//   * Os números proíbem zero à esquerda: "0" é aceito, "05" é erro léxico.

export const regras = [
    // ---- ignorados -------------------------------------------------------
    { tipo: "COMENTARIO",    padrao: /--[^\n]*/y,                       ignorar: true },
    { tipo: "ESPACO",        padrao: /[ \t\r\n]+/y,                     ignorar: true },

    // ---- palavras-chave --------------------------------------------------
    { tipo: "TELA",          padrao: /tela(?![A-Za-z0-9_])/y },
    { tipo: "LINHA",         padrao: /linha(?![A-Za-z0-9_])/y },
    { tipo: "CIRCULO",       padrao: /circulo(?![A-Za-z0-9_])/y },
    { tipo: "RETANGULO",     padrao: /retangulo(?![A-Za-z0-9_])/y },
    { tipo: "GRUPO",         padrao: /grupo(?![A-Za-z0-9_])/y },
    { tipo: "TRACO",         padrao: /traco(?![A-Za-z0-9_])/y },
    { tipo: "PREENCHIMENTO", padrao: /preenchimento(?![A-Za-z0-9_])/y },
    { tipo: "ESPESSURA",     padrao: /espessura(?![A-Za-z0-9_])/y },
    { tipo: "ROTACAO",       padrao: /rotacao(?![A-Za-z0-9_])/y },
    { tipo: "DESLOCAMENTO",  padrao: /deslocamento(?![A-Za-z0-9_])/y },

    // ---- cores -----------------------------------------------------------
    { tipo: "COR",           padrao: /(?:preto|branco|vermelho|verde|azul|amarelo|laranja|roxo|cinza|rosa)(?![A-Za-z0-9_])/y },
    { tipo: "HEX",           padrao: /#[0-9A-Fa-f]{6}(?![A-Za-z0-9_])/y },

    // ---- números ---------------------------------------------------------
    { tipo: "NUM",           padrao: /(?:0|[1-9][0-9]*)(?![0-9A-Za-z_])/y },

    // ---- delimitadores de grupo -----------------------------------------
    { tipo: "ABRE",          padrao: /\{/y },
    { tipo: "FECHA",         padrao: /\}/y },
];

// Descrição legível de cada tipo de token, usada nas mensagens de erro
// sintático ("esperado X, encontrado Y").
export const descricao = {
    TELA: "'tela'",
    LINHA: "'linha'",
    CIRCULO: "'circulo'",
    RETANGULO: "'retangulo'",
    GRUPO: "'grupo'",
    TRACO: "'traco'",
    PREENCHIMENTO: "'preenchimento'",
    ESPESSURA: "'espessura'",
    ROTACAO: "'rotacao'",
    DESLOCAMENTO: "'deslocamento'",
    COR: "nome de cor",
    HEX: "cor hexadecimal",
    NUM: "número",
    ABRE: "'{'",
    FECHA: "'}'",
    FIM: "fim do programa",
};
