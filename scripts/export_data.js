const keys = ["REQ_barventory_raw", "RESP_barventory_raw", "RESP_barventory", "nodeloc_auth_cookie", "nodeseek_auth_cookie"];

let output = "=== QX 数据存储导出 ===\n\n";

keys.forEach(key => {
  const value = $prefs.valueForKey(key);
  if (value) {
    output += `📦 ${key}:\n${value}\n\n`;
  } else {
    output += `❌ ${key}: (无数据)\n\n`;
  }
});

$notify("数据导出完成", "", "请查看日志");
console.log(output);
$done({});
