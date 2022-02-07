const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseText (text) {
    if (!tagRE.test(text)) {
        return
    }
    const tokens = []
    let match, index
    tagRE.lastIndex = 0
    while ((match = tagRE.exec(text))) {
        index = match.index
        if (index > 0) {
            tokens.push(JSON.stringify(text.slice(0, index)))
        }
        const exp = match[1].trim()
        tokens.push(`_s(${exp})`)
        text = text.substring(index + match[0].length)
        tagRE.lastIndex = 0
    }
    if (text.length > 0) {
        tokens.push(JSON.stringify(text))
    }
    return {
        expression: tokens.join('+')
    }
}
