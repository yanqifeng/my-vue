import { parseText } from './text-parser'

export function html2AST(html) {
    const startTag = /<([a-zA-Z_][\w\-\.]*)((?:\s+([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))*)\s*(\/?)>/;
    const endTag = /<\/([a-zA-Z_][\w\-\.]*)>/
    const attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g

    const bufArray = []
    let results = {}
    let chars
    let match
    while (html) {
        chars = true
        if (html.indexOf('</') === 0) {
            match = html.match(endTag)
            if (match) {
                chars = false
                html = html.substring(match[0].length)
                match[0].replace(endTag, parseEndTag)
            }
        } else if (html.indexOf('<') === 0) {
            match = html.match(startTag)
            if (match) {
                chars = false
                html = html.substring(match[0].length)
                match[0].replace(startTag, parseStartTag)
            }
        }
        if (chars) {
            let index = html.indexOf('<')
            let text
            if (index < 0) {
                text = html
                html = ''
            } else {
                text = html.substring(0, index)
                html = html.substring(index)
            }
            let node = {
                node: 'text',
                text
            }
            let res
            if ((res = parseText(text))) {
                node.expression = res.expression
            }
            pushChild(node)
        }
    }

    function parseStartTag (tag, tagName, rest) {
        tagName = tagName.toLowerCase()
        const attrs = []
        const node = {
            node: 'element',
            tag: tagName
        }
        let unary = !!arguments[7] // 是否是自闭合标签，如 <div />
        rest.replace(attr, function (match, name) {
            const value = arguments[2]
                ? arguments[2]
                : arguments[3]
                    ? arguments[3]
                    : arguments[4]
                        ? arguments[4]
                        : ''
            attrs.push({
                name,
                value
            })
        })
        node.attrs = attrs
        if (!unary) {
            bufArray.push(node)
        } else {
            pushChild(node)
        }
    }

    function parseEndTag (tag, tagName) {
        let pos = 0;
        for (pos = bufArray.length - 1; pos >= 0; pos--) {
            if (bufArray[pos].tag == tagName) {
                break;
            }
        }
        if (pos >= 0) {
            pushChild(bufArray.pop());
        }
    }

    function pushChild (node) {
        if (bufArray.length === 0) {
            results = node
        } else {
            const parent = bufArray[bufArray.length - 1]
            if (typeof parent.children == "undefined") {
                parent.children = []
            }
            parent.children.push(node)
        }
    }
    return results
}
