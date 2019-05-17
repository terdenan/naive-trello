import { createElement, removeChildren } from "../utils/index.js";


function getBasicFooter() {
    const el =
        createElement(
            'div',
            {class: 'column-footer column__column-footer'},
            {onclick: () => this.footerClick()},
            [
                createElement('i', {class: 'icon icon-plus column-footer__icon'}),
                createElement('span', null, null, [this.spanText])
            ]
        );

    return el;
}

function getActiveFooter() {
    const el =
        createElement(
            'div',
            {class: 'column-footer column-footer_active column__column-footer'},
            null,
            [
                createElement(
                    'button',
                    {class: 'button'},
                    {onclick: () => this.buttonClick()},
                    [this.buttonText]
                ),
                createElement(
                    'i',
                    {class: 'icon icon-cross column-footer__icon-cross'},
                    {onclick: () => this.crossClick()}
                ),
            ]
        );

    return el;
}


export class ColumnFooter extends HTMLElement {

    constructor() {
        super();
        this._getFooter = getBasicFooter.bind(this);
    }

    connectedCallback() {
        this._render();
    }

    get active() {
        return this._active;
    }

    set active(val) {
        this._active = val;
        if (val) {
            this._getFooter = getActiveFooter.bind(this);
        }
        else {
            this._getFooter = getBasicFooter.bind(this);
        }
        this._render();
    }

    _render() {
        removeChildren(this);
        const el = this._getFooter();
        this.appendChild(el);
    }
}