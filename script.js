// Seleciona todas as imagens da galeria
const imagens = document.querySelectorAll('.gallery-item img');

imagens.forEach(img => {
    img.addEventListener('click', () => {
        alert("Você clicou na arte: " + img.alt);
    });
});
