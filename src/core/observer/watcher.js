import { Dep } from './dep'

export class Watcher {
    constructor (vm, cb) {
        this.vm = vm
        this.getter = cb
        this.value = this.get()
    }

    addDep (dep) {
        dep.addSub(this)
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
