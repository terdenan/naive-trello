import { createElement } from "../utils/index.js";


export class ColumnFooter extends HTMLElement {

    connectedCallback() {
        this._render();
    }

    static get observedAttributes() {
        return ['active'];
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(val) {
        if (val) {
            this.setAttribute('active', '');
        }
        else {
            this.removeAttribute('active');
        }
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this._render();
    }

    _render() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        let el;
        if (this.active) {
            el =
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
                            {class: 'icon icon-cross'},
                            {onclick: () => this.crossClick()}
                        ),
                    ]
                );
        }
        else {
            el =
                createElement(
                    'div',
                    {class: 'column-footer column__column-footer'},
                    {onclick: () => this.footerClick()},
                    [
                        createElement('i', {class: 'icon icon-plus column-footer__icon'}),
                        createElement('span', null, null, [this.spanText])
                    ]
                );
        }

        this.appendChild(el);
    }
}