const { log } = require('../../lib/log.js')
const { isFileInstatic, isObject } = require('../../lib/kit.js')
const path = require('path')

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
        if (shy.render) {
            let url = new URL('http://localhost' + hinge.url).pathname
            let filePath
            if (global.config.static) {
                filePath = isFileInstatic(url, global.config.static)
            }
            if (filePath && isObject(data) && shy.render) {
                res(shy.render(path.join(module.parent.parent.parent.parent.path, filePath), data).toString())
            } else {
                res(data)
            }
        } else {
            res(data)
        }
    })
}


module.exports = { toCallController }