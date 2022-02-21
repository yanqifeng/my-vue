import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { extend } from 'shared/util'

import {
    getAndRemoveAttr
} from '../helpers'

export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g

export function createASTElement (tag, attrs, parent) {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent,
        children: []
    }
}

export function parse (template) {
    const stack = []
    let root
    let currentParent
    let inVPre = false

    function closeElement (element) {
        if (currentParent) {
            if (element.elseif || element.else) {
                processIfConditions(element, currentParent)
            } else {
                currentParent.children.push(element)
                element.parent = currentParent
            }
        }

        if (element.pre) {
            inVPre = false
        }
    }

    parseHTML(template, {
        start (tag, attrs, unary, start, end) {
            let element = createASTElement(tag, attrs, currentParent)
            
            if (!inVPre) {
                // 处理 v-pre
                processPre(element)
                if (element.pre) {
                    inVPre = true
                }
            }

            if (inVPre) {
                processRawAttrs(element)
            } else {
                // v-for
                processFor(element)
                // v-if
                processIf(element)
                // v-once
                processOnce(element)
            }

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
    console.log(root)
    return root
}

function makeAttrsMap (attrs) {
    const map = {}
    for (let i = 0, l = attrs.length; i < l; i++) {
        map[attrs[i].name] = attrs[i].value
    }
    return map
}

function processPre (el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
        el.pre = true
    }
}

function processRawAttrs (el) {
    const list = el.attrsList
    const len = list.length
    if (len) {
        const attrs = el.attrs = new Array(len)
        for (let i = 0; i < len; i++) {
            attrs[i] = {
                name: list[i].name,
                value: JSON.stringify(list[i].value)
            }
        }
    } else if (!el.plain) {
        el.plain = true
    }
}

function processFor (el) {
    let exp
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
        const res = parseFor(exp)
        console.log(res)
        if (res) {
            extend(el, res)
        }
    }
}

/**
 * (item, index) in array
 * (value, key, index) in object
 * 
 * res = {
 *  for
 *  alias
 *  iterator1
 *  iterator1
 * }
 */
export function parseFor (exp) {
    const inMatch = exp.match(forAliasRE)
    if (!inMatch) return
    const res = {}
    res.for = inMatch[2].trim()
    const alias = inMatch[1].trim().replace(stripParensRE, '')
    const iteratorMatch = alias.match(forIteratorRE)
    if (iteratorMatch) {
        res.alias = alias.replace(forIteratorRE, '').trim()
        res.iterator1 = iteratorMatch[1].trim()
        if (iteratorMatch[2]) {
            res.iterator2 = iteratorMatch[2].trim()
        }
    } else {
        res.alias = alias
    }
    return res
}

function processIf (el) {
    const exp = getAndRemoveAttr(el, 'v-if')
    if (exp) {
        el.if = exp
        addIfCondition(el, {
            exp: exp,
            block: el
        })
    } else {
        if (getAndRemoveAttr(el, 'v-else') != null) {
            el.else = true
        }
        const elseif = getAndRemoveAttr(el, 'v-else-if')
        if (elseif) {
            el.elseif = elseif
        }
    }
}

function processIfConditions (el, parent) {
    const prev = findPrevElement(parent.children)
    if (prev && prev.if) {
        addIfCondition(prev, {
            exp: el.elseif,
            block: el
        })
    }
}

function findPrevElement (children) {
    let i = children.length
    while (i--) {
        if (children[i].type === 1) {
            return children[i]
        } else {
            children.pop()
        }
    }
}

export function addIfCondition (el, condition) {
    if (!el.ifConditions) {
        el.ifConditions = []
    }
    el.ifConditions.push(condition)
}

function processOnce (el) {
    const once = getAndRemoveAttr(el, 'v-once')
    if (once != null) {
        el.once = true
    }
}
