export function createElement(type, attributes, properties, children) {
    const elem = document.createElement(type);

    if (attributes) {
        for (let key in attributes) {
            if (typeof attributes[key] === 'boolean') {
                if (attributes[key]) {
                    elem.setAttribute(key, '');
                }
                continue;
            }
            elem.setAttribute(key, attributes[key]);
        }
    }

    if (properties) {
        for (let key in properties) {
            elem[key] = properties[key]
        }
    }

    if (children) {
        for (let child of children) {
            if (child instanceof HTMLElement) {
                elem.appendChild(child);
            }
            else {
                elem.innerHTML = elem.innerHTML + child;
            }

        }
    }

    return elem;
}

export function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}

export function isHigherThanHalf(elem, event) {
    const y = event.clientY;
    const elemMeasures = elem.getBoundingClientRect();
    const elemHalfY = elemMeasures.y + (elemMeasures.height - 12) / 2;

    return y < elemHalfY;
}

export function obj2str(obj) {
    let res = '';
    for (let prop in obj) {
        res += `${prop}: ${obj[prop]};`
    }
    return res;
}

export function removeChildren(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}