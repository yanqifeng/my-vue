import { observe } from "../observer/index"
import { Watcher } from "../observer/watcher"

export function initState (vm) {
    const opts = vm.$options
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
        initData(vm, opts.data)
    }
    if (opts.computed) initComputed(vm, opts.computed)
}

function initData (vm) {
    const data = vm.$options.data
    for (const key in data) {
        proxy(vm, data, key)
    }

    observe(data)
}

function proxy (target, sourceKey, key) {
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
            return sourceKey[key]
        },
        set: function proxySetter (val) {
            sourceKey[key] = val
        }
    })
}

function initComputed (vm, computed) {
    for (const key in computed) {
        const userDef = computed[key]
        new Watcher(
            vm,
            userDef
        )
        Object.defineProperty(vm, key, {
            get () {
                return userDef.call(this, this)
            }
        })
    }
}

function initMethods (vm, methods) {
    for (const key in methods) {
        vm[key] = methods[key].bind(vm)
    }
}
