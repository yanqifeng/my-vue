export function generate (ast) {
    const render = `with(this) {return ${genElement(ast)}}`
    return {
        render
    }
}

function genElement (el) {
    if (el.type === 1) {
        return `_h("${el.tag || 'div'}", ${genChildren(el.children)}, ${genData(el)})`
    } else if (el.type === 2) {
        return `_h("", "", "", ${el.expression})`
    } else {
        return `_h("", "", "", "${el.text}")`
    }
}

function genChildren (children = []) {
    return `[${children.map(child => genElement(child))}]`
}

function genData (el) {
    let data = '{'
    el.attrsList.forEach(attr => {
        if (attr.name[0] === ':') {
            data += `${attr.name.substring(1)}: ${attr.value},`
        } else {
            data += `${attr.name}: '${attr.value}',`
        }
    })
    data = data.replace(/,$/, '') + '}'
    return data
}
