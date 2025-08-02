import { TodoModel } from './model.js';
import { TaskView } from './views/components/taskView.js';
import { AddTaskView } from './views/components/addTaskView.js';
import { SearchView } from './views/components/searchView.js';
import { FilterView } from './views/components/filterView.js';

class TodoController {
    #model = new TodoModel();
    #taskView = new TaskView();
    #addTaskView = new AddTaskView();
    #searchView = new SearchView();
    #filterView = new FilterView();

    constructor() {
        this.#init();
    }

    #init() {
        this.#addTaskView.addHandlerAddTask(this.#controlAddTask.bind(this));
        this.#taskView.addHandlerToggleTask(this.#controlToggleTask.bind(this));
        this.#taskView.addHandlerDeleteTask(this.#controlDeleteTask.bind(this));
        this.#taskView.addHandlerDragAndDrop(this.#controlUpdateOrder.bind(this));
        this.#searchView.addHandlerSearch(this.#controlSearch.bind(this));
        this.#filterView.addHandlerFilter(this.#controlFilter.bind(this));
        this.#filterView.addHandlerClearCompleted(this.#controlClearCompleted.bind(this));
        this.#controlFilter({ category: 'all', status: 'all', priority: 'all', recurrence: 'all' });
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