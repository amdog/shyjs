const { log } = require('../lib/log.js')



function toCallController(controller, hinge) {
    let vm = {
        return: {}
    }
    return new Promise(async res => {
        let runClock = setTimeout(() => {
            res([null, '506'])
        }, global.config.timeOut)
        Object.defineProperty(vm, 'return', {
            set(new_value) {
                clearTimeout(runClock)
                res([new_value, '200'])
            }
        })
        try {
            if (global.shy.Controller) {

                Object.assign(global.shy.Controller, hinge)

                if (global.shy.beforeNext) {
                    await global.shy.beforeNext.call(global.shy.Controller, async(...args) => {
                        vm.return = await controller.call(global.shy.Controller, hinge.query, args)
                    })
                } else {
                    vm.return = await controller.call(global.shy.Controller, hinge.query)
                }
            } else {
                throw new Error('not defined Contoller!')
            }
        } catch (e) {
            console.log(e);
            if (global.config.logDir) {
                log(hinge.req, e)
            }
            if (e) {
                clearTimeout(runClock)
                res([e, '500'])
            }
        }
    })
}
module.exports = { toCallController }