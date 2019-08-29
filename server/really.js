const http = require('http');
const oracledb = require('oracledb');

const httpPort = 7000;

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
      // console.log(request,"_____", response)
      // response.end("123", request.)
      // response.end(request)
    });
    await server.listen(httpPort);
    console.log("Server running at http://localhost:" + httpPort);
  } catch (err) {
    console.error("init() error: " + err.message);
  }
}

async function handleRequest(request, response) {
  var config = {
    user: 'hhggk',
    password: 'hhggk',
    connectString: "10.60.1.87:1521/orcl"
  };
  let connection;
  try {
    // oracledb.getConnection(
    //   config,
    //   function (err, connection) {
    //     if (err) {
    //       return;
    //     }
    //     connection.execute("select * from view_stock_now ",
    //       function (err, result) {
    //         if (err) {
    //           return;
    //         }
    //         //打印返回的表结构
    //         response.end(JSON.stringify(result.metaData))
    //       });
    //   });
    connection = await oracledb.getConnection();
    const result = await connection.execute(`SELECT 
        t.PILENO as pileno,
        t.STATUS as status,
        t.STOCKNUM as curstocknum
         from view_stock_now t where t.ISPILEENABLE = '1'
        order by PILENO asc `)
            response.end(JSON.stringify(result))



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

// Report an error
function handleError(response, text, err) {
  if (err) {
    text += ": " + err.message;
  }
  console.error(text);
  response.write("<p>Error: " + text + "</p>");
}

// Display query results
function displayResults(response, result, deptid) {
  response.write("<h2>" + "Employees in Department " + deptid + "</h2>");
  // response.write("<table>");

  // Column Title
  // response.write("<tr>");
  // for (let col = 0; col < result.metaData.length; col++) {
  //   response.write("<th>" + result.metaData[col].name + "</th>");
  // }
  response.write(result.metaData, result.rows);
}

function htmlFooter(response) {
  response.write("</body>\n</html>");
  response.end();
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