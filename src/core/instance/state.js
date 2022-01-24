import { observe } from "../observer/index"

export function initState (vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm, opts.data)
    }
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
