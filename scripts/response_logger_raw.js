const STORE = "RESP_barventory_raw";
const body = $response.body || "";
const url = $request.url || "";
const headers = JSON.stringify($response.headers || {});

let arr = [];
try {
  arr = JSON.parse($prefs.valueForKey(STORE) || "[]");
} catch (e) {
  arr = [];
}

arr.push({
  time: new Date().toISOString(),
  url: url,
  headers: headers,
  body: body.slice(0, 5000)
});

if (arr.length > 30) arr = arr.slice(-30);

$prefs.setValueForKey(JSON.stringify(arr), STORE);
$done({});
