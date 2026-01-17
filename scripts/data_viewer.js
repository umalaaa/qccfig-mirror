let allData = {};
const maxScanKeys = 200;

const commonPrefixes = [
  "nodeloc", "nodeseek", "RESP", "REQ", "auth", "cookie", 
  "token", "sign", "chavy", "Chavy", "zqzs", "surgeconf"
];

commonPrefixes.forEach(prefix => {
  for (let i = 0; i < 20; i++) {
    const testKey = i === 0 ? prefix : `${prefix}_${i}`;
    const val = $prefs.valueForKey(testKey);
    if (val) {
      allData[testKey] = val;
    }
  }
});

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
  if (value && !allData[key]) {
    allData[key] = value;
  }
});

const allKeys = Object.keys(allData);

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
.key-list { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.key-item { padding: 12px; border-bottom: 1px solid #f5f5f7; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; }
.key-item:hover { background: #f5f5f7; }
.key-item:last-child { border-bottom: none; }
.key-name { font-family: "SF Mono", Monaco, monospace; color: #007aff; font-size: 14px; }
.key-size { color: #86868b; font-size: 12px; }
.data-viewer { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: none; }
.data-viewer.active { display: block; }
.viewer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #f5f5f7; }
.viewer-title { font-size: 18px; font-weight: 600; color: #1d1d1f; }
.close-btn { background: #ff3b30; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; }
.close-btn:active { opacity: 0.7; }
.content { background: #f5f5f7; padding: 16px; border-radius: 8px; font-family: "SF Mono", Monaco, monospace; font-size: 13px; line-height: 1.6; color: #1d1d1f; max-height: 500px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
.copy-btn { background: #007aff; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; cursor: pointer; margin-top: 12px; }
.copy-btn:active { opacity: 0.7; }
.empty-state { text-align: center; padding: 60px 20px; color: #86868b; }
.empty-state h3 { font-size: 20px; margin-bottom: 12px; }
.stats { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-card { background: white; border-radius: 12px; padding: 16px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); flex: 1; min-width: 150px; }
.stat-number { font-size: 28px; font-weight: 700; color: #007aff; }
.stat-label { color: #86868b; font-size: 13px; margin-top: 4px; }
.record { border-bottom: 1px solid #e5e5e7; padding: 12px 0; }
.record:last-child { border-bottom: none; }
.record-time { color: #86868b; font-size: 12px; margin-bottom: 4px; }
.record-url { color: #007aff; font-size: 13px; margin-bottom: 8px; word-break: break-all; }
.record-body { background: white; padding: 12px; border-radius: 6px; font-size: 12px; max-height: 200px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
</style>
</head>
<body>
<div class="container">
<h1>📊 QX 数据查看器</h1>
<p class="subtitle">umalaaa.github.io/qx-data · 点击 Key 查看数据</p>

<div class="stats">
  <div class="stat-card">
    <div class="stat-number" id="total-keys">0</div>
    <div class="stat-label">可用数据项</div>
  </div>
</div>

<div id="key-list-container"></div>
<div id="data-viewer" class="data-viewer"></div>

<p style="color: #86868b; text-align: center; margin-top: 30px; font-size: 12px;">
  生成时间：${new Date().toLocaleString('zh-CN')}
</p>
</div>
<script>
const ALL_DATA = ${JSON.stringify(allData)};
const ALL_KEYS = ${JSON.stringify(allKeys)};

document.getElementById('total-keys').textContent = ALL_KEYS.length;

function formatSize(str) {
  if (!str) return '0 B';
  const bytes = new Blob([str]).size;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function formatData(value) {
  try {
    const data = JSON.parse(value);
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return '<div style="color: #86868b;">空数组</div>';
      }
      return data.map(record => \`
        <div class="record">
          <div class="record-time">\${record.time || '未知时间'}</div>
          \${record.url ? \`<div class="record-url">\${record.url}</div>\` : ''}
          <div class="record-body">\${JSON.stringify(record, null, 2)}</div>
        </div>
      \`).join('');
    }
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return value;
  }
}

function showData(key) {
  const viewer = document.getElementById('data-viewer');
  const value = ALL_DATA[key];
  
  viewer.innerHTML = \`
    <div class="viewer-header">
      <div class="viewer-title">\${key}</div>
      <button class="close-btn" onclick="closeViewer()">关闭</button>
    </div>
    <div class="content">\${formatData(value)}</div>
    <button class="copy-btn" onclick="copyData('\${key}')">复制原始数据</button>
  \`;
  
  viewer.classList.add('active');
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeViewer() {
  document.getElementById('data-viewer').classList.remove('active');
}

function copyData(key) {
  const value = ALL_DATA[key];
  if (navigator.clipboard) {
    navigator.clipboard.writeText(value).then(() => {
      alert('已复制到剪贴板');
    });
  }
}

function renderKeyList() {
  const container = document.getElementById('key-list-container');
  
  if (ALL_KEYS.length === 0) {
    container.innerHTML = \`
      <div class="empty-state">
        <h3>暂无数据</h3>
        <p>请先访问目标网站触发数据抓取</p>
        <p style="margin-top: 12px; font-size: 13px;">
          支持的网站：<br>
          • nodeloc.com<br>
          • nodeseek.com<br>
          • barventory.com
        </p>
      </div>
    \`;
    return;
  }
  
  container.innerHTML = \`
    <div class="key-list">
      \${ALL_KEYS.map(key => \`
        <div class="key-item" onclick="showData('\${key}')">
          <span class="key-name">\${key}</span>
          <span class="key-size">\${formatSize(ALL_DATA[key])}</span>
        </div>
      \`).join('')}
    </div>
  \`;
}

renderKeyList();
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
