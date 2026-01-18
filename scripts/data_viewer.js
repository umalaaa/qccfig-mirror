try {
  const keys = [
    { key: "nodeloc_auth_cookie", label: "NodeLoc Cookie" },
    { key: "nodeloc_auth_auth", label: "NodeLoc Auth" },
    { key: "nodeseek_auth_cookie", label: "NodeSeek Cookie" },
    { key: "nodeseek_auth_auth", label: "NodeSeek Auth" }
  ];

  var htmlParts = [];
  htmlParts.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX Data</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#111;color:#eee;padding:12px}h1{font-size:20px;margin-bottom:10px}.c{background:#222;padding:10px;margin-bottom:10px;border-radius:8px}pre{background:#000;padding:8px;overflow:auto;max-height:150px;font-size:11px;color:#0f0}button{background:#444;color:#fff;border:none;padding:6px 12px;margin-top:5px;border-radius:4px;font-size:12px}</style></head><body><h1>QX Data Viewer</h1>');

  var hasData = 0;
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = $prefs.valueForKey(k.key);
    var has = (v && v.length > 0);
    if (has) hasData++;
    
    htmlParts.push('<div class="c"><b>' + k.label + '</b><br><small>' + k.key + '</small>');
    if (has) {
      var esc = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      htmlParts.push('<pre>' + esc + '</pre>');
      htmlParts.push('<button onclick="location.href=\\'https://umalaaa.github.io/qx-data/delete?key=' + k.key + '\\'">删除</button>');
    } else {
      htmlParts.push('<p style="color:#666">暂无数据</p>');
    }
    htmlParts.push('</div>');
  }

  var bvRaw = $prefs.valueForKey("RESP_barventory");
  var bvCount = 0;
  if (bvRaw) {
    try {
      var bvArr = JSON.parse(bvRaw);
      if (Array.isArray(bvArr)) bvCount = bvArr.length;
    } catch(e) {}
  }

  htmlParts.push('<div class="c" style="border-left:3px solid #39f"><b>Barventory Response</b><br><small>RESP_barventory (' + bvCount + ')</small>');
  if (bvCount > 0) {
    htmlParts.push('<pre>' + bvRaw.replace(/</g,"&lt;") + '</pre>');
    htmlParts.push('<button onclick="location.href=\\'https://umalaaa.github.io/qx-data/delete?key=RESP_barventory\\'">删除全部</button>');
  } else {
    htmlParts.push('<p style="color:#666">暂无数据</p>');
  }
  htmlParts.push('</div>');

  htmlParts.push('<div style="margin-top:20px;text-align:center"><button style="background:#c00;padding:10px 20px" onclick="location.href=\\'https://umalaaa.github.io/qx-data/clear\\'">清除所有数据</button></div>');
  htmlParts.push('</body></html>');

  $done({
    status: "HTTP/1.1 200 OK",
    headers: { "Content-Type": "text/html;charset=utf-8" },
    body: htmlParts.join('')
  });

} catch (err) {
  $done({
    status: "HTTP/1.1 200 OK",
    headers: { "Content-Type": "text/html;charset=utf-8" },
    body: "<h1>Script Error</h1><pre>" + err + "</pre>"
  });
}