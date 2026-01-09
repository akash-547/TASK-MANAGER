const taskInput = document.getElementById('taskinput');
const dateInput = document.getElementById('dateinput');
const addBtn = document.getElementById('addBtn');
const errorMessage = document.getElementById('errorMessage');

addBtn.addEventListener('click', () => {
  const taskValue = taskInput.value.trim();
  if (taskValue === '') {
    errorMessage.classList.remove('hidden');
    return;
  }
  errorMessage.classList.add('hidden');
});
