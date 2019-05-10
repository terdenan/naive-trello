function getTemplate(body='Пустая карточка') {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
        .card {
            background: #FFFFFF;
            box-shadow: 0px 1px 4px rgba(9, 45, 66, 0.25);
            border-radius: 3px;
        }
        
        .cards-list__card {
            margin: 0 12px 12px;
        }
        
        .card__content {
            padding: 8px 12px;
        }
    </style>
    <div class="card cards-list__card">
        <div class="card__content">
            ${body}
        </div>
    </div>
    `;

    return template;
}

function getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
        width: box.width,
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}

function onMouseDown (event) {
    const _this = this;
    const coords = getCoords(_this);

    const shiftX = event.pageX - coords.left;
    const shiftY = event.pageY - coords.top;
    const cardWidth = coords.width;

    _this.style.position = 'absolute';
    _this.style.zIndex = 100;
    _this.style.width = cardWidth + 'px';
    moveAt(event);

    function moveAt(event) {
        _this.style.left = event.pageX - shiftX + 'px';
        _this.style.top = event.pageY - shiftY + 'px';
    }

    document.onmousemove = function(event) {
        moveAt(event);
    }

    document.onmouseup = function (event) {
        document.onmousemove = null;
        document.onmouseup = null;
    }

}

export class AppCard extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(getTemplate().content.cloneNode(true));

        this.onmousedown = onMouseDown.bind(this);
    }

    static get observedAttributes() {
        return ['body'];
    }

    get body() {
        return this.getAttribute('body')
    }

    set body(val) {
        this.setAttribute('body', val)
    }

    _updateContent() {
        while (this._shadowRoot.firstChild) {
            this._shadowRoot.removeChild(this._shadowRoot.firstChild);
        }
        const body = this.body;
        this._shadowRoot.appendChild(getTemplate(body).content.cloneNode(true));
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this._updateContent();
    }
}