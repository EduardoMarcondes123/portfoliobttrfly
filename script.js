// 1. NAVEGAÇÃO ENTRE ABAS
function abrirAba(nomeAba) {
    document.querySelectorAll('.aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    const abaAlvo = document.getElementById('aba-' + nomeAba);
    if (abaAlvo) {
        abaAlvo.classList.add('ativa');
    }
    window.scrollTo(0, 0);
}

// 2. CONFIGURAÇÃO DO MODAL E GALERIA
const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const themeToggle = document.getElementById("theme-toggle");
let imagens = [];
let indiceAtual = 0;

document.addEventListener("DOMContentLoaded", function() {
    // Captura todas as imagens do portfólio
    imagens = document.querySelectorAll(".gallery-item img");
    
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modal.style.display = "flex";
            // ESCONDE o botão de tema para não sobrepor o "X"
            themeToggle.style.visibility = 'hidden'; 
            
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
        }
    });

    // Fechar ao clicar no "X"
    document.querySelector(".close-button").onclick = () => {
        modal.style.display = "none";
        // MOSTRA o botão de tema novamente
        themeToggle.style.visibility = 'visible';
    };

    // Fechar ao clicar fora da imagem
    window.onclick = (e) => { 
        if (e.target == modal) {
            modal.style.display = "none";
            themeToggle.style.visibility = 'visible';
        }
    }

    // 3. CONTROLE DE TEMA (DARK MODE)
    themeToggle.onclick = () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    };
});

// 4. NAVEGAÇÃO DO MODAL (SETAS)
function mudarImagem(direcao) {
    indiceAtual += direcao;
    if (indiceAtual >= imagens.length) indiceAtual = 0;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;
    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}
