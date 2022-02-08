export function createPatchFunction ({ nodeOps }) {
    function createElm (vnode, parentElm) {
        const el = vnode.tag && document.createElement(vnode.tag)
        vnode.elm = vnode.tag ? el : null
    
        if (el && vnode.attrs) {
            for (const key in vnode.attrs) {
                el.setAttribute(key, vnode.attrs[key])
            }
        }
        if (Array.isArray(vnode.children)) {
            vnode.children.forEach((v) => {
                createElm(v, el)
            })
        } else {
            insert(nodeOps.createText(vnode.children), parentElm)
        }
        insert(el, parentElm)
    }

    function insert(el, parent) {
        parent && parent.append(el)
    }

    function patchVnode (oldVnode, vnode) {
        console.log('patchVnode')
    }

    
    return function patch (oldVnode, vnode) {
        const isRealElement = oldVnode.nodeType != null
        if (!isRealElement) {
            // diff
            patchVnode(oldVnode, vnode)
        } else {
            // 第一次，直接渲染
            const parentElm = oldVnode.nodeType ? oldVnode.parentNode : oldVnode.elm.parentNode
            createElm(vnode, parentElm)
            nodeOps.removeNode(oldVnode.nodeType ? oldVnode : oldVnode.elm)
        }
    }
}
