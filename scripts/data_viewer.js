let dataObj = {};
let allStoredKeys = [];

try {
  const knownKeys = [
    "nodeloc_auth_cookie",
    "nodeloc_auth_auth", 
    "nodeseek_auth_cookie",
    "nodeseek_auth_auth",
    "RESP_barventory",
    "REQ_barventory_raw",
    "RESP_barventory_raw"
  ];
  
  knownKeys.forEach(key => {
    const value = $prefs.valueForKey(key);
    if (value) {
      dataObj[key] = value;
      allStoredKeys.push(key);
    }
  });
  
  for (let i = 0; i < 100; i++) {
    const testKey = "test_key_" + i;
    const val = $prefs.valueForKey(testKey);
    if (val) {
      dataObj[testKey] = val;
      allStoredKeys.push(testKey);
    }
  }
} catch (e) {
  console.log("Error reading prefs: " + e);
}

const debugInfo = {
  totalKeys: Object.keys(dataObj).length,
  foundKeys: allStoredKeys,
  prefsAvailable: typeof $prefs !== 'undefined',
  timestamp: new Date().toISOString()
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
.debug { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 13px; }
.debug pre { background: white; padding: 12px; border-radius: 4px; overflow: auto; margin-top: 8px; }
.stats { display: flex; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; }
.stat-card { background: white; border-radius: 12px; padding: 16px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); flex: 1; min-width: 150px; }
.stat-number { font-size: 28px; font-weight: 700; color: #007aff; }
.stat-label { color: #86868b; font-size: 13px; margin-top: 4px; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #f5f5f7; padding-bottom: 12px; }
.card-title { font-size: 18px; font-weight: 600; color: #1d1d1f; }
.badge { background: #007aff; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
.badge.empty { background: #d1d1d6; }
.content { background: #f5f5f7; padding: 16px; border-radius: 8px; font-family: "SF Mono", Monaco, monospace; font-size: 13px; line-height: 1.6; color: #1d1d1f; max-height: 400px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
.empty-state { color: #86868b; text-align: center; padding: 40px; }
.record { border-bottom: 1px solid #e5e5e7; padding: 12px 0; }
.record:last-child { border-bottom: none; }
.record-time { color: #86868b; font-size: 12px; margin-bottom: 4px; }
.record-url { color: #007aff; font-size: 13px; margin-bottom: 8px; word-break: break-all; }
.record-body { background: #f5f5f7; padding: 12px; border-radius: 6px; font-size: 12px; max-height: 200px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
.key-badge { display: inline-block; background: #f5f5f7; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #86868b; margin-bottom: 8px; }
.copy-btn { background: #007aff; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; margin-top: 8px; }
.copy-btn:active { opacity: 0.7; }
.timestamp { color: #86868b; font-size: 12px; margin-top: 16px; text-align: center; }
.guide { background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
.guide h3 { color: #1976d2; margin-bottom: 8px; font-size: 16px; }
.guide ol { margin-left: 20px; color: #424242; line-height: 1.8; }
</style>
</head>
<body>
<div class="container">
<h1>📊 QX 数据查看器</h1>
<p class="subtitle">umalaaa.github.io/qx-data · 实时监控</p>

<div class="debug">
  <strong>🐛 调试信息</strong>
  <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
</div>

<div id="stats"></div>
<div id="guide-container"></div>
<div id="data-container"></div>
<div class="timestamp">生成时间：${new Date().toLocaleString('zh-CN')}</div>
</div>
<script>
const DATA = ${JSON.stringify(dataObj)};
const DEBUG = ${JSON.stringify(debugInfo)};

const LABELS = {
  "nodeloc_auth_cookie": "NodeLoc Cookie",
  "nodeloc_auth_auth": "NodeLoc Auth Token",
  "nodeseek_auth_cookie": "NodeSeek Cookie",
  "nodeseek_auth_auth": "NodeSeek Auth Token",
  "RESP_barventory": "Response 记录",
  "REQ_barventory_raw": "请求记录",
  "RESP_barventory_raw": "响应记录"
};

function showGuide() {
  const guideContainer = document.getElementById('guide-container');
  guideContainer.innerHTML = \`
    <div class="guide">
      <h3>📝 如何开始抓取数据</h3>
      <ol>
        <li>确保 QX 的 <strong>Rewrite</strong> 和 <strong>MitM</strong> 已开启</li>
        <li>访问目标网站：
          <ul>
            <li><a href="https://www.nodeloc.com" target="_blank">nodeloc.com</a> - 会自动抓取 Cookie</li>
            <li><a href="https://www.nodeseek.com" target="_blank">nodeseek.com</a> - 会自动抓取 Cookie</li>
            <li>barventory.com 接口 - 会自动记录 Response</li>
          </ul>
        </li>
        <li>刷新此页面查看抓取的数据</li>
      </ol>
    </div>
  \`;
}

function getStats() {
  let totalKeys = 0;
  let totalRecords = 0;
  Object.entries(DATA).forEach(([key, value]) => {
    totalKeys++;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        totalRecords += parsed.length;
      }
    } catch (e) {}
  });
  return { totalKeys, totalRecords };
}

function formatData(key, value) {
  if (!value) {
    return '<div class="empty-state">暂无数据</div>';
  }
  
  try {
    const data = JSON.parse(value);
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return '<div class="empty-state">数组为空</div>';
      }
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

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板');
    });
  } else {
    alert('复制失败：不支持剪贴板 API');
  }
}

function loadStats() {
  const { totalKeys, totalRecords } = getStats();
  const statsContainer = document.getElementById('stats');
  statsContainer.innerHTML = \`
    <div class="stat-card">
      <div class="stat-number">\${totalKeys}</div>
      <div class="stat-label">数据项</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">\${totalRecords}</div>
      <div class="stat-label">记录总数</div>
    </div>
  \`;
}

function loadData() {
  const container = document.getElementById('data-container');
  container.innerHTML = '';
  
  if (Object.keys(DATA).length === 0) {
    showGuide();
    container.innerHTML = '<div class="card"><div class="empty-state">暂无任何数据<br><br>请按照上方指引访问目标网站以触发数据抓取</div></div>';
    return;
  }
  
  Object.entries(DATA).forEach(([key, value]) => {
    const label = LABELS[key] || key;
    const hasData = value && value.length > 0;
    let count = 0;
    
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        count = parsed.length;
      }
    } catch (e) {}
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = \`
      <div class="card-header">
        <div>
          <div class="card-title">\${label}</div>
          <div class="key-badge">\${key}</div>
        </div>
        <div class="badge \${hasData ? '' : 'empty'}">\${count > 0 ? count + ' 条' : (hasData ? '有数据' : '无数据')}</div>
      </div>
      \${formatData(key, value)}
      \${hasData ? \`<button class="copy-btn" onclick="copyToClipboard(decodeURIComponent('\${encodeURIComponent(value)}'))">复制原始数据</button>\` : ''}
    \`;
    container.appendChild(card);
  });
}

loadStats();
loadData();
</script>
</body>
</html>`;

$done({ 
  status: "HTTP/1.1 200 OK",
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  },
  body: html
});
