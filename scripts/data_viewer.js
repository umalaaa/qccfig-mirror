const predefinedKeys = [
  { key: "nodeloc_auth_cookie", label: "NodeLoc Cookie", isArray: false },
  { key: "nodeloc_auth_auth", label: "NodeLoc Auth", isArray: false },
  { key: "nodeseek_auth_cookie", label: "NodeSeek Cookie", isArray: false },
  { key: "nodeseek_auth_auth", label: "NodeSeek Auth", isArray: false },
  { key: "RESP_barventory", label: "Barventory Response", isArray: true }
];

let simpleCards = [];
let barventoryData = [];
let hasDataCount = 0;
let emptyCount = 0;

predefinedKeys.forEach(item => {
  const value = $prefs.valueForKey(item.key);
  const hasData = !!value;
  
  if (item.isArray) {
    if (hasData) {
      try {
        const arr = JSON.parse(value);
        if (Array.isArray(arr) && arr.length > 0) {
          hasDataCount++;
          barventoryData = arr;
        } else {
          emptyCount++;
        }
      } catch (e) {
        emptyCount++;
      }
    } else {
      emptyCount++;
    }
  } else {
    if (hasData) hasDataCount++;
    else emptyCount++;
    simpleCards.push({
      key: item.key,
      label: item.label,
      value: value || "",
      hasData: hasData
    });
  }
});

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeJs(str) {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}

const simpleCardsHtml = simpleCards.map((item, idx) => {
  const statusClass = item.hasData ? "has-data" : "empty";
  const statusText = item.hasData ? "有数据" : "空";
  const valueDisplay = item.hasData 
    ? '<div class="value-box">' + escapeHtml(item.value) + '</div>'
    : '<div class="empty-box">暂无数据</div>';
  const deleteBtn = item.hasData ? '<button class="btn btn-delete" onclick="deleteKey(\'' + item.key + '\')">删除</button>' : '';
  const copyValueBtn = item.hasData ? '<button class="btn btn-value" onclick="copyText(\'' + escapeJs(item.value) + '\')">复制</button>' : '';
  
  return '<div class="card"><div class="card-header"><div><div class="card-label">' + item.label + '</div><div class="card-key">' + item.key + '</div></div><div class="status ' + statusClass + '">' + statusText + '</div></div><div class="card-body">' + valueDisplay + '<div class="btn-row"><button class="btn btn-key" onclick="copyText(\'' + item.key + '\')">复制Key</button>' + copyValueBtn + deleteBtn + '</div></div></div>';
}).join("");

const barventoryOptions = barventoryData.map((item, idx) => {
  const time = item.time || "Record " + (idx + 1);
  return '<option value="' + idx + '">' + time + '</option>';
}).join("");

const barventoryJson = JSON.stringify(barventoryData);

const barventorySection = barventoryData.length > 0 
  ? '<div class="card array-card"><div class="card-header"><div><div class="card-label">Barventory Response</div><div class="card-key">RESP_barventory (' + barventoryData.length + ' 条记录)</div></div><div class="status has-data">有数据</div></div><div class="card-body"><select id="bv-select" onchange="showRecord(this.value)"><option value="">-- 选择记录查看 --</option>' + barventoryOptions + '</select><div id="bv-display" class="json-box"></div><div class="btn-row"><button class="btn btn-key" onclick="copyText(\'RESP_barventory\')">复制Key</button><button class="btn btn-value" onclick="copyCurrentRecord()">复制当前记录</button><button class="btn btn-delete" onclick="deleteKey(\'RESP_barventory\')">删除全部</button></div></div></div>'
  : '<div class="card"><div class="card-header"><div><div class="card-label">Barventory Response</div><div class="card-key">RESP_barventory</div></div><div class="status empty">空</div></div><div class="card-body"><div class="empty-box">暂无数据</div></div></div>';

const html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>QX数据</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#1a1a2e;padding:16px;color:#eee}h1{font-size:22px;margin-bottom:4px}h1 span{font-size:16px}.subtitle{color:#888;margin-bottom:16px;font-size:12px}.stats{display:flex;gap:10px;margin-bottom:16px}.stat{flex:1;background:#16213e;border-radius:10px;padding:12px;text-align:center}.stat-num{font-size:24px;font-weight:700}.stat-num.green{color:#10b981}.stat-num.red{color:#ef4444}.stat-label{font-size:10px;color:#888;margin-top:2px}.card{background:#16213e;border-radius:12px;margin-bottom:12px;overflow:hidden}.array-card{border-left:3px solid #3b82f6}.card-header{padding:12px;border-bottom:1px solid #0f3460;display:flex;justify-content:space-between;align-items:center}.card-label{font-size:14px;font-weight:600}.card-key{font-size:11px;color:#888;font-family:monospace;margin-top:2px}.status{padding:3px 8px;border-radius:8px;font-size:10px;font-weight:500}.status.has-data{background:#064e3b;color:#10b981}.status.empty{background:#7f1d1d;color:#ef4444}.card-body{padding:12px}select{width:100%;padding:10px;border-radius:8px;border:1px solid #0f3460;background:#1a1a2e;color:#eee;font-size:13px;margin-bottom:10px}.value-box{background:#0f3460;border-radius:8px;padding:10px;font-family:monospace;font-size:11px;max-height:120px;overflow:auto;word-break:break-all;color:#a5b4fc}.json-box{background:#0f3460;border-radius:8px;padding:12px;font-family:monospace;font-size:11px;max-height:300px;overflow:auto;white-space:pre-wrap;line-height:1.6;color:#eee}.json-key{color:#f472b6}.json-string{color:#a5f3fc}.json-number{color:#fbbf24}.json-bool{color:#a78bfa}.json-null{color:#94a3b8}.empty-box{background:#7f1d1d33;border-radius:8px;padding:16px;text-align:center;color:#fca5a5;font-size:12px}.btn-row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}.btn{flex:1;min-width:70px;padding:8px;border:none;border-radius:6px;font-size:11px;font-weight:500;cursor:pointer}.btn-key{background:#312e81;color:#a5b4fc}.btn-value{background:#1e3a5f;color:#60a5fa}.btn-delete{background:#7f1d1d;color:#fca5a5}.btn-clear{background:#dc2626;color:#fff;width:100%;margin-top:16px;padding:12px;font-size:13px}.btn:active{opacity:.7}.ts{text-align:center;color:#555;font-size:10px;margin-top:16px}</style></head><body><h1><span>📊</span> QX数据查看器</h1><p class="subtitle">点击复制 · 下拉查看</p><div class="stats"><div class="stat"><div class="stat-num green">' + hasDataCount + '</div><div class="stat-label">有数据</div></div><div class="stat"><div class="stat-num red">' + emptyCount + '</div><div class="stat-label">空</div></div></div>' + simpleCardsHtml + barventorySection + '<button class="btn btn-clear" onclick="clearAll()">🗑️ 清除所有数据</button><div class="ts">' + new Date().toLocaleString("zh-CN") + '</div><script>var BV=' + barventoryJson + ';function syntaxHighlight(j){if(!j)return"";return j.replace(/("(\\\\u[a-zA-Z0-9]{4}|\\\\[^u]|[^\\\\"])*"(\\s*:)?|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?)/g,function(m){var c="json-number";if(/^"/.test(m)){c=/":$/.test(m)?"json-key":"json-string"}else if(/true|false/.test(m)){c="json-bool"}else if(/null/.test(m)){c="json-null"}return"<span class=\\""+c+"\\">"+m+"</span>"})}function showRecord(i){var d=document.getElementById("bv-display");if(i===""||!BV[i]){d.innerHTML="";return}d.innerHTML=syntaxHighlight(JSON.stringify(BV[i],null,2))}function copyText(t){if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){alert("已复制")})}else{prompt("复制:",t)}}function copyCurrentRecord(){var s=document.getElementById("bv-select").value;if(s!==""&&BV[s]){copyText(JSON.stringify(BV[s],null,2))}}function deleteKey(k){if(confirm("删除 "+k+"?")){location.href="https://umalaaa.github.io/qx-data/delete?key="+encodeURIComponent(k)}}function clearAll(){if(confirm("清除所有数据?")){location.href="https://umalaaa.github.io/qx-data/clear"}}</script></body></html>';

$done({status:"HTTP/1.1 200 OK",headers:{"Content-Type":"text/html;charset=utf-8"},body:html});
