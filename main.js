document.documentElement.lang = 'ru';
document.body.style.backgroundColor = "#fff";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.margin = "0";
document.body.style.padding = "0";

const header = document.createElement("header");
header.style.padding = "20px";
header.style.borderBottom = "2px solid #2e7d32";
const title = document.createElement("h1");
title.textContent = "ToDoList";
title.style.margin = "0";
title.style.color = "#2e7d32";
header.appendChild(title);
document.body.appendChild(header);

const container = document.createElement("div");
container.style.maxWidth = "900px";
container.style.margin = "0 auto";
container.style.padding = "20px";
document.body.appendChild(container);

const form = document.createElement("form");
form.style.display = "flex";
form.style.flexWrap = "wrap";
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
addButton.style.color = "white";
addButton.style.border = "none";
addButton.style.padding = "8px 12px";
addButton.style.cursor = "pointer";
addButton.style.borderRadius = "5px";
form.appendChild(addButton);

const controls = document.createElement("div");
controls.style.display = "flex";
controls.style.flexWrap = "wrap";
controls.style.gap = "10px";
controls.style.marginBottom = "15px";
container.appendChild(controls);

const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Поиск по названию...";
searchInput.style.flex = "1";
searchInput.style.padding = "8px";
controls.appendChild(searchInput);

const filterSelect = document.createElement("select");
const optAll = new Option("Все задачи", "all");
const optDone = new Option("Выполненные", "done");
const optNotDone = new Option("Невыполненные", "notdone");
filterSelect.append(optAll, optDone, optNotDone);
filterSelect.style.padding = "8px";
controls.appendChild(filterSelect);

const sortSelect = document.createElement("select");
const s0 = new Option("Без сортировки", "none");
const s1 = new Option("Сначала срочные", "urgent");
const s2 = new Option("Сначала отложенные", "delayed");
sortSelect.append(s0, s1, s2);
sortSelect.style.padding = "8px";
controls.appendChild(sortSelect);

const taskList = document.createElement("ul");
taskList.style.listStyle = "none";
taskList.style.padding = "0";
taskList.style.margin = "0";
container.appendChild(taskList);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function createTaskItem(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.draggable = true;
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

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = !!task.done;

  const textSpan = document.createElement("span");
  textSpan.textContent = task.text;

  const dateSpan = document.createElement("span");
  dateSpan.textContent = task.date ? task.date : "Без срока";
  dateSpan.style.fontSize = "13px";
  dateSpan.style.color = "#555";

  if (task.done) {
    textSpan.style.textDecoration = "line-through";
    textSpan.style.color = "gray";
  }

  left.append(checkbox, textSpan, dateSpan);

  const right = document.createElement("div");
  right.style.display = "flex";
  right.style.gap = "8px";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.style.border = "none";
  editBtn.style.background = "transparent";
  editBtn.style.cursor = "pointer";

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.style.border = "none";
  delBtn.style.background = "transparent";
  delBtn.style.cursor = "pointer";

  right.append(editBtn, delBtn);
  li.append(left, right);

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
    if (left.querySelector('input[type="text"]')) return;

    const editText = document.createElement("input");
    editText.type = "text";
    editText.value = task.text;
    editText.style.padding = "6px";
    editText.style.flex = "1";

    const editDate = document.createElement("input");
    editDate.type = "date";
    editDate.value = task.date || "";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "✅";
    saveBtn.style.border = "none";
    saveBtn.style.background = "transparent";
    saveBtn.style.cursor = "pointer";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "❌";
    cancelBtn.style.border = "none";
    cancelBtn.style.background = "transparent";
    cancelBtn.style.cursor = "pointer";

    clearNode(left);
    left.append(checkbox, editText, editDate);
    clearNode(right);
    right.append(saveBtn, cancelBtn);

    saveBtn.addEventListener("click", () => {
      task.text = editText.value.trim() || task.text;
      task.date = editDate.value;
      saveTasks();
      renderTasks();
    });

    cancelBtn.addEventListener("click", renderTasks);
  });

  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    const ids = Array.from(taskList.children).map(ch => ch.dataset.id);
    tasks = ids.map(id => tasks.find(t => t.id === id)).filter(Boolean);
    saveTasks();
    renderTasks();
  });

  return li;
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderTasks() {
  clearNode(taskList);

  let filtered = tasks.filter(t => {
    if (filterSelect.value === "done") return t.done;
    if (filterSelect.value === "notdone") return !t.done;
    return true;
  });

  const q = searchInput.value.trim().toLowerCase();
  if (q) filtered = filtered.filter(t => t.text.toLowerCase().includes(q));

  if (sortSelect.value === "urgent" || sortSelect.value === "delayed") {
    filtered.sort((a, b) => {
      const aDate = a.date ? new Date(a.date) : null;
      const bDate = b.date ? new Date(b.date) : null;

      if (sortSelect.value === "urgent") {
        if (!aDate && bDate) return 1;
        if (aDate && !bDate) return -1;
        if (!aDate && !bDate) return 0;
        return aDate - bDate;
      } else {
        if (!aDate && bDate) return -1;
        if (aDate && !bDate) return 1;
        if (!aDate && !bDate) return 0;
        return bDate - aDate;
      }
    });
  }

  filtered.forEach(task => {
    const li = createTaskItem(task);
    taskList.append(li);
  });
}

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(taskList, e.clientY);
  if (!dragging) return;
  if (!afterElement) taskList.append(dragging);
  else taskList.insertBefore(dragging, afterElement);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  const newTask = {
    id: Date.now().toString(),
    text,
    date: dateInput.value || "",
    done: false
  };
  tasks.push(newTask);
  saveTasks();
  form.reset();
  renderTasks();
});

filterSelect.addEventListener("input", renderTasks);
sortSelect.addEventListener("input", renderTasks);
searchInput.addEventListener("input", renderTasks);

renderTasks();
