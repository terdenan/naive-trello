import { AppCard } from "./components/card.js";
import { AppColumn } from "./components/column.js";
import columns from "./content.js";


function getTemplate(columns) {
    const renderedColumns = columns.map(column => {
        const cards = JSON.stringify(column.cards);
        const escapedCards = cards.replace(/"/g, "&quot;");
        return `
            <app-column class="column app__column"
                        title="${column.title}"
                        cards="${escapedCards}"
            ></app-column>
        `;
    }).join('');
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
        .app {
            box-sizing: border-box;
            padding: 20px;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: flex-start;
            overflow-x: scroll;
        }
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
        </style>
        <div class="app">
            ${renderedColumns}        
        </div>
    `;

    return template;
}

export class KanbanApp extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(getTemplate(columns).content.cloneNode(true));
    }
}


customElements.define('app-card', AppCard);
customElements.define('app-column', AppColumn);
customElements.define('kanban-app', KanbanApp);