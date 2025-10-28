const body = document.body;
body.style.backgroundColor = 'white';
body.style.fontFamily = 'Arial, sans-serif';
body.style.margin = '0';
body.style.padding = '20px';


const title = document.createElement('h1');
title.textContent = 'ToDoList';
title.style.color = 'green';
title.style.marginBottom = '20px';
body.appendChild(title);


const form = document.createElement('form');
form.style.display = 'flex';
form.style.gap = '10px';
form.style.marginBottom = '20px';

// Поле ввода
const inputText = document.createElement('input');
inputText.type = 'text';
inputText.placeholder = 'Введите задачу';
inputText.required = true;
inputText.style.flex = '1';
form.appendChild(inputText);

// Поле для даты
const inputDate = document.createElement('input');
inputDate.type = 'date';
form.appendChild(inputDate);

// Добавление
const addBtn = document.createElement('button');
addBtn.textContent = 'Создать задачу';
addBtn.style.backgroundColor = 'green';
addBtn.style.color = 'white';
addBtn.style.border = 'none';
addBtn.style.padding = '8px 15px';
addBtn.style.cursor = 'pointer';
form.appendChild(addBtn);

body.appendChild(form);

// Фильтр
const controls = document.createElement('div');
controls.style.display = 'flex';
controls.style.gap = '10px';
controls.style.marginBottom = '20px';


const filterSelect = document.createElement('select');
const optionAll = document.createElement('option');
optionAll.value = 'all';
optionAll.textContent = 'Все';
filterSelect.appendChild(optionAll);

const optionDone = document.createElement('option');
optionDone.value = 'done';
optionDone.textContent = 'Выполненные';
filterSelect.appendChild(optionDone);

const optionNotDone = document.createElement('option');
optionNotDone.value = 'notdone';
optionNotDone.textContent = 'Невыполненные';
filterSelect.appendChild(optionNotDone);

controls.appendChild(filterSelect);

// Сортировка
const sortBtn = document.createElement('button');
sortBtn.textContent = 'Сортировать по дате';
sortBtn.style.backgroundColor = 'green';
sortBtn.style.color = 'white';
sortBtn.style.border = 'none';
sortBtn.style.padding = '8px 15px';
sortBtn.style.cursor = 'pointer';
controls.appendChild(sortBtn);

// Поиск
const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск по названию';
searchInput.style.flex = '1';
controls.appendChild(searchInput);

body.appendChild(controls);

const taskList = document.createElement('ul');
taskList.style.listStyle = 'none';
taskList.style.padding = '0';
body.appendChild(taskList);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks.slice();

  const filter = filterSelect.value;
  if (filter === 'done') filtered = filtered.filter(t => t.done);
  if (filter === 'notdone') filtered = filtered.filter(t => !t.done);


  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(t => t.text.toLowerCase().includes(searchValue));
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.style.border = '1px solid lightgray';
    li.style.padding = '8px';
    li.style.marginBottom = '5px';
    li.style.borderRadius = '5px';
    li.dataset.index = index;

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '10px';

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.done;
    check.addEventListener('change', () => {
      task.done = check.checked;
      saveTasks();
      renderTasks();
    });
    left.appendChild(check);


    const text = document.createElement('span');
    text.textContent = `${task.text} (${task.date || 'без даты'})`;
    if (task.done) {
      text.style.textDecoration = 'line-through';
      text.style.color = 'gray';
    }
    left.appendChild(text);

    li.appendChild(left);

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '5px';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.style.cursor = 'pointer';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Новое название задачи:', task.text);
      const newDate = prompt('Новая дата (ГГГГ-ММ-ДД):', task.date);
      if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        task.date = newDate || '';
        saveTasks();
        renderTasks();
      }
    });
    buttons.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    buttons.appendChild(deleteBtn);

    li.appendChild(buttons);

    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
      li.style.opacity = '0.5';
    });
    li.addEventListener('dragend', () => {
      li.style.opacity = '1';
    });
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      li.style.backgroundColor = '#f0fff0';
    });
    li.addEventListener('dragleave', () => {
      li.style.backgroundColor = '';
    });
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      li.style.backgroundColor = '';
      const from = e.dataTransfer.getData('text/plain');
      const to = index;
      const moved = tasks.splice(from, 1)[0];
      tasks.splice(to, 0, moved);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = inputText.value.trim();
  const date = inputDate.value;
  if (!text) return;

  const newTask = {
    text: text,
    date: date,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
});

sortBtn.addEventListener('click', () => {
  tasks.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateA - dateB;
  });
  saveTasks();
  renderTasks();
});


filterSelect.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

renderTasks();
renderTasks();
