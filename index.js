import {
    createElement,
    insertAfter,
    isHigherThanHalf } from "./utils/index.js";
import { AppCard } from "./components/card.js";
import { AppColumn } from "./components/column.js";
import { BlankSpace } from "./components/blankSpace.js";
import columns from "./content.js";


export class KanbanApp extends HTMLElement {
    constructor() {
        super();
        this.initDragable();
    }

    connectedCallback() {
        this._render(columns);
    }

    _render(columns) {
        while(this.firstChild) {
            this.removeChild(this.firstChild)
        }

        const el =
            createElement(
                'div',
                {class: 'app'},
                null,
                columns.map(column => createElement(
                    'app-column',
                    null,
                    {title: column.title, cards: column.cards})
                )
            );
        this.appendChild(el);
    }

    _getCoords(elem) {
        const box = elem.getBoundingClientRect();
        return {
            width: box.width,
            height: box.height,
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    _findClosestCard(column, grabbedCard, event) {
        const y = event.clientY;
        const cards = Array.prototype.filter.call(
            column.querySelectorAll('app-card'),
            elem => elem !== grabbedCard
        );

        let ans = cards[0] || null;

        for (let card of cards) {
            if (card === grabbedCard) continue;
            const currentY = card.getBoundingClientRect().y;
            if (currentY > y) break;
            ans = card;
        }

        return ans;
    }

    _findClosestColumn(event) {
        const x = event.clientX;
        const columns = this.querySelectorAll('app-column');
        let ans = columns[0] || null;

        for (let column of columns) {
            const currentX = column.getBoundingClientRect().x;
            if (currentX > x) break;
            ans = column;
        }

        return ans;
    }

    _removeBlankSpace() {
        if (this._currentBlankSpace) {
            const parent =  this._currentBlankSpace.parentNode;
            parent.removeChild(this._currentBlankSpace);
            this._currentBlankSpace = null;
        }
    }

    _insertBlankSpace(event) {
        const grabbedCard = this._dragCard.elem;

        const targetColumn = this._findClosestColumn(event);
        const closestCard = this._findClosestCard(targetColumn, grabbedCard, event);
        const insertionList = targetColumn.querySelector('.cards-list');

        const newBlankSpace = createElement(
            'blank-space',
            {class: "blank-space cards-list__blank-space"},
            {width: this._dragCard.width - 24, height: this._dragCard.height}
        );

        if (closestCard === null) {
            insertionList.appendChild(newBlankSpace);
        }
        else {
            const isHigher = isHigherThanHalf(closestCard, event);
            if (isHigher) {
                insertionList.insertBefore(newBlankSpace, closestCard);
            }
            else {
                insertAfter(newBlankSpace, closestCard)
            }
        }

        this._removeBlankSpace();
        this._currentBlankSpace = newBlankSpace;
    }

    initDragable() {
        this._dragCard = {};
        this._currentBlankSpace = null;

        this.onmousedown = event => {
            // Ignore if it's not a left-button click
            if (event.button !== 0) {
                return;
            }

            const grabbedCard = event.target.closest('app-card');
            if (!grabbedCard) {
                return;
            }

            // Storing grabbed card
            const coords = this._getCoords(grabbedCard);
            this._dragCard = {
                elem: grabbedCard,
                nextSibling: grabbedCard.nextElementSibling,

                shiftX: event.pageX - coords.left,
                shiftY: event.pageY - coords.top,
                width: coords.width,
                height: coords.height,
            };

            this._dragCard.style = {
                position: grabbedCard.style.position || '',
                zIndex: grabbedCard.style.zIndex || '',
                width: grabbedCard.style.width || ''
            };

            this._insertBlankSpace(event);

            grabbedCard.classList.add('card_grabbed');
            grabbedCard.style.width = coords.width + 'px';
            grabbedCard.style.left = event.pageX - this._dragCard.shiftX + 'px';
            grabbedCard.style.top = event.pageY - this._dragCard.shiftY + 'px';

            this.onmousemove = (function(event) {
                const grabbedCard = this._dragCard.elem;
                grabbedCard.style.left = event.pageX - this._dragCard.shiftX + 'px';
                grabbedCard.style.top = event.pageY - this._dragCard.shiftY + 'px';

                this._insertBlankSpace(event);
            }).bind(this);

            this.onmouseup = (function (event) {
                if (!this._dragCard.elem) {
                    return;
                }
                // Restoring grabbed card
                const grabbedCard = this._dragCard.elem;
                grabbedCard.classList.remove('card_grabbed')
                grabbedCard.style = this._dragCard.style;

                const targetColumn = this._findClosestColumn(event);
                const closestCard = this._findClosestCard.call(this, targetColumn, grabbedCard, event);
                const insertionList = targetColumn.querySelector('.cards-list');

                if (closestCard === null) {
                    insertionList.appendChild(grabbedCard);
                }
                else {
                    const isHigher = isHigherThanHalf(closestCard, event);
                    if (isHigher) {
                        insertionList.insertBefore(grabbedCard, closestCard);
                    }
                    else {
                        insertAfter(grabbedCard, closestCard)
                    }
                }

                this._removeBlankSpace();

                this.onmousemove = null;
                this._dragCard = {};
            }).bind(this);
        }
    }
}


customElements.define('blank-space', BlankSpace);
customElements.define('app-card', AppCard);
customElements.define('app-column', AppColumn);
customElements.define('kanban-app', KanbanApp);