import { createElement, obj2str, removeChildren } from "../utils/index.js";


function getEditableCard() {
    let inputStyles = {};
    let placeholder = 'Введите название карточки';

    if (this.columnCreation) {
        inputStyles = {
            'min-height': '35px',
            'margin-top': '8px',
        };
        placeholder = 'Введите название колонки';
    }

    const el = createElement(
        'div',
        {class: 'cards-list__card card card_editable'},
        null,
        [
            createElement(
                'div',
                {
                    class: 'card__input',
                    contentEditable: true,
                    placeholder: placeholder,
                    style: obj2str(inputStyles)
                },
                null
            )
        ]
    );

    return el;
}

function getBasicCard() {
    const body = this.body;
    const el = createElement(
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

    return el;
}

export class AppCard extends HTMLElement {

    constructor() {
        super();
        this._getCard = getBasicCard.bind(this);
    }

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
        const isInitial = this._editable === undefined;
        this._editable = val;

        if (val === true) {
            this._getCard = getEditableCard.bind(this);
        }
        else {
            this._getCard = getBasicCard.bind(this);
        }

        if (!isInitial) {
            this._render();
        }
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
        removeChildren(this);
        const el = this._getCard();
        this.appendChild(el);
    }
}

