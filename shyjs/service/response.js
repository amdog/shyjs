const { route_map } = require('../lib/route.js')
const { isObject, isString, objToStr } = require('../lib/kit.js')
const { toCallController } = require('./controller.js')
const fs = require('fs')
const path = require('path')

function render(data) {
    let color = '#dc3545'
    let type = 'Error'
    if (parseInt(data.status) >= 507) {
        color = '#ffc107'
        type = 'Warn'
    }
    if (global.config.mode != 'product') {
        return `<div data-shy style='padding-left: 10px;width:60%;position:fixed;top: 25%;left: 20%;height: 50%;background-color: black;opacity: 1;border-radius: 20px;color: white;'><div style='position: absolute;top:-20px;width: 140px;height: 50px;left:30px; background-color: ${color};font-size: 30px;border-radius: 3px;line-height: 40px;text-align:center;letter-spacing: 8px;font-weight: 800;'>${type}</div><br><br><div style='width: 100%;min-height: 60px;font-size: 24px;letter-spacing: 3px;border-bottom: solid 1px rgb(87, 86, 86);'>&nbsp;${data.type} STATUS <span style='background-color: rgb(56, 55, 55);'>${data.status}</span></div><br> ${data.message.replace(/\n/g,'<br>')}</div>`
    } else {
        return ''
    }
}

let createTemplate = {
    '200': (r) => {
        return {
            status: 200,
            data: r
        }
    },
    '403': (m) => {
        let data = {
            status: '403',
            type: 'Not found',
            message: `not find`
        }
        data.message = render(data)
        return data
    },
    '500': (e) => {
        let data = {
            status: '500',
            type: `${e.code}${e.message}`,
            message: `${e.stack}`
        }
        data.message = render(data)
        return data
    },
    '506': () => {
        let data = {
            status: '506',
            type: 'Controller run timeout',
            message: `The running time has exceeded ${global.config.timeOut}ms`
        }
        data.message = render(data)
        return data
    },
    '507': (result) => {
        let data = {
            status: '507',
            type: 'Format warning',
            message: `${result}`
        }
        data.message = render(data)
        return data
    }
}
let exten_name_list = {
    ".json": "application/json",
    ".zip": "application/zip",
    ".xml": "application/xml",
    ".wav": "audio/x-wav",
    ".txt": "text/plain",
    ".tar": "application/x-tar",
    ".svg": "image/svg+xml",
    ".ppt": "application/vnd.ms-powerpoint",
    ".png": "image/png",
    ".pdf": "application/pdf",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".js": "application/x-javascript",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".gif": "  image/gif",
    ".jpg": "image/jpeg",
    ".png": "image/png"
}

function eachDirFiles(dir) {
    let sub = []

    function childEach(tDir) {
        let files = fs.readdirSync(tDir)
        files.forEach(file => {
            let childPath = tDir + '/' + file
            let item = fs.statSync(childPath)
            if (item.isDirectory()) {
                childEach(childPath)
            }
            if (item.isFile()) {
                let p = childPath
                sub.push(p)
            }
        })
    }
    childEach(dir)
    return sub
}

let paths = []


function send(hinge, res) {
    let route_map_keys = Object.keys(route_map)
    let key_ = new URL('http://localhost' + hinge.url.origin).pathname.replace('/', '_')
    let key = hinge.method.toLocaleLowerCase() + key_
    if (route_map_keys.includes(key)) {
        toCallController(route_map[key], hinge)
            .then(([result, status]) => {
                if (!hinge.res.writableEnded) {
                    let template = objToStr(createTemplate[status](result))
                    if (parseInt(status) < 500) {
                        res.setHeader('Content-Type', 'application/json')
                    } else {
                        res.setHeader('Content-Type', 'text/html')
                    }

                    if (isObject(result) || isString(result)) {
                        if (isString(result)) {
                            res.removeHeader('Content-Type')
                            res.setHeader('Content-Type', 'text/html')
                            res.end(result)
                        } else {
                            res.end(template)
                        }
                    } else {
                        res.removeHeader('Content-Type')
                        res.setHeader('Content-Type', 'text/html')
                        res.end(objToStr(createTemplate['507'](result)))
                    }
                }

            })
    } else {
        let filePath = global.config.static + hinge.url.origin
        global.config.static && (paths = eachDirFiles(global.config.static))
        if (hinge.url.origin == '/') {
            filePath = global.config.static + '/index.html'
            hinge.url.origin = '/index.html'
        }
        if (paths.includes(filePath)) {
            fs.readFile(filePath, (e, d) => {
                let extend = path.extname(hinge.url.origin)
                if (exten_name_list[extend]) {
                    res.setHeader('Content-Type', exten_name_list[extend])
                } else {
                    res.setHeader('Content-Type', 'application/octet-stream')
                }
                res.end(d)
            })
        } else {
            call403(res, hinge)
        }
    }
}

function call403(res, hinge) {
    res.setHeader('Content-Type', 'text/html')
    let template = createTemplate['403'](hinge.url.origin)
    res.end(objToStr(template))
}
module.exports = { send }