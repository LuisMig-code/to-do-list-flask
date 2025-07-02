document.addEventListener('DOMContentLoaded', function() {
    const btnAddTask = document.getElementById('btn-add-task');
    
    btnAddTask.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário usando os novos IDs
        const formData = {
            name: document.getElementById('task-name').value,
            description: document.getElementById('task-desc').value,
            status: document.getElementById('task-status').value,
            due_date: document.getElementById('task-due-date').value
        };
        
        // Validação
        if (!formData.name.trim()) {
            alert('O nome da task é obrigatório!');
            return;
        }
        
        // Enviar para o backend
        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Limpar formulário
                document.getElementById('task-name').value = '';
                document.getElementById('task-desc').value = '';
                document.getElementById('task-status').value = 'pendente';
                document.getElementById('task-due-date').value = '';
                
                // Fechar modal (se estiver usando)
                const modal = document.getElementById('taskModal');
                if (modal) {
                    modal.classList.add('hidden');
                }
                
                // Atualizar a tabela (opcional)
                updateTaskTable();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification(error.message || 'Erro ao adicionar task', 'error');
        });
    });
    
    // Função auxiliar para mostrar notificações
    function showNotification(message, type) {
        // Implemente sua notificação favorita (Toast, SweetAlert, etc)
        alert(`${type.toUpperCase()}: ${message}`);
    }
    
    // Função para atualizar a tabela (implemente conforme sua necessidade)
    function updateTaskTable() {
        // Recarregar a página
        window.location.reload();
    
    }
});