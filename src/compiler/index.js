import { html2AST } from './ast'
import { generate } from './codegen'

export function compiler (template, vm) {
    const ast = html2AST(template)
    const code = generate(ast)

    return {
        ast,
        render: code.render
    }
}
