# QX Data Viewer

轻量级数据查看页面，比 BoxJS 更简单直接。

## 使用方法

### 1. 添加订阅（已包含在主订阅中）

如果你已经订阅了 `qx-rewrite.snippet`，数据查看器已自动启用。

如果想单独订阅：

```ini
[rewrite_remote]
https://raw.githubusercontent.com/umalaaa/qccfig-mirror/main/data-viewer.snippet, tag=数据查看器, enabled=true
```

### 2. 访问页面

在浏览器中打开：**http://data.saw.local**

### 3. 查看数据

页面会实时显示：
- ✅ Barventory 请求/响应记录
- ✅ NodeLoc/NodeSeek Cookie
- ✅ 所有认证信息

点击右下角 **↻** 刷新数据。

## 特性

- 📱 移动端优化
- 🎨 简洁 UI
- 🔄 实时刷新
- 📊 自动格式化 JSON
- 🚀 零依赖，纯前端

## 注意事项

- 必须开启 QX 的 MitM
- hostname 需要包含 `data.saw.local`
- 使用 `http://`（不是 https）
