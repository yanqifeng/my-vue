export function generate (ast) {
    const render = `with(this) {return ${genElement(ast)}}`
    return {
        render
    }
}

function genElement (el) {
    if (el.node === 'root') {
        return genElement(el.children[0])
    } else if (el.node === 'text') {
        let text
        if (el.text) {
            text = `'${el.text.trim()}'`
        }
        if (el.expression) {
            text = el.expression
        }
        return `_h("${el.tag || ''}", ${text})`
    } else {
        return `_h("${el.tag || 'div'}", ${genChildren(el.children)}, ${genData(el)})`
    }
}

function genChildren (children = []) {
    return `[${children.map(child => genElement(child))}]`
}

function genData (el) {
    let data = '{'
    if (el.attrs) {
        el.attrs.forEach(attr => {
            if (attr.name[0] === ':') {
                data += `${attr.name.substring(1)}: ${attr.value},`
            } else {
                data += `${attr.name}: '${attr.value}',`
            }
        })
    }
    data = data.replace(/,$/, '') + '}'
    return data
}
