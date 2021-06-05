const crypto = require('crypto')
let SessionStore = {}

function storeClock() {
    let configSession = global.config.session
    if (configSession && configSession.store) {
        setInterval(() => {
            for (let key in SessionStore) {
                SessionStore[key][1] -= 1000
                if (SessionStore[key][1] < 0) {
                    delete SessionStore[key]
                }
            }
        }, 1000)
    }
}


async function parseSession(hinge) {
    let configSession = global.config.session

    if (configSession) {
        let session = {
            set: (key) => {
                let hash = crypto.createHash('md5')
                hash.update(key)
                hash.update(Math.random().toString())
                let k = hash.digest('hex')
                hinge.setCookie(configSession.cookieKey, k, configSession)
                hinge.setHeader('Authorization', k)

                if (configSession.store) {
                    configSession.store.set(k, key)
                    configSession.store.expire(k, configSession.maxAge)
                } else {
                    SessionStore[k] = [key, configSession.maxAge]
                }
            },
            get: async(key) => {
                if (configSession.store) {
                    return await configSession.store.get(key)
                } else {
                    if (SessionStore[key]) {
                        return new Promise(res => {
                            res(SessionStore[key][0])
                        })
                    } else {
                        return new Promise(res => {
                            res(null)
                        })
                    }
                }
            },
            del() {
                let sign_id = hinge.cookie[configSession.cookieKey]
                if (configSession.store) {
                    return configSession.store.del(sign_id)
                } else {
                    delete SessionStore[key]
                }
                hinge.setCookie(configSession.cookieKey, sign_id, { maxAge: -1 })
            }
        }

        let key = configSession.cookieKey


        if (!hinge.cookie[key]) {
            key = hinge.headers['authorization']
            if (key) {
                session[key] = key
                session.value = await session.get(key)
            }
        } else {
            session[key] = hinge.cookie[key]
            session.value = await session.get(session[key])
        }
        return session
    } else {
        return {}
    }
}

module.exports = { parseSession, SessionStore, storeClock }