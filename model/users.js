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
  let sql = `insert into users set sourceId = ?,
             username = ?,
             password = ?,
             gender = ?,
             avatar = ?,
             sign = ?,
             source = ?,
             create_time = ?,
             update_time = ?`
  return connect.query(sql, values)
}

let findUserByName = (name) => {
  let sql = `select * from users where username = "${name}" and source="native"`
  return connect.query(sql, [])
}

let findUserBySourceId = (sourceId) => {
  let sql = `select * from users where sourceId = "${sourceId}"`
  return connect.query(sql, [])
}

let updateGithubUserById = (name, imgUrl, updateTime, id) => {
  let sql = `update users
             set username = "${name}", avatar = "${imgUrl}", update_time="${updateTime}"
             where sourceId = "${id}"`
  return connect.query(sql, [])
}

let updateUserInfoById = (userInfo, source)  => {
  let sqlGithub = `update users
                   set gender = "${userInfo.gender}",
                       sign = "${userInfo.sign}",
                       update_time = "${userInfo.updateTime}"
                   where sourceId = "${userInfo.sourceId}"`
  let sqlNative = `update users
                   set username = "${userInfo.username}",
                       gender = "${userInfo.gender}",
                       avatar = "${userInfo.avatar}",
                       sign = "${userInfo.sign}",
                       update_time = "${userInfo.updateTime}"
                   where sourceId = "${userInfo.sourceId}"`
  return connect.query(source === 'github' ? sqlGithub : sqlNative, [])
}

let updatePasswordById = (password, id) => {
  let sql = `update users set password = "${password}" where sourceId = "${id}"`
  return connect.query(sql, [])
}

let getUserInfoBySourceId = (sourceId) => {
  return new Promise((resolve, reject) => {
    findUserBySourceId(sourceId).then(data => {
      if (data.length) {
        delete data[0].password
        resolve(data[0])
      } else {
        resolve(null)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = {
  addUser,
  findUserByName,
  findUserBySourceId,
  updateGithubUserById,
  updateUserInfoById,
  updatePasswordById,
  getUserInfoBySourceId
}
