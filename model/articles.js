var connect = require('../lib/index')
var log = new require('../public/log.js')()

/**
  @property {Char} type 文章类型 1：原创; 2：转载; 3：翻译
*/
let articles_sql = `CREATE TABLE IF NOT EXISTS articles(
                  id INT(13) NOT NULL AUTO_INCREMENT,
                  tag VARCHAR(100),
                  abstract VARCHAR(1024),
                  title VARCHAR(100),
                  content TEXT,
                  type VARCHAR(1),
                  author VARCHAR(150),
                  picture  VARCHAR(1024),
                  pv INT,
                  create_time TIMESTAMP,
                  update_time TIMESTAMP,
                  PRIMARY KEY( id )
                )`

connect.createTable(articles_sql).then((data) => {
  console.log('创建文章表成功')
}).catch((err) => {
  log.error('创建表文章表错误', JSON.stringify(err))
})

let addArticles = (values) => {
  let sql = `insert into articles set
             title = ?,
             tag = ?,
             abstract = ?,
             content = ?,
             type = ?,
             author = ?,
             picture = ?,
             pv = ?,
             create_time = ?,
             update_time = ?`
  return connect.query(sql, values)
}

let findArticles = () => {
  let sql = `select * from articles`
  return connect.query(sql, [])
}

let findArticlesById = (id) => {
  let sql = `select users.username, users.avatar, users.sign, articles.*
             from articles
             inner join users
             on articles.author = users.sourceId
             where articles.id = ${id}`
  return connect.query(sql, [])
}

let findArticlesByAuthor = (author) => {
  let sql = `select *
             from articles
             where author = '${author}'
             order by articles.update_time desc`
  return connect.query(sql, [])
}

let findArticlesList = (startRow, rowCount) => {
  let sql = `select users.username, users.avatar, users.sign, articles.*
             from articles
             inner join users
             on articles.author = users.sourceId
             order by articles.update_time desc
             limit ${startRow}, ${rowCount}`
  return connect.query(sql, [])
}

let updatePv = (articleId) => {
  let sql = `update articles
             set pv = pv + 1
             where
            	 id = ${articleId}`
  return connect.query(sql, [])
}

let updateArticleById = (articleId, values) => {
  let sql = `update articles set
             title = ?,
             tag = ?,
             abstract = ?,
             content = ?,
             type = ?,
             picture = ?,
             update_time = ?
             where id = ${articleId}`
  return connect.query(sql, values)
}

module.exports = {
  addArticles,
  findArticles,
  findArticlesById,
  findArticlesByAuthor,
  findArticlesList,
  updatePv,
  updateArticleById
}
