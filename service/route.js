let route = {
    get(...args) {
        buildRouteKey('get', args)
    },
    post(...args) {
        buildRouteKey('post', args)
    },
    put(...args) {
        buildRouteKey('put', args)
    },
    delete(...args) {
        buildRouteKey('delete', args)
    }
}

let route_map = {}

function buildRouteKey(method, args) {
    return route_map[method + args[0].replace('/', '_')] = args[1]
}

module.exports = {
    route_map,
    route
}