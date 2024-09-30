// Info date
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');

// Tasks Container
const tasksContainer = document.getElementById('tasksContainer');

// Set current date
const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

// Load tasks from localStorage
const loadTasks = () => {
    const tasks = obtenerTareasDeLocalStorage();
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, task.done);
        tasksContainer.prepend(taskElement);
    });
};

// Create a new task element
const createTaskElement = (text, done = false) => {
    const task = document.createElement('div');
    task.classList.add('task', 'roundBorder');
    if (done) task.classList.add('done');

    // Create the text for the task
    task.textContent = text;

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('deleteButton');
    deleteButton.onclick = (event) => {
        event.stopPropagation();
        deleteTask(task, text);
    };

    task.appendChild(deleteButton);
    task.addEventListener('click', changeTaskState);
    return task;
};

// Add new task
const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) return;

    const newTask = { text: value, done: false };
    const taskElement = createTaskElement(value);
    tasksContainer.prepend(taskElement);
    guardarTareaEnLocalStorage(newTask);
    event.target.reset();
};

// Change task state
const changeTaskState = event => {
    const taskElement = event.target;
    taskElement.classList.toggle('done');
    updateTaskStateInLocalStorage(taskElement.textContent, taskElement.classList.contains('done'));
};

// Save task in localStorage
const guardarTareaEnLocalStorage = (task) => {
    const tasks = obtenerTareasDeLocalStorage();
    tasks.push(task);
    localStorage.setItem('tareas', JSON.stringify(tasks));
};

// Update task state in localStorage
const updateTaskStateInLocalStorage = (taskText, done) => {
    const tasks = obtenerTareasDeLocalStorage().map(task => {
        if (task.text === taskText) {
            return { text: taskText, done };
        }
        return task;
    });
    localStorage.setItem('tareas', JSON.stringify(tasks));
};

// Get tasks from localStorage
const obtenerTareasDeLocalStorage = () => {
    const tasks = localStorage.getItem('tareas');
    return tasks ? JSON.parse(tasks) : [];
};

// Delete task
const deleteTask = (taskElement, taskText) => {
    // Remove the task from the interface
    tasksContainer.removeChild(taskElement);

    // Remove the task from localStorage
    const tasks = obtenerTareasDeLocalStorage().filter(task => task.text !== taskText);
    localStorage.setItem('tareas', JSON.stringify(tasks));
};

// Set everything up
setDate();
loadTasks();

// Event listener for form submission
document.getElementById('taskForm').addEventListener('submit', addNewTask);
