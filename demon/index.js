 const shy = require('shyjs')
 const config = require('./config.js')
 shy.deploy(config)
 config.session.store = new shy.Plug('redis').redis
 shy.beforeNext = (vector, next) => {
     if (vector.url == '/login' || vector.session.value) {
         next()
     } else {
         vector.redirect('/')
     }
 }
 class C extends shy.Plug {
     constructor() {
         super('mysql', 'art-template', 'redis')
     }
     async login(vector, b) {
         let message = ''
         let name = vector.data.nam
         let password = vector.data.pwd
         if (await this.mysql.select('user', { name: name, password: password })) {
             vector.session.set(name)
             vector.redirect('/about')
         } else {
             message = 'Error'
         }
         return message
     }
     async about(vector) {
         let name = vector.session.value
         if (name) {
             let goods = await this.mysql.select('tb_goods', '*')
             return this.art.template(__dirname + '/public/about.html', { name: name, goods: goods }).toString()
         } else {
             vector.redirect('/')
             return ''
         }
     }
     async add(vector) {
         await this.mysql.insert('tb_goods', { goods: vector.query.goods, city: vector.query.city, postal: vector.query.postal })
         vector.redirect('/about')
         return 'sucess'
     }
     exit(vector, b) {
         vector.session.del()
         vector.redirect('/')
     }
 }
 shy.Controller = new C()
 shy.Route.post('/login', shy.Controller.login)
 shy.Route.get('/about', shy.Controller.about)
 shy.Route.get('/exit', shy.Controller.exit)
 shy.Route.get('/add', shy.Controller.add)