// 引入 http 模块
var oracledb = require('oracledb');
var config = {
  user: 'hhggk',
  password: 'Thebigdata_2019',
  connectString: "10.60.127.64:1521/orcl"
};

var query = function (callback) {

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
        connection.close();
        callback((result)=>{
          return result.metaData

        })
          console.log("444")

          // doRelease(connection);

      });
          console.log("555")

  });
}
function doRelease(connection) {
  connection.close(
    function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}
exports.query = query;