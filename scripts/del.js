
var k = "RESP_barventory";
var q = $request.url.split("?")[1];
if (q && q.indexOf("key=") !== -1) {
  k = q.split("key=")[1].split("&")[0];
}
$prefs.removeValueForKey(k);
var base = "http://" + $request.url.split("/")[2];
$done({
  status: "HTTP/1.1 200 OK", 
  headers: {"Content-Type": "text/html"}, 
  body: "<meta http-equiv='refresh' content='0;url=" + base + "'>Deleted " + k
});
