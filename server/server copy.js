// 引入 http 模块
const http = require("http");
// 引入 fs 模块
const fs = require("fs");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors')
const router = express.Router();
const oracleData = require("./oracle")
const app = express();

app.use(cors())
var conn = mysql.createConnection({

  host: '10.60.127.135',
  user: 'dnjk@dnjk_tenant',
  password: '!QAZ2wsx',
  port: '8107',
  database: 'large_screen'
  // host: '132.232.68.38',
  // user: 'lubin',
  // password: 'lubin123',
  // port: '3306',
  // database: 'large_screen'

});
var sql = 'SELECT * FROM device_belt_status';


conn.connect();

var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.send('err');
  } else {
    res.send(ret);
  }
}

//获取信息
router.get('/getData', (req, res) => {
  conn.query(sql, function (err, result) {
    if (err) {
      res.send('错误')
      console.log(err);
    }
    if (result[0] === undefined) {
      res.send('-1') //查询不出username，data 返回-1
    } else {
      res.send(result)
    }
  })
});
app.use(router)

app.listen(3000);
console.log('success listen at port: 3000')