function parseCookie(cookie) {
    if (!!cookie) {
        let str = cookie.replace(/[;=]/g, '#').split('#')
        let result = {}
        str.forEach((v, k) => {
            if (k % 2 == 0) {
                result[str[k].trim()] = str[k + 1].trim()
            }
        })
        return result
    } else {
        return {}
    }
}

function setCookie(key, value, options) {
    let expires = ''
    let maxAge = ''
    if (!!options.expires) {
        expires = `Expires=${options.expires};`
    }
    if (!!options.maxAge) {
        maxAge = `Max-Age=${options.maxAge};`
    }
    if (!this.writableEnded) {
        this.setHeader('Set-Cookie', `${key}=${value};${expires}${maxAge}path=${options.path?options.path:'/'};${options.domain?options.domain+';':''}${options.secure?'Secure;':''} ${options.httpOnly?'HttpOnly;':''}`)
    }
}

module.exports = { parseCookie, setCookie }