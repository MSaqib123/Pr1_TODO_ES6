export class View {
    _parentElement;
    _data;

    constructor() {
        this._validateParentElement();
    }

    _validateParentElement() {
        if (!this._parentElement) {
            throw new Error('Parent element not found. Ensure the selector is correct.');
        }
    }

    render(data, render = true) {
        try {
            if (!data || (Array.isArray(data) && data.length === 0)) {
                return this.renderMessage('No data available.');
            }

            this._data = data;
            const markup = this._generateMarkup();
            if (!render) return markup;

            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin', markup);
        } catch (err) {
            console.error('Render error:', err);
            this.renderMessage('Error rendering content. Please try again.');
        }
    }

    update(data) {
        try {
            this._data = data;
            const newMarkup = this._generateMarkup();
            const newDOM = document.createRange().createContextualFragment(newMarkup);
            const newElements = Array.from(newDOM.querySelectorAll('*'));
            const curElements = Array.from(this._parentElement.querySelectorAll('*'));

            newElements.forEach((newEl, i) => {
                const curEl = curElements[i];
                if (!newEl.isEqualNode(curEl)) {
                    if (newEl.firstChild?.nodeValue?.trim()) {
                        curEl.textContent = newEl.textContent;
                    }
                    Array.from(newEl.attributes).forEach(attr => {
                        curEl.setAttribute(attr.name, attr.value);
                    });
                }
            });
        } catch (err) {
            console.error('Update error:', err);
            this.renderMessage('Error updating content.');
        }
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
            <div class="flex justify-center items-center py-6">
                <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message) {
        const markup = `
            <div class="text-center py-6 text-gray-600">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="mt-2">${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    addEventDelegate(selector, eventType, handler) {
        this._parentElement.addEventListener(eventType, e => {
            const target = e.target.closest(selector);
            if (target) {
                handler(e, target);
            }
        });
    }
}