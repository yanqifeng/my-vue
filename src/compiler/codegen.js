export function generate (ast) {
    const codeGen = `with(this) {return ${genElement(ast)}}`
    return {
        render: new Function(codeGen)
    }
}

function genElement (el) {
    if (el.node === 'text') {
        let text = el.text.trim()
        if (text) {
            text = `'` + text.replace(/\{\{(.*)\}\}/g, ($1, $2) => `'+` + $2.trim() + `+'`) + `'`
        }
        return `_h("${el.tag || 'span'}", null, ${text})`
    } else {
        return `_h("${el.tag || 'div'}", null, ${genChildren(el.child)})`
    }
}

function genChildren (children = []) {
    return `[${children.map(child => genElement(child))}]`
}
