 const shy = require('shyjs')
 const config = require('./config.js')

 config.session.store = new shy.Plug('redis').redis
 shy.deploy(config)

 shy.beforeNext = function(next) {
     console.log(this.session);

     if (this.url.origin == '/login' || this.session.value) {
         next()
     } else {
         this.redirect('/')
     }
 }
 class C extends shy.Plug {
     constructor() {
         super('mysql', 'art-template', 'redis')
     }
     async login(q) {
         let message = ''
         let name = this.data.nam
         let password = this.data.pwd
         if (await this.mysql.select('user', { name: name, password: password })) {
             this.session.set(name)
             this.redirect('/about')
         } else {
             message = 'Error'
         }
         return message
     }
     async about(q) {
         console.log(this.session.value);

         let name = this.session.value
         if (name) {
             let goods = await this.mysql.select('tb_goods', '*')
             return this.art.template(__dirname + '/public/about.html', { name: name, goods: goods }).toString()
         } else {
             this.redirect('/')
             return ''
         }
     }
     async add(q) {
         await this.mysql.insert('tb_goods', { goods: this.query.goods, city: this.query.city, postal: this.query.postal })
         this.redirect('/about')
         return 'sucess'
     }
     exit(q) {
         this.session.del()
         this.redirect('/')
     }
 }
 shy.Controller = new C()
 shy.Route.post('/login', shy.Controller.login)
 shy.Route.get('/about', shy.Controller.about)
 shy.Route.get('/exit', shy.Controller.exit)
 shy.Route.get('/add', shy.Controller.add)