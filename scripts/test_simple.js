const testHtml = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Test</title></head><body><h1>Test Page</h1><p>If you see this, HTML works!</p><p>Time: " + new Date().toLocaleString() + "</p></body></html>";

$done({ 
  status: "HTTP/1.1 200 OK",
  headers: {
    "Content-Type": "text/html; charset=utf-8"
  },
  body: testHtml
});
