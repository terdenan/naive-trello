import { createElement, removeChildren } from "../utils/index.js";


function getBasicColumn() {
    const el =
        createElement(
            'div',
            {class: 'column app__column'},
            null,
            [
                createElement('div', {class: 'column__title'}, null, [this.title]),
                createElement(
                    'div',
                    {class: 'cards-list column__cards-list'},
                    null,
                    this.cards.map((card, index) =>
                        createElement(
                            'app-card',
                            {key: index},
                            {
                                ...card,
                                onEnterHandler: this.onEnterHandler.bind(this)
                            }
                        )
                    )
                ),
                createElement(
                    'column-footer',
                    {active: this.footerIsActive},
                    {
                        buttonClick: this.createCard.bind(this),
                        footerClick: this.addEditableCard.bind(this),
                        crossClick: this.removeNewCard.bind(this),
                        buttonText: 'Добавить карточку',
                        spanText: 'Добавить еще одну карточку'
                    }
                )
            ]
        );

    return el;
}

function getEditableColumn() {
    const el =
        createElement(
            'div',
            {class: 'column app__column'},
            null,
            [
                createElement(
                    'div',
                    {class: 'cards-list column__cards-list'},
                    null,
                    this.cards.map((card, index) =>
                        createElement(
                            'app-card',
                            null,
                            {
                                ...card,
                                columnCreation: true,
                                onEnterHandler: this.onEnterHandler.bind(this)
                            },
                        )
                    )
                ),
                createElement(
                    'column-footer',
                    {active: this.footerIsActive},
                    {
                        footerClick: this.addEditableCard.bind(this),
                        crossClick: this.removeNewCard.bind(this),
                        buttonClick: this.createColumn.bind(this),
                        buttonText: 'Добавить колонку',
                        spanText: 'Добавить еще одну колонку',
                    }
                )
            ]
        );
    return el;
}

export class AppColumn extends HTMLElement {

    constructor() {
        super();
        this._getColumn = getBasicColumn.bind(this);
        this.footerIsActive = false;
    }

    get editable() {
        return this._editable || false;
    }

    set editable(val) {
        this._editable = val;

        if (val === true) {
            this._getColumn = getEditableColumn.bind(this);
        }
        else {
            this._getColumn = getBasicColumn.bind(this);
        }

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
        this.insertCard({ body: cardBody });

        this._render();
        this._currentNewCard = null;
    }

    addEditableCard() {
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

    onEnterHandler() {
        if (this.editable) {
            this.createColumn();
        }
        else {
            this.createCard();
        }
    }

    _render() {
        removeChildren(this);
        const el = this._getColumn();
        this.appendChild(el);
    }
}