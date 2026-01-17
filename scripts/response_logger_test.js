$notify("测试", "脚本已执行", "URL: " + $request.url);

const body = $response.body || "";
const url = $request.url;
const STORE = "RESP_barventory";

let host = "";
try {
  host = new URL($request.url).hostname;
} catch (e) {
  console.log("[response_logger] URL parse error: " + e);
  $notify("错误", "URL解析失败", e.toString());
  $done({});
  return;
}

console.log("[response_logger] Host: " + host);

if (!/(^|\.)barventory\.com$/i.test(host)) {
  console.log("[response_logger] Host not match: " + host);
  $notify("提示", "域名不匹配", host);
  $done({});
  return;
}

console.log("[response_logger] Matched! URL: " + url + ", Body length: " + body.length);

let arr = [];
try {
  arr = JSON.parse($prefs.valueForKey(STORE) || "[]");
} catch (e) {
  console.log("[response_logger] Parse stored data failed: " + e);
  arr = [];
}

arr.push({
  time: new Date().toISOString(),
  url,
  body: body.slice(0, 4000)
});

if (arr.length > 20) arr = arr.slice(-20);

$prefs.setValueForKey(JSON.stringify(arr), STORE);
console.log("[response_logger] Saved! Total records: " + arr.length);

$notify("Response已记录", "", "barventory - " + arr.length + "条");
$done({});
