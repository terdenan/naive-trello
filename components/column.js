import { createElement } from "../utils/index.js";


export class AppColumn extends HTMLElement {

    constructor() {
        super()
        this.footerIsActive = false;
    }

    get editable() {
        return this._editable || false;
    }

    set editable(val) {
        this._editable = val;
        this._render();
    }

    get title() {
        return this._title || '';
    }

    set title(val) {
        this._title = val;
    }

    get cards() {
        return this._cards || [];
    }

    set cards(val) {
        this._cards = val;
        this._render();
    }

    connectedCallback() {
        this._render();
    }

    createCard() {
        const cardBody = this.querySelector('.card__input').innerHTML;

        if (cardBody === '') {
            return;
        }

        this.footerIsActive = false;

        this._currentNewCard.editable = false;
        this._currentNewCard.body = cardBody;

        this._render();
        this._currentNewCard = null;
    }

    addNewCard() {
        this.footerIsActive = true;
        this._currentNewCard = {
            body: '',
            editable: true
        };

        const newCards = this.cards.slice();
        newCards.push(this._currentNewCard);

        this.cards = newCards;
    }

    removeNewCard() {
        this.footerIsActive = false;
        const newCards = this.cards.filter(card => card !== this._currentNewCard);
        this.cards = newCards;
    }

    createColumn() {
        const cardBody = this.querySelector('.card__input').innerHTML;

        if (cardBody === '') {
            return;
        }

        this.footerIsActive = false;
        this.addNewColumn(cardBody);
    }

    _render() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        let el;
        const editable = this.editable;
        const title = this.title;
        const cards = this.cards;

        if (editable) {
            el =
                createElement(
                    'div',
                    {class: 'column app__column'},
                    null,
                    [
                        createElement(
                            'div',
                            {class: 'cards-list column__cards-list'},
                            null,
                            cards.map((card, index) =>
                                createElement(
                                    'app-card',
                                    {key: index},
                                    {
                                        ...card,
                                        placeholder: 'Введите название колонки',
                                        inputStyles: {
                                            'min-height': '35px',
                                            'margin-top': '8px',
                                        }
                                    }
                                )
                            )
                        ),
                        createElement(
                            'column-footer',
                            {active: this.footerIsActive},
                            {
                                footerClick: this.addNewCard.bind(this),
                                crossClick: this.removeNewCard.bind(this),
                                buttonClick: this.createColumn.bind(this),
                                buttonText: 'Добавить колонку',
                                spanText: 'Добавить еще одну колонку',
                            }
                        )
                    ]
                );
        }
        else {
            el =
                createElement(
                    'div',
                    {class: 'column app__column'},
                    null,
                    [
                        createElement('div', {class: 'column__title'}, null, [title]),
                        createElement(
                            'div',
                            {class: 'cards-list column__cards-list'},
                            null,
                            cards.map((card, index) => createElement('app-card', {key: index}, card))
                        ),
                        createElement(
                            'column-footer',
                            {active: this.footerIsActive},
                            {
                                buttonClick: this.createCard.bind(this),
                                footerClick: this.addNewCard.bind(this),
                                crossClick: this.removeNewCard.bind(this),
                                buttonText: 'Добавить карточку',
                                spanText: 'Добавить еще одну карточку'
                            }
                        )
                    ]
                );
        }
        this.appendChild(el);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this._render();
    }
}