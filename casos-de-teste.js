// casos-de-teste.js
// Cinco programas válidos e três inválidos da linguagem Traço, com o
// resultado esperado de cada um. Usado pela página de teste (menu de
// exemplos) e pelo script rodar-testes.js (Node).

export const casos = [
    // =====================================================================
    // VÁLIDOS
    // =====================================================================
    {
        nome: "V1 - Programa mínimo (só a tela)",
        valido: true,
        codigo: `tela 100 100`,
        esperado: {
            tipo: "programa",
            tela: { largura: 100, altura: 100 },
            itens: [],
        },
    },
    {
        nome: "V2 - As três formas, sem estilo, com comentários e zero",
        valido: true,
        codigo: `-- as três formas da linguagem
tela 200 150
linha 0 0 200 150          -- diagonal
circulo 100 75 40          -- centro da tela
retangulo 10 10 50 30      -- canto superior esquerdo`,
        esperado: {
            tipo: "programa",
            tela: { largura: 200, altura: 150 },
            itens: [
                { tipo: "linha", x1: 0, y1: 0, x2: 200, y2: 150,
                  estilo: { traco: null, preenchimento: null, espessura: null } },
                { tipo: "circulo", cx: 100, cy: 75, raio: 40,
                  estilo: { traco: null, preenchimento: null, espessura: null } },
                { tipo: "retangulo", x: 10, y: 10, largura: 50, altura: 30,
                  estilo: { traco: null, preenchimento: null, espessura: null } },
            ],
        },
    },
    {
        nome: "V3 - Estilos: cores por nome, hexadecimal e espessura",
        valido: true,
        codigo: `tela 300 300
retangulo 20 20 260 260 traco preto preenchimento #FFCC00 espessura 3
circulo 150 150 80 preenchimento azul traco #00ff00
linha 0 150 300 150 espessura 5
linha 150 0 150 300 traco vermelho`,
        esperado: {
            tipo: "programa",
            tela: { largura: 300, altura: 300 },
            itens: [
                { tipo: "retangulo", x: 20, y: 20, largura: 260, altura: 260,
                  estilo: { traco: "preto", preenchimento: "#ffcc00", espessura: 3 } },
                { tipo: "circulo", cx: 150, cy: 150, raio: 80,
                  estilo: { traco: "#00ff00", preenchimento: "azul", espessura: null } },
                { tipo: "linha", x1: 0, y1: 150, x2: 300, y2: 150,
                  estilo: { traco: null, preenchimento: null, espessura: 5 } },
                { tipo: "linha", x1: 150, y1: 0, x2: 150, y2: 300,
                  estilo: { traco: "vermelho", preenchimento: null, espessura: null } },
            ],
        },
    },
    {
        nome: "V4 - Carro: grupos aninhados com rotação e deslocamento",
        valido: true,
        codigo: `tela 400 300
-- um carro simples
retangulo 50 150 200 60 preenchimento azul
grupo deslocamento 70 190 {
    circulo 0 0 25 preenchimento preto
    grupo rotacao 45 {
        linha 0 0 20 0 traco branco espessura 2
    }
}
grupo deslocamento 200 190 {
    circulo 0 0 25 preenchimento preto
}`,
        esperado: {
            tipo: "programa",
            tela: { largura: 400, altura: 300 },
            itens: [
                { tipo: "retangulo", x: 50, y: 150, largura: 200, altura: 60,
                  estilo: { traco: null, preenchimento: "azul", espessura: null } },
                { tipo: "grupo",
                  modificadores: [{ tipo: "deslocamento", dx: 70, dy: 190 }],
                  itens: [
                      { tipo: "circulo", cx: 0, cy: 0, raio: 25,
                        estilo: { traco: null, preenchimento: "preto", espessura: null } },
                      { tipo: "grupo",
                        modificadores: [{ tipo: "rotacao", angulo: 45 }],
                        itens: [
                            { tipo: "linha", x1: 0, y1: 0, x2: 20, y2: 0,
                              estilo: { traco: "branco", preenchimento: null, espessura: 2 } },
                        ] },
                  ] },
                { tipo: "grupo",
                  modificadores: [{ tipo: "deslocamento", dx: 200, dy: 190 }],
                  itens: [
                      { tipo: "circulo", cx: 0, cy: 0, raio: 25,
                        estilo: { traco: null, preenchimento: "preto", espessura: null } },
                  ] },
            ],
        },
    },
    {
        nome: "V5 - Grupo vazio, grupo sem modificador e vários modificadores em ordem",
        valido: true,
        codigo: `tela 500 400
grupo { }
grupo rotacao 90 deslocamento 10 20 rotacao 15 {
    retangulo 0 0 40 40 preenchimento cinza
    grupo {
        grupo deslocamento 5 5 {
            circulo 0 0 3 traco rosa
        }
    }
}`,
        esperado: {
            tipo: "programa",
            tela: { largura: 500, altura: 400 },
            itens: [
                { tipo: "grupo", modificadores: [], itens: [] },
                { tipo: "grupo",
                  modificadores: [
                      { tipo: "rotacao", angulo: 90 },
                      { tipo: "deslocamento", dx: 10, dy: 20 },
                      { tipo: "rotacao", angulo: 15 },
                  ],
                  itens: [
                      { tipo: "retangulo", x: 0, y: 0, largura: 40, altura: 40,
                        estilo: { traco: null, preenchimento: "cinza", espessura: null } },
                      { tipo: "grupo", modificadores: [],
                        itens: [
                            { tipo: "grupo",
                              modificadores: [{ tipo: "deslocamento", dx: 5, dy: 5 }],
                              itens: [
                                  { tipo: "circulo", cx: 0, cy: 0, raio: 3,
                                    estilo: { traco: "rosa", preenchimento: null, espessura: null } },
                              ] },
                        ] },
                  ] },
            ],
        },
    },

    // =====================================================================
    // INVÁLIDOS
    // =====================================================================
    {
        nome: "I1 - Erro léxico: zero à esquerda, cor desconhecida e hex curto",
        valido: false,
        fase: "lexico",
        codigo: `tela 400 300
circulo 100 100 05 preenchimento azul
retangulo 0 0 10 10 traco magenta
linha 0 0 1 1 traco #FFF`,
        esperado: [
            { linha: 2, lexema: "05" },
            { linha: 3, lexema: "magenta" },
            { linha: 4, lexema: "#FFF" },
        ],
    },
    {
        nome: "I2 - Erro sintático: falta um número na forma",
        valido: false,
        fase: "sintatico",
        codigo: `tela 400 300
circulo 100 100 preenchimento azul`,
        esperado: "Erro sintático na linha 2: esperado número, encontrado 'preenchimento' (PREENCHIMENTO)",
    },
    {
        nome: "I3 - Erro sintático: grupo sem fechar",
        valido: false,
        fase: "sintatico",
        codigo: `tela 400 300
grupo deslocamento 10 10 {
    circulo 0 0 5
retangulo 0 0 10 10`,
        esperado: "Erro sintático na linha 4: esperado forma, grupo ou '}', encontrado fim do programa",
    },

    // =====================================================================
    // EXTRAS (não contam entre os 8 obrigatórios; cobrem outras decisões)
    // =====================================================================
    {
        nome: "E1 - Erro sintático: programa sem 'tela' no início",
        valido: false,
        fase: "sintatico",
        extra: true,
        codigo: `circulo 10 10 5
tela 100 100`,
        esperado: "Erro sintático na linha 1: esperado 'tela', encontrado 'circulo' (CIRCULO)",
    },
    {
        nome: "E2 - Erro sintático: atributo de estilo repetido",
        valido: false,
        fase: "sintatico",
        extra: true,
        codigo: `tela 100 100
circulo 10 10 5 traco azul traco verde`,
        esperado: "Erro sintático na linha 2: atributo 'traco' repetido na mesma forma (esperado um atributo ainda não usado, forma, grupo, '}' ou fim do programa, encontrado 'traco' (TRACO))",
    },
    {
        nome: "E3 - Erro sintático: '}' sobrando",
        valido: false,
        fase: "sintatico",
        extra: true,
        codigo: `tela 100 100
circulo 10 10 5 }`,
        esperado: "Erro sintático na linha 2: esperado forma, grupo ou fim do programa, encontrado '}' (FECHA)",
    },
    {
        nome: "E4 - Erro léxico: palavra-chave colada em outra palavra",
        valido: false,
        fase: "lexico",
        extra: true,
        codigo: `tela 100 100
linhas 0 0 1 1
circulo 5 5 2 preenchimento azulado`,
        esperado: [
            { linha: 2, lexema: "linhas" },
            { linha: 3, lexema: "azulado" },
        ],
    },
];
