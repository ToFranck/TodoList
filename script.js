document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    const filters = document.getElementById('filters');
    const searchInput = document.getElementById('search');

    const tasksContainer = document.getElementById('tasks-container');
    const formContainer = document.getElementById('form-container');
    const tasksHeader = document.getElementById('tasks-header');
    const formHeader = document.getElementById('form-header');

    const country = document.getElementById('country');
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    // Rendre les containers déplaçables
    makeContainerDraggable(tasksContainer, tasksHeader);
    makeContainerDraggable(formContainer, formHeader);

    loadTasks();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            todoInput.value = '';
        }
    });

    searchInput.addEventListener('input', () => {
        filterTasks(null, searchInput.value.trim());
    });

    filters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            filterTasks(e.target.id);
        }
    });



    // Fonction pour rendre un container déplaçable
    function makeContainerDraggable(container, header) {
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;

        header.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function addTask(taskText) {
        const li = document.createElement('li');
        li.classList.add('task-item');

        const taskTextNode = document.createElement('span');
        taskTextNode.textContent = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            todoList.removeChild(li);
            saveTasks();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            const newTaskText = prompt('Edit the task:', taskText);
            if (newTaskText !== null) {
                taskTextNode.textContent = newTaskText.trim();
                saveTasks();
            }
        });

        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.classList.add('done');
        doneButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        li.appendChild(taskTextNode);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(doneButton);

        todoList.appendChild(li);
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach((task) => {
                addTask(task.text);
                if (task.completed) {
                    todoList.lastChild.classList.add('completed');
                }
            });
        }
    }

    function filterTasks(filter, searchText = '') {
        const allTasks = todoList.querySelectorAll('li');
        allTasks.forEach((task) => {
            let shouldDisplay = true;

            if (filter === 'completed' && !task.classList.contains('completed')) {
                shouldDisplay = false;
            }

            if (filter === 'not-completed' && task.classList.contains('completed')) {
                shouldDisplay = false;
            }

            if (searchText && !task.querySelector('span').textContent.toLowerCase().includes(searchText.toLowerCase())) {
                shouldDisplay = false;
            }

            task.style.display = shouldDisplay ? '' : 'none';
        });
    }

  
        
    function getCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString('en-US', options);
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US');
        
    }

    function updateTime(){
        date.textContent = getCurrentDate();
        time.textContent = getCurrentTime();
    }

    country.textContent = 'Fr';
    updateTime();
    setInterval(updateTime, 1000); // Mettre à jour l'heure toutes les secondes normallement

});
