module.exports = {
    isObject: function(target) {
        return typeof target == 'object'
    },
    isString: function(target) {
        return typeof target == 'string'
    },
    objToStr: function(obj) {
        return JSON.stringify(obj)
    },
    observer: function(ob, key, retu) {
        Object.defineProperty(ob, key, {
            get() {
                return retu
            }
        })
    }
}