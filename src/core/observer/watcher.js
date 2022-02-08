import { Dep } from './dep'

let uid = 0

export class Watcher {
    constructor (vm, cb) {
        this.vm = vm
        this.id = ++uid
        this.newDepIds = new Set()
        this.getter = cb
        this.value = this.get()
    }

    addDep (dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            dep.addSub(this)
        }
    }

    run = function () {
        this.get()
    }

    get = function () {
        Dep.target = this
        const value = this.getter.call(this.vm)
        Dep.target = null
        return value
    }
}
