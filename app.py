from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)

# Configuração do banco de dados RDS
user = str(os.getenv("USER"))
pwd = str(os.getenv("PASSWORD"))
endpoint = str(os.getenv("ENDPOINT"))
port = str(os.getenv("PORT"))
dbname = str(os.getenv("DBNAME"))
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{user}:{pwd}@{endpoint}:{port}/{dbname}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo da tabela tasks
class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pendente')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'due_date': self.due_date.strftime('%Y-%m-%d') if self.due_date else None
        }

@app.route('/')
def index():
    # Obter parâmetros de filtro da URL
    task_id = request.args.get('id')
    task_name = request.args.get('name')
    task_status = request.args.get('status')
    
    # Consulta base
    query = Task.query
    
    # Aplicar filtros
    if task_id:
        query = query.filter(Task.id == task_id)
    if task_name:
        query = query.filter(Task.name.ilike(f'%{task_name}%'))
    if task_status:
        query = query.filter(Task.status == task_status)
    
    # Executar consulta
    filtered_tasks = query.all()
    
    # Verifica se é uma requisição AJAX
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render_template('partials/table.html', tasks=[t.to_dict() for t in filtered_tasks])
    
    return render_template('index.html', tasks=[t.to_dict() for t in filtered_tasks])

@app.route('/add_task', methods=['POST'])
def add_task():
    try:
        # Obter dados do formulário
        data = request.get_json()
        
        # Validação básica
        if not data.get('name'):
            return jsonify({'success': False, 'message': 'O nome da task é obrigatório'}), 400
        
        # Criar nova tarefa
        new_task = Task(
            name=data['name'],
            description=data.get('description', ''),
            status=data.get('status', 'pendente'),
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d') if data.get('due_date') else None
        )
        
        # Adicionar ao banco de dados
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Task adicionada com sucesso!',
            'task': new_task.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': 'Formato de data inválido. Use YYYY-MM-DD'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao adicionar task: {str(e)}'
        }), 500

@app.route('/delete_task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Task deletada com sucesso!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)