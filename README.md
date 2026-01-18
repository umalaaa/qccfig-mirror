# QX Config Mirror (Private)

Quantumult X 私有配置镜像仓库。包含 Rewrite 规则、自动签到脚本和高级数据查看器。

## 🚀 快速开始

### 1. 添加订阅
在 Quantumult X 中添加引用（Rewrite 引用）：

```
https://raw.githubusercontent.com/umalaaa/qccfig-mirror/main/qx-rewrite.snippet
```

### 2. 配置 MitM (关键!)
为了确保脚本正常工作，请在 **MitM** > **Hostnames** 中添加以下域名：

```
nodeloc.com, www.nodeloc.com, nodeseek.com, www.nodeseek.com, *.barventory.com, qxdata.liangjima.com
```

> **注意**: 请务必生成证书并安装信任，否则 HTTPS 流量无法解密。

---

## 📊 数据查看器 V3

用于查看、复制和管理抓取到的 Cookie 和 Response 数据。采用 iOS 深色风格，支持 JSON 数组下拉查看。

### 访问地址
在 Safari 中打开以下任意一个链接：

- **主入口 (HTTP)**: [http://qxdata.liangjima.com](http://qxdata.liangjima.com)
  - **推荐**：无需 MitM 证书，通过 HTTP 协议直接拦截，最稳定。
- **备用入口 (HTTPS)**: [https://umalaaa.github.io/qx-data](https://umalaaa.github.io/qx-data)
  - 需要 MitM 证书信任。

### 功能亮点
- **智能识别**: 自动识别 Barventory 响应数组，转换为下拉菜单。
- **美化显示**: 自动格式化 JSON 数据，清晰易读。
- **一键复制**: 提供 `Copy` 按钮，自动处理转义符。
- **安全渲染**: 防止特殊字符导致的页面崩溃。

---

## 🍪 Cookie 捕获与签到

### 1. Cookie 捕获
脚本会自动捕获以下网站的 Cookie/Auth：
- **NodeLoc**
- **NodeSeek** (捕获完整 Headers 用于签到)

**防骚扰机制**: 只有当数据 **发生变化** 时才会发送通知，避免重复刷屏。

### 2. 每日签到
已包含 NodeSeek 自动签到脚本。

**配置方法**:
建议在 Quantumult X 的 `[task_local]` 中手动添加：

```conf
0 9 * * * https://raw.githubusercontent.com/umalaaa/qccfig-mirror/main/scripts/nodeseek_checkin.js, tag=NodeSeek签到, img-url=https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png, enabled=true
```

*(每天上午 9:00 执行)*

---

## 🛠️ 故障排除

| 问题 | 解决方案 |
|------|----------|
| **白屏 / 空响应** | 1. 确保使用了 `http://` 协议 (推荐 liangjima.com) <br> 2. 更新订阅 <br> 3. 重启 QX 清除缓存 |
| **301 跳转 / 直连** | QX 未拦截成功。请检查 MitM Hostnames 是否包含访问的域名。 |
| **JS Exception** | 脚本执行错误。请查看 QX 日志中的详细报错信息。 |
| **无法安装证书** | 请前往 iOS 设置 > 通用 > 关于本机 > 证书信任设置，开启信任。 |

---
*Generated for Umalaaa*
