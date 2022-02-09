function sameVnode (a, b) {
    return (
        a.key === b.key &&
        a.tag === b.tag
    )
}

export function createPatchFunction ({ nodeOps }) {
    function createElm (vnode, parentElm) {
        if (vnode.tag) {
            vnode.elm = nodeOps.createElement(vnode.tag, vnode)
            if (vnode.elm && vnode.attrs) {
                for (const key in vnode.attrs) {
                    vnode.elm.setAttribute(key, vnode.attrs[key])
                }
            }
            if (Array.isArray(vnode.children)) {
                vnode.children.forEach((v) => {
                    createElm(v, vnode.elm)
                })
            }
        } else {
            vnode.elm = nodeOps.createTextNode(vnode.text)
            // if (vnode.text) {
            //     insert(nodeOps.createText(vnode.text), parentElm)
            // }
        }
        insert(vnode.elm, parentElm)
    }

    function insert(el, parent) {
        parent && parent.append(el)
    }

    function updateChildren (parentElm, oldCh, ch) {
        let oldStartIdx = 0
        let newStartIdx = 0
        let oldEndIdx = oldCh.length - 1
        let newEndIdx = ch.length - 1
        let oldStartVnode = oldCh[0]
        let oldEndVnode = oldCh[oldEndIdx]
        let newStartVnode = ch[0]
        let newEndVnode = ch[newEndIdx]
        /** 五种情况
         * 1. oldStartVnode === newStartVnode
         * 2. oldEndVnode === newEndVnode
         * 3. oldStartVnode === newEndVnode
         * 4. oldEndVnode === newStartVnode
         * 5. 其他情况：遍历通过key来判断是否存在相同的节点
         */

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = ch[++newStartIdx]
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode)
                oldEndVnode = oldCh[--oldEndIdx]
                newEndVnode = ch[--newEndIdx]
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                
            } else {
                
            }
            if (oldStartIdx > oldEndIdx) {

            } else if (newStartIdx > newEndIdx) {
                
            }
        }
    }

    function patchVnode (oldVnode, vnode) {
        const elm = vnode.elm = oldVnode.elm
        const oldCh = oldVnode.children
        const ch = vnode.children
        
        if (!vnode.text) {
            if (oldCh && ch && (oldCh !== ch)) {
                //  都存在子节点并且不相同
                updateChildren(elm, oldCh, ch)
            } else if (ch) {
                // 新节点存在子节点，直接添加子节点
                if (oldVnode.text) {
                    // 存在文本节点时，删除文本节点
                }
            } else if (oldCh) {
                // 旧节点存在子节点，删除
            } else if (oldVnode.text) {
                // 旧节点存在文本节点，删除
            }
        } else if (oldVnode.text !== vnode.text) {
            nodeOps.setTextContent(elm, vnode.text)
        }
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
