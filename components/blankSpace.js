export class BlankSpace extends HTMLElement {

    get width() {
        return this._width;
    }

    set width(val) {
        this._width = val;
        this.style.width = val + 'px';
    }

    get height() {
        return this._height;
    }

    set height(val) {
        this._height = val;
        this.style.height = val + 'px';
    }

}