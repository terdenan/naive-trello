import { createElement } from "../utils/index.js";


export class AppColumn extends HTMLElement {

    get class() {
        return this.getAttribute('class');
    }

    set class(val) {
        this.setAttribute('class', val);
    }

    get title() {
        return this._title;
    }

    set title(val) {
        this._title = val;
    }

    get cards() {
        return this._cards;
    }

    set cards(val) {
        this._cards = val;
    }

    connectedCallback() {
        const title = this.title;
        const cards = this.cards;
        this._render(title, cards);
    }

    _render(title, cards) {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        const el =
            createElement(
                'div',
                {class: 'column app__column'},
                null,
                [
                    createElement('div', {class: 'column__title'}, null, [title]),
                    createElement(
                        'div',
                        {class: 'cards-list'},
                        null,
                        cards.map(body => createElement('app-card', null, {body}))
                    ),
                    createElement(
                        'div',
                        {class: 'column-footer column__column-footer'},
                        null,
                        [
                            createElement('i', {class: 'icon-plus'}),
                            createElement('span', null, null, ["Добавить еще одну карточку"])
                        ])


                ]);
        this.appendChild(el);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this._render();
    }
}