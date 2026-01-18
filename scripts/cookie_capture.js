const targets = [
  { match: /(^|\.)nodeloc\.com$/i, key: "nodeloc_auth", name: "NodeLoc" },
  { match: /(^|\.)nodeseek\.com$/i, key: "nodeseek_auth", name: "NodeSeek" }
];

const h = $request.headers || {};
const headers = {};
for (const key in h) {
  headers[key.toLowerCase()] = h[key];
}

const cookie = headers["cookie"];
const auth = headers["authorization"];

let host = "";
try {
  host = new URL($request.url).hostname;
} catch (e) {
  $done({});
}

let target = null;
for (const item of targets) {
  if (item.match.test(host)) {
    target = item;
    break;
  }
}

if (!target) {
  $done({});
}

let extraChanged = false;
if (target.name === "NodeSeek") {
  const NEED_KEYS = ["connection", "accept-encoding", "priority", "content-type", "origin", "refract-sign", "user-agent", "refract-key", "sec-fetch-mode", "cookie", "host", "referer", "accept-language", "accept"];
  const captured = {};
  let hasContent = false;
  for (const k of NEED_KEYS) {
    if (headers[k]) {
      captured[k] = headers[k];
      hasContent = true;
    }
  }
  
  if (hasContent) {
    const oldHeaders = $prefs.valueForKey("nodeseek_headers");
    const newHeaders = JSON.stringify(captured);
    if (oldHeaders !== newHeaders) {
      $prefs.setValueForKey(newHeaders, "nodeseek_headers");
      extraChanged = true;
    }
  }
}

const cookieKey = target.key + "_cookie";
const authKey = target.key + "_auth";

const oldCookie = $prefs.valueForKey(cookieKey) || "";
const oldAuth = $prefs.valueForKey(authKey) || "";

let changed = false;

if (cookie && cookie !== oldCookie) {
  $prefs.setValueForKey(cookie, cookieKey);
  changed = true;
}

if (auth && auth !== oldAuth) {
  $prefs.setValueForKey(auth, authKey);
  changed = true;
}

if (changed || extraChanged) {
  $notify("✅ " + target.name, "认证已更新", "Cookie/Headers 已保存");
} else {
  console.log("⚠️ " + target.name + ": Data matches existing value. Skipped notification.");
}

$done({});
