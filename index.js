import { criarItemDaLista } from "./scripts/criarItemDaLiata.js";

const listaDeCompras = document.getElementById("lista-de-compras");
const botaoAdicionar = document.getElementById("adicionar-item");
botaoAdicionar.addEventListener("click", (evento) => {
    evento.preventDefault();
    const itemDaLista = criarItemDaLista();
    listaDeCompras.appendChild(itemDaLista);
    verificarListaVazia();
});

const mensagemListaVazia = document.querySelector(".mensagem-lista-vazia");
function verificarListaVazia() {
    const itemDaLista = listaDeCompras.querySelectorAll("li");
    if (itemDaLista.length === 0) {
        mensagemListaVazia.style.display = "block"
    } else {
        mensagemListaVazia.style.display = "none"
    }
};

verificarListaVazia();
