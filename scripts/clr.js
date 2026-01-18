
$prefs.removeValueForKey("nodeloc_auth_cookie");
$prefs.removeValueForKey("nodeloc_auth_auth");
$prefs.removeValueForKey("nodeseek_auth_cookie");
$prefs.removeValueForKey("nodeseek_auth_auth");
$prefs.removeValueForKey("RESP_barventory");
var base = "http://" + $request.url.split("/")[2];
$done({
  status: "HTTP/1.1 200 OK", 
  headers: {"Content-Type": "text/html"}, 
  body: "<meta http-equiv='refresh' content='0;url=" + base + "'>Cleared All"
});
