
console.log("QX_DEBUG: Script start");

try {
  var url = $request.url;
  var parts = url.split("/");
  var base = parts[0] + "//" + parts[2];
  
  var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
  var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];

  var body = [];
  body.push('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX Data</title><style>');
  body.push('body{background:#111;color:#fff;font-family:sans-serif;padding:10px}');
  body.push('.c{background:#222;padding:10px;margin-bottom:10px;border-radius:5px}');
  body.push('pre{background:#000;color:#0f0;padding:5px;overflow-x:auto;white-space:pre-wrap;word-break:break-all}');
  body.push('a.btn{display:inline-block;background:#444;color:#fff;text-decoration:none;padding:8px 15px;margin-top:5px;border-radius:4px}');
  body.push('a.btn.del{background:#c00}');
  body.push('</style></head><body><h1>QX Viewer</h1>');

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = $prefs.valueForKey(k);
    body.push('<div class="c"><b>' + labels[i] + '</b>');
    if (v) {
      var disp = v.replace(/</g, "&lt;");
      if (disp.length > 200) disp = disp.substring(0, 200) + "...";
      body.push('<pre>' + disp + '</pre>');
      body.push('<a class="btn" href="' + base + '/delete?key=' + k + '">DELETE</a>');
    } else {
      body.push('<p style="color:#666">Empty</p>');
    }
    body.push('</div>');
  }

  var bv = $prefs.valueForKey("RESP_barventory");
  body.push('<div class="c" style="border-left:3px solid #00f"><b>Barventory</b>');
  if (bv) {
    var dispBv = bv.replace(/</g, "&lt;");
    if (dispBv.length > 200) dispBv = dispBv.substring(0, 200) + "...";
    body.push('<pre>' + dispBv + '</pre>');
    body.push('<a class="btn" href="' + base + '/delete?key=RESP_barventory">DELETE ALL</a>');
  } else {
    body.push('<p style="color:#666">Empty</p>');
  }
  body.push('</div>');

  body.push('<div style="margin-top:20px"><a class="btn del" href="' + base + '/clear" style="display:block;text-align:center">CLEAR EVERYTHING</a></div>');
  body.push('</body></html>');

  var html = body.join("");
  console.log("QX_DEBUG: HTML generated, length=" + html.length);

  $done({
    status: "HTTP/1.1 200",
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-cache"
    },
    body: html
  });

} catch (e) {
  console.log("QX_DEBUG: Error " + e);
  $done({
    status: "HTTP/1.1 200",
    headers: {"Content-Type": "text/html;charset=UTF-8"},
    body: "<h1>JS Error</h1><pre>" + e + "</pre>"
  });
}
