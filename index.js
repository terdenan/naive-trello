import {
    createElement,
    insertAfter,
    isHigherThanHalf } from "./utils/index.js";
import { AppCard } from "./components/card.js";
import { AppColumn } from "./components/column.js";
import { BlankSpace } from "./components/blankSpace.js";
import { ColumnFooter } from "./components/columnFooter.js";
import content from "./content.js";


export class KanbanApp extends HTMLElement {
    constructor() {
        super();
        this.columns = content;
        this.columns.push({editable: true});
        this.initDraggable();
    }

    connectedCallback() {
        this._render();
    }

    get columns() {
        return this._columns;
    }

    set columns(val) {
        const isInitial = this.columns === undefined;
        this._columns = val;
        if (!isInitial) {
            this._render();
        }
    }

    _addNewColumn(title) {
        this.columns[this.columns.length - 1] = { title };
        const newColumns = this.columns.slice()
        newColumns.push({editable: true});
        this.columns = newColumns;
    }

    _insertCard(columnIndex) {
        return (function(card) {
            if (this.columns[columnIndex].cards === undefined) {
                this.columns[columnIndex].cards = [];
            }
            this.columns[columnIndex].cards.push(card);
        }).bind(this);
    }

    _render() {
        while(this.firstChild) {
            this.removeChild(this.firstChild)
        }

        const columns = this.columns;
        const el =
            createElement(
                'div',
                {class: 'app'},
                null,
                [
                    ...columns.map((column, index) => createElement(
                        'app-column',
                        {key: index},
                        {
                            ...column,
                            addNewColumn: this._addNewColumn.bind(this),
                            insertCard: this._insertCard(index),
                        })
                    )
                ]
            );

        this.appendChild(el);
    }

    _getElemBoundaries(elem) {
        const box = elem.getBoundingClientRect();
        return {
            width: box.width,
            height: box.height,
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    _findClosestCard(column, grabbedCard, event) {
        const currentY = event.clientY;

        const cards = Array.prototype.filter.call(
            column.querySelectorAll('app-card'),
            elem => elem !== grabbedCard
        );
        let closestCard = cards[0] || null;

        for (let card of cards) {
            if (card.editable) {
                continue;
            }
            const cardY = card.getBoundingClientRect().y;
            if (cardY > currentY) break;
            closestCard = card;
        }

        return closestCard;
    }

    _findClosestColumn(event) {
        const currentX = event.clientX;
        const columns = this.querySelectorAll('app-column');
        let closestColumn = columns[0] || null;

        for (let column of columns) {
            if (column.editable) {
                continue;
            }
            const cardX = column.getBoundingClientRect().x;
            if (cardX > currentX) break;
            closestColumn = column;
        }

        return closestColumn;
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
            if (isHigher || closestCard.editable) {
                insertionList.insertBefore(newBlankSpace, closestCard);
            }
            else {
                insertAfter(newBlankSpace, closestCard)
            }
        }

        this._removeBlankSpace();
        this._currentBlankSpace = newBlankSpace;
    }

    _updateColumn(column, cards) {
        const columnKey = parseInt(column.getAttribute('key'));
        column.cards = cards;
        this.columns[columnKey].cards = cards;
    }

    initDraggable() {
        this._dragCard = {};
        this._currentBlankSpace = null;

        this.onmousedown = event => {
            // Ignore if it's not a left-button click
            if (event.button !== 0) {
                return;
            }

            const grabbedCard = event.target.closest('app-card');
            const sourceColumn = event.target.closest('app-column');

            if (!grabbedCard || grabbedCard.editable) {
                return;
            }

            const grabbedCardKey = parseInt(grabbedCard.getAttribute('key'));
            const leftCards = sourceColumn.cards.filter((card, index) => {
                return index !== grabbedCardKey;
            });

            // Storing grabbed card
            const grabbedCardBoundaries = this._getElemBoundaries(grabbedCard);
            this._dragCard = {
                elem: grabbedCard,
                nextSibling: grabbedCard.nextElementSibling,

                shiftX: event.pageX - grabbedCardBoundaries.left,
                shiftY: event.pageY - grabbedCardBoundaries.top,
                width: grabbedCardBoundaries.width,
                height: grabbedCardBoundaries.height,
                stlye: {
                    position: grabbedCard.style.position || '',
                    zIndex: grabbedCard.style.zIndex || '',
                    width: grabbedCard.style.width || ''
                }
            };

            this._insertBlankSpace(event);

            function moveTo(event) {
                grabbedCard.style.left = event.pageX - this._dragCard.shiftX + 'px';
                grabbedCard.style.top = event.pageY - this._dragCard.shiftY + 'px';
            }

            grabbedCard.classList.add('card_grabbed');
            grabbedCard.style.width = grabbedCardBoundaries.width + 'px';
            moveTo.call(this, event)

            this.onmousemove = (function(event) {
                moveTo.call(this, event);
                this._insertBlankSpace(event);
            }).bind(this);

            this.onmouseup = (function (event) {
                if (!this._dragCard.elem) {
                    return;
                }
                // Restoring grabbed card
                grabbedCard.classList.remove('card_grabbed')
                grabbedCard.style = this._dragCard.style;

                const targetColumn = this._findClosestColumn(event);
                const closestCard = this._findClosestCard(targetColumn, grabbedCard, event);

                const sourceAttributes = grabbedCard.sourceAttributes();

                if (closestCard === null) {
                    this._updateColumn(sourceColumn, leftCards);
                    this._updateColumn(targetColumn, [sourceAttributes])
                }
                else {
                    const isHigher = isHigherThanHalf(closestCard, event);
                    let closestCardKey = parseInt(closestCard.getAttribute('key'));

                    this._updateColumn(sourceColumn, leftCards);

                    const newCards = targetColumn.cards.slice();
                    if (targetColumn === sourceColumn && grabbedCardKey < closestCardKey) {
                        closestCardKey -= 1;
                    }
                    if (isHigher || closestCard.editable) {
                        newCards.splice(closestCardKey , 0, sourceAttributes);
                    }
                    else {
                        newCards.splice(closestCardKey + 1, 0, sourceAttributes);
                    }

                    this._updateColumn(targetColumn, newCards)
                }

                this._removeBlankSpace();
                this.onmousemove = null;
                this._dragCard = {};
            }).bind(this);
        }
    }
}


customElements.define('blank-space', BlankSpace);
customElements.define('column-footer', ColumnFooter);
customElements.define('app-card', AppCard);
customElements.define('app-column', AppColumn);
customElements.define('kanban-app', KanbanApp);