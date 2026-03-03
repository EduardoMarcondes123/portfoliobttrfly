const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const imagens = document.querySelectorAll(".gallery-item img");
let indiceAtual = 0; // Guarda a posição da imagem aberta

// Função para abrir o modal
imagens.forEach((img, index) => {
    img.onclick = function() {
        modal.style.display = "flex";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
        indiceAtual = index; // Salva qual imagem você clicou
    }
});

// Função para mudar a imagem (Próximo ou Anterior)
function mudarImagem(direcao) {
    indiceAtual += direcao;

    // Se chegar no fim, volta pro começo
    if (indiceAtual >= imagens.length) { indiceAtual = 0; }
    // Se for antes da primeira, vai pra última
    if (indiceAtual < 0) { indiceAtual = imagens.length - 1; }

    modalImg.src = imagens[indiceAtual].src;
    captionText.innerHTML = imagens[indiceAtual].alt;
}

// Fechar modal
document.querySelector(".close-button").onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
