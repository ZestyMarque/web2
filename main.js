document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('header');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '20px';
    header.style.backgroundColor = '#fff';
    header.style.borderBottom = '2px solid #2e8b57';

    const title = document.createElement('h1');
    title.textContent = 'ToDoList';
    title.style.color = '#2e8b57';
    title.style.margin = '0';

    header.appendChild(title);
    document.body.appendChild(header);

    const main = document.createElement('main');
    main.style.padding = '20px';
    document.body.appendChild(main);

    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.gap = '10px';
    form.style.marginBottom = '20px';
    form.style.flexWrap = 'wrap';

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'Введите задачу';
    taskInput.required = true;
    taskInput.style.flex = '1';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';

    const addButton = document.createElement('button');
    addButton.textContent = 'Создать задачу';
    addButton.style.backgroundColor = '#2e8b57';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.padding = '10px 15px';
    addButton.style.borderRadius = '6px';
    addButton.style.cursor = 'pointer';

    form.append(taskInput, dateInput, addButton);
    main.appendChild(form);


    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.gap = '10px';
    controls.style.marginBottom = '20px';

    const filterSelect = document.createElement('select');
    filterSelect.innerHTML = `
        <option value="all">Все</option>
        <option value="done">Выполненные</option>
        <option value="undone">Невыполненные</option>
    `;
    filterSelect.style.padding = '8px';

    const sortButton = document.createElement('button');
    sortButton.textContent = 'Сначала срочные';
    sortButton.style.backgroundColor = '#2e8b57';
    sortButton.style.color = 'white';
    sortButton.style.border = 'none';
    sortButton.style.padding = '8px 12px';
    sortButton.style.borderRadius = '6px';
    sortButton.style.cursor = 'pointer';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск по названию';
    searchInput.style.flex = '1';
    searchInput.style.padding = '8px';

    controls.append(filterSelect, sortButton, searchInput);
    main.appendChild(controls);

    // Список задач
    const taskList = document.createElement('ul');
    taskList.style.listStyle = 'none';
    taskList.style.padding = '0';
    taskList.style.margin = '0';
    main.appendChild(taskList);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let sortMode = 'urgent';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskItem(task) {
        const li = document.createElement('li');
        li.draggable = true;
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.padding = '10px';
        li.style.marginBottom = '8px';
        li.style.border = '1px solid #ccc';
        li.style.borderRadius = '8px';
        li.dataset.id = task.id;

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = task.done;

        const text = document.createElement('span');
        text.textContent = task.text;

        const date = document.createElement('span');
        date.textContent = task.date || 'Без срока';
        date.style.color = '#555';
        date.style.fontSize = '0.9em';

        if (task.done) {
            text.style.textDecoration = 'line-through';
            text.style.color = 'gray';
        }

        check.addEventListener('change', () => {
            task.done = check.checked;
            saveTasks();
            renderTasks();
        });

        left.append(check, text, date);

        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.gap = '5px';

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.style.cursor = 'pointer';

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.style.cursor = 'pointer';

        delBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        // редактирование
        editBtn.addEventListener('click', () => {
            if (li.querySelector('input[type="text"]')) return;

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
            left.append(check, editText, editDate);
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
        li.addEventListener('dragover', e => e.preventDefault());
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
        taskList.innerHTML = '';

        let filtered = tasks.filter(t => {
            if (filterSelect.value === 'done') return t.done;
            if (filterSelect.value === 'undone') return !t.done;
            return true;
        });

        if (searchInput.value.trim()) {
            filtered = filtered.filter(t =>
                t.text.toLowerCase().includes(searchInput.value.toLowerCase())
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

        filtered.forEach(task => taskList.appendChild(createTaskItem(task)));
    }

    form.addEventListener('submit', e => {
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

    sortButton.addEventListener('click', () => {
        if (sortMode === 'urgent') {
            sortMode = 'delayed';
            sortButton.textContent = 'Сначала отложенные';
        } else {
            sortMode = 'urgent';
            sortButton.textContent = 'Сначала срочные';
        }
        renderTasks();
    });

    filterSelect.addEventListener('change', renderTasks);
    searchInput.addEventListener('input', renderTasks);

    renderTasks();
});
