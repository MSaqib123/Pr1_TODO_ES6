export class TodoModel {
    #todos = [];
    #categories = ['personal', 'work', 'urgent', 'other'];
    #priorities = ['low', 'medium', 'high'];

    constructor() {
        this.loadTodos();
    }

    getTodos() {
        return this.#todos;
    }

    getCategories() {
        return this.#categories;
    }

    getPriorities() {
        return this.#priorities;
    }

    addTodo(todo) {
        this.#todos.push({
            id: crypto.randomUUID(),
            title: todo.title,
            category: todo.category,
            dueDate: todo.dueDate || null,
            priority: todo.priority || 'low',
            completed: false,
            createdAt: new Date().toISOString()
        });
        this.#persistTodos();
    }

    toggleTodo(id) {
        const todo = this.#todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.#persistTodos();
        }
    }

    deleteTodo(id) {
        this.#todos = this.#todos.filter(t => t.id !== id);
        this.#persistTodos();
    }

    updateTodoOrder(newOrder) {
        this.#todos = newOrder.map(id => this.#todos.find(t => t.id === id));
        this.#persistTodos();
    }

    clearCompleted() {
        this.#todos = this.#todos.filter(t => !t.completed);
        this.#persistTodos();
    }

    searchTodos(query) {
        return this.#todos.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
    }

    filterTodos({ category = 'all', status = 'all', priority = 'all' }) {
        let filtered = [...this.#todos];
        if (category !== 'all') {
            filtered = filtered.filter(t => t.category === category);
        }
        if (status !== 'all') {
            filtered = filtered.filter(t => t.completed === (status === 'completed'));
        }
        if (priority !== 'all') {
            filtered = filtered.filter(t => t.priority === priority);
        }
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    #persistTodos() {
        localStorage.setItem('todos', JSON.stringify(this.#todos));
    }

    loadTodos() {
        const stored = localStorage.getItem('todos');
        if (stored) {
            this.#todos = JSON.parse(stored);
        }
    }
}