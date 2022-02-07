const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

export function parseHTML(html, options) {
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
    const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`
    const startTagOpen = new RegExp(`^<${qnameCapture}`)
    const startTagClose = /^\s*(\/?)>/
    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

    const stack = []
    let index = 0
    let last, lastTag
    while (html) {
        last = html
        
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // 匹配结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                const curIndex = index
                advance(endTagMatch[0].length)
                parseEndTag(endTagMatch[1], curIndex, index)
                continue
            }

            // 匹配开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch)
                continue
            }
        }
        
        let text, rest, next
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }

        if (textEnd < 0) {
            text = html
        }

        if (text) {
            advance(text.length)
        }

        if (options.chars && text) {
            options.chars(text)
        }
    }

    parseEndTag()

    function advance (n) {
        index += n
        html = html.substring(n)
    }

    function parseStartTag (tag, tagName, rest) {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                // 标签未闭合，且存在属性或者动态属性
                attr.start = index
                advance(attr[0].length)
                attr.end = index
                match.attrs.push(attr)
            }
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    function handleStartTag (match) {
        const tagName = match.tagName
        const unarySlash = match.unarySlash

        const unary = !!unarySlash

        const l = match.attrs.length
        const attrs = new Array(l)
        for (let i = 0; i < l; i++) {
            const args = match.attrs[i]
            const value = args[3] || args[4] || args[5] || ''
            attrs[i] = {
                name: args[1],
                value
            }
        }

        if (!unary) {
            stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
            lastTag = tagName
        }

        if (options.start) {
            options.start(tagName, attrs, unary, match.start, match.end)
        }
    }

    function parseEndTag (tagName, start, end) {
        let pos, lowerCasedTagName
        if (start == null) start = index
        if (end == null) end = index

        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase()
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break
                }
            }
        } else {
            pos = 0
        }

        if (pos >= 0) {
            for (let i = stack.length - 1; i >= pos; i--) {
                if (options.end) {
                    options.end(stack[i].tag, start, end)
                }
            }
            stack.length = pos
            lastTag = pos && stack[pos-1].tag
        }
    }
}
