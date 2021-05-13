/*!
 * Javascript Library
 * shy.js - v1.0.0 (2021-05-7T14:55:51+0800)
 * https://github.com/amdog/shy.js | Released under MIT license
 */
const entry = Object.create(null)
const { route } = require('./lib/route.js')
const { deploy } = require('./service/service.js')
const { Plug } = require('./lib/plug')

entry.beforeNext = (next) => {
    next()
}
entry.Route = route
entry.Plug = Plug
entry.deploy = deploy
entry.Controller
global.shy = entry

module.exports = entry