import Vue from '@/core/instance/index'
import { compiler } from '@/compiler/index'
import { Watcher } from '@/core/observer/watcher'
import { patch } from '@/core/vdom/patch'

Vue.prototype.__patch__ = patch

Vue.prototype.$mount = function (el) {
    new Watcher(this, function () {
        this._update(this._render())
    })
}

export default Vue
