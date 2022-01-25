export function generate (ast) {
    console.log(ast)
    const render = `with(this) {return ${genElement(ast)}}`
    console.log(render)
    return {
        render
    }
}

function genElement (el) {
    if (el.node === 'root') {
        return genElement(el.child[0])
    } else if (el.node === 'text') {
        let text = el.text.trim()
        if (text) {
            text = `'` + text.replace(/\{\{(.*)\}\}/g, ($1, $2) => `'+` + $2.trim() + `+'`) + `'`
        }
        return `_h("${el.tag || ''}", ${text})`
    } else {
        return `_h("${el.tag || 'div'}", ${genChildren(el.child)}, ${genData(el)})`
    }
}

function genChildren (children = []) {
    return `[${children.map(child => genElement(child))}]`
}

function genData (el) {
    let data = '{'
    if (el.attrs) {
        el.attrs.forEach(attr => {
            data += `${attr.name}: '${attr.value}',`
        })
    }
    data = data.replace(/,$/, '') + '}'
    return data
}
