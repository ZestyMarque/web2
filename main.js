document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.style.backgroundColor = 'white';
    body.style.fontFamily = 'Arial, sans-serif';

    const title = document.createElement('h1');
    title.textContent = 'ToDoList';
    title.style.color = '#2e8b57';
    title.style.margin = '20px';
    body.appendChild(title);

    const container = document.createElement('div');
    container.style.maxWidth = '600px';
    container.style.margin = '0 auto';
    body.appendChild(container);

    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.gap = '10px';
    form.style.marginBottom = '20px';

    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.placeholder = 'Введите задачу';
    inputText.required = true;

    const inputDate = document.createElement('input');
    inputDate.type = 'date';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Создать задачу';
    addBtn.style.backgroundColor = '#2e8b57';
    addBtn.style.color = 'white';
    addBtn.style.border = 'none';
    addBtn.style.padding = '5px 10px';
    addBtn.style.borderRadius = '5px';
    addBtn.style.cursor = 'pointer';

    form.append(inputText, inputDate, addBtn);
    container.appendChild(form);

    // фильтрация и сортировка
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'space-between';
    controls.style.marginBottom = '10px';

    const filterSelect = document.createElement('select');
    filterSelect.innerHTML = `
        <option value="all">Все</option>
        <option value="done">Выполненные</option>
        <option value="undone">Невыполненные</option>
    `;

    const sortBtn = document.createElement('button');
    sortBtn.textContent = 'Сначала срочные';
    sortBtn.style.backgroundColor = '#2e8b57';
    sortBtn.style.color = 'white';
    sortBtn.style.border = 'none';
    sortBtn.style.padding = '5px 10px';
    sortBtn.style.borderRadius = '5px';
    sortBtn.style.cursor = 'pointer';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск по названию';

    controls.append(filterSelect, sortBtn, searchInput);
    container.appendChild(controls);

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    container.appendChild(list);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let sortMode = 'urgent'; 

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskItem(task) {
        const li = document.createElement('li');
        li.draggable = true;
        li.style.border = '1px solid #ccc';
        li.style.borderRadius = '8px';
        li.style.padding = '10px';
        li.style.marginBottom = '10px';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';
        li.style.gap = '10px';
        li.dataset.id = task.id;

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement('span');
        text.textContent = task.text;
        if (task.done) {
            text.style.textDecoration = 'line-through';
            text.style.color = 'gray';
        }

        const date = document.createElement('span');
        date.textContent = task.date || 'Без срока';
        date.style.fontSize = '0.9em';
        date.style.color = '#555';

        left.append(checkbox, text, date);

        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.gap = '5px';

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';

        delBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        editBtn.addEventListener('click', () => {
            if (li.querySelector('input[type="text"]')) return; // уже редактируется

            const editText = document.createElement('input');
            editText.type = 'text';
            editText.value = task.text;

            const editDate = document.createElement('input');
            editDate.type = 'date';
            editDate.value = task.date || '';

            const saveBtn = document.createElement('button');
            saveBtn.textContent = '✅';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '❌';

            left.innerHTML = '';
            left.append(checkbox, editText, editDate);

            right.innerHTML = '';
            right.append(saveBtn, cancelBtn);

            saveBtn.addEventListener('click', () => {
                task.text = editText.value;
                task.date = editDate.value;
                saveTasks();
                renderTasks();
            });

            cancelBtn.addEventListener('click', renderTasks);
        });

        right.append(editBtn, delBtn);
        li.append(left, right);

        li.addEventListener('dragstart', e => {
            e.dataTransfer.setData('id', task.id);
        });

        li.addEventListener('dragover', e => {
            e.preventDefault();
        });

        li.addEventListener('drop', e => {
            const fromId = e.dataTransfer.getData('id');
            const fromIndex = tasks.findIndex(t => t.id === fromId);
            const toIndex = tasks.findIndex(t => t.id === task.id);
            const [moved] = tasks.splice(fromIndex, 1);
            tasks.splice(toIndex, 0, moved);
            saveTasks();
            renderTasks();
        });

        return li;
    }

    function renderTasks() {
        list.innerHTML = '';

        let filtered = tasks.filter(task => {
            if (filterSelect.value === 'done') return task.done;
            if (filterSelect.value === 'undone') return !task.done;
            return true;
        });

        if (searchInput.value.trim() !== '') {
            filtered = filtered.filter(task =>
                task.text.toLowerCase().includes(searchInput.value.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const aDate = a.date ? new Date(a.date) : null;
            const bDate = b.date ? new Date(b.date) : null;

            if (sortMode === 'urgent') {
                if (!aDate && !bDate) return 0;
                if (!aDate) return 1;
                if (!bDate) return -1;
                return aDate - bDate;
            } else {
                if (!aDate && !bDate) return 0;
                if (!aDate) return -1;
                if (!bDate) return 1;
                return bDate - aDate;
            }
        });

        filtered.forEach(task => list.appendChild(createTaskItem(task)));
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const newTask = {
            id: Date.now().toString(),
            text: inputText.value.trim(),
            date: inputDate.value,
            done: false
        };
        tasks.push(newTask);
        saveTasks();
        form.reset();
        renderTasks();
    });

    filterSelect.addEventListener('change', renderTasks);
    searchInput.addEventListener('input', renderTasks);

    sortBtn.addEventListener('click', () => {
        if (sortMode === 'urgent') {
            sortMode = 'delayed';
            sortBtn.textContent = 'Сначала отложенные';
        } else {
            sortMode = 'urgent';
            sortBtn.textContent = 'Сначала срочные';
        }
        renderTasks();
    });

    renderTasks();
});
