$notify("Cookie脚本", "已触发", $request.url);

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
  host = "";
}

let target = null;
for (const item of targets) {
  if (item.match.test(host)) {
    target = item;
    break;
  }
}

if (!target) {
  $notify("Cookie脚本", "域名不匹配", host);
  $done({});
  return;
}

if (cookie) $prefs.setValueForKey(cookie, target.key + "_cookie");
if (auth) $prefs.setValueForKey(auth, target.key + "_auth");

if (cookie || auth) {
  $notify("认证信息更新", target.name, "Cookie/Auth 已保存");
} else {
  $notify("Cookie脚本", target.name, "无Cookie/Auth");
}

$done({});
