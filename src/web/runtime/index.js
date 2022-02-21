import Vue from 'core/instance/index'
import { patch } from './patch'
import { mountComponent } from 'core/instance/lifecycle'

Vue.prototype.__patch__ = patch

Vue.prototype.$mount = function (el) {
    mountComponent(this, el)
}

export default Vue
