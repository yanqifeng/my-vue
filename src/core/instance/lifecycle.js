import { Watcher } from '../observer/watcher'

export function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        const prevVnode = vm._vnode
        vm._vnode = vnode

        if (!prevVnode) {
            // 初次渲染
            vm.$el = vm.__patch__(vm.$el, vnode)
        } else {
            // 修改更新
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
    }
}

export function mountComponent (vm, el) {
    vm.$el = el
    new Watcher(vm, function () {
        vm._update(vm._render())
    })
}

export function callHook (vm, hook) {
    const handler = vm.$options[hook]
    if (handler) {
        handler.call(vm)
    }
}
