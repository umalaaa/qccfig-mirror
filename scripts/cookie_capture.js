const targets = [
  { match: /(^|\.)nodeloc\.com$/i, key: "nodeloc_auth", name: "NodeLoc" },
  { match: /(^|\.)nodeseek\.com$/i, key: "nodeseek_auth", name: "NodeSeek" }
];

const h = $request.headers || {};
const cookie = h.Cookie || h.cookie;
const auth = h.Authorization || h.authorization;

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

if (changed) {
  $notify("✅ " + target.name, "认证已更新", "Cookie/Auth 已保存");
} else {
  console.log("⚠️ " + target.name + ": Cookie/Auth matches existing value. Skipped notification.");
}

$done({});
