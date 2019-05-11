import { createElement } from "../utils/index.js";


export class AppCard extends HTMLElement {

    get body() {
        return this._body;
    }

    set body(val) {
        this._body = val;
    }

    connectedCallback() {
        const body = this.body;
        this._render(body);
    }

    _render(body) {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        const el = createElement(
            'div',
            {class: 'card cards-list__card'},
            null,
            [
                createElement(
                    'div',
                    {class: 'card__content'},
                    null,
                    [body])
            ]
        );
        this.appendChild(el);
    }
}