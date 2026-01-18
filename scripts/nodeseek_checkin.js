
const $ = new Env("NodeSeek Checkin");

(async () => {
  try {
    const headersRaw = $prefs.valueForKey("nodeseek_headers");
    if (!headersRaw) {
      $.msg($.name, "❌ Failed", "No headers found. Please visit NodeSeek to capture.");
      return;
    }

    const headers = JSON.parse(headersRaw);
    
    const url = "https://www.nodeseek.com/api/attendance";
    const method = "POST";
    
    const opts = {
      url: url,
      method: method,
      headers: headers,
      body: JSON.stringify({})
    };

    delete headers["content-length"];
    delete headers["Content-Length"];

    const resp = await $.http.post({
        url: url,
        headers: headers
    });

    const body = resp.body;
    let obj = null;
    try {
        obj = JSON.parse(body);
    } catch(e) {
        console.log("Parse error: " + body);
    }

    if (obj) {
        if (obj.success === "true" || obj.success === true) {
            $.msg($.name, "✅ Success", obj.message || "Checked in successfully!");
        } else {
            if (obj.message && obj.message.includes("已经")) {
                 $.msg($.name, "⚠️ Already Done", obj.message);
            } else {
                 $.msg($.name, "❌ Failed", obj.message || "Unknown error");
            }
        }
    } else {
        $.msg($.name, "❌ Error", "Invalid response: " + body);
    }

  } catch (e) {
    console.log(e);
    $.msg($.name, "❌ Exception", e.message);
  }
})().finally(() => $done());

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}write(t,e){this.env.setValueForKey(t,e)}read(t){return this.env.valueForKey(t)}}return new class{constructor(t,e){this.name=t,this.http=new class{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this;return new Promise((r,n)=>{s.env.msg(e,t,r,n)})}get(t){return this.send(t,"GET")}post(t){return this.send(t,"POST")}}(this),this.data=new s(this),this.logs=[],this.isSurge=(()=>"undefined"!=typeof $httpClient),this.isQuanX=(()=>"undefined"!=typeof $task),this.isNode=(()=>"undefined"!=typeof module&&!!module.exports),this.log=(...t)=>{this.logs=[...this.logs,...t],t.length>0&&(console.log(t.join("  ")))},this.msg=(t=this.name,e="",s="")=>{this.isSurge&&$notification.post(t,e,s),this.isQuanX&&$notify(t,e,s),this.isNode&&(console.log(t,e,s))},this.done=(t={})=>{this.isNode&&console.log(this.logs.join("\n")),this.isQuanX&&$done(t),this.isSurge&&$done(t)}}msg(t,e,s,r){if(this.isQuanX&&(t.method=e,this.isQuanX)){$task.fetch(t).then(t=>{t.status=t.statusCode,s(t)},t=>r(t))}}}(t,e)}
