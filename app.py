# app.py
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Dados de exemplo (em um projeto real, isso viria de um banco de dados)
tasks = [
    {"id": 1, "name": "Implementar login", "description": "Criar sistema de autenticação", 
     "status": "pendente", "due_date": "2023-06-15"},
    {"id": 2, "name": "Criar API", "description": "Desenvolver endpoints REST", 
     "status": "concluido", "due_date": "2023-06-10"},
    {"id": 3, "name": "Testar sistema", "description": "Realizar testes unitários", 
     "status": "em_andamento", "due_date": "2023-06-20"},
]

@app.route('/')
def index():
    return render_template('index.html', tasks=tasks)

if __name__ == '__main__':
    app.run(debug=True)