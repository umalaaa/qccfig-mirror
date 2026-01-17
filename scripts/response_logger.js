const body = $response.body || "";
const url = $request.url;

let host = "";
try {
  host = new URL($request.url).hostname;
} catch (e) {
  host = "";
}

if (!/(^|\.)barventory\.com$/i.test(host)) {
  $done({});
  return;
}

const STORE = "RESP_barventory";

let arr = JSON.parse($prefs.valueForKey(STORE) || "[]");

arr.push({
  time: new Date().toISOString(),
  url,
  body: body.slice(0, 4000)
});

if (arr.length > 20) arr = arr.slice(-20);

$prefs.setValueForKey(JSON.stringify(arr), STORE);
$done({});
