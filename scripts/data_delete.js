const url = $request.url;
const keyMatch = url.match(/[?&]key=([^&]+)/);

if (keyMatch) {
  const key = decodeURIComponent(keyMatch[1]);
  $prefs.removeValueForKey(key);
  
  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="1;url=http://api.example.com/qxdata"><title>删除成功</title><style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f7;margin:0}.box{background:white;padding:40px;border-radius:16px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.1)}h1{color:#059669;margin-bottom:12px}p{color:#86868b}</style></head><body><div class="box"><h1>✅ 删除成功</h1><p>已删除: ' + key + '</p><p>正在返回...</p></div></body></html>';
  
  $done({ 
    status: "HTTP/1.1 200 OK",
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: html
  });
} else {
  $done({});
}
