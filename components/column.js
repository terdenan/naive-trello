import { createElement } from "../utils/index.js";


export class AppColumn extends HTMLElement {

    // get class() {
    //     return this.getAttribute('class');
    // }
    //
    // set class(val) {
    //     this.setAttribute('class', val);
    // }
    constructor() {
        super()
        this.footerIsActive = false;
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
        const isInitial = this._cards === undefined;
        this._cards = val;
        if (!isInitial) {
            this._render();
        }
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

    _render() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        const title = this.title;
        const cards = this.cards;

        const _this = this;
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
                        cards.map((card, index) => createElement('app-card', {key: index}, card))
                    ),
                    createElement(
                        'column-footer',
                        {active: this.footerIsActive},
                        {
                            createCard: _this.createCard.bind(this),
                            addNewCard: _this.addNewCard.bind(this),
                            removeNewCard: _this.removeNewCard.bind(this)
                        }
                    )
                ]
            );
        this.appendChild(el);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this._render();
    }
}