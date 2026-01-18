var body = "<h1>QX Debug Mode</h1><p>If you see this, script is working.</p>";

try {
    var testVal = $prefs.valueForKey("nodeloc_auth_cookie");
    body += "<p>Read Prefs Success. Value length: " + (testVal ? testVal.length : 0) + "</p>";
} catch(e) {
    body += "<p style='color:red'>Error: " + e + "</p>";
}

$done({
    status: "HTTP/1.1 200 OK",
    headers: {
        "Content-Type": "text/html;charset=utf-8",
        "Cache-Control": "no-cache"
    },
    body: body
});
