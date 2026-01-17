const keys = [
  { key: "nodeloc_auth_cookie", label: "NodeLoc Cookie" },
  { key: "nodeloc_auth_auth", label: "NodeLoc Auth" },
  { key: "nodeseek_auth_cookie", label: "NodeSeek Cookie" },
  { key: "nodeseek_auth_auth", label: "NodeSeek Auth" }
];

let cards = "";
let hasData = 0;
let empty = 0;

keys.forEach((k, i) => {
  const v = $prefs.valueForKey(k.key) || "";
  const has = v.length > 0;
  if (has) hasData++; else empty++;
  const esc = v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  const vJs = v.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"");
  cards += '<div class="c"><div class="ch"><div><b>' + k.label + '</b><br><small>' + k.key + '</small></div><span class="s ' + (has?"g":"r") + '">' + (has?"有":"空") + '</span></div><div class="cb">' + (has ? '<pre>' + esc + '</pre><div class="br"><button onclick="cp(\\''+k.key+'\\')">复制Key</button><button onclick="cp(\\''+vJs+'\\')">复制Value</button><button class="d" onclick="del(\\''+k.key+'\\')">删除</button></div>' : '<p class="e">暂无数据</p>') + '</div></div>';
});

const bvRaw = $prefs.valueForKey("RESP_barventory") || "[]";
let bvArr = [];
try { bvArr = JSON.parse(bvRaw); } catch(e) { bvArr = []; }
if (!Array.isArray(bvArr)) bvArr = [];

if (bvArr.length > 0) hasData++; else empty++;

let opts = '<option value="-1">选择记录查看 (' + bvArr.length + ' 条)</option>';
bvArr.forEach((r, i) => {
  const t = r.time || ("Record " + (i+1));
  opts += '<option value="' + i + '">' + t + '</option>';
});

const bvJson = JSON.stringify(bvArr).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/</g,"\\u003c").replace(/>/g,"\\u003e");

const bvCard = '<div class="c ar"><div class="ch"><div><b>Barventory Response</b><br><small>RESP_barventory (' + bvArr.length + ' 条)</small></div><span class="s ' + (bvArr.length>0?"g":"r") + '">' + (bvArr.length>0?"有":"空") + '</span></div><div class="cb"><select id="sel" onchange="show()">' + opts + '</select><pre id="out"></pre><div class="br"><button onclick="cp(\\'RESP_barventory\\')">复制Key</button><button onclick="cpCur()">复制当前</button><button class="d" onclick="del(\\'RESP_barventory\\')">删除全部</button></div></div></div>';

const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#111;color:#eee;padding:12px}h1{font-size:20px;margin-bottom:4px}.sub{color:#666;font-size:11px;margin-bottom:12px}.st{display:flex;gap:8px;margin-bottom:12px}.st>div{flex:1;background:#1a1a1a;padding:10px;border-radius:8px;text-align:center}.st b{font-size:22px}.st.g b{color:#0f0}.st.r b{color:#f44}.st small{font-size:10px;color:#666}.c{background:#1a1a1a;border-radius:10px;margin-bottom:10px;overflow:hidden}.c.ar{border-left:3px solid #39f}.ch{display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #222}.ch b{font-size:13px}.ch small{color:#666;font-size:10px}.s{padding:2px 8px;border-radius:6px;font-size:10px}.s.g{background:#052;color:#0f0}.s.r{background:#400;color:#f66}.cb{padding:10px}pre{background:#222;padding:10px;border-radius:6px;font-size:11px;overflow:auto;max-height:200px;white-space:pre-wrap;word-break:break-all;margin-bottom:8px}.e{color:#f66;text-align:center;padding:20px}select{width:100%;padding:8px;background:#222;color:#eee;border:1px solid #333;border-radius:6px;margin-bottom:8px;font-size:12px}.br{display:flex;gap:6px}button{flex:1;padding:8px;border:none;border-radius:6px;font-size:11px;cursor:pointer;background:#333;color:#aaa}button.d{background:#411;color:#f66}.cl{background:#c00;color:#fff;width:100%;padding:12px;margin-top:12px;border:none;border-radius:8px;font-size:13px}.ts{text-align:center;color:#444;font-size:10px;margin-top:12px}</style></head><body><h1>📊 QX数据</h1><p class="sub">点击复制 · 下拉查看</p><div class="st"><div class="g"><b>' + hasData + '</b><br><small>有数据</small></div><div class="r"><b>' + empty + '</b><br><small>空</small></div></div>' + cards + bvCard + '<button class="cl" onclick="clr()">🗑️ 清除所有</button><p class="ts">' + new Date().toLocaleString("zh-CN") + '</p><script>var B=' + bvJson + ';function show(){var i=document.getElementById("sel").value;var o=document.getElementById("out");if(i<0||!B[i]){o.textContent="";return;}o.textContent=JSON.stringify(B[i],null,2);}function cp(t){navigator.clipboard?navigator.clipboard.writeText(t).then(()=>alert("已复制")):prompt("复制:",t);}function cpCur(){var i=document.getElementById("sel").value;if(i>=0&&B[i])cp(JSON.stringify(B[i],null,2));}function del(k){if(confirm("删除 "+k+"?"))location.href="https://umalaaa.github.io/qx-data/delete?key="+encodeURIComponent(k);}function clr(){if(confirm("清除所有?"))location.href="https://umalaaa.github.io/qx-data/clear";}</script></body></html>';

$done({status:"HTTP/1.1 200 OK",headers:{"Content-Type":"text/html;charset=utf-8"},body:html});
