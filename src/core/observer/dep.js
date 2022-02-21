let uid = 0

export class Dep {
    constructor () {
        this.id = uid++
        this.subs = []
    }

    addSub (sub) {
        this.subs.push(sub)
    }

    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify () {
        for (let i = 0, l = this.subs.length; i < l; i++) {
            this.subs[i].run()
        }
    }
}

Dep.target = null
