
console.log("DEBUG: viewer_v3.js started");

try {
    if (typeof $prefs === "undefined") throw new Error("$prefs undefined");
    
    var keys = ["nodeloc_auth_cookie", "nodeloc_auth_auth", "nodeseek_auth_cookie", "nodeseek_auth_auth"];
    var labels = ["NodeLoc Cookie", "NodeLoc Auth", "NodeSeek Cookie", "NodeSeek Auth"];
    
    var payload = {
        items: [],
        barventory: null,
        baseUrl: "http://qxdata.liangjima.com"
    };

    if (typeof $request !== "undefined" && $request.url) {
        var parts = $request.url.split("/");
        if (parts.length >= 3) {
            payload.baseUrl = parts[0] + "//" + parts[2];
            if ($request.url.indexOf("/qx-data") !== -1) {
                payload.baseUrl += "/qx-data";
            }
        }
    }

    for (var i = 0; i < keys.length; i++) {
        var val = $prefs.valueForKey(keys[i]);
        if (val) {
            payload.items.push({
                key: keys[i],
                label: labels[i],
                value: val
            });
        }
    }

    var bvRaw = $prefs.valueForKey("RESP_barventory");
    if (bvRaw) {
        try {
            payload.barventory = JSON.parse(bvRaw);
        } catch (e) {
            payload.barventory = bvRaw; 
        }
    }

    var html = [];
    html.push('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"><title>QX Data V3</title>');
    html.push('<style>');
    html.push(':root { --bg: #000; --card: #1c1c1e; --text: #fff; --sub: #888; --accent: #0a84ff; --danger: #ff453a; }');
    html.push('body { background: var(--bg); color: var(--text); font-family: -apple-system, sans-serif; padding: 16px; margin: 0; padding-bottom: 50px; }');
    html.push('h1 { margin: 0 0 20px 0; font-size: 28px; font-weight: 800; }');
    html.push('.section-title { color: var(--sub); font-size: 13px; text-transform: uppercase; margin: 24px 0 8px 12px; font-weight: 600; }');
    html.push('.card { background: var(--card); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }');
    html.push('.row { padding: 16px; border-bottom: 1px solid #2c2c2e; }');
    html.push('.row:last-child { border-bottom: none; }');
    html.push('.label { font-size: 15px; font-weight: 600; margin-bottom: 8px; display: block; }');
    html.push('textarea { width: 100%; background: #2c2c2e; border: none; color: #32d74b; font-family: monospace; font-size: 12px; border-radius: 8px; padding: 8px; box-sizing: border-box; resize: vertical; min-height: 60px; outline: none; }');
    html.push('.actions { margin-top: 12px; display: flex; gap: 10px; justify-content: flex-end; }');
    html.push('button, .btn { background: #3a3a3c; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer; display: inline-block; }');
    html.push('.btn-copy { background: rgba(10,132,255,0.15); color: var(--accent); }');
    html.push('.btn-del { background: rgba(255,69,58,0.15); color: var(--danger); }');
    html.push('.btn-main { display: block; width: 100%; text-align: center; padding: 14px; background: var(--card); color: var(--danger); margin-top: 30px; }');
    html.push('select { width: 100%; padding: 10px; background: #2c2c2e; color: #fff; border: 1px solid #3a3a3c; border-radius: 8px; font-size: 14px; margin-bottom: 10px; outline: none; appearance: none; -webkit-appearance: none; }');
    html.push('</style></head><body>');

    html.push('<h1>QX Data Manager</h1>');
    html.push('<div id="app"></div>'); 

    html.push('<script type="application/json" id="raw-data">' + JSON.stringify(payload) + '</script>');

    html.push('<script>');
    html.push('const data = JSON.parse(document.getElementById("raw-data").textContent);');
    html.push('const app = document.getElementById("app");');
    
    html.push('function el(tag, cls, text) { const e = document.createElement(tag); if(cls) e.className = cls; if(text) e.textContent = text; return e; }');
    
    html.push('function render() {');
    html.push('  if (data.items.length > 0) {');
    html.push('    const t = el("div", "section-title", "Authentication"); app.appendChild(t);');
    html.push('    const card = el("div", "card");');
    html.push('    data.items.forEach(item => {');
    html.push('      const row = el("div", "row");');
    html.push('      row.appendChild(el("div", "label", item.label));');
    html.push('      const ta = el("textarea"); ta.value = item.value; ta.readOnly = true; ta.onclick = () => ta.select(); row.appendChild(ta);');
    html.push('      const acts = el("div", "actions");');
    html.push('      const cBtn = el("button", "btn-copy", "Copy"); cBtn.onclick = () => copyText(item.value); acts.appendChild(cBtn);');
    html.push('      const dBtn = el("a", "btn btn-del", "Delete"); dBtn.href = data.baseUrl + "/delete?key=" + item.key; acts.appendChild(dBtn);');
    html.push('      row.appendChild(acts); card.appendChild(row);');
    html.push('    });');
    html.push('    app.appendChild(card);');
    html.push('  }');

    html.push('  const t2 = el("div", "section-title", "Barventory Response"); app.appendChild(t2);');
    html.push('  const card2 = el("div", "card");');
    html.push('  const row2 = el("div", "row");');
    
    html.push('  if (data.barventory) {');
    html.push('    let displayVal = "";');
    html.push('    if (Array.isArray(data.barventory)) {');
    html.push('      const sel = el("select");');
    html.push('      sel.innerHTML = "<option value=\'-1\'>Select an item (" + data.barventory.length + " records)...</option>";');
    html.push('      data.barventory.forEach((item, idx) => {');
    html.push('        let label = "Item " + (idx+1);');
    // Dropdown Label Logic: Try to find URL first, then time/name
    html.push('        if (item.url) label += ": " + item.url;');
    html.push('        else if (item.request && item.request.url) label += ": " + item.request.url;');
    html.push('        else if (item.time) label += " - " + item.time;');
    html.push('        else if (item.name) label += " - " + item.name;');
    html.push('        if (label.length > 60) label = label.substring(0, 57) + "...";'); // Truncate
    html.push('        const opt = el("option", "", label);');
    html.push('        opt.value = idx; sel.appendChild(opt);');
    html.push('      });');
    html.push('      row2.appendChild(sel);');
    
    html.push('      const ta2 = el("textarea"); ta2.rows = 12; ta2.id = "bv-view"; ta2.placeholder = "Select an item above to view details..."; row2.appendChild(ta2);');
    html.push('      sel.onchange = (e) => {');
    html.push('         const idx = e.target.value;');
    html.push('         if(idx == -1) ta2.value = "";');
    html.push('         else ta2.value = JSON.stringify(data.barventory[idx], null, 2);');
    html.push('      };');
    html.push('      displayVal = JSON.stringify(data.barventory);'); 
    html.push('    } else {');
    html.push('      const ta2 = el("textarea"); ta2.rows = 10; ta2.value = JSON.stringify(data.barventory, null, 2); row2.appendChild(ta2);');
    html.push('      displayVal = ta2.value;');
    html.push('    }');
    
    html.push('    const acts2 = el("div", "actions");');
    html.push('    const cBtn2 = el("button", "btn-copy", "Copy Raw"); cBtn2.onclick = () => copyText(displayVal); acts2.appendChild(cBtn2);');
    html.push('    const dBtn2 = el("a", "btn btn-del", "Clear All"); dBtn2.href = data.baseUrl + "/delete?key=RESP_barventory"; acts2.appendChild(dBtn2);');
    html.push('    row2.appendChild(acts2);');
    
    html.push('  } else {');
    html.push('    row2.innerHTML = "<div style=\'color:#666;text-align:center\'>No data captured yet</div>";');
    html.push('  }');
    
    html.push('  card2.appendChild(row2); app.appendChild(card2);');
    
    html.push('  const clr = el("a", "btn btn-main", "Reset Everything"); clr.href = data.baseUrl + "/clear"; app.appendChild(clr);');
    html.push('}');

    html.push('function copyText(txt) {');
    html.push('  const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();');
    html.push('  try { document.execCommand("copy"); alert("Copied!"); } catch(e) { alert("Error: " + e); }');
    html.push('  document.body.removeChild(ta);');
    html.push('}');

    html.push('render();');
    html.push('</script></body></html>');

    $done({
        status: "HTTP/1.1 200 OK",
        headers: {
            "Content-Type": "text/html;charset=UTF-8",
            "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data:; connect-src *;"
        },
        body: html.join("")
    });

} catch (e) {
    console.log("CRITICAL ERROR: " + e);
    $done({
        status: "HTTP/1.1 200 OK",
        headers: {"Content-Type": "text/html;charset=UTF-8"},
        body: "<h1>Script Critical Error</h1><pre>" + e + "</pre>"
    });
}
