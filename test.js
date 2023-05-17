const { lighthouse } = require('lighthouse-ci');

(async () => { 
  const result = await lighthouse('https://example.com', {
    output: 'json',
  });
  
  await lighthouse.upload({
    target: 'filesystem',
    report: result.report,
  });

})()

要将 Lighthouse 报告上传到 Lighthouse CI 服务器，您需要使用 `lhci upload` 命令，并指定要上传的报告文件的路径。默认情况下，Lighthouse CI 服务器将在上传报告后自动运行分析，并将结果发送到您的 Slack 频道或其他通知渠道。

以下是一个示例命令：

```shell
lhci upload --target=temporary-public-storage --token='382da973-cb76-439e-a3f4-2e98d8284f5c' 
--buildToken='Ql8zQgyt9OJLy2669wF1BoneThESQ31d4A4hKDE6' --report='./111.json' --serverBaseUrl='http://127.0.0.1:18405' 
lhci upload --target=temporary-public-storage --token={{LHCI_SERVER_TOKEN}} --build-id={{BUILD_ID}} --report=./report.json --serverBaseUrl=https://my-lighthouse-ci-server.com/
```

这将上传名为 `report.json` 的报告文件到 Lighthouse CI 服务器，并将其与指定的 `BUILD_ID` 关联。请注意，您需要将 `LHCI_SERVER_TOKEN` 替换为您的 Lighthouse CI 服务器访问令牌，并将 `BUILD_ID` 替换为您要关联报告的构建 ID。另外，`--target=temporary-public-storage` 选项将报告上传到临时公共存储区，这意味着报告将在 24 小时后自动删除。如果您想要将报告上传到永久存储区，请将 `--target` 选项更改为 `lhci`。