import { parse } from './parser/index'
import { generate } from './codegen'
import { createFunction } from './to-function'

export function compiler(template, options) {
    const ast = parse(template.trim())
    const code = generate(ast)

    return {
        ast,
        render: createFunction(code.render)
    }
}
