const body = document.body;
body.style.backgroundColor = "#fff";
body.style.fontFamily = "Arial, sans-serif";
body.style.margin = "0";
body.style.padding = "0";

const header = document.createElement("header");
header.textContent = "ToDoList";
header.style.fontSize = "28px";
header.style.fontWeight = "bold";
header.style.color = "#2e7d32";
header.style.padding = "20px";
header.style.textAlign = "left";
body.appendChild(header);

const container = document.createElement("div");
container.className = "container";
container.style.maxWidth = "900px";
container.style.margin = "0 auto";
container.style.padding = "20px";
body.appendChild(container);

const controls = document.createElement("div");
controls.style.display = "flex";
controls.style.flexWrap = "wrap";
controls.style.gap = "10px";
controls.style.marginBottom = "15px";
container.appendChild(controls);

// Поле для поиска
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Поиск по названию...";
searchInput.style.flex = "1";
searchInput.style.padding = "8px";
controls.appendChild(searchInput);

// Фильтр по статусу
const filterSelect = document.createElement("select");
filterSelect.innerHTML = `
  <option value="all">Все задачи</option>
  <option value="done">Выполненные</option>
  <option value="notdone">Невыполненные</option>
`;
filterSelect.style.padding = "8px";
controls.appendChild(filterSelect);

// Сортировка по дате
const sortSelect = document.createElement("select");
sortSelect.innerHTML = `
  <option value="urgent">Сначала срочные</option>
  <option value="delayed">Сначала отложенные</option>
`;
sortSelect.style.padding = "8px";
controls.appendChild(sortSelect);

const form = document.createElement("form");
form.style.display = "flex";
form.style.gap = "10px";
form.style.marginBottom = "20px";
container.appendChild(form);

const taskInput = document.createElement("input");
taskInput.type = "text";
taskInput.placeholder = "Введите задачу...";
taskInput.required = true;
taskInput.style.flex = "2";
taskInput.style.padding = "8px";
form.appendChild(taskInput);

const dateInput = document.createElement("input");
dateInput.type = "date";
dateInput.style.flex = "1";
dateInput.style.padding = "8px";
form.appendChild(dateInput);

const addButton = document.createElement("button");
addButton.type = "submit";
addButton.textContent = "Создать задачу";
addButton.style.backgroundColor = "#2e7d32";
addButton.style.color = "#fff";
addButton.style.border = "none";
addButton.style.padding = "8px 12px";
addButton.style.cursor = "pointer";
addButton.style.borderRadius = "5px";
form.appendChild(addButton);

const taskList = document.createElement("ul");
taskList.style.listStyle = "none";
taskList.style.padding = "0";
taskList.style.margin = "0";
container.appendChild(taskList);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskItem(task) {
  const li = document.createElement("li");
  li.draggable = true;
  li.dataset.id = task.id;
  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.justifyContent = "space-between";
  li.style.padding = "10px";
  li.style.marginBottom = "8px";
  li.style.border = "1px solid #ccc";
  li.style.borderRadius = "6px";
  li.style.backgroundColor = "#fafafa";
  li.style.gap = "10px";

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.alignItems = "center";
  left.style.gap = "10px";
  li.appendChild(left);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  left.appendChild(checkbox);

  const text = document.createElement("span");
  text.textContent = task.text;
  if (task.done) {
    text.style.textDecoration = "line-through";
    text.style.color = "gray";
  }
  left.appendChild(text);

  const dateSpan = document.createElement("span");
  dateSpan.textContent = task.date ? task.date : "(без срока)";
  dateSpan.style.fontSize = "13px";
  dateSpan.style.color = "#555";
  left.appendChild(dateSpan);

  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "8px";
  li.appendChild(buttons);

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.style.border = "none";
  editBtn.style.background = "transparent";
  editBtn.style.cursor = "pointer";
  buttons.appendChild(editBtn);

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.style.border = "none";
  delBtn.style.background = "transparent";
  delBtn.style.cursor = "pointer";
  buttons.appendChild(delBtn);

  checkbox.addEventListener("change", () => {
    task.done = checkbox.checked;
    saveTasks();
    renderTasks();
  });

  delBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  editBtn.addEventListener("click", () => {
    const newTextInput = document.createElement("input");
    newTextInput.type = "text";
    newTextInput.value = task.text;
    newTextInput.style.flex = "1";
    const newDateInput = document.createElement("input");
    newDateInput.type = "date";
    newDateInput.value = task.date || "";
    left.replaceChildren(checkbox, newTextInput, newDateInput);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾";
    saveBtn.style.border = "none";
    saveBtn.style.background = "transparent";
    saveBtn.style.cursor = "pointer";
    buttons.replaceChildren(saveBtn, delBtn);

    saveBtn.addEventListener("click", () => {
      task.text = newTextInput.value.trim();
      task.date = newDateInput.value;
      saveTasks();
      renderTasks();
    });
  });

 
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    const newOrder = [...taskList.children].map(el => tasks.find(t => t.id === el.dataset.id));
    tasks = newOrder.filter(Boolean);
    saveTasks();
    renderTasks();
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const dragging = document.querySelector(".dragging");
    if (!dragging || dragging === li) return;
    const rect = li.getBoundingClientRect();
    const offset = e.clientY - rect.top - rect.height / 2;
    if (offset > 0) {
      li.after(dragging);
    } else {
      li.before(dragging);
    }
  });

  return li;
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (filterSelect.value === "done") return t.done;
    if (filterSelect.value === "notdone") return !t.done;
    return true;
  });

  if (searchInput.value.trim()) {
    filtered = filtered.filter(t => t.text.toLowerCase().includes(searchInput.value.toLowerCase()));
  }

  // сортировка
  filtered.sort((a, b) => {
    const aDate = a.date ? new Date(a.date) : null;
    const bDate = b.date ? new Date(b.date) : null;

    if (sortSelect.value === "urgent") {
      // Сначала срочные — без даты в конце
      if (!aDate && bDate) return 1;
      if (aDate && !bDate) return -1;
      if (!aDate && !bDate) return 0;
      return aDate - bDate;
    } else {
      // Сначала отложенные — без даты в начале
      if (!aDate && bDate) return -1;
      if (aDate && !bDate) return 1;
      if (!aDate && !bDate) return 0;
      return bDate - aDate;
    }
  });

  filtered.forEach(task => {
    const li = createTaskItem(task);
    taskList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now().toString(),
    text: taskInput.value.trim(),
    date: dateInput.value,
    done: false
  };
  tasks.push(newTask);
  saveTasks();
  form.reset();
  renderTasks();
});

[filterSelect, sortSelect, searchInput].forEach(el =>
  el.addEventListener("input", renderTasks)
);

renderTasks();
