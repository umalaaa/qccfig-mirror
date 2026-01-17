const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>测试页面</title>
</head>
<body style="padding: 40px; font-family: sans-serif;">
<h1>✅ 成功！</h1>
<p>如果你看到这个页面，说明 rewrite 已生效。</p>
<p>时间：${new Date().toLocaleString()}</p>
</body>
</html>`;

$done({ 
  status: "HTTP/1.1 200 OK",
  headers: {
    "Content-Type": "text/html; charset=utf-8"
  },
  body: html
});
