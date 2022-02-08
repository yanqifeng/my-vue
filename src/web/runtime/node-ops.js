export function createText(text) {
    return new Text(text)
}

export function removeNode (el) {
    const parent = el.parentNode
    parent.removeChild(el)
}
