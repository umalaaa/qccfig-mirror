const predefinedKeys = [
  { key: "nodeloc_auth_cookie", label: "NodeLoc Cookie", isArray: false },
  { key: "nodeloc_auth_auth", label: "NodeLoc Auth", isArray: false },
  { key: "nodeseek_auth_cookie", label: "NodeSeek Cookie", isArray: false },
  { key: "nodeseek_auth_auth", label: "NodeSeek Auth", isArray: false },
  { key: "RESP_barventory", label: "Barventory Response", isArray: true }
];

const allKeysForClear = predefinedKeys.map(k => k.key);

let allCards = [];
let hasDataCount = 0;
let emptyCount = 0;
let cardIndex = 0;

predefinedKeys.forEach(item => {
  const value = $prefs.valueForKey(item.key);
  const hasData = !!value;
  
  if (item.isArray && hasData) {
    try {
      const arr = JSON.parse(value);
      if (Array.isArray(arr) && arr.length > 0) {
        hasDataCount++;
        arr.forEach((record, i) => {
          allCards.push({
            key: item.key + "[" + i + "]",
            label: item.label + " #" + (i + 1),
            value: JSON.stringify(record),
            hasData: true,
            isArrayItem: true,
            parentKey: item.key,
            index: cardIndex++
          });
        });
      } else {
        emptyCount++;
        allCards.push({
          key: item.key,
          label: item.label,
          value: "",
          hasData: false,
          isArrayItem: false,
          index: cardIndex++
        });
      }
    } catch (e) {
      hasDataCount++;
      allCards.push({
        key: item.key,
        label: item.label,
        value: value,
        hasData: true,
        isArrayItem: false,
        index: cardIndex++
      });
    }
  } else {
    if (hasData) hasDataCount++;
    else emptyCount++;
    allCards.push({
      key: item.key,
      label: item.label,
      value: value || "",
      hasData: hasData,
      isArrayItem: false,
      index: cardIndex++
    });
  }
});

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatValue(val) {
  if (!val) return "";
  try {
    const obj = JSON.parse(val);
    return escapeHtml(JSON.stringify(obj, null, 2));
  } catch (e) {
    return escapeHtml(val);
  }
}

const cardsHtml = allCards.map((item) => {
  const statusClass = item.hasData ? "has-data" : "empty";
  const statusText = item.hasData ? "有数据" : "空";
  const valueDisplay = item.hasData 
    ? '<div class="value-box">' + formatValue(item.value) + '</div>'
    : '<div class="empty-box">暂无数据，请先访问对应网站</div>';
  
  const deleteBtn = item.hasData
    ? '<button class="btn btn-delete" onclick="deleteKey(\'' + (item.parentKey || item.key) + '\')">删除</button>'
    : '';
  
  const copyValueBtn = item.hasData
    ? '<button class="btn btn-value" onclick="copyValue(' + item.index + ')">复制 Value</button>'
    : '<button class="btn btn-value" disabled>无数据</button>';
  
  const cardClass = item.isArrayItem ? "card array-item" : "card";
  
  return '<div class="' + cardClass + '">' +
    '<div class="card-header">' +
      '<div>' +
        '<div class="card-label">' + item.label + '</div>' +
        '<div class="card-key">' + item.key + '</div>' +
      '</div>' +
      '<div class="status ' + statusClass + '">' + statusText + '</div>' +
    '</div>' +
    '<div class="card-body">' +
      valueDisplay +
      '<div class="btn-row">' +
        '<button class="btn btn-key" onclick="copyKey(' + item.index + ')">复制 Key</button>' +
        copyValueBtn +
        deleteBtn +
      '</div>' +
    '</div>' +
  '</div>';
}).join("");

const valuesJson = JSON.stringify(allCards.map(d => ({ key: d.key, value: d.value, parentKey: d.parentKey || d.key })));
const allKeysJson = JSON.stringify(allKeysForClear);

const html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>QX 数据查看器</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f7;padding:16px}h1{font-size:24px;font-weight:600;margin-bottom:6px;color:#1d1d1f}.subtitle{color:#86868b;margin-bottom:20px;font-size:13px}.stats{display:flex;gap:10px;margin-bottom:16px}.stat{flex:1;background:white;border-radius:10px;padding:14px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.1)}.stat-num{font-size:28px;font-weight:700}.stat-num.green{color:#059669}.stat-num.red{color:#dc2626}.stat-label{font-size:11px;color:#86868b;margin-top:2px}.card{background:white;border-radius:12px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden}.card.array-item{border-left:4px solid #007aff}.card-header{padding:14px 16px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center}.card-label{font-size:15px;font-weight:600;color:#1d1d1f}.card-key{font-size:12px;color:#86868b;font-family:monospace;margin-top:2px}.status{padding:4px 10px;border-radius:10px;font-size:11px;font-weight:500}.status.has-data{background:#d1fae5;color:#059669}.status.empty{background:#fee2e2;color:#dc2626}.card-body{padding:12px 16px}.value-box{background:#f5f5f7;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;line-height:1.5;max-height:200px;overflow:auto;word-break:break-all;white-space:pre-wrap;color:#1d1d1f}.empty-box{background:#fef3c7;border-radius:8px;padding:20px;text-align:center;color:#92400e;font-size:13px}.btn-row{display:flex;gap:8px;margin-top:10px}.btn{flex:1;padding:10px;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer}.btn-key{background:#e0e7ff;color:#4338ca}.btn-value{background:#dbeafe;color:#1d4ed8}.btn-delete{background:#fee2e2;color:#dc2626}.btn-clear-all{background:#dc2626;color:white;width:100%;margin-top:20px;padding:14px}.btn:disabled{background:#e5e5e5;color:#9ca3af;cursor:not-allowed}.btn:active:not(:disabled){opacity:0.7}.timestamp{text-align:center;color:#86868b;font-size:11px;margin-top:20px}</style></head><body><h1>📊 QX 数据查看器</h1><p class="subtitle">点击按钮快速复制 Key 或 Value</p><div class="stats"><div class="stat"><div class="stat-num green">' + hasDataCount + '</div><div class="stat-label">有数据</div></div><div class="stat"><div class="stat-num red">' + emptyCount + '</div><div class="stat-label">空</div></div></div>' + cardsHtml + '<button class="btn btn-clear-all" onclick="clearAll()">🗑️ 清除所有数据</button><div class="timestamp">生成时间：' + new Date().toLocaleString("zh-CN") + '</div><script>var DATA=' + valuesJson + ';var ALL_KEYS=' + allKeysJson + ';function copyKey(i){var k=DATA[i].key;if(navigator.clipboard){navigator.clipboard.writeText(k).then(function(){alert("已复制 Key: "+k)})}else{prompt("请手动复制:",k)}}function copyValue(i){var v=DATA[i].value;if(v){if(navigator.clipboard){navigator.clipboard.writeText(v).then(function(){alert("已复制 Value")})}else{prompt("请手动复制:",v)}}}function deleteKey(key){if(confirm("确定删除 "+key+" 吗？")){window.location.href="https://umalaaa.github.io/qx-data/delete?key="+encodeURIComponent(key)}}function clearAll(){if(confirm("确定清除所有数据吗？此操作不可恢复！")){window.location.href="https://umalaaa.github.io/qx-data/clear"}}</script></body></html>';

$done({ 
  status: "HTTP/1.1 200 OK",
  headers: { "Content-Type": "text/html; charset=utf-8" },
  body: html
});
