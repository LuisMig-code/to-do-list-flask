// Função principal que é executada quando o DOM está carregado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de filtro
    const filterForm = document.getElementById('filterForm');
    const filterButton = document.getElementById('filterButton');
    const clearButton = document.getElementById('clearButton');
    
    // Se o formulário existe, configuramos os event listeners
    if (filterForm) {
        // Evento de submit do formulário
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
        
        // Evento do botão limpar
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                clearFilters();
            });
        }
        
        // Preenche os campos com os parâmetros da URL (se existirem)
        populateFormFromUrl();
    }
});

// Aplica os filtros baseados nos valores do formulário
function applyFilters() {
    const formData = new FormData(document.getElementById('filterForm'));
    const params = new URLSearchParams();
    
    // Adiciona apenas os parâmetros que têm valor
    formData.forEach((value, key) => {
        if (value) {
            params.append(key, value);
        }
    });
    
    // Atualiza a URL sem recarregar a página
    updateUrl(params.toString());
    
    // Faz a chamada para a rota com os filtros
    fetchFilteredTasks(params.toString());
}

// Limpa todos os filtros
function clearFilters() {
    // Limpa os campos do formulário
    document.getElementById('filterForm').reset();
    
    // Atualiza a URL removendo os parâmetros
    updateUrl('');
    
    // Faz a chamada para a rota sem filtros
    fetchFilteredTasks();
}

// Atualiza a URL sem recarregar a página
function updateUrl(queryString) {
    const newUrl = queryString 
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
    
    window.history.pushState({}, '', newUrl);
}

// Preenche o formulário com os parâmetros da URL
function populateFormFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const form = document.getElementById('filterForm');
    
    urlParams.forEach((value, key) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    });
}

// Faz a chamada AJAX para obter as tasks filtradas
function fetchFilteredTasks(queryString = '') {
    const url = queryString 
        ? `/?${queryString}`
        : '/';
    
    fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Identifica como AJAX
        }
    })
    .then(response => response.text())
    .then(html => {
        // Extrai apenas a tabela da resposta
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTable = doc.querySelector('table');
        
        // Atualiza apenas a tabela na página atual
        if (newTable) {
            const currentTable = document.querySelector('table');
            currentTable.parentNode.replaceChild(newTable, currentTable);
        }
    })
    .catch(error => {
        console.error('Erro ao filtrar tasks:', error);
    });
}