import { View } from '../view.js';

export class RoutineView extends View {
    _parentElement = document.querySelector('.routine-list');

    _generateMarkup() {
        return this._data.map(routine => `
            <li class="routine-card bg-gray-100 p-4 rounded-lg flex justify-between items-center" data-id="${routine.id}">
                <div class="flex flex-col">
                    <h3 class="text-lg font-semibold text-gray-800">${routine.title}</h3>
                    <p class="text-sm text-gray-600">
                        Time: ${this.formatTime(routine.startTime)} ${routine.endTime ? `- ${this.formatTime(routine.endTime)}` : ''} 
                        ${routine.notes ? `| Notes: ${routine.notes}` : ''}
                    </p>
                </div>
                <button class="btn-delete-routine text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </li>
        `).join('');
    }

    addHandlerDeleteRoutine(handler) {
        this.addEventDelegate('.btn-delete-routine', 'click', (e, target) => {
            const id = target.closest('.routine-card').dataset.id;
            handler(id);
        });
    }
}