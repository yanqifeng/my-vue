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
        }
        if (vnode.text) {
            insert(nodeOps.createText(vnode.text), parentElm)
        }
        insert(el, parentElm)
    }

    function insert(el, parent) {
        parent && parent.append(el)
    }

    function updateChildren (parentElm, oldCh, ch) {
        console.log('updateChildren')
        let oldStartIdx = 0
        let newStartIdx = 0
        let oldEndIdx = oldCh.length - 1
        let newEndIdx = newCh.length - 1
        let oldStartVnode = oldCh[0]
        let oldEndVnode = oldCh[oldEndIdx]
        let newStartVnode = newCh[0]
        let newEndVnode = newCh[newEndIdx]
        /** 五种情况
         * 1. oldStartVnode === newStartVnode
         * 2. oldEndVnode === newEndVnode
         * 3. oldStartVnode === newEndVnode
         * 4. oldEndVnode === newStartVnode
         * 5. 其他情况：遍历通过key来判断是否存在相同的节点
         */
    }

    function patchVnode (oldVnode, vnode) {
        const elm = vnode.elm = oldVnode.elm
        const oldCh = oldVnode.children
        const ch = vnode.children
        
        if (vnode.text) {

        } else {
            console.log(oldCh, ch)
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
