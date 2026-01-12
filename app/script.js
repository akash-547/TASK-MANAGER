// DOM Elements
const taskInput = document.getElementById('taskinput');
const addBtn = document.getElementById('addBtn');
const errorMessage = document.getElementById('errorMessage');
const taskList = document.getElementById('taskList');
const pagination = document.getElementById('panigation');

const tasks = [];
const tasksPerPage = 5;
let currentPage = 1;
let editingIndex = -1;

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

function addTask() {
  const taskValue = taskInput.value.trim();
  
  if (!taskValue) {
    errorMessage.textContent = 'Please enter a task!';
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 3000);
    return;
  }
  
  if (editingIndex !== -1) {
    tasks[editingIndex].text = taskValue;
    editingIndex = -1;
    addBtn.textContent = 'Add';
  } else {
    tasks.unshift({ text: taskValue, completed: false });
  }
  
  taskInput.value = '';
  renderTasks();
  renderPagination();
}

function renderTasks() {
  taskList.innerHTML = '';
  const start = (currentPage - 1) * tasksPerPage;
  const current = tasks.slice(start, start + tasksPerPage);

  if (!current.length && !tasks.length) {
    taskList.innerHTML = '<div class="text-center py-12 text-gray-400">No tasks yet ✨</div>';
    return;
  }

  current.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border border-gray-200 rounded-lg mb-2';

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = `flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`;

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
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm font-medium';
    editBtn.onclick = () => {
      taskInput.value = task.text;
      editingIndex = start + i;
      addBtn.textContent = 'Update';
      taskInput.focus();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'px-3 py-1 border border-red-500 text-red-500 rounded text-sm font-medium';
    deleteBtn.onclick = () => {
      tasks.splice(start + i, 1);
      if (current.length === 1 && currentPage > 1) currentPage--;
      renderTasks();
      renderPagination();
    };

    btnDiv.appendChild(completeBtn);
    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(btnDiv);
    taskList.appendChild(li);
  });
}

function renderPagination() {
  pagination.innerHTML = '';
  const total = Math.ceil(tasks.length / tasksPerPage);
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