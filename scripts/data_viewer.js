const KEYS = {
  "REQ_barventory_raw": "Barventory 请求记录",
  "RESP_barventory_raw": "Barventory 响应记录",
  "nodeloc_auth_cookie": "NodeLoc Cookie",
  "nodeseek_auth_cookie": "NodeSeek Cookie",
  "nodeloc_auth_auth": "NodeLoc Auth",
  "nodeseek_auth_auth": "NodeSeek Auth"
};

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QX 数据查看器</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f5f7; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
h1 { font-size: 32px; font-weight: 600; margin-bottom: 10px; color: #1d1d1f; }
.subtitle { color: #86868b; margin-bottom: 30px; font-size: 14px; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-title { font-size: 18px; font-weight: 600; color: #1d1d1f; }
.badge { background: #007aff; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
.badge.empty { background: #d1d1d6; }
.content { background: #f5f5f7; padding: 16px; border-radius: 8px; font-family: "SF Mono", Monaco, monospace; font-size: 13px; line-height: 1.6; color: #1d1d1f; max-height: 400px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
.empty-state { color: #86868b; text-align: center; padding: 40px; }
.btn { background: #007aff; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 12px; }
.btn:active { opacity: 0.8; }
.record { border-bottom: 1px solid #d1d1d6; padding: 12px 0; }
.record:last-child { border-bottom: none; }
.record-time { color: #86868b; font-size: 12px; margin-bottom: 4px; }
.record-url { color: #007aff; font-size: 13px; margin-bottom: 8px; word-break: break-all; }
.record-body { background: #f5f5f7; padding: 12px; border-radius: 6px; font-size: 12px; max-height: 200px; overflow: auto; }
.refresh-btn { position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px; border-radius: 50%; background: #007aff; color: white; border: none; font-size: 24px; box-shadow: 0 4px 16px rgba(0,122,255,0.4); cursor: pointer; }
.refresh-btn:active { transform: scale(0.95); }
</style>
</head>
<body>
<div class="container">
<h1>QX 数据查看器</h1>
<p class="subtitle">data.saw.local · 实时数据监控</p>
<div id="data-container"></div>
</div>
<button class="refresh-btn" onclick="loadData()">↻</button>
<script>
const KEYS = ${JSON.stringify(KEYS)};

function formatData(key, value) {
  if (!value) {
    return '<div class="empty-state">暂无数据</div>';
  }
  
  try {
    const data = JSON.parse(value);
    if (Array.isArray(data)) {
      return data.map(record => \`
        <div class="record">
          <div class="record-time">\${record.time || '未知时间'}</div>
          \${record.url ? \`<div class="record-url">\${record.url}</div>\` : ''}
          <div class="record-body">\${JSON.stringify(record, null, 2)}</div>
        </div>
      \`).join('');
    }
    return \`<div class="content">\${JSON.stringify(data, null, 2)}</div>\`;
  } catch (e) {
    return \`<div class="content">\${value}</div>\`;
  }
}

function loadData() {
  const container = document.getElementById('data-container');
  container.innerHTML = '';
  
  Object.entries(KEYS).forEach(([key, label]) => {
    const value = $prefs.valueForKey(key);
    const hasData = value && value.length > 0;
    const count = hasData ? (value.match(/time/g) || []).length : 0;
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = \`
      <div class="card-header">
        <div class="card-title">\${label}</div>
        <div class="badge \${hasData ? '' : 'empty'}">\${hasData ? count + ' 条' : '无数据'}</div>
      </div>
      \${formatData(key, value)}
    \`;
    container.appendChild(card);
  });
}

loadData();
</script>
</body>
</html>`;

$done({ 
  status: "HTTP/1.1 200 OK",
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  },
  body: html
});
