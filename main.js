/*!
 * Javascript Library
 * shy.js - v1.0.0 (2021-05-7T14:55:51+0800)
 * https://github.com/amdog/shy.js | Released under MIT license
 */
const entry = Object.create(null)
const { route } = require('./service/route.js')
const { deploy } = require('./service/http.js')
const { Plug } = require('./plug/index.js')

entry.beforeNext = (next) => {
    next()
}
entry.Route = route
entry.Plug = Plug
entry.deploy = deploy
entry.Controller = {}
entry.render = (filePath, d) => {
    return d
}
global.shy = entry

module.exports = entry