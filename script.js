// ==========================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ==========================================
const API_BASE = "https://back-mariposa.onrender.com/api";
const API_PORTFOLIO = `${API_BASE}/portfolio`;
const API_PRODUTOS = `${API_BASE}/produtos`;
const WHATSAPP_LOJA = "5511918491312"; 

const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const themeToggle = document.getElementById("theme-toggle");
let imagens = [];
let indiceAtual = 0;
let TODOS_OS_PRODUTOS = []; 

// ==========================================
// 2. NAVEGAÇÃO ENTRE ABAS (COM BOTÃO VOLTAR DO CELULAR)
// ==========================================
// O "salvarNoHistorico" evita que o site entre num loop infinito quando o usuário clica em "Voltar"
function abrirAba(nomeAba, salvarNoHistorico = true) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    const alvo = document.getElementById('aba-' + nomeAba);
    if (alvo) alvo.classList.add('ativa');
    window.scrollTo(0, 0);

    // Salva a aba no histórico do celular/navegador
    if (salvarNoHistorico) {
        history.pushState({ aba: nomeAba }, "", "#" + nomeAba);
    }
}

// ==========================================
// 3. BUSCA DINÂMICA (PORTFÓLIO E LOJA)
// ==========================================
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

        configurarModalPortfolio();

    } catch (error) {
        grid.innerHTML = "<p style='text-align: center; width: 100%;'>Erro ao carregar as artes. Tente atualizar! 🦋</p>";
    }
}

async function carregarSessoes() {
    try {
        const res = await fetch(`${API_BASE}/sessoes`);
        const sessoes = await res.json();
        const menu = document.getElementById('menu-filtros');
        if(!menu) return;
        
        sessoes.forEach(s => {
            menu.innerHTML += `<button class="btn-filtro" onclick="filtrarProdutos('${s.nome}')">${s.nome}</button>`;
        });
    } catch (err) { console.log(err); }
}

async function carregarProdutosLoja() {
    try {
        const res = await fetch(API_PRODUTOS);
        TODOS_OS_PRODUTOS = await res.json();
        filtrarProdutos('Todos'); 
    } catch (err) {
        document.getElementById('grid-produtos').innerHTML = "<p style='width:100%;text-align:center;'>A lojinha está dormindo... 😴</p>";
    }
}

function filtrarProdutos(categoria) {
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        if(btn.innerText === categoria) btn.classList.add('ativo');
        else btn.classList.remove('ativo');
    });

    let filtrados = categoria === 'Todos' ? TODOS_OS_PRODUTOS : TODOS_OS_PRODUTOS.filter(p => p.sessao === categoria);
    
    const grid = document.getElementById('grid-produtos');
    if(!grid) return;
    grid.innerHTML = ""; 
    
    if(filtrados.length === 0) {
        grid.innerHTML = "<p style='width:100%; text-align:center; grid-column: 1/-1;'>Nenhum item nesta categoria ainda. 🦋</p>";
        return;
    }

    filtrados.forEach(p => {
        const msgZap = encodeURIComponent(`Oii! Vi no site e gostaria de encomendar: ${p.nome} (${p.preco}).`);
        const linkZap = `https://wa.me/${WHATSAPP_LOJA}?text=${msgZap}`;

        grid.innerHTML += `
            <div class="produto-card">
                <img src="${p.imagem}" alt="${p.nome}" class="img-produto-clicavel" onclick="abrirFotoProduto('${p.imagem}', '${p.nome}')">
                <div style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                    <div>
                        <span class="etiqueta-sessao">${p.sessao || 'Loja'}</span>
                        <h3 style="font-size: 16px; margin: 0 0 10px;">${p.nome}</h3>
                    </div>
                    <div>
                        <p style="color: #Fa7f72; font-weight: bold; font-size: 18px; margin: 0 0 15px;">${p.preco}</p>
                        <a href="${linkZap}" target="_blank" class="btn-comprar">Comprar via WhatsApp</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// ==========================================
// 4. LÓGICA DO MODAL (TECLADO E CELULAR)
// ==========================================

function abrirModalComHistorico() {
    modal.style.display = "flex";
    themeToggle.style.visibility = 'hidden';
    // Adiciona o modal no histórico do celular para o botão "Voltar" funcionar
    history.pushState({ modalAberto: true }, "", "#foto");
}

function fecharModal(voltarHistorico = true) {
    modal.style.display = "none";
    themeToggle.style.visibility = 'visible';
    // Se a gente fechou no 'X', limpa o histórico pra não bugar o botão do celular depois
    if (voltarHistorico && history.state && history.state.modalAberto) {
        history.back();
    }
}

function configurarModalPortfolio() {
    imagens = document.querySelectorAll(".gallery-item img");
    
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
            document.querySelectorAll('.nav-button').forEach(btn => btn.style.display = 'block');
            abrirModalComHistorico();
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

function abrirFotoProduto(imagemSrc, nomeProduto) {
    modalImg.src = imagemSrc;
    captionText.innerHTML = nomeProduto;
    document.querySelectorAll('.nav-button').forEach(btn => btn.style.display = 'none');
    abrirModalComHistorico();
}

// Fechar no X
document.querySelector(".close-button").onclick = () => fecharModal(true);

// Fechar clicando no fundo escuro
window.onclick = (e) => { 
    if (e.target == modal) fecharModal(true);
}

// ==========================================
// 5. INICIALIZAÇÃO, BLINDAGEM E EVENTOS (UX)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Registra a home inicial no histórico pra navegação não se perder
    history.replaceState({ aba: 'home' }, "", "#home");

    carregarSessoes();
    carregarProdutosLoja();
    carregarPortfolioDoBanco();

    themeToggle.onclick = () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    };
});

// A MÁGICA DO BOTÃO "VOLTAR" DO CELULAR
window.addEventListener('popstate', function(event) {
    // 1. Se o modal da foto estiver aberto, apenas fecha ele!
    if (modal.style.display === "flex") {
        fecharModal(false); // false pra não dar conflito no histórico
        return; 
    }

    // 2. Se mudou de aba, volta pra aba anterior!
    if (event.state && event.state.aba) {
        abrirAba(event.state.aba, false);
    } else {
        abrirAba('home', false);
    }
});

// A MÁGICA DO TECLADO DO PC (ESC e Setinhas)
document.addEventListener('keydown', function(e) {
    // Se o modal estiver aberto, controla com o teclado:
    if (modal.style.display === "flex") {
        if (e.key === "Escape") {
            fecharModal(true);
        } else if (e.key === "ArrowRight") {
            // Só passa pro lado se as setinhas não estiverem escondidas (ou seja, se for o portfólio)
            if (document.querySelector('.nav-button.next').style.display !== 'none') mudarImagem(1);
        } else if (e.key === "ArrowLeft") {
            if (document.querySelector('.nav-button.prev').style.display !== 'none') mudarImagem(-1);
        }
    }

    // A BLINDAGEM CONTRA COPIADORES CONTINUA AQUI:
    if (e.key === 'F12' || e.keyCode === 123) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) e.preventDefault();
    if (e.ctrlKey && (e.key === 'U' || e.key === 'S')) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.key === 'P') e.preventDefault();
});

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('copy', function(e) {
    e.clipboardData.setData('text/plain', 'As artes deste site são protegidas. Apoie o artista independente!');
    e.preventDefault();
});
document.addEventListener('cut', e => e.preventDefault());