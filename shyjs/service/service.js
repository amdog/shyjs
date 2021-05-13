const { printInfo } = require('../lib/console.js')
const { isObject } = require('../lib/kit.js')
const { send } = require('./response.js')
const http = require('http')
const { parseBody } = require('./parse-body.js')
const { parseSession, storeClock } = require('../lib/session.js')
const { defaultConf } = require('./config.js')
const path = require('path')
const querystring = require('querystring')
const { parseCookie, setCookie } = require('../lib/cookie.js')

function main(req, res) {
    extractDigest(req, res)
        .then(hinge => {
            send(hinge, res)
        })
};

function deploy(conf) {
    if (!conf) { conf = {} }
    let config = defaultConf(conf)
    global.config = config
    storeClock()
    http.createServer((req, res) => {
        if (req.method == 'OPTIONS') {
            setHeader(res)
            res.end()
        } else {
            main(req, res)
        }
    }).listen(config.port)
    printInfo(config)
}

function setHeader(res) {
    if (!config.headers && !res.writableEnded) {
        if (isObject(config.headers)) {
            Object.keys(config.headers).forEach(v => {
                res.setHeader(v, config.headers[v])
            })
        }
    }
}

function redirect(res, url) {
    res.statusCode = 302
    if (!res.writableEnded) {
        res.setHeader('Location', url)
        res.end()
    }
}

module.exports = { deploy, setHeader }

async function extractDigest(req, res) {
    let hinge = {
        url: Object.assign({ origin: req.url }, path.parse(req.url)),
        method: req.method,
        req: req,
        res: res,
        query: querystring.parse(req.url.split('?')[1] + '&'),
        headers: req.headers,
        cookie: parseCookie(req.headers.cookie),
        session: {},
        redirect(url) {
            redirect(res, url)
        },
        setCookie(...args) {
            setCookie.apply(res, args)
        }
    }
    hinge.session = await parseSession(hinge)
    hinge.data = await parseBody(req)
    return hinge
}

module.exports = { deploy }