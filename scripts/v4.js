
console.log("DEBUG: v4.js started");

try {
    var html = [];
    html.push('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX Data</title><style>body{background:#000;color:#fff;font-family:sans-serif;padding:10px}pre{background:#222;padding:10px;overflow-x:scroll;border:1px solid #444}a{display:block;background:#333;color:#fff;padding:10px;text-align:center;text-decoration:none;margin:5px 0;border-radius:5px}</style></head><body><h1>QX Viewer</h1>');

    var base = "http://qxdata.liangjima.com";
    if (typeof $request !== "undefined" && $request.url) {
        var parts = $request.url.split("/");
        if (parts.length >= 3) {
            base = parts[0] + "//" + parts[2];
        }
    }

    if (typeof $prefs === "undefined") {
        throw new Error("$prefs is undefined");
    }

    var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
    var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];

    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = $prefs.valueForKey(k);
        html.push('<h3>' + labels[i] + '</h3>');
        if (v) {
            var cleanV = String(v).replace(/</g, "&lt;");
            html.push('<pre>' + cleanV + '</pre>');
            html.push('<a href="' + base + '/delete?key=' + k + '" style="background:#800">DELETE</a>');
        } else {
            html.push('<p style="color:#666">Empty</p>');
        }
    }

    var bv = $prefs.valueForKey("RESP_barventory");
    html.push('<h3 style="color:#5bf">Barventory</h3>');
    if (bv) {
        var cleanBv = String(bv).replace(/</g, "&lt;");
        if (cleanBv.length > 500) cleanBv = cleanBv.substring(0, 500) + "... (truncated)";
        html.push('<pre>' + cleanBv + '</pre>');
        html.push('<a href="' + base + '/delete?key=RESP_barventory" style="background:#800">DELETE ALL</a>');
    } else {
        html.push('<p style="color:#666">Empty</p>');
    }

    html.push('<br><a href="' + base + '/clear" style="background:#c00;padding:15px">CLEAR EVERYTHING</a>');
    html.push('</body></html>');

    console.log("DEBUG: HTML generated successfully");

    $done({
        status: "HTTP/1.1 200 OK",
        headers: {"Content-Type": "text/html;charset=UTF-8"},
        body: html.join("")
    });

} catch (e) {
    console.log("DEBUG: Error caught: " + e);
    $done({
        status: "HTTP/1.1 200 OK",
        headers: {"Content-Type": "text/html;charset=UTF-8"},
        body: "<h1>JS Error</h1><pre>" + e + "</pre>"
    });
}
