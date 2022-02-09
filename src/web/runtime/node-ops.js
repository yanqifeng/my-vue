export function createElement (tagName, vnode) {
    return document.createElement(tagName)
}

export function createTextNode (text) {
    return document.createTextNode(text)
}

export function createText(text) {
    return new Text(text)
}

export function removeNode (el) {
    const parent = el.parentNode
    parent.removeChild(el)
}

export function setTextContent (node, text) {
    node.textContent = text
  }
