// rodar-testes.js
// Executa todos os casos de casos-de-teste.js no Node e compara com o
// resultado esperado.  Uso:  node rodar-testes.js

import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";
import { casos } from "./casos-de-teste.js";

let ok = 0;
let falhas = 0;

for (const caso of casos) {
    const { tokens, erros } = analisarLexico(caso.codigo);
    let obtido;

    if (erros.length > 0) {
        obtido = erros;                       // resultado léxico
    } else {
        try {
            obtido = analisarSintatico(tokens); // AST
        } catch (falha) {
            obtido = falha.message;           // erro sintático
        }
    }

    const passou = JSON.stringify(obtido) === JSON.stringify(caso.esperado);

    if (passou) {
        ok++;
        console.log("PASSOU  " + caso.nome);
    } else {
        falhas++;
        console.log("FALHOU  " + caso.nome);
        console.log("  esperado: " + JSON.stringify(caso.esperado));
        console.log("  obtido:   " + JSON.stringify(obtido));
    }
}

console.log("\n" + ok + " passaram, " + falhas + " falharam.");
process.exit(falhas === 0 ? 0 : 1);
