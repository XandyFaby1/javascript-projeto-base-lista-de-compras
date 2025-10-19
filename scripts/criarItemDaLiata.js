import gerarDiaDaSemana from "./gerarDiaDaSemana.js";

// Elementos HTML
const inputItem = document.getElementById("input-item");
const listaUl = document.getElementById("lista-de-compras"); // Assuma que você tem este ID no seu <ul> ou <ol>

// --- Lógica de Armazenamento ---

// Tenta obter a lista do localStorage. Se existir, converte de volta para array; se não, inicia um array vazio.
const listaSalvaJSON = localStorage.getItem('listaCompras');
let listaDeItens = listaSalvaJSON ? JSON.parse(listaSalvaJSON) : [];

// Função auxiliar para salvar o array atual no localStorage
function salvarLista() {
    localStorage.setItem('listaCompras', JSON.stringify(listaDeItens));
}

// --- Lógica de Renderização e Criação de Elementos ---

// Função para renderizar o array completo (chamada no início e após alterações)
function renderizarLista() {
    // 1. Limpa a lista existente no HTML
    listaUl.innerHTML = "";
    
    // 2. Itera sobre o array de itens e cria os elementos HTML
    listaDeItens.forEach((itemData, index) => {
        // Cria o elemento HTML a partir dos dados do array
        const itemLi = criarElementoLi(itemData, index);
        listaUl.appendChild(itemLi);
    });
}

/**
 * Cria o elemento <li> no HTML com base nos dados do item.
 * @param {Object} dadosDoItem - O objeto do item {nome, data, concluido}.
 * @param {number} index - O índice do item no array listaDeItens.
 * @returns {HTMLLIElement} O elemento <li> criado.
 */
function criarElementoLi(dadosDoItem, index) {
    const itemDaLista = document.createElement("li");
    
    // Container para o checkbox e nome
    const containerItemDaLista = document.createElement("div");
    containerItemDaLista.classList.add("lista-item-container");
    
    // Checkbox
    const inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.id = "checkbox-" + index; 
    
    // Nome do Item
    const nomeItem = document.createElement("p");
    nomeItem.innerText = dadosDoItem.nome; 

    // Define o estado inicial do checkbox e a decoração do texto
    inputCheckbox.checked = dadosDoItem.concluido;
    if (dadosDoItem.concluido) {
        nomeItem.style.textDecoration = "line-through";
    }

    // Listener para o checkbox: atualiza o array e salva
    inputCheckbox.addEventListener("click", function () {
        const isChecked = inputCheckbox.checked;
        if (isChecked) {
            nomeItem.style.textDecoration = "line-through";
        } else {
            nomeItem.style.textDecoration = "none";
        }
        
        // Atualiza o estado 'concluido' no array de dados
        listaDeItens[index].concluido = isChecked;
        salvarLista(); // Salva a alteração no localStorage
    });

    // Botão de Excluir
    const botaoExcluir = document.createElement("button");
    botaoExcluir.innerText = "X"; // Você pode usar um ícone aqui
    botaoExcluir.classList.add("botao-excluir");

    botaoExcluir.addEventListener("click", function () {
        // Remove o item do array usando o método splice()
        listaDeItens.splice(index, 1);
        
        salvarLista();      // 1. Salva a alteração no localStorage
        renderizarLista();  // 2. Re-renderiza a lista para atualizar a exibição
    });

    // Anexando elementos ao container
    containerItemDaLista.appendChild(inputCheckbox);
    containerItemDaLista.appendChild(nomeItem);

    // Data
    const itemData = document.createElement("p");
    itemData.innerText = dadosDoItem.data;
    itemData.classList.add("texto-data");
    
    // Anexando tudo ao <li> principal
    itemDaLista.appendChild(containerItemDaLista);
    itemDaLista.appendChild(itemData);
    itemDaLista.appendChild(botaoExcluir); // Adiciona o botão de exclusão

    return itemDaLista;
}

// --- Funções Exportadas (Chamadas pelo seu HTML) ---

/**
 * Função principal chamada para adicionar um novo item, agora com validação de duplicidade.
 */
export function criarItemDaLista() {
    const novoItemNome = inputItem.value.trim();

    // 1. Validação de campo vazio
    if (novoItemNome === "") {
        alert("Por favor, insira um item!");
        return;
    }
    
    // 2. NOVIDADE: Validação de duplicidade (case-insensitive)
    const itemDuplicado = listaDeItens.some(item => 
        item.nome.toLowerCase() === novoItemNome.toLowerCase()
    );

    if (itemDuplicado) {
        alert("Você já tem este item na lista.");
        return;
    }
    // --- FIM NOVIDADE ---

    // 3. Cria o objeto do novo item
    const novoItem = {
        nome: novoItemNome,
        data: gerarDiaDaSemana(),
        concluido: false 
    };

    // 4. Adiciona ao array e salva
    listaDeItens.push(novoItem);
    salvarLista();

    // 5. Limpa o input
    inputItem.value = "";
    
    // 6. Renderiza a lista completa para mostrar o novo item
    renderizarLista();
}

// --- Inicialização ---

// Chamamos a função de renderização uma vez para mostrar os itens salvos ao carregar a página
renderizarLista();