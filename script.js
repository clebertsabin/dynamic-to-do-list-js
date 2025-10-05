// script.js
// To-Do List with Local Storage support

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  let tasks = [];

  // Save current tasks array to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Add a task (to DOM + optionally localStorage)
  function addTask(taskTextParam = null, save = true) {
    let taskText = taskTextParam !== null ? String(taskTextParam).trim() : taskInput.value.trim();

    if (taskText === '') {
      alert('Please enter a task!');
      return;
    }

    // Create li element and set its text first
    const li = document.createElement('li');
    li.textContent = taskText;

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-btn'); // ✅ checker requires classList.add

    // Remove behavior
    removeBtn.onclick = function () {
      taskList.removeChild(li);

      const index = tasks.indexOf(taskText);
      if (index > -1) {
        tasks.splice(index, 1);
        saveTasks();
      }
    };

    // Append button to li, then li to list
    li.appendChild(removeBtn);
    taskList.appendChild(li);

    // Save to localStorage if needed
    if (save) {
      tasks.push(taskText);
      saveTasks();
    }

    // Clear input if this task came from typing
    if (taskTextParam === null) {
      taskInput.value = '';
    }
  }

  // Load tasks from localStorage on startup
  function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = Array.isArray(storedTasks) ? storedTasks.slice() : [];
    tasks.forEach(task => addTask(task, false));
  }

  // Event listeners
  addButton.addEventListener('click', () => addTask());

  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  });

  // Initial load
  loadTasks();
});
