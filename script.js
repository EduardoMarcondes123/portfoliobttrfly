// Seleciona os elementos do Modal
const modal = document.getElementById("modal-container");
const modalImg = document.getElementById("img-ampliada");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close-button");

// Seleciona todas as imagens da galeria
const imagens = document.querySelectorAll(".gallery-item img");

imagens.forEach(img => {
    img.onclick = function() {
        modal.style.display = "flex"; // Mostra o modal
        modalImg.src = this.src;      // Copia o caminho da imagem
        captionText.innerHTML = this.alt; // Usa o 'alt' como legenda
    }
});

// Fecha o modal ao clicar no X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Fecha o modal ao clicar fora da imagem
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
