// export class View {
//     _parentElement;
//     _data;

//     render(data, render = true) {
//         if (!data || (Array.isArray(data) && data.length === 0)) return this.renderMessage('No tasks found.');

//         this._data = data;
//         const markup = this._generateMarkup();
//         if (!render) return markup;

//         this._clear();
//         this._parentElement.insertAdjacentHTML('afterbegin', markup);
//     }

//     _clear() {
//         this._parentElement.innerHTML = '';
//     }

//     renderSpinner() {
//         const markup = `
//             <div class="flex justify-center items-center py-6">
//                 <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//                     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
//                 </svg>
//             </div>
//         `;
//         this._clear();
//         this._parentElement.insertAdjacentHTML('afterbegin', markup);
//     }

//     renderMessage(message) {
//         const markup = `
//             <div class="text-center py-6 text-gray-600">
//                 <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 <p class="mt-2">${message}</p>
//             </div>
//         `;
//         this._clear();
//         this._parentElement.insertAdjacentHTML('afterbegin', markup);
//     }
// }

// export class TaskView extends View {
//     _parentElement = document.querySelector('.task-list');

//     _generateMarkup() {
//         return this._data.map(todo => `
//             <li class="task-card bg-gray-100 p-4 rounded-lg flex justify-between items-center priority-${todo.priority} ${todo.completed ? 'completed' : ''}" data-id="${todo.id}" draggable="true">
//                 <div class="flex items-center space-x-3">
//                     <input type="checkbox" class="toggle-task h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" ${todo.completed ? 'checked' : ''}>
//                     <div>
//                         <h3 class="text-lg font-semibold ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}">${todo.title}</h3>
//                         <p class="text-sm text-gray-600">Category: ${todo.category} | Priority: ${todo.priority} ${todo.dueDate ? `| Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}</p>
//                     </div>
//                 </div>
//                 <button class="btn-delete-task text-red-500 hover:text-red-700">
//                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
//                     </svg>
//                 </button>
//             </li>
//         `).join('');
//     }

//     addHandlerToggleTask(handler) {
//         this._parentElement.addEventListener('change', e => {
//             if (e.target.classList.contains('toggle-task')) {
//                 const id = e.target.closest('.task-card').dataset.id;
//                 handler(id);
//             }
//         });
//     }

//     addHandlerDeleteTask(handler) {
//         this._parentElement.addEventListener('click', e => {
//             if (e.target.closest('.btn-delete-task')) {
//                 const id = e.target.closest('.task-card').dataset.id;
//                 handler(id);
//             }
//         });
//     }

//     addHandlerDragAndDrop(handler) {
//         this._parentElement.addEventListener('dragstart', e => {
//             if (e.target.classList.contains('task-card')) {
//                 e.target.classList.add('dragged');
//                 this._parentElement.classList.add('dragging');
//                 e.dataTransfer.setData('text/plain', e.target.dataset.id);
//             }
//         });

//         this._parentElement.addEventListener('dragend', e => {
//             if (e.target.classList.contains('task-card')) {
//                 e.target.classList.remove('dragged');
//                 this._parentElement.classList.remove('dragging');
//             }
//         });

//         this._parentElement.addEventListener('dragover', e => {
//             e.preventDefault();
//         });

//         this._parentElement.addEventListener('drop', e => {
//             e.preventDefault();
//             const draggedId = e.dataTransfer.getData('text/plain');
//             const target = e.target.closest('.task-card');
//             if (!target || target.dataset.id === draggedId) return;

//             const allTasks = Array.from(this._parentElement.querySelectorAll('.task-card'));
//             const newOrder = allTasks
//                 .map(task => task.dataset.id)
//                 .filter(id => id !== draggedId);
//             const targetIndex = newOrder.indexOf(target.dataset.id);
//             newOrder.splice(targetIndex, 0, draggedId);
//             handler(newOrder);
//         });
//     }
// }

// export class AddTaskView extends View {
//     _parentElement = document.querySelector('.add-task');

//     addHandlerAddTask(handler) {
//         this._parentElement.addEventListener('submit', e => {
//             e.preventDefault();
//             const formData = new FormData(this._parentElement);
//             const todo = {
//                 title: formData.get('task-title'),
//                 category: formData.get('category'),
//                 dueDate: formData.get('due-date'),
//                 priority: formData.get('priority')
//             };
//             handler(todo);
//             this._parentElement.reset();
//         });
//     }
// }

// export class SearchView extends View {
//     _parentElement = document.querySelector('.search');

//     addHandlerSearch(handler) {
//         this._parentElement.querySelector('.search__field').addEventListener('input', e => {
//             handler(e.target.value);
//         });
//     }
// }

// export class FilterView extends View {
//     _parentElement = document.querySelector('.filters');

//     addHandlerFilter(handler) {
//         this._parentElement.querySelectorAll('select').forEach(el => {
//             el.addEventListener('change', () => {
//                 const filters = {
//                     category: this._parentElement.querySelector('.filter-category').value,
//                     status: this._parentElement.querySelector('.filter-status').value,
//                     priority: this._parentElement.querySelector('.filter-priority').value
//                 };
//                 handler(filters);
//             });
//         });
//     }

//     addHandlerClearCompleted(handler) {
//         this._parentElement.querySelector('.btn-clear-completed').addEventListener('click', handler);
//     }
// }