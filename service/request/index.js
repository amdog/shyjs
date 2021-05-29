const path = require('path')
const querystring = require('querystring')
const { parseCookie, setCookie } = require('../../lib/cookie.js')
const { parseBody } = require('./parse-body.js')
const { parseSession } = require('../../lib/session.js')


function redirect(res, url) {
    res.statusCode = 302
    if (!res.writableEnded) {
        res.setHeader('Location', url)
        res.end()
    }
}

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

module.exports = { extractDigest }