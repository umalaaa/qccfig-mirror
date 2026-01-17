console.log("[data_viewer] Script started");

try {
  console.log("[data_viewer] $prefs available: " + (typeof $prefs !== 'undefined'));
  console.log("[data_viewer] $response available: " + (typeof $response !== 'undefined'));
  console.log("[data_viewer] $request available: " + (typeof $request !== 'undefined'));
  
  const testKey = "nodeloc_auth_cookie";
  const testValue = $prefs.valueForKey(testKey);
  console.log("[data_viewer] Test read key '" + testKey + "': " + (testValue ? "found" : "not found"));
  
  const simpleHtml = "<!DOCTYPE html><html><head><title>Debug</title></head><body><h1>Debug Info</h1><p>Script executed successfully!</p><p>Time: " + new Date().toISOString() + "</p></body></html>";
  
  console.log("[data_viewer] About to send response, HTML length: " + simpleHtml.length);
  
  $done({ 
    status: "HTTP/1.1 200 OK",
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    },
    body: simpleHtml
  });
  
} catch (e) {
  console.log("[data_viewer] ERROR: " + e);
  $done({});
}
