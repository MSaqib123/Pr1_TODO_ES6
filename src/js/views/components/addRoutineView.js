import { View } from '../view.js';

export class AddRoutineView extends View {
    _parentElement = document.querySelector('.add-routine');

    addHandlerAddRoutine(handler) {
        this._parentElement.addEventListener('submit', e => {
            e.preventDefault();
            try {
                const data = this.getFormData(this._parentElement);
                if (!data['routine-title']) {
                    throw new Error('Routine title cannot be empty.');
                }
                if (!data['start-time']) {
                    throw new Error('Start time is required.');
                }
                const routine = {
                    title: data['routine-title'],
                    notes: data.notes,
                    startTime: data['start-time'],
                    endTime: data['end-time']
                };
                handler(routine);
                this._parentElement.reset();
            } catch (err) {
                this.renderMessage(err.message);
            }
        });
    }
}