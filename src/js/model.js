export class TodoModel {
    #todos = [];
    #categories = ['personal', 'work', 'urgent', 'other'];
    #priorities = ['low', 'medium', 'high'];
    #recurrenceTypes = ['none', 'daily', 'weekly', 'monthly'];

    constructor() {
        this.loadTodos();
        this.#handleRecurrence();
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

    getRecurrenceTypes() {
        return this.#recurrenceTypes;
    }

    addTodo(todo) {
        if (todo.startTime && todo.endTime && todo.startTime >= todo.endTime) {
            throw new Error('End time must be after start time.');
        }

        const newTodo = {
            id: crypto.randomUUID(),
            title: todo.title,
            category: todo.category,
            dueDate: todo.dueDate || null,
            priority: todo.priority || 'low',
            recurrence: todo.recurrence || 'none',
            startTime: todo.startTime || null,
            endTime: todo.endTime || null,
            completed: false,
            createdAt: new Date().toISOString(),
            lastRecurrence: todo.dueDate ? new Date(todo.dueDate).toISOString() : null
        };

        this.#todos.push(newTodo);
        this.#persistTodos();
    }

    toggleTodo(id) {
        const todo = this.#todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            if (todo.completed && todo.recurrence !== 'none') {
                this.#generateNextRecurrence(todo);
            }
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

    filterTodos({ category = 'all', status = 'all', priority = 'all', recurrence = 'all' }) {
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
        if (recurrence !== 'all') {
            filtered = filtered.filter(t => t.recurrence === recurrence);
        }
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    #generateNextRecurrence(todo) {
        if (!todo.dueDate || todo.recurrence === 'none') return;

        const currentDue = new Date(todo.dueDate);
        let nextDue;

        switch (todo.recurrence) {
            case 'daily':
                nextDue = new Date(currentDue.setDate(currentDue.getDate() + 1));
                break;
            case 'weekly':
                nextDue = new Date(currentDue.setDate(currentDue.getDate() + 7));
                break;
            case 'monthly':
                nextDue = new Date(currentDue.setMonth(currentDue.getMonth() + 1));
                break;
            default:
                return;
        }

        const newTodo = {
            ...todo,
            id: crypto.randomUUID(),
            dueDate: nextDue.toISOString().split('T')[0],
            completed: false,
            createdAt: new Date().toISOString(),
            lastRecurrence: nextDue.toISOString()
        };

        this.#todos.push(newTodo);
    }

    #handleRecurrence() {
        const today = new Date().toISOString().split('T')[0];
        this.#todos.forEach(todo => {
            if (todo.recurrence !== 'none' && todo.dueDate < today && !todo.completed) {
                this.#generateNextRecurrence(todo);
            }
        });
        this.#persistTodos();
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