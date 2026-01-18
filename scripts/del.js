
try {
  var url = $request.url;
  var parts = url.split("/");
  var base = parts[0] + "//" + parts[2];
  if (url.indexOf("/qx-data") !== -1) {
    base += "/qx-data";
  }
  
  var k = "RESP_barventory";
  var q = url.split("?")[1];
  if (q && q.indexOf("key=") !== -1) {
    k = q.split("key=")[1].split("&")[0];
  }
  $prefs.removeValueForKey(k);
  $done({
    status: "HTTP/1.1 200 OK", 
    headers: {"Content-Type": "text/html;charset=UTF-8"}, 
    body: "<meta http-equiv='refresh' content='0;url=" + base + "'>Deleted " + k
  });
} catch(e) {
  $done({status: "HTTP/1.1 200 OK", body: "Error: " + e});
}
