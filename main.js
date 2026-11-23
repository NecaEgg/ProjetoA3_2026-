// main.js
// Liga a página de teste aos analisadores léxico e sintático.

import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";
import { casos } from "./casos-de-teste.js";

const entrada = document.getElementById("entrada");
const botao = document.getElementById("botao");
const seletor = document.getElementById("exemplos");
const saidaTokens = document.getElementById("tokens");
const saidaResultado = document.getElementById("resultado");
const status = document.getElementById("status");

// ---- menu de exemplos ----------------------------------------------------
for (let k = 0; k < casos.length; k++) {
    const opcao = document.createElement("option");
    opcao.value = String(k);
    opcao.textContent = casos[k].nome;
    seletor.appendChild(opcao);
}

seletor.addEventListener("change", () => {
    const k = Number(seletor.value);
    if (!Number.isNaN(k)) entrada.value = casos[k].codigo;
});

// programa inicial: o carro
const inicial = casos.find((c) => c.nome.startsWith("V4"));
entrada.value = inicial ? inicial.codigo : "tela 400 300\n";
seletor.value = String(casos.indexOf(inicial));

// ---- análise -------------------------------------------------------------
function mostrarStatus(texto, classe) {
    status.textContent = texto;
    status.className = "status " + classe;
}

function tabelaTokens(tokens) {
    if (tokens.length === 0) {
        return "<p class='vazio'>Nenhum token.</p>";
    }
    let html = "<table><thead><tr><th>#</th><th>Tipo</th><th>Lexema</th><th>Linha</th></tr></thead><tbody>";
    tokens.forEach((t, k) => {
        html += "<tr><td>" + (k + 1) + "</td><td>" + t.tipo + "</td><td><code>" +
            escapar(t.lexema) + "</code></td><td>" + t.linha + "</td></tr>";
    });
    return html + "</tbody></table>";
}

function escapar(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function analisar() {
    const texto = entrada.value;

    // 1) léxico
    const { tokens, erros } = analisarLexico(texto);
    saidaTokens.innerHTML = tabelaTokens(tokens);

    // 2) erros léxicos: a análise sintática não roda
    if (erros.length > 0) {
        const linhas = erros.map((e) =>
            "Erro léxico na linha " + e.linha + ': "' + e.lexema + '" não forma nenhum token');
        saidaResultado.textContent = linhas.join("\n");
        saidaResultado.className = "saida erro";
        mostrarStatus(erros.length + " erro(s) léxico(s). A análise sintática não foi executada.", "erro");
        return;
    }

    // 3) sintático + AST
    try {
        const ast = analisarSintatico(tokens);
        saidaResultado.textContent = JSON.stringify(ast, null, 2);
        saidaResultado.className = "saida ok";
        mostrarStatus("Programa válido. AST gerada com sucesso.", "ok");
    } catch (falha) {
        saidaResultado.textContent = falha.message;
        saidaResultado.className = "saida erro";
        mostrarStatus("Erro sintático. A AST não foi gerada.", "erro");
    }
}

botao.addEventListener("click", analisar);

// Ctrl+Enter também analisa
entrada.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey && ev.key === "Enter") analisar();
});
