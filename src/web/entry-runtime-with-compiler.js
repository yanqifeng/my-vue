import Vue from './runtime/index'
import { compiler } from '@/compiler/index'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el) {
    el = el && document.querySelector(el)

    const options = this.$options

    if (!options.render) {
        const template = getOuterHTML(el)
        const { render } = compiler(template, this)
        options.render = render
    }

    mount.call(this, el)
}

function getOuterHTML (el) {
    if (el.outerHTML) { 
        return el.outerHTML
    } else {
        const container = document.createElement('div')
        container.appendChild(el.cloneNode(true))
        return container.innerHTML
    }
}

export default Vue
