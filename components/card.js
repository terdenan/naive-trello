import { createElement } from "../utils/index.js";


export class AppCard extends HTMLElement {

    get body() {
        return this._body;
    }

    set body(val) {
        this._body = val;
    }

    get editable() {
        return this._editable || false;
    }

    set editable(val) {
        this._editable = val;
        this._render();
    }

    connectedCallback() {
        this._render();
    }

    sourceAttributes() {
        return {
            body: this.body,
            editable: this.editable
        }
    }

    _render() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        const body = this.body;

        let el;
        if (this.editable) {
            el = createElement(
                'div',
                {class: 'card cards-list__card'},
                null,
                [
                    createElement(
                        'div',
                        {
                            class: 'card__input',
                            contentEditable: true,
                            placeholder: 'Введите название карточки'
                        },
                        null
                    )
                ]
            );
        }
        else {
            el = createElement(
                'div',
                {class: 'card cards-list__card'},
                null,
                [
                    createElement(
                        'div',
                        {class: 'card__content'},
                        null,
                        [body]
                    )
                ]
            );
        }
        this.appendChild(el);
    }
}