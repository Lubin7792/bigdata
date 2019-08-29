const http = require("http");
const express = require('express');
const cors = require('cors')
const router = express.Router();
const oracleData = require("./oracle")

const app = express();
var oracledb = require('oracledb');
var config = {
  user: 'hhggk',
  password: 'Thebigdata_2019',
  connectString: "10.60.127.64:1521/orcl"
};

router.get('/getData', (req, res) => {

  oracledb.getConnection(
    config,
    function (err, connection) {
      if (err) {
        return;
      }
      connection.execute("select * from view_stock_now ",
        function (err, result) {
          if (err) {
            console.log("111")
            doRelease(connection);
            return;
          }
          //打印返回的表结构
          console.log(result.metaData)
          // oracledb.getPool().close(10);
       
        });
      console.log("555")

    });
  })

  app.use(router)

  app.listen(7000);