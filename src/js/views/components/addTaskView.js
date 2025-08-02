import { View } from '../view.js';

export class AddTaskView extends View {
    _parentElement = document.querySelector('.add-task');

    addHandlerAddTask(handler) {
        this._parentElement.addEventListener('submit', e => {
            e.preventDefault();
            try {
                const formData = new FormData(this._parentElement);
                const todo = {
                    title: formData.get('task-title'),
                    category: formData.get('category'),
                    dueDate: formData.get('due-date'),
                    priority: formData.get('priority')
                };
                if (!todo.title.trim()) {
                    throw new Error('Task title cannot be empty.');
                }
                handler(todo);
                this._parentElement.reset();
            } catch (err) {
                this.renderMessage(err.message);
            }
        });
    }
}