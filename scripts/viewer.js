
try {
  var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
  var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX Data</title><style>body{background:#111;color:#fff;font-family:sans-serif;padding:10px}.c{background:#222;padding:10px;margin-bottom:10px;border-radius:5px}pre{background:#000;color:#0f0;padding:5px;overflow:x:auto}button{background:#444;color:#fff;border:none;padding:5px 10px;margin-top:5px}</style></head><body><h1>QX Viewer</h1>';

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = $prefs.valueForKey(k);
    if (v) {
      html += '<div class="c"><b>' + labels[i] + '</b><pre>' + v.substring(0, 100) + (v.length > 100 ? '...' : '') + '</pre>';
      html += '<button onclick="location.href=\\'http://qxdata.liangjima.com/delete?key=' + k + '\\'">Delete</button></div>';
    } else {
      html += '<div class="c"><b>' + labels[i] + '</b><p style="color:#666">Empty</p></div>';
    }
  }

  var bv = $prefs.valueForKey("RESP_barventory");
  html += '<div class="c" style="border-left:3px solid blue"><b>Barventory</b>';
  if (bv) {
    html += '<pre>' + bv.substring(0, 100) + '...</pre>';
    html += '<button onclick="location.href=\\'http://qxdata.liangjima.com/delete?key=RESP_barventory\\'">Delete All</button>';
  } else {
    html += '<p>Empty</p>';
  }
  html += '</div>';

  html += '<div style="margin-top:20px"><button onclick="location.href=\\'http://qxdata.liangjima.com/clear\\'" style="background:red;width:100%;padding:10px">CLEAR ALL</button></div>';
  html += '</body></html>';

  $done({status: "HTTP/1.1 200 OK", headers: {"Content-Type": "text/html"}, body: html});
} catch(e) {
  $done({status: "HTTP/1.1 200 OK", headers: {"Content-Type": "text/html"}, body: "<h1>JS Error</h1><pre>" + e + "</pre>"});
}
