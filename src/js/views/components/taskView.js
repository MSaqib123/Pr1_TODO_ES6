import { View } from '../view.js';

export class TaskView extends View {
    _parentElement = document.querySelector('.task-list');

    _generateMarkup() {
        return this._data.map(todo => `
            <li class="task-card bg-gray-100 p-4 rounded-lg flex justify-between items-center priority-${todo.priority} recurrence-${todo.recurrence} ${todo.completed ? 'completed' : ''}" data-id="${todo.id}" draggable="true">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" class="toggle-task h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" ${todo.completed ? 'checked' : ''}>
                    <div>
                        <h3 class="text-lg font-semibold ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}">${todo.title}</h3>
                        <p class="text-sm text-gray-600">
                            Category: ${todo.category} | Priority: ${todo.priority} 
                            ${todo.dueDate ? `| Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ''} 
                            ${todo.recurrence !== 'none' ? `| Recurrence: ${todo.recurrence}` : ''} 
                            ${todo.startTime || todo.endTime ? `| Time: ${this.formatTime(todo.startTime)} - ${this.formatTime(todo.endTime)}` : ''}
                        </p>
                    </div>
                </div>
                <button class="btn-delete-task text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </li>
        `).join('');
    }

    addHandlerToggleTask(handler) {
        this.addEventDelegate('.toggle-task', 'change', (e, target) => {
            const id = target.closest('.task-card').dataset.id;
            handler(id);
        });
    }

    addHandlerDeleteTask(handler) {
        this.addEventDelegate('.btn-delete-task', 'click', (e, target) => {
            const id = target.closest('.task-card').dataset.id;
            handler(id);
        });
    }

    addHandlerDragAndDrop(handler) {
        this._parentElement.addEventListener('dragstart', e => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.add('dragged');
                this._parentElement.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
            }
        });

        this._parentElement.addEventListener('dragend', e => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragged');
                this._parentElement.classList.remove('dragging');
            }
        });

        this._parentElement.addEventListener('dragover', e => {
            e.preventDefault();
        });

        this._parentElement.addEventListener('drop', e => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const target = e.target.closest('.task-card');
            if (!target || target.dataset.id === draggedId) return;

            const allTasks = Array.from(this._parentElement.querySelectorAll('.task-card'));
            const newOrder = allTasks
                .map(task => task.dataset.id)
                .filter(id => id !== draggedId);
            const targetIndex = newOrder.indexOf(target.dataset.id);
            newOrder.splice(targetIndex, 0, draggedId);
            handler(newOrder);
        });
    }
}