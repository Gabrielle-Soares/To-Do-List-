// --- Funções de Utilitário e Notificação (Essenciais) ---

function generateId() {
    return Date.now().toString();
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // Estilos mínimos para que a notificação funcione
    notification.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; padding: 10px 20px;
        border-radius: 8px; color: white; z-index: 1000; opacity: 0;
        transition: opacity 0.5s; background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.addEventListener('transitionend', () => notification.remove());
    }, 3000);
}

// --- Funções de Gerenciamento de Dados (Local Storage) ---

function saveTasks() {
    const listItems = document.querySelectorAll('#taskList li');
    const tasks = [];

    listItems.forEach(item => {
        tasks.push({
            id: item.getAttribute('data-id'),
            text: item.querySelector('.task-text').textContent,
            completed: item.classList.contains('completed')
        });
    });

    localStorage.setItem('todos', JSON.stringify(tasks));
}

function loadAndRenderTasks() {
    const savedTasks = localStorage.getItem('todos');
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    renderTasks(tasks);
}

// --- Funções de Manipulação do DOM ---

function createTaskElement(task) {
    const list = document.getElementById('taskList');
    
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id); 
    if (task.completed) {
        li.classList.add('completed');
    }

    const taskTextSpan = document.createElement('span');
    taskTextSpan.classList.add('task-text');
    taskTextSpan.textContent = task.text;
    
    // Evento: Marcar/desmarcar conclusão
    taskTextSpan.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveTasks();
    });
    
    li.appendChild(taskTextSpan);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
    
    // Evento: Remover tarefa
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        li.remove();
        saveTasks();
        showNotification('Tarefa removida!', 'error');
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
}

function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    tasks.forEach(task => createTaskElement(task));
}


function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        showNotification('Digite uma tarefa válida!', 'error');
        return;
    }

    const newTask = {
        id: generateId(),
        text: taskText,
        completed: false
    };

    createTaskElement(newTask);
    saveTasks();
    
    input.value = '';
    showNotification('Tarefa adicionada!', 'success');
}

// --- Inicialização da Aplicação ---

document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderTasks();

    // Listener para o botão Adicionar
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    
    // Listener para a tecla Enter no input
    document.getElementById('taskInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});