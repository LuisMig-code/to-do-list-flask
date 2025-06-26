// Lógica para abrir/fechar o modal
const modal = document.getElementById('taskModal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelModal');

openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});