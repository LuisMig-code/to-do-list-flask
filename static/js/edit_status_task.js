document.addEventListener('DOMContentLoaded', function() {
  let currentTaskId = null;
  
  // Abre o popup ao clicar em Editar
  document.querySelector('table').addEventListener('click', function(e) {
    if (e.target && e.target.textContent === 'Editar') {
      e.preventDefault();
      const row = e.target.closest('tr');
      const taskId = row.querySelector('td').textContent;

      currentTaskId = taskId;

      // Mostra o modal
      document.getElementById('edit-modal').classList.remove('hidden');
    }
  });

  // Fecha o modal ao clicar em Cancelar
  document.getElementById('cancel-edit').addEventListener('click', function() {
    document.getElementById('edit-modal').classList.add('hidden');
  });

  // Salva as alterações
  document.getElementById('save-edit').addEventListener('click', function() {
    const newStatus = document.getElementById('status-select').value;
    
    // Aqui você faria a requisição AJAX para salvar no backend
    fetch(`/edit_task/${currentTaskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Recarrega a pagina
        window.location.reload(true);

      }
    });
  });
});