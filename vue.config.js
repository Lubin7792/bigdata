module.exports = {
  baseUrl: './', // 配置基本url
  devServer: {
    host: "localhost",
    port: 8088, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    proxy: 'http://127.0.0.1:3000', // 配置跨域处理,只有一个代理
    // 配置多个代理
    // proxy: {·
    //   "/api": {
    //     target: "http://localhost:4000",
    //     ws: true,
    //     changeOrigin: true
    //   }
    // }
  }
}