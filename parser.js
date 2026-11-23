// parser.js
// Analisador sintático descendente recursivo da linguagem Traço (Fase 1)
// e construção da AST.
//
// Gramática (símbolo inicial: programa; MAIÚSCULAS são tokens):
//
//   programa      → TELA NUM NUM itens
//   itens         → item itens | ε
//   item          → forma | grupo
//   forma         → LINHA NUM NUM NUM NUM estilos
//                 | CIRCULO NUM NUM NUM estilos
//                 | RETANGULO NUM NUM NUM NUM estilos
//   estilos       → estilo estilos | ε
//   estilo        → TRACO cor | PREENCHIMENTO cor | ESPESSURA NUM
//   cor           → COR | HEX
//   grupo         → GRUPO modificadores ABRE itens FECHA
//   modificadores → modificador modificadores | ε
//   modificador   → ROTACAO NUM | DESLOCAMENTO NUM NUM
//
// Cada função abaixo corresponde a um não-terminal. A escolha da alternativa
// depende apenas do próximo token (LL(1)). O parser para no primeiro erro,
// lançando um Error cuja mensagem traz a linha, o que era esperado e o que
// foi encontrado.
//
// Restrição contextual (além da gramática): um mesmo atributo de estilo
// (traco, preenchimento ou espessura) não pode ser repetido na mesma forma.

import { descricao } from "./tokens.js";

export function analisarSintatico(tokens) {
    let i = 0;

    // ---------------------------------------------------------------
    // utilitários
    // ---------------------------------------------------------------

    function atual() {
        return i < tokens.length ? tokens[i] : null;
    }

    function tipoAtual() {
        const t = atual();
        return t === null ? "FIM" : t.tipo;
    }

    function linhaAtual() {
        const t = atual();
        if (t !== null) return t.linha;
        // no fim do programa, usa a linha do último token
        return tokens.length > 0 ? tokens[tokens.length - 1].linha : 1;
    }

    function descreverEncontrado() {
        const t = atual();
        if (t === null) return "fim do programa";
        return "'" + t.lexema + "' (" + t.tipo + ")";
    }

    function erro(esperado) {
        throw new Error(
            "Erro sintático na linha " + linhaAtual() +
            ": esperado " + esperado +
            ", encontrado " + descreverEncontrado()
        );
    }

    // consome o token do tipo esperado ou lança erro
    function esperar(tipo) {
        const t = atual();
        if (t === null || t.tipo !== tipo) {
            erro(descricao[tipo]);
        }
        i++;
        return t;
    }

    function numero() {
        return Number(esperar("NUM").lexema);
    }

    // ---------------------------------------------------------------
    // conjuntos "primeiro" usados nas decisões LL(1)
    // ---------------------------------------------------------------

    const PRIMEIRO_FORMA = ["LINHA", "CIRCULO", "RETANGULO"];
    const PRIMEIRO_ITEM = [...PRIMEIRO_FORMA, "GRUPO"];
    const PRIMEIRO_ESTILO = ["TRACO", "PREENCHIMENTO", "ESPESSURA"];
    const PRIMEIRO_MODIFICADOR = ["ROTACAO", "DESLOCAMENTO"];

    // ---------------------------------------------------------------
    // não-terminais
    // ---------------------------------------------------------------

    // programa → TELA NUM NUM itens
    function programa() {
        esperar("TELA");
        const largura = numero();
        const altura = numero();
        const lista = itens("FIM");

        if (atual() !== null) {
            // itens() só para em algo que não começa item; aqui só pode ser FECHA sobrando
            erro("forma, grupo ou fim do programa");
        }

        return {
            tipo: "programa",
            tela: { largura, altura },
            itens: lista,
        };
    }

    // itens → item itens | ε
    // "seguinte" é o token que encerra a lista (FIM no programa, FECHA no grupo),
    // usado só para montar a mensagem de erro.
    function itens(seguinte) {
        const lista = [];
        while (PRIMEIRO_ITEM.includes(tipoAtual())) {
            lista.push(item());
        }
        if (tipoAtual() !== seguinte) {
            erro("forma, grupo ou " + descricao[seguinte]);
        }
        return lista;
    }

    // item → forma | grupo
    function item() {
        if (tipoAtual() === "GRUPO") return grupo();
        return forma();
    }

    // forma → LINHA NUM NUM NUM NUM estilos
    //       | CIRCULO NUM NUM NUM estilos
    //       | RETANGULO NUM NUM NUM NUM estilos
    function forma() {
        switch (tipoAtual()) {
            case "LINHA": {
                esperar("LINHA");
                const x1 = numero();
                const y1 = numero();
                const x2 = numero();
                const y2 = numero();
                const estilo = estilos();
                return { tipo: "linha", x1, y1, x2, y2, estilo };
            }
            case "CIRCULO": {
                esperar("CIRCULO");
                const cx = numero();
                const cy = numero();
                const raio = numero();
                const estilo = estilos();
                return { tipo: "circulo", cx, cy, raio, estilo };
            }
            case "RETANGULO": {
                esperar("RETANGULO");
                const x = numero();
                const y = numero();
                const largura = numero();
                const altura = numero();
                const estilo = estilos();
                return { tipo: "retangulo", x, y, largura, altura, estilo };
            }
            default:
                return erro("'linha', 'circulo' ou 'retangulo'");
        }
    }

    // estilos → estilo estilos | ε
    // Devolve sempre um objeto { traco, preenchimento, espessura } com null
    // nos atributos ausentes. Atributo repetido é erro.
    function estilos() {
        const resultado = { traco: null, preenchimento: null, espessura: null };

        while (PRIMEIRO_ESTILO.includes(tipoAtual())) {
            const t = atual();
            const chave = t.lexema; // "traco" | "preenchimento" | "espessura"

            if (resultado[chave] !== null) {
                throw new Error(
                    "Erro sintático na linha " + t.linha +
                    ": atributo '" + chave + "' repetido na mesma forma" +
                    " (esperado um atributo ainda não usado, forma, grupo, '}' ou fim do programa, encontrado '" +
                    t.lexema + "' (" + t.tipo + "))"
                );
            }

            estilo(resultado);
        }

        return resultado;
    }

    // estilo → TRACO cor | PREENCHIMENTO cor | ESPESSURA NUM
    function estilo(resultado) {
        switch (tipoAtual()) {
            case "TRACO":
                esperar("TRACO");
                resultado.traco = cor();
                break;
            case "PREENCHIMENTO":
                esperar("PREENCHIMENTO");
                resultado.preenchimento = cor();
                break;
            case "ESPESSURA":
                esperar("ESPESSURA");
                resultado.espessura = numero();
                break;
            default:
                erro("'traco', 'preenchimento' ou 'espessura'");
        }
    }

    // cor → COR | HEX
    // Nomes ficam como escritos; hexadecimais são normalizados para minúsculas.
    function cor() {
        if (tipoAtual() === "COR") return esperar("COR").lexema;
        if (tipoAtual() === "HEX") return esperar("HEX").lexema.toLowerCase();
        return erro("nome de cor ou cor hexadecimal");
    }

    // grupo → GRUPO modificadores ABRE itens FECHA
    function grupo() {
        esperar("GRUPO");
        const mods = modificadores();
        esperar("ABRE");
        const lista = itens("FECHA");
        esperar("FECHA");
        return { tipo: "grupo", modificadores: mods, itens: lista };
    }

    // modificadores → modificador modificadores | ε
    // Mantidos em lista, na ordem em que foram escritos (a ordem importa na Fase 2).
    function modificadores() {
        const lista = [];
        while (PRIMEIRO_MODIFICADOR.includes(tipoAtual())) {
            lista.push(modificador());
        }
        if (tipoAtual() !== "ABRE") {
            erro("'rotacao', 'deslocamento' ou '{'");
        }
        return lista;
    }

    // modificador → ROTACAO NUM | DESLOCAMENTO NUM NUM
    function modificador() {
        switch (tipoAtual()) {
            case "ROTACAO": {
                esperar("ROTACAO");
                const angulo = numero();
                return { tipo: "rotacao", angulo };
            }
            case "DESLOCAMENTO": {
                esperar("DESLOCAMENTO");
                const dx = numero();
                const dy = numero();
                return { tipo: "deslocamento", dx, dy };
            }
            default:
                return erro("'rotacao' ou 'deslocamento'");
        }
    }

    // ---------------------------------------------------------------
    return programa();
}
