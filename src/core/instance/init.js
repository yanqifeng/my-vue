import { initState } from './state'
import { callHook } from './lifecycle'

export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        const vm = this

        vm.$options = options

        callHook(vm, 'beforeCreate')
        initState(vm)
        callHook(vm, 'created')

        if (vm.$options.el) {
            this.$mount(vm.$options.el)
        }
    }
}
