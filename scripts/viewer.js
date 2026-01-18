
console.log("[QX Viewer] Script started");

try {
    var url = $request.url;
    console.log("[QX Viewer] Request URL: " + url);

    var base = "http://" + url.split("/")[2];
    var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
    var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];

    var body = [];
    body.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QX Data</title><style>body{background:#111;color:#fff;font-family:sans-serif;padding:10px}.c{background:#222;padding:10px;margin-bottom:10px;border-radius:5px}pre{background:#000;color:#0f0;padding:5px;overflow-x:auto}button{background:#444;color:#fff;border:none;padding:8px 15px;margin-top:5px;border-radius:4px}</style></head><body><h1>QX Viewer</h1>');

    var hasData = false;
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = $prefs.valueForKey(k);
        body.push('<div class="c"><b>' + labels[i] + '</b>');
        if (v) {
            hasData = true;
            var disp = v.length > 200 ? v.substring(0, 200) + '...' : v;
            disp = disp.replace(/</g, "&lt;");
            body.push('<pre>' + disp + '</pre>');
            body.push('<button onclick="location.href=\\'' + base + '/delete?key=' + k + '\\'">DELETE</button>');
        } else {
            body.push('<p style="color:#666">Empty</p>');
        }
        body.push('</div>');
    }

    var bv = $prefs.valueForKey("RESP_barventory");
    body.push('<div class="c" style="border-left:3px solid #00f"><b>Barventory</b>');
    if (bv) {
        hasData = true;
        var dispBv = bv.length > 200 ? bv.substring(0, 200) + '...' : bv;
        dispBv = dispBv.replace(/</g, "&lt;");
        body.push('<pre>' + dispBv + '</pre>');
        body.push('<button onclick="location.href=\\'' + base + '/delete?key=RESP_barventory\\'">DELETE ALL</button>');
    } else {
        body.push('<p style="color:#666">Empty</p>');
    }
    body.push('</div>');

    body.push('<div style="margin-top:20px"><button onclick="location.href=\\'' + base + '/clear\\'" style="background:#c00;width:100%;padding:12px">CLEAR EVERYTHING</button></div>');
    body.push('</body></html>');

    var html = body.join("");
    console.log("[QX Viewer] HTML Length: " + html.length);

    $done({
        status: "HTTP/1.1 200 OK",
        headers: {
            "Content-Type": "text/html;charset=UTF-8",
            "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        body: html
    });

} catch (err) {
    console.log("[QX Viewer] Error: " + err);
    $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "text/html;charset=UTF-8" },
        body: "<h1>Script Error</h1><pre>" + err + "</pre>"
    });
}
