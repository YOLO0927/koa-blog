var moment = require('moment')
var Router = require('koa-router')
var md = require('markdown-it')()
var articleModel = require('../model/articles')
var saveBase64 = require('../public/saveBase64').save
var log = new require('../public/log.js')()
var countdown = require('../public/countdown.js').countdown

var router = new Router({
  prefix: '/article'
})

router
  .get('/create', async ctx => {
    // let userInfo = ctx.session.userInfo
    return ctx.render('create')
  })
  .post('/addArticles', async ctx => {
    try {
      if (!ctx.request.body.content) {
        throw new Error('文章内容不能为空')
      }
      if (!ctx.request.body.title) {
        throw new Error('文章标题不能为空')
      }
      if (!ctx.request.body.content) {
        throw new Error('文章类型不能为空')
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        data: {},
        msg: e.message
      }
    }

    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    let picture = await saveBase64(ctx.request.body.picture).then(imgName => {
      return imgName
    })
    let args = [
      ctx.request.body.title,
      ctx.request.body.tag || null,
      ctx.request.body.abstract || null,
      ctx.request.body.content,
      ctx.request.body.type,
      ctx.session.userInfo.sourceId,
      picture || null,
      1,
      time,
      time
    ]
    let createSuccess = await articleModel.addArticles(args).then(data => {
      ctx.body = {
        code: data ? 1 : -1,
        data: {},
        msg: data ? '创建文章成功' : '创建文章失败，请重试'
      }
    }).catch(err => {
      log.error('创建文章失败', JSON.stringify(err))
      return false
    })
  })
  .get('/:id', async ctx => {
    // 先更新 pv再查询文章
    let articleData = await Promise.all([articleModel.updatePv(ctx.params.id), articleModel.findArticlesById(ctx.params.id)]).then(data => {
      console.log(data)
      try {
        if (!data[1].length) {
          throw new error('未查询到该文章')
        }
        return data[1][0]
      } catch (err) {
        log.error('更新', err.message)
      }
    }).catch(err => {
      log.error('查询文章或更新pv错误', JSON.stringify(err))
    })
    return ctx.render('article', {
      article: Object.assign({}, articleData, {
        update_time: moment(articleData.update_time).format('YYYY-MM-DD HH-mm'),
        content: md.render(articleData.content)
      })
    })
  })
  .get('/author/:username', async ctx => {
    let articles = await articleModel.findArticlesByAuthor(ctx.session.userInfo.sourceId).then(articles => {
      return articles
    }).catch(err => {
      log.error('查询用户文章错误', JSON.stringify(err))
    })

    // 该用户的文章统计数据
    let staticties = {
      articleType1: 0,
      articleType2: 0,
      articleType3: 0,
      pvCount: 0,
      articleCount: articles.length
    }

    articles.forEach((article) => {
      Object.assign(article, {countdown: countdown(article.update_time)})
      if (article.type === '1') {
        staticties.articleType1 ++
      } else if (article.type === '2') {
        staticties.articleType2 ++
      } else if (article.type === '3') {
        staticties.articleType3 ++
      }
      staticties.pvCount += article.pv
    })
    return ctx.render('person', {
      articles,
      staticties
    })
  })
  .get('/:id/edit', async ctx => {
    let articleData = await articleModel.findArticlesById(ctx.params.id).then(data => {
      if (data.length) {
        return data[0]
      } else {
        log.error('未找到该ID的文章', ctx.params.id)
      }
    }).catch(err => {
      log.error('查询文章失败', JSON.stringify(err))
    })
    return ctx.render('editArticle', {article: articleData})
  })
  .post('/:id/edit', async ctx => {
    let allowUpdate = await articleModel.findArticlesById(ctx.params.id).then(data => {
      if (data.length) {
        return data[0].author === ctx.session.userInfo.sourceId
      } else {
        return false
      }
    })
    if (!allowUpdate) {
      ctx.body = {
        code: -1,
        data: {},
        msg: '您没有权限修改此文章'
      }
    } else {
      try {
        if (!ctx.request.body.content) {
          throw new Error('文章内容不能为空')
        }
        if (!ctx.request.body.title) {
          throw new Error('文章标题不能为空')
        }
        if (!ctx.request.body.content) {
          throw new Error('文章类型不能为空')
        }
      } catch (e) {
        ctx.body = {
          code: -1,
          data: {},
          msg: e.message
        }
      }
      let time = moment().format('YYYY-MM-DD HH:mm:ss')
      let picture = await saveBase64(ctx.request.body.picture).then(imgName => {
        return imgName
      })
      let update = await articleModel.updateArticleById(ctx.params.id, [
        ctx.request.body.title,
        ctx.request.body.tag || null,
        ctx.request.body.abstract || null,
        ctx.request.body.content,
        ctx.request.body.type,
        picture || null,
        time
      ]).then(data => {
        return data ? true : false
      }).catch(err => {
        log.error('更新文章失败', JSON.stringify(err))
      })
      ctx.body = {
        code: update ? 1 : -1,
        data: {},
        msg: update ? '更新文章成功' : '更新失败，请重试'
      }
    }
  })

module.exports = router.routes()
