import { TodoModel } from './model.js';
import { TaskView, AddTaskView, SearchView, FilterView } from './view.js';

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
        this.#controlFilter({ category: 'all', status: 'all', priority: 'all' });
    }

    #controlAddTask(todo) {
        this.#model.addTodo(todo);
        this.#renderTasks();
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
            priority: document.querySelector('.filter-priority').value
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
            priority: document.querySelector('.filter-priority').value
        };
        const todos = this.#model.filterTodos(filters);
        this.#taskView.render(todos);
    }
}

new TodoController();