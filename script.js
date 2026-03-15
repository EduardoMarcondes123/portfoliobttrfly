// ==========================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ==========================================
const API_URL = "https://back-mariposa.onrender.com/api/produtos";
const API_PORTFOLIO = "https://back-mariposa.onrender.com/api/portfolio"; // A nova gaveta!

const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const themeToggle = document.getElementById("theme-toggle");
let imagens = [];
let indiceAtual = 0;

// ==========================================
// 2. NAVEGAÇÃO ENTRE ABAS
// ==========================================
function abrirAba(nomeAba) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    const alvo = document.getElementById('aba-' + nomeAba);
    if (alvo) alvo.classList.add('ativa');
    window.scrollTo(0, 0);
}

// ==========================================
// 3. BUSCA DINÂMICA DA LOJA E DO PORTFÓLIO
// ==========================================
async function carregarProdutosDoBanco() {
    const grid = document.getElementById("grid-produtos");
    if (!grid) return;

    try {
        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();
        grid.innerHTML = ""; 

        if (produtos.length === 0) {
            grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Nenhuma joia no momento, volte logo! 🌸</p>";
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "produto-card";

            const msgWhats = encodeURIComponent(`Oi! Vi no site e tenho interesse no ${produto.nome}`);
            const linkWhats = `https://wa.me/5511918491312?text=${msgWhats}`;

            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="preco">${produto.preco}</p>
                <a href="${linkWhats}" target="_blank" class="btn-comprar">Comprar via WhatsApp</a>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>O Atelier está acordando... Tente atualizar em instantes! 🦋</p>";
    }
}

async function carregarPortfolioDoBanco() {
    const grid = document.getElementById("grid-portfolio");
    if (!grid) return;

    try {
        const resposta = await fetch(API_PORTFOLIO);
        const artes = await resposta.json();
        grid.innerHTML = "";

        if (artes.length === 0) {
            grid.innerHTML = "<p style='text-align: center; width: 100%;'>O portfólio está sendo atualizado. Volte em breve! 🎨</p>";
            return;
        }

        artes.forEach((arte) => {
            const item = document.createElement("div");
            item.className = "gallery-item";
            item.innerHTML = `<img src="${arte.imagem}" alt="${arte.titulo}">`;
            grid.appendChild(item);
        });

        // Chama a função para ativar o clique nas fotos novas
        configurarModal();

    } catch (error) {
        grid.innerHTML = "<p style='text-align: center; width: 100%;'>Erro ao carregar as artes. Tente atualizar! 🦋</p>";
    }
}

// ==========================================
// 4. LÓGICA DO MODAL (GALERIA)
// ==========================================
function configurarModal() {
    imagens = document.querySelectorAll(".gallery-item img");
    
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modal.style.display = "flex";
            themeToggle.style.visibility = 'hidden';
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
        }
    });
}

function mudarImagem(direcao) {
    if (imagens.length === 0) return;
    indiceAtual += direcao;
    if (indiceAtual >= imagens.length) indiceAtual = 0;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;
    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}

// ==========================================
// 5. INICIALIZAÇÃO DA PÁGINA E BLINDAGEM
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Carrega tudo do banco assim que a página abre
    carregarProdutosDoBanco();
    carregarPortfolioDoBanco();

    // Botões de fechar do modal
    document.querySelector(".close-button").onclick = () => {
        modal.style.display = "none";
        themeToggle.style.visibility = 'visible';
    };

    window.onclick = (e) => { 
        if (e.target == modal) {
            modal.style.display = "none";
            themeToggle.style.visibility = 'visible';
        }
    }

    // Controle do Dark Mode
    themeToggle.onclick = () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    };
});

// Blindagem de Segurança (DevSecOps)
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) e.preventDefault();
    if (e.ctrlKey && (e.key === 'U' || e.key === 'S')) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.key === 'P') e.preventDefault();
});
document.addEventListener('copy', function(e) {
    e.clipboardData.setData('text/plain', 'As artes deste site são protegidas. Apoie o artista independente!');
    e.preventDefault();
});
document.addEventListener('cut', e => e.preventDefault());

const API_BASE = "https://back-mariposa.onrender.com/api";
let TODOS_OS_PRODUTOS = []; 
const WHATSAPP_LOJA = "5511999999999"; // Lembre de colocar o numero dela aqui!

// 1. Carrega as Sessões e cria os botões
async function carregarSessoes() {
    try {
        const res = await fetch(`${API_BASE}/sessoes`);
        const sessoes = await res.json();
        const menu = document.getElementById('menu-filtros');
        sessoes.forEach(s => {
            menu.innerHTML += `<button class="btn-filtro" onclick="filtrarProdutos('${s.nome}')">${s.nome}</button>`;
        });
    } catch (err) { console.log(err); }
}

// 2. Busca todos os produtos do banco de dados
async function carregarProdutosLoja() {
    try {
        const res = await fetch(`${API_BASE}/produtos`);
        TODOS_OS_PRODUTOS = await res.json();
        filtrarProdutos('Todos'); // Assim que baixar, mostra todos!
    } catch (err) {
        document.getElementById('grid-produtos').innerHTML = "<p style='width:100%;text-align:center;'>A lojinha está dormindo... 😴</p>";
    }
}

// 3. A mágica de esconder e mostrar (O Filtro)
function filtrarProdutos(categoria) {
    // Muda a cor do botão clicado
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        if(btn.innerText === categoria) btn.classList.add('ativo');
        else btn.classList.remove('ativo');
    });

    // Filtra a lista
    let filtrados = categoria === 'Todos' ? TODOS_OS_PRODUTOS : TODOS_OS_PRODUTOS.filter(p => p.sessao === categoria);
    
    const grid = document.getElementById('grid-produtos');
    grid.innerHTML = ""; // Limpa a vitrine
    
    if(filtrados.length === 0) {
        grid.innerHTML = "<p style='width:100%; text-align:center; grid-column: 1/-1;'>Nenhum item nesta categoria ainda. 🦋</p>";
        return;
    }

    // Pinta os produtos na tela
    filtrados.forEach(p => {
        const msgZap = encodeURIComponent(`Oii! Gostaria de encomendar: ${p.nome} (${p.preco}).`);
        const linkZap = `https://wa.me/${WHATSAPP_LOJA}?text=${msgZap}`;

        grid.innerHTML += `
            <div class="produto-card">
                <img src="${p.imagem}" alt="${p.nome}">
                <div style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                    <div>
                        <span class="etiqueta-sessao">${p.sessao || 'Loja'}</span>
                        <h3 style="font-size: 16px; margin: 0 0 10px;">${p.nome}</h3>
                    </div>
                    <div>
                        <p style="color: #Fa7f72; font-weight: bold; font-size: 18px; margin: 0 0 15px;">${p.preco}</p>
                        <a href="${linkZap}" target="_blank" class="btn-comprar">Eu Quero! 🛍️</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Roda essas funções pra lojinha já abrir carregada!
carregarSessoes();
carregarProdutosLoja();