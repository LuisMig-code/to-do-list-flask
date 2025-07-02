document.addEventListener('DOMContentLoaded', function() {
    // Delegation de eventos para os botões de deletar
    document.querySelector('table').addEventListener('click', function(e) {
        if (e.target && e.target.id === 'delete-task') {
            e.preventDefault();
            const row = e.target.closest('tr');
            const taskId = row.querySelector('td[id="id"]').textContent;
            
            if (confirm('Tem certeza que deseja deletar esta task?')) {
                deleteTask(taskId, row);
            }
        }
    });

    // Função para deletar via AJAX
    async function deleteTask(taskId, rowElement) {
        try {
            const response = await fetch(`/delete_task/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();

            if (data.success) {
                // Remove a linha da tabela
                rowElement.remove();
                // Mostra mensagem de sucesso
                showNotification('Task deletada com sucesso!', 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Erro ao deletar task:', error);
            showNotification(`Erro ao deletar: ${error.message}`, 'error');
        }
    }

    // Função para mostrar notificações (substitua por sua implementação)
    function showNotification(message, type) {
        // Exemplo simples com alert - você pode usar Toast, SweetAlert, etc.
        alert(`${type.toUpperCase()}: ${message}`);
        
        // Exemplo com Toast (se tiver uma biblioteca):
        // Toastify({
        //     text: message,
        //     className: type,
        // }).showToast();
    }
});