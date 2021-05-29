const fs = require('fs')
const path = require('path')




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

let static_paths

function isFileInstatic(url, dir) {
    url = url == '/' ? 'index.html' : url
    let filePath = path.join(dir, url).replace('\\', '/')
    dir && (static_paths = eachDirFiles(dir))
    if (static_paths.includes(filePath)) {
        return filePath
    } else {
        return false
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

function isObject(target) {
    return typeof target == 'object'
}

function isString(target) {
    return typeof target == 'string'
}

function isString(target) {
    return typeof target == 'string'
}

function objToStr(obj) {
    return JSON.stringify(obj)
}

function observer(ob, key, retu) {
    Object.defineProperty(ob, key, {
        get() {
            return retu
        }
    })
}

module.exports = { isFileInstatic, isString, isObject, objToStr, observer, exten_name_list }