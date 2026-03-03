// FUNÇÃO PARA TROCAR DE ABA
function abrirAba(nomeAba) {
    // 1. Pega todas as abas e esconde
    const todasAbas = document.querySelectorAll('.aba');
    todasAbas.forEach(aba => {
        aba.classList.remove('ativa');
    });

    // 2. Mostra a aba que você quer
    const abaAlvo = document.getElementById('aba-' + nomeAba);
    if (abaAlvo) {
        abaAlvo.classList.add('ativa');
    }
    
    // 3. Joga a tela pro topo
    window.scrollTo(0, 0);
}

// --- RESTANTE DO SEU CÓDIGO DO MODAL (MANTIDO) ---
const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const imagens = document.querySelectorAll(".gallery-item img");
let indiceAtual = 0;

imagens.forEach((img, index) => {
    img.onclick = function() {
        modal.style.display = "flex";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
        indiceAtual = index;
    }
});

function mudarImagem(direcao) {
    indiceAtual += direcao;
    if (indiceAtual >= imagens.length) { indiceAtual = 0; }
    if (indiceAtual < 0) { indiceAtual = imagens.length - 1; }
    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}

document.querySelector(".close-button").onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

// LÓGICA DARK MODE
const themeToggle = document.getElementById("theme-toggle");
themeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
};
