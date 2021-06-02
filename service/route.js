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

let RouteMap = {}

function buildRouteKey(method, args) {
    return RouteMap[method + args[0].replace('/', '_')] = args[1]
}

module.exports = {
    RouteMap,
    route
}