export function patch (oldVnode, vnode) {
    const parentElm = oldVnode.nodeType ? oldVnode.parentNode : oldVnode.elm.parentNode
    createElm(vnode, parentElm)
    removeNode(oldVnode.nodeType ? oldVnode : oldVnode.elm)
}

function createText(text) {
    return new Text(text)
}

function insert(el, parent) {
    parent.append(el)
}

function removeNode (el) {
    const parent = el.parentNode
    parent.removeChild(el)
}

function createElm (vnode, parentElm) {
    const el = document.createElement(vnode.tag)
    vnode.elm = el

    if (Array.isArray(vnode.children)) {
        vnode.children.forEach((v) => {
            createElm(v, el)
        })
    } else {
        insert(createText(vnode.children), el)
    }

    insert(el, parentElm)
}
