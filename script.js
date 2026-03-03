// Variáveis Globais (fora para a função mudarImagem enxergar)
let indiceAtual = 0;
let imagens = [];

document.addEventListener("DOMContentLoaded", function() {
    // 1. Elementos do Modal
    const modal = document.getElementById("modal-container");
    const modalImg = document.getElementById("img-ampliada");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-button");
    
    // 2. Elementos da Galeria
    imagens = document.querySelectorAll(".gallery-item img");

    // 3. Lógica para abrir o modal
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
        }
    });

    // 4. Fechar Modal
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

    // 5. Lógica do Dark Mode
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle("dark-mode");
            themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        };
    }
});

// 6. Função de mudar imagem (precisa ser global para o 'onclick' do HTML achar)
function mudarImagem(direcao) {
    const modalImg = document.getElementById("img-ampliada");
    const captionText = document.getElementById("caption");
    
    indiceAtual += direcao;

    if (indiceAtual >= imagens.length) { indiceAtual = 0; }
    if (indiceAtual < 0) { indiceAtual = imagens.length - 1; }

    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}
