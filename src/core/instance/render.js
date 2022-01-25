import { VNode } from '../vdom/vnode'

export function renderMixin (Vue) {
    Vue.prototype._h = function (tag, children = []) {
        return new VNode(tag, children)
    }

    Vue.prototype._render = function () {
        // 返回 vdom
        return this.$options.render.call(this)
    }
}
