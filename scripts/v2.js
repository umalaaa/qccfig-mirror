
var url = $request.url;
var parts = url.split("/");
var base = parts[0] + "//" + parts[2];

var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];

var html = [];
html.push('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX Data</title><style>body{background:#000;color:#fff;font-family:sans-serif;padding:10px}pre{background:#222;padding:10px;overflow-x:scroll;border:1px solid #444}a{display:block;background:#333;color:#fff;padding:10px;text-align:center;text-decoration:none;margin:5px 0;border-radius:5px}</style></head><body><h1>QX Viewer</h1>');

for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = $prefs.valueForKey(k);
    html.push('<h3>' + labels[i] + '</h3>');
    if (v) {
        var cleanV = v.replace(/</g, "&lt;");
        html.push('<pre>' + cleanV + '</pre>');
        html.push('<a href="' + base + '/delete?key=' + k + '" style="background:#800">DELETE</a>');
    } else {
        html.push('<p style="color:#666">Empty</p>');
    }
}

var bv = $prefs.valueForKey("RESP_barventory");
html.push('<h3 style="color:#5bf">Barventory</h3>');
if (bv) {
    var cleanBv = bv.replace(/</g, "&lt;");
    html.push('<pre>' + cleanBv + '</pre>');
    html.push('<a href="' + base + '/delete?key=RESP_barventory" style="background:#800">DELETE ALL</a>');
} else {
    html.push('<p style="color:#666">Empty</p>');
}

html.push('<br><a href="' + base + '/clear" style="background:#c00;padding:15px">CLEAR EVERYTHING</a>');
html.push('</body></html>');

$done({
    status: "HTTP/1.1 200 OK",
    headers: {"Content-Type": "text/html;charset=UTF-8"},
    body: html.join("")
});
