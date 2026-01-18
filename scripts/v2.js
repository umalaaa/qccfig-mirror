
console.log("DEBUG: v2.js started");
$done({
    status: "HTTP/1.1 200",
    headers: {"Content-Type": "text/html;charset=UTF-8"},
    body: "<h1>SUCCESS</h1><p>Script v2 loaded.</p>"
});
