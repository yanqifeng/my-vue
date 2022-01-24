import Vue from './runtime/index'
import { compiler } from '@/compiler/index'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el) {
    this.$el = document.querySelector(this.$options.el)

    el = document.querySelector(this.$options.el)
    const template = getOuterHTML(el)
    const { render } =  compiler(template)
    this.$options.render = render
    
    mount.call(this)
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
