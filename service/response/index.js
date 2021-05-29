const { route_map } = require('../route.js')
const { isObject, isString, objToStr, isFileInstatic, exten_name_list } = require('../../lib/kit.js')
const { toCallController } = require('./controller.js')
const fs = require('fs')
const path = require('path')

function render(data) {
    let config = global.config
    let color = '#dc3545'
    let type = 'Error'
    if (parseInt(data.code) >= 507) {
        color = '#ffc107'
        type = 'Warn'
    }
    if (config.mode != 'product') {
        return `<div data-shy style='padding-left: 10px;width:60%;position:fixed;top: 25%;left: 20%;height: 50%;background-color: black;opacity: 1;border-radius: 20px;color: white;'><div style='position: absolute;top:-20px;width: 140px;height: 50px;left:30px; background-color: ${color};font-size: 30px;border-radius: 3px;line-height: 40px;text-align:center;letter-spacing: 8px;font-weight: 800;'>${type}</div><br><br><div style='width: 100%;min-height: 60px;font-size: 24px;letter-spacing: 3px;border-bottom: solid 1px rgb(87, 86, 86);'>&nbsp;${data.type} code: <span style='background-color: rgb(56, 55, 55);'>${data.code}</span></div><br> ${data.message.replace(/\n/g,'<br>')}</div>`
    } else {
        return ''
    }
}

let createTemplate = {
    'success': (r) => {
        return {
            code: 1,
            data: r
        }
    },
    'notFind': (m) => {
        let data = {
            code: 0,
            type: 'Not found',
            message: `not find`
        }
        data.message = render(data)
        return data
    },
    'serviceError': (e) => {
        let data = {
            code: 0,
            type: `${e.code}${e.message}`,
            message: `${e.stack}`
        }
        data.message = render(data)
        return data
    },
    'runTimeOut': () => {
        let data = {
            code: 0,
            type: 'Controller run timeout',
            message: `The running time has exceeded ${config.timeOut}ms`
        }
        data.message = render(data)
        return data
    },
    'formatWarning': (result) => {
        let data = {
            code: 3,
            type: 'Format warning',
            message: `${result}`
        }
        data.message = render(data)
        return data
    }
}



function send(hinge, res) {
    let url = hinge.url.origin
    let route_map_keys = Object.keys(route_map)
    let key_ = new URL('http://localhost' + url).pathname.replace('/', '_')
    let key = hinge.method.toLocaleLowerCase() + key_
    let config = global.config

    if (route_map_keys.includes(key)) {
        toCallController(route_map[key], hinge)
            .then(([result, mes]) => {
                if (!hinge.res.writableEnded) {
                    let template = objToStr(createTemplate[mes](result))
                    if (mes == 'success' && isObject(result)) {
                        res.setHeader('Content-Type', 'application/json')
                        res.end(template)
                    }
                    if (mes != 'success') {
                        res.setHeader('Content-Type', 'text/html')
                        res.end(template)
                    }
                    if (mes == 'success' && isString(result)) {
                        res.setHeader('Content-Type', 'text/html')
                        res.end(result)
                    }
                    if (!isString(result) && !isObject(result)) {
                        res.removeHeader('Content-Type')
                        res.setHeader('Content-Type', 'text/html')
                        res.end(objToStr(createTemplate['formatWarning'](result)))
                    }
                }

            })
    } else {
        let url = hinge.url.origin
        if (config.static) {
            let filePath = isFileInstatic(url, config.static)
            if (filePath) {
                fs.readFile(filePath, (e, d) => {
                    let exten = path.extname(filePath)
                    if (exten_name_list[exten]) {
                        res.setHeader('Content-Type', exten_name_list[exten])
                    } else {
                        res.setHeader('Content-Type', 'application/octet-stream')
                    }
                    res.end(d)
                })
            } else {
                call403(res, url)
            }
        } else {
            call403(res, url)
        }

    }
}

function call403(res, url) {
    res.setHeader('Content-Type', 'text/html')
    let template = createTemplate['notFind'](url)
    res.end(objToStr(template))
}


module.exports = { send }