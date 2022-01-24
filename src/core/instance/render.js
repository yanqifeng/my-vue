export function renderMixin (Vue) {
    Vue.prototype._h = function (tag, props, children = []) {
        return {
            tag,
            props,
            children
        }
    }

    Vue.prototype._render = function () {
        // 返回 vdom
        return this.$options.render.call(this)
    }
}
