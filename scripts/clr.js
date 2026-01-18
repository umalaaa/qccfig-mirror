
try {
  var url = $request.url;
  var base = "http://" + url.split("/")[2];
  $prefs.removeValueForKey("nodeloc_auth_cookie");
  $prefs.removeValueForKey("nodeloc_auth_auth");
  $prefs.removeValueForKey("nodeseek_auth_cookie");
  $prefs.removeValueForKey("nodeseek_auth_auth");
  $prefs.removeValueForKey("RESP_barventory");
  $done({
    status: "HTTP/1.1 200 OK", 
    headers: {"Content-Type": "text/html;charset=UTF-8"}, 
    body: "<meta http-equiv='refresh' content='0;url=" + base + "'>Cleared All"
  });
} catch(e) {
  $done({
    status: "HTTP/1.1 200 OK", 
    headers: {"Content-Type": "text/html"}, 
    body: "JS Error: " + e
  });
}
