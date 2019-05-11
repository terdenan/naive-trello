export function createElement(type, attributes, properties, children) {
    const elem = document.createElement(type);

    if (attributes) {
        for (let key in attributes) {
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
                const textNode = document.createTextNode(child);
                elem.appendChild(textNode);
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