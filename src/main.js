// Данные приложения
let appData = {
    rooms: [],
    budget: 0,
    expenses: [],
    suppliers: [],
    reminders: []
};

// Загрузка данных из localStorage
function loadData() {
    const savedData = localStorage.getItem('renovationPlanner');
    if (savedData) {
        appData = JSON.parse(savedData);
    }
}

// Сохранение данных в localStorage
function saveData() {
    localStorage.setItem('renovationPlanner', JSON.stringify(appData));
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    initializeNavigation();
    initializeModals();
    renderAllSections();
    setupQuickStats();
});

// Навигация между разделами
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Убираем активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));

            // Добавляем активный класс к текущей ссылке
            this.classList.add('active');

            // Скрываем все разделы
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));

            // Показываем выбранный раздел
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Инициализация модальных окон
function initializeModals() {
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButtons = document.querySelectorAll('.close');
    const modals = document.querySelectorAll('.modal');

    // Функция для скрытия всех модальных окон
    function hideAllModals() {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            modalOverlay.style.display = 'none';
            hideAllModals();
        });
    });

    // Закрытие при клике вне модального окна
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
            hideAllModals();
        }
    });

    // Открытие модальных окон
    document.getElementById('add-room-btn').addEventListener('click', function () {
        hideAllModals();
        document.getElementById('add-room-modal').style.display = 'block';
        modalOverlay.style.display = 'flex';
    });

    document.getElementById('add-task-btn').addEventListener('click', function () {
        // Заполняем выпадающий список комнат
        const taskRoomSelect = document.getElementById('task-room');
        taskRoomSelect.innerHTML = '<option value="">Выберите комнату</option>';

        appData.rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            taskRoomSelect.appendChild(option);
        });

        hideAllModals();
        document.getElementById('add-task-modal').style.display = 'block';
        modalOverlay.style.display = 'flex';
    });

    document.getElementById('set-budget-btn').addEventListener('click', function () {
        document.getElementById('total-budget').value = appData.budget;
        hideAllModals();
        document.getElementById('set-budget-modal').style.display = 'block';
        modalOverlay.style.display = 'flex';
    });

    document.getElementById('add-expense-btn').addEventListener('click', function () {
        // Устанавливаем сегодняшнюю дату по умолчанию
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = today;

        hideAllModals();
        document.getElementById('add-expense-modal').style.display = 'block';
        modalOverlay.style.display = 'flex';
    });

    document.getElementById('add-supplier-btn').addEventListener('click', function () {
        hideAllModals();
        document.getElementById('add-supplier-modal').style.display = 'block';
        modalOverlay.style.display = 'flex';
    });

    document.getElementById('add-reminder-btn').addEventListener('click', function () {
        // Устанавливаем сегодняшнюю дату и время по умолчанию
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');

        document.getElementById('reminder-date').value = today;
        document.getElementById('reminder-time').value = time;

        hideAllModals();
        document.getElementById('add-reminder-modal').style.display = 'block';
        modalOverlay.style.display = 'flex';
    });

    // Кнопка быстрой статистики
    document.getElementById('quick-stats-btn').addEventListener('click', function () {
        updateQuickStats();
        alert('Статистика обновлена! Проверьте карточки в разделе "Задачи".');
    });

    // Обработка форм
    document.getElementById('add-room-form').addEventListener('submit', handleAddRoom);
    document.getElementById('add-task-form').addEventListener('submit', handleAddTask);
    document.getElementById('set-budget-form').addEventListener('submit', handleSetBudget);
    document.getElementById('add-expense-form').addEventListener('submit', handleAddExpense);
    document.getElementById('add-supplier-form').addEventListener('submit', handleAddSupplier);
    document.getElementById('add-reminder-form').addEventListener('submit', handleAddReminder);
}

// Обработчики форм
function handleAddRoom(e) {
    e.preventDefault();

    const roomName = document.getElementById('room-name').value;
    const roomDescription = document.getElementById('room-description').value;

    const newRoom = {
        id: Date.now().toString(),
        name: roomName,
        description: roomDescription,
        tasks: []
    };

    appData.rooms.push(newRoom);
    saveData();
    renderAllSections();

    document.getElementById('add-room-form').reset();
    document.getElementById('modal-overlay').style.display = 'none';
}

function handleAddTask(e) {
    e.preventDefault();

    const roomId = document.getElementById('task-room').value;
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskDeadline = document.getElementById('task-deadline').value;
    const taskCost = parseFloat(document.getElementById('task-cost').value) || 0;

    if (!roomId) {
        alert('Пожалуйста, выберите комнату!');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        deadline: taskDeadline,
        cost: taskCost,
        completed: false
    };

    const room = appData.rooms.find(r => r.id === roomId);
    if (room) {
        room.tasks.push(newTask);
        saveData();
        renderAllSections();
    }

    document.getElementById('add-task-form').reset();
    document.getElementById('modal-overlay').style.display = 'none';
}

function handleSetBudget(e) {
    e.preventDefault();

    const totalBudget = parseFloat(document.getElementById('total-budget').value);

    if (!isNaN(totalBudget) && totalBudget >= 0) {
        appData.budget = totalBudget;
        saveData();
        renderAllSections();
    }

    document.getElementById('set-budget-form').reset();
    document.getElementById('modal-overlay').style.display = 'none';
}

function handleAddExpense(e) {
    e.preventDefault();

    const expenseDate = document.getElementById('expense-date').value;
    const expenseCategory = document.getElementById('expense-category').value;
    const expenseDescription = document.getElementById('expense-description').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);

    const newExpense = {
        id: Date.now().toString(),
        date: expenseDate,
        category: expenseCategory,
        description: expenseDescription,
        amount: expenseAmount
    };

    appData.expenses.push(newExpense);
    saveData();
    renderAllSections();

    document.getElementById('add-expense-form').reset();
    document.getElementById('modal-overlay').style.display = 'none';
}

function handleAddSupplier(e) {
    e.preventDefault();

    const supplierName = document.getElementById('supplier-name').value;
    const supplierContact = document.getElementById('supplier-contact').value;
    const supplierPhone = document.getElementById('supplier-phone').value;
    const supplierEmail = document.getElementById('supplier-email').value;
    const supplierAddress = document.getElementById('supplier-address').value;
    const supplierSpecialization = document.getElementById('supplier-specialization').value;
    const supplierNotes = document.getElementById('supplier-notes').value;

    const newSupplier = {
        id: Date.now().toString(),
        name: supplierName,
        contact: supplierContact,
        phone: supplierPhone,
        email: supplierEmail,
        address: supplierAddress,
        specialization: supplierSpecialization,
        notes: supplierNotes
    };

    appData.suppliers.push(newSupplier);
    saveData();
    renderAllSections();

    document.getElementById('add-supplier-form').reset();
    document.getElementById('modal-overlay').style.display = 'none';
}

function handleAddReminder(e) {
    e.preventDefault();

    const reminderTitle = document.getElementById('reminder-title').value;
    const reminderDescription = document.getElementById('reminder-description').value;
    const reminderDate = document.getElementById('reminder-date').value;
    const reminderTime = document.getElementById('reminder-time').value;
    const reminderPriority = document.getElementById('reminder-priority').value;

    const newReminder = {
        id: Date.now().toString(),
        title: reminderTitle,
        description: reminderDescription,
        date: reminderDate,
        time: reminderTime,
        priority: reminderPriority,
        completed: false
    };

    appData.reminders.push(newReminder);
    saveData();
    renderAllSections();

    document.getElementById('add-reminder-form').reset();
    document.getElementById('modal-overlay').style.display = 'none';
}

// Функции отрисовки
function renderAllSections() {
    renderRooms();
    renderBudget();
    renderExpenses();
    renderSuppliers();
    renderReminders();
    updateQuickStats();
    updateProgressBar();
}

function renderRooms() {
    const roomsGrid = document.querySelector('.rooms-grid');
    roomsGrid.innerHTML = '';

    if (appData.rooms.length === 0) {
        roomsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-door-open"></i>
                <h3>Пока нет комнат</h3>
                <p>Добавьте первую комнату, чтобы начать планирование ремонта</p>
            </div>
        `;
        return;
    }

    appData.rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';

        let tasksHtml = '';
        if (room.tasks.length === 0) {
            tasksHtml = `
                <div class="empty-tasks">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Задачи для этой комнаты пока не добавлены</p>
                </div>
            `;
        } else {
            tasksHtml = '<ul class="task-list">';
            room.tasks.forEach(task => {
                const priorityClass = `priority-${task.priority}`;
                const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : 'Не установлен';
                const completedClass = task.completed ? 'completed' : '';

                tasksHtml += `
                    <li class="task-item ${completedClass}">
                        <div class="task-info">
                            <h4>${task.name}</h4>
                            <p>${task.description || ''}</p>
                            <div class="task-meta">
                                <span><i class="fas fa-calendar"></i> ${deadline}</span>
                                <span><i class="fas fa-ruble-sign"></i> ${task.cost} ₽</span>
                                <span class="task-priority ${priorityClass}">${getPriorityText(task.priority)}</span>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="complete-task" data-room="${room.id}" data-task="${task.id}" title="${task.completed ? 'Вернуть в работу' : 'Отметить выполненной'}">
                                <i class="fas ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
                            </button>
                            <button class="delete-task" data-room="${room.id}" data-task="${task.id}" title="Удалить задачу">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </li>
                `;
            });
            tasksHtml += '</ul>';
        }

        roomCard.innerHTML = `
            <div class="room-header">
                <h3 class="room-title">${room.name}</h3>
                <button class="delete-room" data-room="${room.id}" title="Удалить комнату">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="room-content">
                <p>${room.description || 'Описание не добавлено'}</p>
                ${tasksHtml}
            </div>
        `;

        roomsGrid.appendChild(roomCard);
    });

    // Добавляем обработчики событий для кнопок удаления и завершения задач
    attachRoomEventHandlers();
}

function renderBudget() {
    // Обновляем сводку бюджета
    document.querySelector('.total-budget').textContent = `${formatCurrency(appData.budget)}`;

    const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.querySelector('.spent').textContent = `${formatCurrency(totalSpent)}`;

    const remaining = appData.budget - totalSpent;
    document.querySelector('.remaining').textContent = `${formatCurrency(remaining)}`;

    // Обновляем цвет остатка в зависимости от значения
    const remainingElement = document.querySelector('.remaining');
    if (remaining < 0) {
        remainingElement.style.color = '#e63946';
    } else if (remaining < appData.budget * 0.2) {
        remainingElement.style.color = '#f8961e';
    } else {
        remainingElement.style.color = '#4cc9f0';
    }
}

function renderExpenses() {
    const expensesTableBody = document.getElementById('expenses-table-body');
    expensesTableBody.innerHTML = '';

    if (appData.expenses.length === 0) {
        expensesTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">
                    <i class="fas fa-receipt"></i>
                    <p>Расходы пока не добавлены</p>
                </td>
            </tr>
        `;
        return;
    }

    // Сортируем расходы по дате (от новых к старым)
    const sortedExpenses = [...appData.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        const date = new Date(expense.date).toLocaleDateString('ru-RU');

        row.innerHTML = `
            <td>${date}</td>
            <td>
                <span class="category-badge category-${expense.category}">
                    ${getCategoryText(expense.category)}
                </span>
            </td>
            <td>${expense.description}</td>
            <td class="expense-amount">${formatCurrency(expense.amount)}</td>
            <td>
                <span class="delete-expense" data-expense="${expense.id}" title="Удалить расход">
                    <i class="fas fa-trash"></i>
                </span>
            </td>
        `;

        expensesTableBody.appendChild(row);
    });

    // Добавляем обработчики событий для удаления расходов
    document.querySelectorAll('.delete-expense').forEach(span => {
        span.addEventListener('click', function () {
            const expenseId = this.getAttribute('data-expense');
            deleteExpense(expenseId);
        });
    });
}

function renderSuppliers() {
    const suppliersGrid = document.querySelector('.suppliers-grid');
    suppliersGrid.innerHTML = '';

    if (appData.suppliers.length === 0) {
        suppliersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-truck"></i>
                <h3>Пока нет поставщиков</h3>
                <p>Добавьте первого поставщика для удобного отслеживания контактов</p>
            </div>
        `;
        return;
    }

    appData.suppliers.forEach(supplier => {
        const supplierCard = document.createElement('div');
        supplierCard.className = 'supplier-card';

        let contactInfo = '';
        if (supplier.phone || supplier.email || supplier.address) {
            contactInfo = '<div class="supplier-contact-info">';
            if (supplier.phone) contactInfo += `<p><i class="fas fa-phone"></i> <strong>Телефон:</strong> ${supplier.phone}</p>`;
            if (supplier.email) contactInfo += `<p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${supplier.email}</p>`;
            if (supplier.address) contactInfo += `<p><i class="fas fa-map-marker-alt"></i> <strong>Адрес:</strong> ${supplier.address}</p>`;
            contactInfo += '</div>';
        }

        supplierCard.innerHTML = `
            <div class="supplier-header">
                <h3 class="supplier-name">${supplier.name}</h3>
                <button class="delete-supplier" data-supplier="${supplier.id}" title="Удалить поставщика">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${supplier.contact ? `<p><i class="fas fa-user"></i> <strong>Контактное лицо:</strong> ${supplier.contact}</p>` : ''}
            ${contactInfo}
            ${supplier.specialization ? `<span class="supplier-specialization">${supplier.specialization}</span>` : ''}
            ${supplier.notes ? `<p class="supplier-notes"><strong>Примечания:</strong> ${supplier.notes}</p>` : ''}
        `;

        suppliersGrid.appendChild(supplierCard);
    });

    // Добавляем обработчики событий для удаления поставщиков
    document.querySelectorAll('.delete-supplier').forEach(button => {
        button.addEventListener('click', function () {
            const supplierId = this.getAttribute('data-supplier');
            deleteSupplier(supplierId);
        });
    });
}

function renderReminders() {
    const remindersGrid = document.querySelector('.reminders-grid');
    remindersGrid.innerHTML = '';

    if (appData.reminders.length === 0) {
        remindersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell"></i>
                <h3>Пока нет напоминаний</h3>
                <p>Добавьте первое напоминание, чтобы не пропустить важные события</p>
            </div>
        `;
        return;
    }

    // Сортируем напоминания по дате и времени
    const sortedReminders = [...appData.reminders].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    sortedReminders.forEach(reminder => {
        const reminderCard = document.createElement('div');
        reminderCard.className = 'reminder-card';

        const priorityClass = `priority-${reminder.priority}`;
        const dateTime = new Date(`${reminder.date}T${reminder.time}`);
        const isOverdue = dateTime < new Date() && !reminder.completed;
        const overdueClass = isOverdue ? 'overdue' : '';

        reminderCard.innerHTML = `
            <div class="reminder-header">
                <h3 class="reminder-title ${overdueClass}">${reminder.title}</h3>
                <button class="delete-reminder" data-reminder="${reminder.id}" title="Удалить напоминание">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p>${reminder.description || 'Описание не добавлено'}</p>
            <div class="reminder-date ${overdueClass}">
                <i class="fas fa-clock"></i>
                ${dateTime.toLocaleString('ru-RU')}
                ${isOverdue ? '<span class="overdue-badge">ПРОСРОЧЕНО</span>' : ''}
            </div>
            <span class="reminder-priority ${priorityClass}">${getPriorityText(reminder.priority)}</span>
        `;

        remindersGrid.appendChild(reminderCard);
    });

    // Добавляем обработчики событий для удаления напоминаний
    document.querySelectorAll('.delete-reminder').forEach(button => {
        button.addEventListener('click', function () {
            const reminderId = this.getAttribute('data-reminder');
            deleteReminder(reminderId);
        });
    });
}

// Вспомогательные функции
function getPriorityText(priority) {
    switch (priority) {
        case 'high': return 'Высокий';
        case 'medium': return 'Средний';
        case 'low': return 'Низкий';
        default: return 'Не указан';
    }
}

function getCategoryText(category) {
    const categories = {
        'материалы': 'Материалы',
        'работа': 'Работа',
        'мебель': 'Мебель',
        'техника': 'Техника',
        'другое': 'Другое'
    };
    return categories[category] || category;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function attachRoomEventHandlers() {
    document.querySelectorAll('.delete-room').forEach(button => {
        button.addEventListener('click', function () {
            const roomId = this.getAttribute('data-room');
            deleteRoom(roomId);
        });
    });

    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', function () {
            const roomId = this.getAttribute('data-room');
            const taskId = this.getAttribute('data-task');
            deleteTask(roomId, taskId);
        });
    });

    document.querySelectorAll('.complete-task').forEach(button => {
        button.addEventListener('click', function () {
            const roomId = this.getAttribute('data-room');
            const taskId = this.getAttribute('data-task');
            completeTask(roomId, taskId);
        });
    });
}

function updateQuickStats() {
    // Подсчет общей статистики по задачам
    let totalTasks = 0;
    let completedTasks = 0;

    appData.rooms.forEach(room => {
        totalTasks += room.tasks.length;
        completedTasks += room.tasks.filter(task => task.completed).length;
    });

    const pendingTasks = totalTasks - completedTasks;

    // Обновление карточек статистики
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
}

function updateProgressBar() {
    let totalTasks = 0;
    let completedTasks = 0;

    appData.rooms.forEach(room => {
        totalTasks += room.tasks.length;
        completedTasks += room.tasks.filter(task => task.completed).length;
    });

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-indicator strong');

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }
}

// Функции удаления
function deleteRoom(roomId) {
    if (confirm('Вы уверены, что хотите удалить эту комнату? Все задачи в ней также будут удалены.')) {
        appData.rooms = appData.rooms.filter(room => room.id !== roomId);
        saveData();
        renderAllSections();
    }
}

function deleteTask(roomId, taskId) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        const room = appData.rooms.find(r => r.id === roomId);
        if (room) {
            room.tasks = room.tasks.filter(task => task.id !== taskId);
            saveData();
            renderAllSections();
        }
    }
}

function completeTask(roomId, taskId) {
    const room = appData.rooms.find(r => r.id === roomId);
    if (room) {
        const task = room.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveData();
            renderAllSections();
        }
    }
}

function deleteExpense(expenseId) {
    if (confirm('Вы уверены, что хотите удалить этот расход?')) {
        appData.expenses = appData.expenses.filter(expense => expense.id !== expenseId);
        saveData();
        renderAllSections();
    }
}

function deleteSupplier(supplierId) {
    if (confirm('Вы уверены, что хотите удалить этого поставщика?')) {
        appData.suppliers = appData.suppliers.filter(supplier => supplier.id !== supplierId);
        saveData();
        renderAllSections();
    }
}

function deleteReminder(reminderId) {
    if (confirm('Вы уверены, что хотите удалить это напоминание?')) {
        appData.reminders = appData.reminders.filter(reminder => reminder.id !== reminderId);
        saveData();
        renderAllSections();
    }
}

// Настройка быстрой статистики
function setupQuickStats() {
    updateQuickStats();
    updateProgressBar();
}