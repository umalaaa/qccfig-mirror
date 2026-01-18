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

// ============================================
// 🚫 过滤规则 (Anti-Spam Logic)
// ============================================
const url = $request.url;
// 1. 排除静态资源后缀
if (/\.(png|jpg|jpeg|gif|css|js|ico|svg|woff2|ttf|map)($|\?)/i.test(url)) {
  $done({});
}
// 2. 排除常见静态资源路径
if (url.includes("/static/") || url.includes("/assets/") || url.includes("/template/") || url.includes("/favicon")) {
  $done({});
}
// 3. 仅允许 GET 和 POST
if ($request.method !== 'GET' && $request.method !== 'POST') {
  $done({});
}
// ============================================

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
      console.log("NodeSeek Headers updated in background.");
      if (!oldHeaders) extraChanged = true;
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
