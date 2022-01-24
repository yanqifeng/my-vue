export function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode) {
        // 根据 vnode 渲染到页面上
        // __patch__ 对比渲染虚拟dom
        const vm = this
        const prevVnode = vm._vnode
        vm._vnode = vnode
        vm.__patch__(prevVnode || vm.$el, vnode)
    }
}
