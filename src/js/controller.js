import { TodoModel } from './model.js';
import { RoutineModel } from './routineModel.js';
import { TaskView } from './views/components/taskView.js';
import { AddTaskView } from './views/components/addTaskView.js';
import { SearchView } from './views/components/searchView.js';
import { FilterView } from './views/components/filterView.js';
import { RoutineView } from './views/components/routineView.js';
import { AddRoutineView } from './views/components/addRoutineView.js';

class TodoController {
    #model = new TodoModel();
    #routineModel;
    #taskView = new TaskView();
    #addTaskView = new AddTaskView();
    #searchView = new SearchView();
    #filterView = new FilterView();
    #routineView = new RoutineView();
    #addRoutineView = new AddRoutineView();
    #currentTab = 'tasks-tab';

    constructor() {
        try {
            this.#routineModel = new RoutineModel();
        } catch (err) {
            console.error('Failed to initialize RoutineModel:', err);
            this.#routineView.renderMessage('Error loading routines. Please refresh the page.');
        }
        this.#init();
    }

    #init() {
        // Initialize tabs first to ensure UI renders
        this.#taskView.setupTabs(this.#controlTabChange.bind(this));
        this.#addTaskView.addHandlerAddTask(this.#controlAddTask.bind(this));
        this.#taskView.addHandlerToggleTask(this.#controlToggleTask.bind(this));
        this.#taskView.addHandlerDeleteTask(this.#controlDeleteTask.bind(this));
        this.#taskView.addHandlerDragAndDrop(this.#controlUpdateOrder.bind(this));
        this.#searchView.addHandlerSearch(this.#controlSearch.bind(this));
        this.#filterView.addHandlerFilter(this.#controlFilter.bind(this));
        this.#filterView.addHandlerClearCompleted(this.#controlClearCompleted.bind(this));
        this.#addRoutineView.addHandlerAddRoutine(this.#controlAddRoutine.bind(this));
        this.#routineView.addHandlerDeleteRoutine(this.#controlDeleteRoutine.bind(this));
        this.#controlFilter({ category: 'all', status: 'all', priority: 'all', recurrence: 'all' });
        if (this.#routineModel) {
            this.#routineView.render(this.#routineModel.getRoutines());
            this.#setupAlarms();
        }
    }

    async #setupAlarms() {
        const permission = await this.#routineView.requestNotificationPermission();
        if (!permission) {
            this.#routineView.renderMessage('Notifications not enabled. Please allow notifications for alarms.');
            return;
        }

        setInterval(() => {
            const now = new Date();
            // Adjust for PKT (UTC+5)
            const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour12: false }).slice(0, 5); // HH:MM
            const routines = this.#routineModel.checkAlarms(currentTime);
            routines.forEach(routine => {
                this.#routineView.showNotification(routine.title, {
                    body: `Time to start your routine! ${routine.notes ? `Notes: ${routine.notes}` : ''}`,
                    icon: 'https://via.placeholder.com/32',
                    requireInteraction: true
                });
            });
        }, 60000); // Check every minute
    }

    #controlAddTask(todo) {
        try {
            this.#model.addTodo(todo);
            this.#renderTasks();
        } catch (err) {
            this.#addTaskView.renderMessage(err.message);
        }
    }

    #controlToggleTask(id) {
        this.#model.toggleTodo(id);
        this.#renderTasks();
    }

    #controlDeleteTask(id) {
        this.#model.deleteTodo(id);
        this.#renderTasks();
    }

    #controlUpdateOrder(newOrder) {
        this.#model.updateTodoOrder(newOrder);
        this.#renderTasks();
    }

    #controlSearch(query) {
        const todos = query ? this.#model.searchTodos(query) : this.#model.filterTodos({
            category: document.querySelector('.filter-category').value,
            status: document.querySelector('.filter-status').value,
            priority: document.querySelector('.filter-priority').value,
            recurrence: document.querySelector('.filter-recurrence').value
        });
        this.#taskView.render(todos);
    }

    #controlFilter(filters) {
        const todos = this.#model.filterTodos(filters);
        this.#taskView.render(todos);
    }

    #controlClearCompleted() {
        this.#model.clearCompleted();
        this.#renderTasks();
    }

    #controlAddRoutine(routine) {
        if (!this.#routineModel) return;
        try {
            this.#routineModel.addRoutine(routine);
            this.#routineView.render(this.#routineModel.getRoutines());
        } catch (err) {
            this.#addRoutineView.renderMessage(err.message);
        }
    }

    #controlDeleteRoutine(id) {
        if (!this.#routineModel) return;
        this.#routineModel.deleteRoutine(id);
        this.#routineView.render(this.#routineModel.getRoutines());
    }

    #controlTabChange(tab) {
        this.#currentTab = tab;
        console.log(`Switched to tab: ${tab}`);
        if (tab === 'tasks-tab') {
            this.#renderTasks();
        } else if (tab === 'routines-tab') {
            if (this.#routineModel) {
                this.#routineView.render(this.#routineModel.getRoutines());
            } else {
                this.#routineView.renderMessage('Routines unavailable due to initialization error.');
            }
        }
    }

    #renderTasks() {
        const filters = {
            category: document.querySelector('.filter-category').value,
            status: document.querySelector('.filter-status').value,
            priority: document.querySelector('.filter-priority').value,
            recurrence: document.querySelector('.filter-recurrence').value
        };
        const todos = this.#model.filterTodos(filters);
        this.#taskView.render(todos);
    }
}

new TodoController();