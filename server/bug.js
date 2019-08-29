router.get('/login', async (req, res) => {

  // 原来做法
  // query('select * from im_user', (err, rows) => {
  //     res.json({
  //         code: 0,
  //         msg: '请求成功',
  //         data: rows
  //     })
  // })

  // 现在
  // const rows = await query('select * from im_user')
  // res.json({
  //   code: 0,
  //   msg: '请求成功',
  //   data: rows
  // })
  await console.log(req, res, "111")
})



// var jsonWrite = function (res, ret) {
//   if (typeof ret === 'undefined') {
//     res.send('err');
//   } else {
//     res.send(ret);
//   }
// }


const mysql = require('mysql')
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'my_database'
})

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function (sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {

          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

module.exports = query