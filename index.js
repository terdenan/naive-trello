import { createElement } from "./utils/index.js";
import { AppCard } from "./components/card.js";
import { AppColumn } from "./components/column.js";
import columns from "./content.js";


export class KanbanApp extends HTMLElement {
    constructor() {
        super();
        this._dragCard = {};
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
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    initDragable() {
        this.onmousedown = event => {
            if (event.button !== 0) {
                return;
            }

            const grabbedCard = event.target.closest('app-card');

            if (!grabbedCard) {
                return;
            }

            this._dragCard.elem = grabbedCard;
            this._dragCard.nextSibling = grabbedCard.nextElementSibling;

            const coords = this._getCoords(grabbedCard);
            this._dragCard.shiftX = event.pageX - coords.left;
            this._dragCard.shiftY = event.pageY - coords.top;
            this._dragCard.width = coords.width;

            this._dragCard.style = {
                position: grabbedCard.style.position || '',
                zIndex: grabbedCard.style.zIndex || '',
                width: grabbedCard.style.width || ''
            };
            grabbedCard.style.position = 'absolute';
            grabbedCard.style.zIndex = 100;
            grabbedCard.style.width = coords.width + 'px';

            this.onmousemove = (function(event) {
                this._dragCard.elem.style.left = event.pageX - this._dragCard.shiftX + 'px';
                this._dragCard.elem.style.top = event.pageY - this._dragCard.shiftY + 'px';
            }).bind(this);

            this.onmouseup = (function (event) {
                const grabbedCard = this._dragCard.elem;

                grabbedCard.style.display = 'none';
                const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
                grabbedCard.style.display = 'block';

                const targetColumn = dropTarget.closest('app-column');

                grabbedCard.style = this._dragCard.style;

                if (!targetColumn) {
                    const sourceColumn = grabbedCard.nextSibling.parentNode;
                    sourceColumn.insertBefore(grabbedCard, grabbedCard.nextSibling);
                    return;
                }

                grabbedCard.parentNode.removeChild(grabbedCard);
                targetColumn.querySelector('.cards-list').appendChild(grabbedCard);
                // targetColumn.appendChild(grabbedCard)
                console.log(targetColumn.querySelectorAll('app-card'))

                this.onmousemove = null;
                this._dragCard = {};
            }).bind(this);
            // parentElement.insertBefore(newElement, referenceElement);
        }
    }
}


customElements.define('app-card', AppCard);
customElements.define('app-column', AppColumn);
customElements.define('kanban-app', KanbanApp);