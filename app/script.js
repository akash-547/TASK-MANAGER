// DOM Elements
const taskInput = document.getElementById('taskinput');
const addBtn = document.getElementById('addBtn');
const errorMessage = document.getElementById('errorMessage');
const taskList = document.getElementById('taskList');
const pagination = document.getElementById('panigation');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const tasksPerPage = 5;
let currentPage = 1;
let editingIndex = -1;
let filterType = 'all';

const filterBtns = document.querySelectorAll('.flex.gap-2 button');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

filterBtns.forEach((btn, i) => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.className = 'px-3 py-1 rounded-full text-sm text-slate-600 bg-slate-100');
    btn.className = 'px-3 py-1 rounded-full text-sm bg-purple-600 text-white font-medium';
    filterType = i === 0 ? 'all' : i === 1 ? 'pending' : 'completed';
    currentPage = 1;
    renderTasks();
    renderPagination();
  };
});

function addTask() {
  const taskValue = taskInput.value.trim();
  
  if (!taskValue) {
    errorMessage.textContent = 'Please enter a task!';
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 3000);
    return;
  }
  
  // Generate auto fix date (7 days from today)
  const fixDate = new Date();
  fixDate.setDate(fixDate.getDate() + 7);
  const formattedDate = fixDate.toISOString().split('T')[0];
  
  // edit new task set 
  if (editingIndex !== -1) {
    tasks[editingIndex].text = taskValue;
    editingIndex = -1;
    addBtn.textContent = 'Add';
  } else {
    tasks.unshift({ text: taskValue, completed: false, fixDate: formattedDate });
  }
  
  // save and render
  saveTasks();
  taskInput.value = '';
  renderTasks();
  renderPagination();
}

function getFilteredTasks() {
  if (filterType === 'pending') return tasks.filter(t => !t.completed);
  if (filterType === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filtered = getFilteredTasks();
  const start = (currentPage - 1) * tasksPerPage;
  const current = filtered.slice(start, start + tasksPerPage);

  current.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border border-gray-200 rounded-lg mb-2';

    const textDiv = document.createElement('div');
    textDiv.className = 'flex-1';

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = `block ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`;

    const dateSpan = document.createElement('span');
    dateSpan.textContent = ` ${task.fixDate || 'No date'}`;
    dateSpan.className = 'block text-xs text-gray-500 mt-1';

    textDiv.appendChild(span);
    textDiv.appendChild(dateSpan);

    const btnDiv = document.createElement('div');
    btnDiv.className = 'flex gap-2';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.className = `px-3 py-1 rounded text-sm font-medium ${task.completed ? 'bg-green-500 text-white' : 'border border-gray-300'}`;
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      span.classList.toggle('line-through');
      span.classList.toggle('text-gray-400');
      completeBtn.className = `px-3 py-1 rounded text-sm font-medium ${task.completed ? 'bg-green-500 text-white' : 'border border-gray-300'}`;
      saveTasks();
      renderTasks();
      renderPagination();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm font-medium';
    editBtn.onclick = () => {
      const actualIndex = tasks.indexOf(task);
      taskInput.value = task.text;
      editingIndex = actualIndex;
      addBtn.textContent = 'Update';
      taskInput.focus();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'px-3 py-1 border border-red-500 text-red-500 rounded text-sm font-medium';
    deleteBtn.onclick = () => {
      const actualIndex = tasks.indexOf(task);
      tasks.splice(actualIndex, 1);
      saveTasks();
      renderTasks();
      renderPagination();
    };

    btnDiv.appendChild(completeBtn);
    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);
    li.appendChild(textDiv);
    li.appendChild(btnDiv);
    taskList.appendChild(li);
  });
}

function renderPagination() {
  pagination.innerHTML = '';
  const filtered = getFilteredTasks();
  const total = Math.ceil(filtered.length / tasksPerPage);
  if (total <= 1) return;

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded text-sm ${i === currentPage ? 'bg-purple-600 text-white' : 'bg-gray-200'}`;
    btn.onclick = () => {
      currentPage = i;
      renderTasks();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

renderTasks();
renderPagination();