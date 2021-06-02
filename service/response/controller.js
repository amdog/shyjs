const { log } = require('../../lib/log.js')

function toCallController(controller, hinge) {
    let config = global.config

    return new Promise(async res => {
        let runClock = setTimeout(() => {
            res([null, 'runTimeOut'])
        }, config.timeOut)

        function errorCatch(e) {
            if (config.logDir) {
                log(hinge.req, e)
                console.log(e);
            }
            clearTimeout(runClock)
            res([e, 'serviceError'])
        }
        let shy = global.shy
        if (shy.Controller) {
            Object.assign(shy.Controller, hinge)
            if (shy.beforeNext) {
                await shy.beforeNext.call(shy.Controller, async(...args) => {
                    (async function() {
                        try {
                            res([await afterContoller(shy, hinge, await controller.call(shy.Controller, hinge.query, args)), 'success', shy.Controller])
                        } catch (e) {
                            errorCatch(e)
                        }
                    })();
                })
            } else {
                (async function() {
                    try {
                        res([await afterContoller(shy, hinge, await controller.call(shy.Controller, hinge.query)), 'success', shy.Controller])
                    } catch (e) {
                        errorCatch(e)
                    }
                })();
            }
        } else {
            throw new Error('not defined Contoller!')
        }
    })
}

function afterContoller(shy, hinge, data) {
    return new Promise(res => {
        if (shy.Controller.afterContoller) {
            shy.Controller.afterContoller(data, hinge, (r) => {
                res(r)
            })
        } else {
            res(data)
        }
    })
}


module.exports = { toCallController }