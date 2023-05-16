//lighthouserc.js文件
module.exports = {
    ci: {
       
      collect: {
        // 配置启动的命令
        // startServerCommand: 'yarn run dev',
        // 测试的页面，可配置多个，如果是开启startServerCommand，则可以跑当前项目的页面，不开启的话可以写死
        url: ['https://wisdom-test.magic-school.com/'],
        // 运行次数，默认3次
        numberOfRuns: 1,
        settings: {
          // 根据实际配置，完整settings可看文档 https://github.com/GoogleChrome/lighthouse/blob/575e29b8b6634bfb280bc820efea6795f3dd9017/types/externs.d.ts#L141-L186
          // 只审查某分类
          onlyCategories: ['performance'],
          // 只执行部分审查
          onlyAudits: ['first-meaningful-paint', 'speed-index','interactive'],
          // 跳过某些审查
          // skipAudits:[],
          // 配置网络
          throttling:{},
          // 配置查看报告的网站是否中文，默认是英文
          locale: "zh",
        }
      },
      upload: {
        // "target": "filesystem"
            target: "lhci",
        // 刚才生成指令时所配置好的服务器上传地址，build token需要填进去。
          serverBaseUrl: "http://127.0.0.1:18405",
          // commitSha: "1781a912502844dbe5f975b54550e6168c5d96b1",
          token:"382da973-cb76-439e-a3f4-2e98d8284f5c",
          buildToken: "Ql8zQgyt9OJLy2669wF1BoneThESQ31d4A4hKDE6",
          branches: ["master"],
        basicAuth: {
          username: "admin",
          password: "123456"
        }
      },
    }
  }
  