// lexer.js
// Analisador léxico da linguagem Traço (Fase 1).
//
// Percorre o texto da esquerda para a direita com um ponteiro (pos) e, em cada
// posição, tenta todas as regras de tokens.js na ordem em que estão. A primeira
// que casar produz um token { tipo, lexema, linha } (ou é descartada, se a
// regra for marcada com ignorar). Se nenhuma regra casar, o trecho até o
// próximo espaço em branco vira um erro léxico { linha, lexema } e o ponteiro
// pula esse trecho para continuar a análise e encontrar outros erros.
//
// Retorna { tokens, erros }.

import { regras } from "./tokens.js";

export function analisarLexico(texto) {
    const tokens = [];
    const erros = [];

    let pos = 0;
    let linha = 1;

    while (pos < texto.length) {
        let casou = false;

        for (const regra of regras) {
            regra.padrao.lastIndex = pos;
            const resultado = regra.padrao.exec(texto);

            if (resultado !== null) {
                const lexema = resultado[0];

                if (!regra.ignorar) {
                    tokens.push({ tipo: regra.tipo, lexema, linha });
                }

                // conta as quebras de linha contidas no lexema (ESPACO)
                for (const c of lexema) {
                    if (c === "\n") linha++;
                }

                pos += lexema.length;
                casou = true;
                break;
            }
        }

        if (!casou) {
            // Erro léxico: pega a "palavra inteira", até o próximo espaço em branco.
            const invalido = /[^ \t\r\n]+/y;
            invalido.lastIndex = pos;
            const trecho = invalido.exec(texto)[0];

            erros.push({ linha, lexema: trecho });
            pos += trecho.length;
        }
    }

    return { tokens, erros };
}
