let indiceAtual = 0;
let imagens = [];

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("modal-container");
    const modalImg = document.getElementById("img-ampliada");
    const captionText = document.getElementById("caption");
    const themeToggle = document.getElementById("theme-toggle");
    
    // Configurar Galeria
    imagens = document.querySelectorAll(".gallery-item img");
    imagens.forEach((img, index) => {
        img.onclick = function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            indiceAtual = index;
        }
    });

    // Fechar Modal
    document.querySelector(".close-button").onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

    // Lógica Dark Mode
    if (themeToggle) {
        themeToggle.onclick = () => {
            document.body.classList.toggle("dark-mode");
            themeToggle.innerHTML = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        };
    }
});

function mudarImagem(direcao) {
    const modalImg = document.getElementById("img-ampliada");
    const captionText = document.getElementById("caption");
    
    indiceAtual += direcao;
    if (indiceAtual >= imagens.length) indiceAtual = 0;
    if (indiceAtual < 0) indiceAtual = imagens.length - 1;

    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}
