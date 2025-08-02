export class RoutineModel {
    #routines = [];

    constructor() {
        this.loadRoutines();
    }

    getRoutines() {
        return this.#routines;
    }

    addRoutine(routine) {
        if (routine.startTime && routine.endTime && routine.startTime >= routine.endTime) {
            throw new Error('End time must be after start time.');
        }
        this.#routines.push({
            id: crypto.randomUUID(),
            title: routine.title,
            notes: routine.notes || null,
            startTime: routine.startTime,
            endTime: routine.endTime || null,
            createdAt: new Date().toISOString()
        });
        this.#persistRoutines();
    }

    deleteRoutine(id) {
        this.#routines = this.#routines.filter(r => r.id !== id);
        this.#persistRoutines();
    }

    checkAlarms(currentTime) {
        return this.#routines.filter(routine => routine.startTime === currentTime);
    }

    #persistRoutines() {
        localStorage.setItem('routines', JSON.stringify(this.#routines));
    }

    loadRoutines() {
        const stored = localStorage.getItem('routines');
        if (stored) {
            this.#routines = JSON.parse(stored);
        }
    }
}