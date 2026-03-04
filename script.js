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

const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
let imagens = [];
let indiceAtual = 0;

document.addEventListener("DOMContentLoaded", function() {
    imagens = document.querySelectorAll(".gallery-item img");
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
        }
    });

    document.querySelector(".close-button").onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.onclick = () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    };
});

function mudarImagem(direcao) {
    indiceAtual += direcao;
    if (indiceAtual >= imagens.length) indiceAtual = 0;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;
    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}

// No seu script.js, onde a imagem é clicada:
img.onclick = function() {
    modal.style.display = "flex";
    document.getElementById('theme-toggle').style.visibility = 'hidden'; // Esconde o botão
    modalImg.src = this.src;
    // ... restante do código
}

// E na função de fechar o modal:
document.querySelector(".close-button").onclick = () => {
    modal.style.display = "none";
    document.getElementById('theme-toggle').style.visibility = 'visible'; // Mostra o botão de volta
}
