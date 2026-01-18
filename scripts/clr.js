
try {
  var url = $request.url;
  var parts = url.split("/");
  var base = parts[0] + "//" + parts[2];
  if (url.indexOf("/qx-data") !== -1) {
    base += "/qx-data";
  }

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
  $done({status: "HTTP/1.1 200 OK", body: "Error: " + e});
}
