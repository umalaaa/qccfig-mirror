
global.$request = {
    url: "http://qxdata.liangjima.com/qx-data",
    method: "GET",
    headers: {}
};

global.$prefs = {
    store: {
        "nodeloc_auth_cookie": "dummy_cookie_value",
        "RESP_barventory": JSON.stringify([{time: "2024-01-01", name: "test"}])
    },
    valueForKey: function(key) {
        return this.store[key];
    },
    setValueForKey: function(val, key) {
        this.store[key] = val;
    },
    removeValueForKey: function(key) {
        delete this.store[key];
    }
};

global.$done = function(obj) {
    console.log("----------------------------------------");
    console.log("✅ Script executed successfully!");
    console.log("Status:", obj.status);
    console.log("Headers:", JSON.stringify(obj.headers, null, 2));
    console.log("Body Length:", obj.body ? obj.body.length : 0);
    console.log("----------------------------------------");
};

global.$notify = function(title, subtitle, message) {
    console.log(`[NOTIFY] ${title} - ${message}`);
};

console.log("🚀 Running script test...");

const fs = require('fs');
const path = require('path');
const scriptPath = process.argv[2];

if (!scriptPath) {
    console.error("❌ Please provide script path");
    process.exit(1);
}

try {
    const content = fs.readFileSync(scriptPath, 'utf8');
    eval(content);
} catch (e) {
    console.error("❌ Script crashed:", e);
    process.exit(1);
}
