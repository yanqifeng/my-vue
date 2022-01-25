import { VNode } from '../vdom/vnode'

export function renderMixin (Vue) {
    Vue.prototype._h = function (tag, children = [], attrs) {
        return new VNode(tag, children, attrs)
    }

    Vue.prototype._render = function () {
        // 返回 vdom
        return this.$options.render.call(this)
    }
}
