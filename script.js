// ==========================================
// 1. NAVEGAÇÃO ENTRE ABAS
// ==========================================
// Oculta todas as abas e mostra apenas a que o usuário clicou
function abrirAba(nomeAba) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    const alvo = document.getElementById('aba-' + nomeAba);
    if (alvo) alvo.classList.add('ativa');
    window.scrollTo(0, 0); // Joga a tela pro topo ao trocar de aba
}

// ==========================================
// 2. CONFIGURAÇÃO DO MODAL (GALERIA) E TEMA
// ==========================================
const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const themeToggle = document.getElementById("theme-toggle");
let imagens = [];
let indiceAtual = 0;

document.addEventListener("DOMContentLoaded", function() {
    // Pega todas as imagens do portfólio
    imagens = document.querySelectorAll(".gallery-item img");
    
    // Configura o clique em cada imagem para abrir o Modal
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modal.style.display = "flex";
            themeToggle.style.visibility = 'hidden'; // Esconde o botão de tema pra não atrapalhar a foto
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
        }
    });

    // Fechar Modal no X
    document.querySelector(".close-button").onclick = () => {
        modal.style.display = "none";
        themeToggle.style.visibility = 'visible';
    };

    // Fechar Modal clicando fora da imagem
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

// ==========================================
// 3. CONTROLE DE SETAS DO MODAL
// ==========================================
// Passa pra próxima foto ou volta pra anterior
function mudarImagem(direcao) {
    indiceAtual += direcao;
    // Lógica para dar a volta na galeria
    if (indiceAtual >= imagens.length) indiceAtual = 0;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;
    
    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}

// ==========================================
// 4. BLINDAGEM DE ALTA SEGURANÇA (DEVSECOPS)
// ==========================================

// Bloqueia o botão direito do mouse (Context Menu)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Bloqueia arrastar e soltar (Drag & Drop)
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

// Bloqueia atalhos de teclado maliciosos e ferramentas de desenvolvedor
document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I / J / C (Inspecionar / Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
    // Ctrl+U (Ver código-fonte)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }
    // Ctrl+S (Salvar página inteira)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        return false;
    }
    // Ctrl+P / Cmd+P (Imprimir página em PDF para roubar arte)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        return false;
    }
});

// Esvazia a área de transferência se tentarem dar Ctrl+C
document.addEventListener('copy', function(e) {
    e.clipboardData.setData('text/plain', 'As artes deste site são protegidas. Apoie o artista independente!');
    e.preventDefault();
});

// Bloqueia recorte (Ctrl+X)
document.addEventListener('cut', function(e) {
    e.preventDefault();
});
