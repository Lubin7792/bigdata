// 引入 http 模块
const http = require("http");
// 引入 fs 模块
const fs = require("fs");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const app = express();

var conn = mysql.createConnection({
  
  host: '132.232',
  user: 'lubin',
  password: 'lubin123',
  port: '3306',
  database: 'large_screen'

});
var sql = 'SELECT * FROM device_belt_status';

conn.connect();

var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    console.log("11")
    res.send('err');
  } else {
    console.log("22")

    console.log(ret);
    res.send(ret);
  }
}

//获取信息
app.get('/', function (req, res) {
   conn.query(sql, function (err, result) {
     if (err) {
       console.log(err);
     }
     // console.log(result);
     if (result[0] === undefined) {
       res.send('-1') //查询不出username，data 返回-1
     } else {
       console.log(res, result, "__________res, result1111111")
       // jsonWrite(res, result);
     }
   })

  // res.send('hello, express')
})

router.get('/getData', (req, res) => {
    console.log("44")

  var sql_name = $sql.user.select_name;
  // var sql_password = $sql.user.select_password;
  var params = req.body;
  console.log(params, "_____params");
  if (params.name) {
    sql_name += "where username ='" + params.name + "'";
  }
  console.log(sql_name, "_____sql_name")
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    // console.log(result);
    if (result[0] === undefined) {
      res.send('-1') //查询不出username，data 返回-1
    } else {
      console.log(res, result, "__________res, result")
      // jsonWrite(res, result);
    }
  })
});


app.listen(3000);
console.log('success listen at port: 3000')
