var path = require('path')
var fs = require('fs')
var Router = require('koa-router')

var router = new Router({
  prefix: '/'
})

router.get('/', async ctx => {
  return ctx.render('index')
}).post('/', async ctx => {
  console.log(ctx.request.body)
})

module.exports = router.routes()
