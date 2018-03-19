var connect = require('../lib/index')
var log = new require('../public/log.js')()

let users_sql = `CREATE TABLE IF NOT EXISTS users(
                  id INT NOT NULL AUTO_INCREMENT,
                  sourceId VARCHAR(150),
                  username VARCHAR(150) NOT NULL,
                  password VARCHAR(150),
                  gender INT(1),
                  avatar VARCHAR(1024) NOT NULL,
                  sign VARCHAR(48),
                  source VARCHAR(150) NOT NULL,
                  create_time TIMESTAMP,
                  update_time TIMESTAMP,
                  PRIMARY KEY( id )
                )`

connect.createTable(users_sql).then((data) => {
  console.log('创建成功')
}).catch((err) => {
  log.error('创建表错误', JSON.stringify(err))
})

let addUser = (values) => {
  let sql = 'insert into users set sourceId=?,username=?,password=?,gender=?,avatar=?,sign=?,source=?,create_time=?,update_time=?;'
  return connect.query(sql, values)
}

let findUserByName = (name) => {
  let sql = `select * from users where username="${name}"`
  return connect.query(sql, [])
}

let findUserBySourceId = (sourceId) => {
  let sql = `select * from users where sourceId="${sourceId}"`
  return connect.query(sql, [])
}

module.exports = {
  addUser: addUser,
  findUserByName: findUserByName,
  findUserBySourceId: findUserBySourceId
}
