const path = require('path')
const querystring = require('querystring')
const { parseCookie, setCookie } = require('../../lib/cookie.js')
const { parseBody } = require('./parse-body.js')
const { parseSession } = require('../../lib/session.js')




async function extractDigest(req, res) {
    let hinge = {
        url: req.url,
        path: path.parse(req.url),
        method: req.method,
        req: req,
        res: res,
        query: querystring.parse(req.url.split('?')[1] + '&'),
        headers: req.headers,
        cookie: parseCookie(req.headers.cookie),
        session: {},
        resHeaders: {},
        resStatusCode: 200,
        setHeader(key, value) {
            this.resHeaders[key] = value
        },
        redirect(url) {
            this.resStatusCode = 302
            this.resHeaders['Location'] = url
        },
        setCookie(...args) {
            this.resHeaders['Set-Cookie'] = setCookie.apply(null, args)
        }
    }

    hinge.session = await parseSession(hinge)
    hinge.data = await parseBody(req)
    return hinge
}
module.exports = { extractDigest }