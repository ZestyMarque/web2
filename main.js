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

const inputText = document.createElement('input');
inputText.type = 'text';
inputText.placeholder = 'Введите задачу';
inputText.required = true;
inputText.style.flex = '1';
form.appendChild(inputText);

const inputDate = document.createElement('input');
inputDate.type = 'date';
form.appendChild(inputDate);

const addBtn = document.createElement('button');
addBtn.textContent = 'Создать задачу';
addBtn.style.backgroundColor = 'green';
addBtn.style.color = 'white';
addBtn.style.border = 'none';
addBtn.style.padding = '8px 15px';
addBtn.style.cursor = 'pointer';
form.appendChild(addBtn);

body.appendChild(form);


const controls = document.createElement('div');
controls.style.display = 'flex';
controls.style.gap = '10px';
controls.style.marginBottom = '20px';

const filterSelect = document.createElement('select');
['Все', 'Выполненные', 'Невыполненные'].forEach((name, i) => {
  const opt = document.createElement('option');
  opt.value = i === 0 ? 'all' : i === 1 ? 'done' : 'notdone';
  opt.textContent = name;
  filterSelect.appendChild(opt);
});
controls.appendChild(filterSelect);

let sortDirection = 'old'; 
const sortBtn = document.createElement('button');
sortBtn.textContent = 'Сначала старые';
sortBtn.style.backgroundColor = 'green';
sortBtn.style.color = 'white';
sortBtn.style.border = 'none';
sortBtn.style.padding = '8px 15px';
sortBtn.style.cursor = 'pointer';
controls.appendChild(sortBtn);

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
      const editText = document.createElement('input');
      editText.type = 'text';
      editText.value = task.text;

      const editDate = document.createElement('input');
      editDate.type = 'date';
      editDate.value = task.date;

      const saveBtn = document.createElement('button');
      saveBtn.textContent = '✅';
      saveBtn.style.cursor = 'pointer';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '❌';
      cancelBtn.style.cursor = 'pointer';

      li.innerHTML = '';
      const editWrap = document.createElement('div');
      editWrap.style.display = 'flex';
      editWrap.style.gap = '10px';
      editWrap.style.alignItems = 'center';
      editWrap.append(editText, editDate, saveBtn, cancelBtn);
      li.appendChild(editWrap);

      saveBtn.addEventListener('click', () => {
        const new
