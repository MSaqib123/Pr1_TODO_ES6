import { View } from '../view.js';

export class SearchView extends View {
    _parentElement = document.querySelector('.search');

    addHandlerSearch(handler) {
        this.addEventDelegate('.search__field', 'input', e => {
            handler(e.target.value.trim());
        });
    }
}