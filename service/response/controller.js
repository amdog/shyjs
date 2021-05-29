const { log } = require('../../lib/log.js')


function toCallController(controller, hinge) {
    let config = global.config
    let vm = {
        return: {}
    }
    return new Promise(async res => {
        let runClock = setTimeout(() => {
            res([null, 'runTimeOut'])
        }, config.timeOut)
        Object.defineProperty(vm, 'return', {
            set(new_value) {
                clearTimeout(runClock)
                if (shy.Controller.afterContoller) {
                    shy.Controller.afterContoller(new_value, hinge, (data) => {
                        res([data, 'success'])
                    })
                } else {
                    res([new_value, 'success'])
                }
            }
        })
        let shy = global.shy
        if (shy.Controller) {
            Object.assign(shy.Controller, hinge)
            if (shy.beforeNext) {
                await shy.beforeNext.call(shy.Controller, async(...args) => {
                    (async function() {
                        try {
                            vm.return = await controller.call(shy.Controller, hinge.query)
                        } catch (e) {
                            if (config.logDir) {
                                log(hinge.req, e)
                            }
                            clearTimeout(runClock)
                            res([e, 'serviceError'])
                        }
                    })();
                })
            } else {
                (async function() {
                    try {
                        vm.return = await controller.call(shy.Controller, hinge.query)
                    } catch (e) {
                        if (config.logDir) {
                            log(hinge.req, e)
                        }
                        clearTimeout(runClock)
                        res([e, 'serviceError'])
                    }
                })();
            }
        } else {
            throw new Error('not defined Contoller!')
        }
    })
}

module.exports = { toCallController }