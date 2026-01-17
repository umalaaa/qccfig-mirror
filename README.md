# QX Config Mirror (Public)

这是 [qccfig](https://github.com/umalaaa/qccfig) 的公开镜像仓库，只包含可安全分享的配置文件。

## 一键订阅（推荐）

### 方法 1：Rewrite + MITM（抓 Cookie + 记录 Response）

在 Quantumult X 配置文件中添加：

```ini
[rewrite_remote]
https://raw.githubusercontent.com/umalaaa/qccfig-mirror/main/qx-rewrite.snippet, tag=QX配置, update-interval=86400, opt-parser=false, enabled=true
```

**✅ 这一条就够了！** 已自动包含：
- ✅ Cookie 抓取（NodeLoc、NodeSeek）
- ✅ Response 记录（barventory）
- ✅ 数据查看器（访问 https://umalaaa.github.io/qx-data/）
- ✅ MITM 域名配置

### 方法 2：定时签到任务（可选）

```ini
[task_remote]
https://raw.githubusercontent.com/umalaaa/qccfig-mirror/main/qx-tasks.list, tag=签到任务, enabled=true
```

---

## 使用步骤

### 1. 添加订阅
- 打开 QX → 配置文件 → 编辑
- 找到 `[rewrite_remote]` 部分，粘贴上面的订阅链接
- 保存配置

### 2. 开启 Rewrite 和 MITM
- QX 首页确保 **Rewrite** 和 **MitM** 开关都打开

### 3. 测试抓取
- 访问 `nodeloc.com` 或 `nodeseek.com`
- 成功会弹通知："认证信息更新 - NodeLoc 已保存"

### 4. 查看数据

**方法 1：数据查看页面（推荐，100% 安全）**
- 浏览器访问：**https://umalaaa.github.io/qx-data/**
- 🔒 **数据安全说明**：
  - GitHub Pages 只托管空白占位符
  - 你的数据由 QX 在本地注入，不会上传
  - 关闭 QX 访问 = 只看到占位符
  - 开启 QX 访问 = 看到你的数据
- 实时查看所有抓取的 Cookie 和 Response

**方法 2：QX 数据存储**
- QX → 设置 → 其他设置 → 数据存储
- 查找 `nodeloc_auth_cookie`、`nodeseek_auth_cookie` 等

---

## 常见错误（一定要避开）

| ❌ 错误做法 | ✅ 正确做法 |
|---------|---------|
| 只下载了 .js 文件 | 用 `[rewrite_remote]` 订阅 snippet |
| 以为"订阅了仓库 = 已生效" | 必须在 QX 配置文件里添加订阅链接 |
| 把抓 Cookie 脚本加到 `[task_local]` | Cookie 脚本只能用 `script-request-header` |
| 忘了开 MITM | Rewrite 触发但抓不到数据 |
| raw 链接写成 `github.com/blob/...` | 必须用 `raw.githubusercontent.com` |

---

## 文件说明

| 文件 | 用途 | 订阅方式 |
|------|------|----------|
| `qx-rewrite.snippet` | Cookie 抓取 + Response 记录 + 数据查看器 | `[rewrite_remote]` |
| `qx-tasks.list` | 定时签到任务 | `[task_remote]` |
| `scripts/cookie_capture.js` | Cookie 抓取脚本 | 自动引用 |
| `scripts/response_logger.js` | Response 记录脚本 | 自动引用 |
| `scripts/data_viewer.js` | 数据查看页面 | 自动引用 |
| `scripts/sign.js` | 签到脚本 | 自动引用 |

---

## 脚本用途对照表

| 功能 | 正确方式 | 错误方式 |
|------|----------|----------|
| 抓 Cookie | `rewrite` + `script-request-header` | ❌ 加到 `[task_local]` |
| 改 Response | `rewrite` + `script-response-body` | ❌ 用 `script-request-header` |
| 记录 Response | `rewrite` + `script-response-body` | ❌ 只下载脚本不加 rewrite |
| 每日签到 | `[task_local]` 或 `[task_remote]` | ❌ 加到 rewrite |

---

## 更新日志

- 2025-01: 初始版本，包含 NodeLoc/NodeSeek Cookie 抓取、barventory Response 记录
