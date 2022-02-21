import { VNode } from '../vdom/vnode'

export function renderMixin (Vue) {
    Vue.prototype._h = function (tag, children = [], attrs, text) {
        return new VNode(tag, children, attrs, text)
    }

    Vue.prototype._s = function (val) {
        return String(val)
    }

    Vue.prototype._render = function () {
        // 返回 vdom
        return this.$options.render.call(this)
    }
}
