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