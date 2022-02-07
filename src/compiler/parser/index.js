import { parseHTML } from './html-parser'
import { parseText } from './text-parser'

export function createASTElement (tag, attrs, parent) {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        parent,
        children: []
    }
}

export function parse (template) {
    const stack = []
    let root
    let currentParent

    function closeElement (element) {
        if (currentParent) {
            currentParent.children.push(element)
            element.parent = currentParent
        }
    }

    parseHTML(template, {
        start (tag, attrs, unary, start, end) {
            let element = createASTElement(tag, attrs, currentParent)

            if (!root) {
                root = element
            }

            if (!unary) {
                currentParent = element
                stack.push(element)
            }
        },

        end (tag, start, end) {
            const element = stack[stack.length - 1]
            stack.length -= 1
            currentParent = stack[stack.length - 1]
            closeElement(element)
        },

        chars (text, start, end) {
            const children = currentParent.children

            text = text.trim()
            if (text) {
                let res
                let child
                if ((res = parseText(text))) {
                    child = {
                        type: 2,
                        expression: res.expression,
                        text
                    }
                } else {
                    child = {
                        type: 3,
                        text
                    }
                }

                if (child) {
                    children.push(child)
                }
            }
        }
    })
    return root
}
