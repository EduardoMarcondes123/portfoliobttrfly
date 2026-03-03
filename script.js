/*const modal = document.getElementById("modal-container");
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

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
/*
themeToggle.onclick = () => {
    body.classList.toggle("dark-mode"); // Liga/Desliga o modo escuro
    
    // Troca o ícone do botão
    if (body.classList.contains("dark-mode")) {
        themeToggle.innerHTML = "☀️";
    } else {
        themeToggle.innerHTML = "🌙";
    }
};*/
/*
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.onclick = () => {
        alert("O botão foi clicado e o script está funcionando!");
        document.body.classList.toggle("dark-mode");
    };
} else {
    console.log("ERRO: O script não encontrou nenhum botão com id='theme-toggle'");
}*/


document.addEventListener("DOMContentLoaded", function() {
    console.log("O DOM foi totalmente carregado!");

    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    if (themeToggle) {
        console.log("Botão encontrado com sucesso!");
        
        themeToggle.addEventListener("click", function() {
            console.log("Clique detectado no botão!");
            body.classList.toggle("dark-mode");
            
            // Troca o ícone
            if (body.classList.contains("dark-mode")) {
                themeToggle.innerHTML = "☀️";
            } else {
                themeToggle.innerHTML = "🌙";
            }
        });
    } else {
        console.error("ERRO CRÍTICO: O botão com id='theme-toggle' ainda não foi encontrado.");
    }
});
