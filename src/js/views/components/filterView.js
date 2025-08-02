import { View } from '../view.js';

export class FilterView extends View {
    _parentElement = document.querySelector('.filters');

    addHandlerFilter(handler) {
        this._parentElement.querySelectorAll('select').forEach(el => {
            el.addEventListener('change', () => {
                try {
                    const filters = {
                        category: this._parentElement.querySelector('.filter-category').value,
                        status: this._parentElement.querySelector('.filter-status').value,
                        priority: this._parentElement.querySelector('.filter-priority').value
                    };
                    handler(filters);
                } catch (err) {
                    console.error('Filter error:', err);
                    this.renderMessage('Error applying filters.');
                }
            });
        });
    }

    addHandlerClearCompleted(handler) {
        this.addEventDelegate('.btn-clear-completed', 'click', () => {
            handler();
        });
    }
}