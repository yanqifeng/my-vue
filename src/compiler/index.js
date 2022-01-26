import { html2AST } from './ast'
import { generate } from './codegen'
import { createFunction } from './to-function'

export function compiler(template, options) {
    const ast = html2AST(template)
    const code = generate(ast)

    return {
        ast,
        render: createFunction(code.render)
    }
}
