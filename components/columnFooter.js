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

    // toggleActive() {
    //     this.active = !this.active;
    // }

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
                            {
                                onclick: () => {
                                    this.createCard();
                                    //this.toggleActive();
                                }
                            },
                            ['Добавить карточку']
                        ),
                        createElement(
                            'i',
                            {class: 'icon icon-cross'},
                            {
                                onclick: () => {
                                    this.removeNewCard();
                                    //this.toggleActive()
                                }
                            }
                        ),
                    ]
                );
        }
        else {
            el =
                createElement(
                    'div',
                    {class: 'column-footer column__column-footer'},
                    {
                        onclick: () => {
                            this.addNewCard();
                            //this.toggleActive();
                        }
                    },
                    [
                        createElement('i', {class: 'icon icon-plus column-footer__icon'}),
                        createElement('span', null, null, ["Добавить еще одну карточку"])
                    ]
                );
        }

        // el =
        //     createElement(
        //         'div',
        //         {class: 'column-footer column__column-footer'},
        //         null,
        //         [
        //             createElement('i', {class: 'icon-plus'}),
        //             createElement('span', null, null, ["Добавить еще одну карточку"])
        //         ]
        //     );

        this.appendChild(el);
    }
}