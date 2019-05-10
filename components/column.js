const template = document.createElement('template');


function getTemplate(title='Название карточки', cards=[]) {
    const renderedCards = cards.map(body => `<app-card body="${body}"></app-card>`).join('');

    const template = document.createElement('template');
    template.innerHTML = `
        <style>
        .app__column {
            margin-right: 12px;
        }
        
        .column {
            box-sizing: border-box;
            width: 272px;
            min-width: 272px;
            max-height: 100%;
            background: #DFE3E6;
            border-radius: 3px;
            padding: 8px 0 12px;
            display: flex;
            flex-direction: column;
        }
        
        .column__title {
            font-family: Montserrat, serif;
            font-style: normal;
            font-weight: bold;
            color: #000000;
        
            margin: 0 12px 12px;
        }
        
        .cards-list {
            overflow-y: scroll;
        }
        
        .column-footer {
            display: flex;
            color: #6B808C;
        }
        
        .column__column-footer {
            padding: 0 12px;
        }
        
        .icon-plus {
            background: url(../images/plus.png);
            height: 15px;
            width: 15px;
            display: block;
            margin-right: 8px;
        }
        </style>
        <div class="column app__column">
            <div class="column__title">
                ${title}
            </div>
            <div class="cards-list">
                ${renderedCards}
            </div>
            <div class="column-footer column__column-footer">
                <i class="icon-plus"></i>
                <span class="">Добавить еще одну карточку</span>
            </div>
        </div>
        `;

    return template;
}

export class AppColumn extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(getTemplate().content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['title', 'cards'];
    }

    get title() {
        return this.getAttribute('title')
    }

    set title(val) {
        this.setAttribute('title', val)
    }

    get cards() {
        return this.getAttribute('cards')
    }

    set cards(val) {
        this.setAttribute('cards', val)
    }

    _updateContent() {
        while (this._shadowRoot.firstChild) {
            this._shadowRoot.removeChild(this._shadowRoot.firstChild);
        }
        const title = this.title;
        const cards = eval(this.cards);
        this._shadowRoot.appendChild(getTemplate(title, cards).content.cloneNode(true));
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this._updateContent();
    }
}