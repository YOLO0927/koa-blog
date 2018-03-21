var Router = require('koa-router')

var router = new Router({
  prefix: '/article'
})

router
  .get('/create', async ctx => {
    // let userInfo = ctx.session.userInfo
    return ctx.render('create')
  })

module.exports = router.routes()
