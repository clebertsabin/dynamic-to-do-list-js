// script.js
// Enhances the To-Do List app with persistent storage (localStorage)
// and provides functions to load, add, and remove tasks.

document.addEventListener('DOMContentLoaded', () => {
  // DOM element references
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  // In-memory array of tasks (keeps current state)
  let tasks = [];

  // Save current tasks array to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Create and return a <li> element for a task with remove button
  function createTaskElement(taskText) {
    const li = document.createElement('li');
    // store the raw task text in a data attribute to make retrieval reliable
    li.dataset.task = taskText;

    // Create a span for the task text (keeps text separate from button)
    const span = document.createElement('span');
    span.textContent = taskText;
    li.appendChild(span);

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';

    // Attach remove behavior
    removeBtn.addEventListener('click', () => {
      removeTask(taskText, li);
    });

    li.appendChild(removeBtn);

    return li;
  }

  /**
   * Add a task to the DOM and optionally save it to localStorage.
   * @param {string|null} taskTextParam - If provided, this text is used. If null, read from input field.
   * @param {boolean} save - Whether to push the task to tasks[] and update localStorage.
   */
  function addTask(taskTextParam = null, save = true) {
    // Determine final task text (either from param or input field)
    let taskText = taskTextParam !== null ? String(taskTextParam).trim() : taskInput.value.trim();

    // Validate non-empty
    if (taskText === '') {
      alert('Please enter a task!');
      return;
    }

    // Create element and append to DOM
    const li = createTaskElement(taskText);
    taskList.appendChild(li);

    // If requested, add to tasks array and persist
    if (save) {
      tasks.push(taskText);
      saveTasks();
    }

    // Clear input only if we used the input field (not when loading from storage)
    if (taskTextParam === null) {
      taskInput.value = '';
    }
  }

  /**
   * Remove a task both from DOM and from tasks array, then update localStorage.
   * @param {string} taskText - the text of the task to remove (removes first matching occurrence)
   * @param {HTMLElement} liElement - the <li> element to remove from the DOM
   */
  function removeTask(taskText, liElement) {
    // Remove from DOM
    if (liElement && liElement.parentNode === taskList) {
      liElement.remove();
    }

    // Remove one occurrence from tasks array
    const index = tasks.indexOf(taskText);
    if (index > -1) {
      tasks.splice(index, 1);
      saveTasks();
    }
  }

  // Load tasks from localStorage and render them
  function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    // Initialize the in-memory tasks array from storage
    tasks = Array.isArray(storedTasks) ? storedTasks.slice() : [];

    // Render each stored task without saving again (save = false)
    tasks.forEach(task => {
      addTask(task, false);
    });
  }

  // Event listeners
  addButton.addEventListener('click', () => addTask());

  // Allow pressing Enter inside the input to add the task
  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // avoid accidental form submit/refresh
      addTask();
    }
  });

  // Initial load
  loadTasks();
});
