
import { Dep } from './dep'

class Observer {
    constructor (value) {
        this.value = value

        this.walk(value)
    }

    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}

export function observe (value) {
    new Observer(value)
}

export function defineReactive (obj, key) {
    const dep = new Dep()
    let val = obj[key]
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            if (Dep.target) {
                dep.depend(Dep.target)
            }
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal
            dep.notify()
        }
    })
}
