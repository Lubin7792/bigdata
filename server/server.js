// 引入 http 模块
const http = require("http");
// 引入 fs 模块
const fs = require("fs");
const mysql = require('mysql');
const oracledb = require('oracledb');
const httpPort = 7000;

// app.use(cors());





// var mysqlGet = mysql.createConnection({

//   host: '10.60.127.135',
//   user: 'dnjk@dnjk_tenant',
//   password: '!QAZ2wsx',
//   port: '8107',
//   database: 'large_screen'
// });
//     mysqlGet.connect();

async function init() {
  try {
    await oracledb.createPool({
      user: 'hhggk',
      password: 'hhggk',
      connectString: "10.60.1.87:1521/orcl"
    });
   
    // Create HTTP server and listen on port httpPort
    const server = http.createServer();
    server.on('error', (err) => {
      console.log('HTTP server problem: ' + err);
    });
    server.on('request', (request, response) => {
      handleRequest(request, response);
    });
    await server.listen(httpPort);
    console.log("Server running at http://localhost:" + httpPort);
  } catch (err) {
    console.error("init() error: " + err.message);
  }
}
async function handleRequest(request, response) {
  const urlparts = request.url.split("/");
  const deptid = urlparts[1];
  let pathName = request.url;
console.log(request.url)
  // 默认加载路径
  if (pathName == "/") {
    // 默认加载的首页
    pathName = "index.html";
  }
  if (pathName != "/favicon.ico") {
    fs.readFile("../server/" + pathName, (err, data) => {
      if (err) {
        // 如果不存在这个文件
        // console.log("404sss Not Found!");
        return;
      } else {
        response.end(data)
      }
    });
  }



  let connection;
  try {
    connection = await oracledb.getConnection();
     const pool = mysql.createPool({
       host: '10.60.127.135',
       user: 'dnjk@dnjk_tenant',
       password: '!QAZ2wsx',
       port: '8107', 
       database: 'large_screen'
     })

    if (request.method == "GET") {
      if (deptid == "getStack") {
        const result = await connection.execute(`SELECT 
        t.PILENO as pileno,
        t.STOCKNUM as curstocknum,
        t.temperature
         from view_stock_now t where t.ISPILEENABLE = '1'
        order by PILENO asc `)
        response.end(JSON.stringify(result))
      }
      if (deptid == "getShip") {
        const result =await connection.execute(
          `SELECT BERTHID, SHIPNAME from RECORD_BERTH where fid in (select max(FID) from RECORD_BERTH group by BERTHID)`)
          response.end(JSON.stringify(result))
        
      }
      if (deptid == "getBelt") {
        var sql = 'SELECT * FROM device_belt_status';
        pool.getConnection(function (err, connection) {
          if (err) {
            response.end(err)
          } else {
            connection.query(sql, (err, result) => {
              if (err) {
                response.end('错误')
                console.log(err);
              } 
              if (result[0] === undefined) {
                response.end('-1') //查询不出username，data 返回-1
              } else {
                response.end(JSON.stringify(result))
              }
              // 结束会话
              connection.release()
            })
          }
        })
        // pool.query(sql, function (err, result) {
        //   if (err) {
        //     response.end('错误')
        //     console.log(err);
        //   }
        //   if (result[0] === undefined) {
        //     response.end('-1') //查询不出username，data 返回-1
        //   } else {
        //     response.end(JSON.stringify(result))
        //   }
        // })
      }
    }
  } catch (err) {
    console.log(err)
    // handleError(response, "handleRequest() error", err);
  } finally {
    if (connection) {
      try {
        // Release the connection back to the connection pool
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
  // htmlFooter(response);
}
async function closePoolAndExit() {
  console.log("\nTerminating");
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    await oracledb.getPool().close(10);
    console.log("Pool closed");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT', closePoolAndExit);

init();