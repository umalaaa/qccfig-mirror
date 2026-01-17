const cookie = $prefs.valueForKey("auth_cookie");
const auth = $prefs.valueForKey("auth_token");
const url = $prefs.valueForKey("sign_url");

if (!url) {
  $notify("签到失败", "", "未设置 sign_url");
  $done();
  return;
}

if (!cookie && !auth) {
  $notify("签到失败", "", "未找到认证信息");
  $done();
  return;
}

const headers = {};
if (cookie) headers.Cookie = cookie;
if (auth) headers.Authorization = auth;

$httpClient.get(
  {
    url,
    headers
  },
  (err, resp, data) => {
    $notify("签到完成", "", data || "OK");
    $done();
  }
);
