
console.log("DEBUG: viewer_v2.js started");

try {
    var html = [];
    html.push('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"><title>QX Data</title><style>');
    html.push('body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;padding:16px;margin:0}');
    html.push('h1{font-size:24px;margin:0 0 16px 4px;font-weight:700}');
    html.push('h3{font-size:13px;color:#888;margin:20px 0 6px 12px;text-transform:uppercase;letter-spacing:0.5px}');
    html.push('.card{background:#1c1c1e;border-radius:12px;overflow:hidden;margin-bottom:8px}');
    html.push('.row{padding:12px 16px;border-bottom:1px solid #2c2c2e;display:block}');
    html.push('.row:last-child{border-bottom:none}');
    html.push('.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}');
    html.push('.val{font-family:Menlo,Monaco,Consolas,monospace;font-size:12px;color:#32d74b;width:100%;overflow-x:auto;white-space:pre-wrap;word-break:break-all;background:transparent;border:none;resize:none;outline:none}');
    html.push('select{width:100%;padding:8px;background:#2c2c2e;color:#fff;border:none;border-radius:6px;margin-bottom:8px;font-size:13px;appearance:none;-webkit-appearance:none}');
    html.push('.empty{color:#555;font-style:italic;font-size:13px}');
    html.push('.actions{display:flex;justify-content:flex-end;margin-top:8px;gap:8px}');
    html.push('.btn{display:inline-block;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;cursor:pointer;border:none}');
    html.push('.btn-del{background:rgba(255,69,58,0.15);color:#ff453a}');
    html.push('.btn-copy{background:rgba(10,132,255,0.15);color:#0a84ff}');
    html.push('.btn-main{background:#0a84ff;color:#fff;display:block;text-align:center;padding:14px;border-radius:12px;margin-top:24px;font-size:16px;font-weight:600;text-decoration:none}');
    html.push('</style></head><body>');
    html.push('<h1>QX Data</h1>');

    var base = "http://qxdata.liangjima.com";
    if (typeof $request !== "undefined" && $request.url) {
        var parts = $request.url.split("/");
        if (parts.length >= 3) {
            base = parts[0] + "//" + parts[2];
            if ($request.url.indexOf("/qx-data") !== -1) {
                base += "/qx-data";
            }
        }
    }

    if (typeof $prefs === "undefined") {
        throw new Error("$prefs is undefined");
    }

    var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
    var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];

    html.push('<h3>Cookies & Auth</h3>');
    html.push('<div class="card">');
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = $prefs.valueForKey(k);
        html.push('<div class="row">');
        html.push('<div class="head"><div style="font-size:15px;color:#fff">' + labels[i] + '</div></div>');
        if (v) {
            var cleanV = String(v).replace(/"/g, "&quot;");
            var jsV = String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n").replace(/\r/g, "");
            html.push('<textarea class="val" rows="3" readonly onclick="this.select()">' + cleanV + '</textarea>');
            html.push('<div class="actions">');
            html.push('<button onclick="copyText(\\'' + jsV + '\\')" class="btn btn-copy">Copy</button>');
            html.push('<a href="' + base + '/delete?key=' + k + '" class="btn btn-del">Delete</a>');
            html.push('</div>');
        } else {
            html.push('<div class="empty">No Data</div>');
        }
        html.push('</div>'); 
    }
    html.push('</div>'); 

    var bv = $prefs.valueForKey("RESP_barventory");
    html.push('<h3>Barventory Response</h3>');
    html.push('<div class="card"><div class="row">');
    
    if (bv) {
        var isArray = false;
        var bvObj = null;
        try {
            bvObj = JSON.parse(bv);
            if (Array.isArray(bvObj)) isArray = true;
        } catch(e) {}

        if (isArray && bvObj.length > 0) {
            var maxItems = 50;
            var displayObj = bvObj;
            if (bvObj.length > maxItems) {
                 displayObj = bvObj.slice(0, maxItems);
            }

            html.push('<select id="sel_bv" onchange="showBv(this.value)">');
            html.push('<option value="-1">Select an item (' + bvObj.length + ' records)</option>');
            for (var j = 0; j < displayObj.length; j++) {
                var label = "Item " + (j + 1);
                if (displayObj[j].time) label = displayObj[j].time;
                else if (displayObj[j].name) label = displayObj[j].name;
                label = String(label).replace(/"/g, "&quot;").replace(/</g, "&lt;");
                html.push('<option value="' + j + '">' + label + '</option>');
            }
            html.push('</select>');
            html.push('<textarea id="txt_bv" class="val" rows="10" readonly></textarea>');
            
            var jsonStr = "[]";
            try {
                jsonStr = JSON.stringify(displayObj).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
            } catch(je) {
                console.log("JSON Stringify Error: " + je);
            }
            html.push('<script>var bvData = ' + jsonStr + ';</script>');

        } else {
            var cleanBv = String(bv).replace(/"/g, "&quot;");
            html.push('<textarea class="val" rows="6" readonly onclick="this.select()">' + cleanBv + '</textarea>');
        }

        var jsBvFull = String(bv).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n").replace(/\r/g, "");
        html.push('<div class="actions">');
        html.push('<button onclick="copyText(\\'' + jsBvFull + '\\')" class="btn btn-copy">Copy Raw</button>');
        html.push('<a href="' + base + '/delete?key=RESP_barventory" class="btn btn-del">Clear All</a>');
        html.push('</div>');

    } else {
        html.push('<div class="empty">No captured response</div>');
    }
    html.push('</div></div>');

    html.push('<a href="' + base + '/clear" class="btn-main">Clear All Data</a>');
    
    html.push('<script>');
    html.push('function copyText(text) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); alert("Copied!"); }');
    html.push('function showBv(idx) { if(idx==-1){document.getElementById("txt_bv").value="";return;} var item = bvData[idx]; document.getElementById("txt_bv").value = JSON.stringify(item, null, 2); }');
    html.push('</script>');

    html.push('<div style="text-align:center;color:#444;margin-top:20px;font-size:12px">Generated by QX Script V2</div>');
    html.push('</body></html>');

    console.log("DEBUG: HTML generated, length=" + html.join("").length);

    $done({
        status: "HTTP/1.1 200 OK",
        headers: {
            "Content-Type": "text/html;charset=UTF-8",
            "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data:; connect-src *;"
        },
        body: html.join("")
    });

} catch (e) {
    console.log("DEBUG: Error " + e);
    $done({
        status: "HTTP/1.1 200 OK",
        headers: {"Content-Type": "text/html;charset=UTF-8"},
        body: "<h1>JS Error</h1><pre>" + e + "</pre>"
    });
}
