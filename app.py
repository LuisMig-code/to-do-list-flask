from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Dados de exemplo
tasks = [
    {"id": 1, "name": "Implementar login", "description": "Criar sistema de autenticação", 
     "status": "pendente", "due_date": "2023-06-15"},
    {"id": 2, "name": "Criar API", "description": "Desenvolver endpoints REST", 
     "status": "concluido", "due_date": "2023-06-10"},
    {"id": 3, "name": "Testar sistema", "description": "Realizar testes unitários", 
     "status": "em_andamento", "due_date": "2023-06-20"},
    {"id": 4, "name": "Documentação", "description": "Escrever documentação do projeto", 
     "status": "pendente", "due_date": "2023-06-25"},
]

@app.route('/')
def index():
    # Obter parâmetros de filtro da URL
    task_id = request.args.get('id')
    task_name = request.args.get('name')
    task_status = request.args.get('status')
    
    filtered_tasks = tasks
    
    # Aplicar filtros
    if task_id:
        filtered_tasks = [t for t in filtered_tasks if str(t['id']) == task_id]
    
    if task_name:
        filtered_tasks = [t for t in filtered_tasks if task_name.lower() in t['name'].lower()]
    
    if task_status:
        filtered_tasks = [t for t in filtered_tasks if t['status'] == task_status]
    
    # Verifica se é uma requisição AJAX
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render_template('partials/table.html', tasks=filtered_tasks)
    
    return render_template('index.html', tasks=filtered_tasks)

if __name__ == '__main__':
    app.run(debug=True)