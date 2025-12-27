# 📝 数据库配置指南

## 🎯 快速开始

### 第一步：启用 SQL Server 登录

在 **SQL Server Management Studio (SSMS)** 中运行以下 SQL：

```sql
-- 启用 sa 账户并设置密码
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'Admin123456';
GO
```

### 第二步：启用混合身份验证

1. 在 SSMS 中，右键点击**服务器名称**（最顶层节点）→ **属性**
2. 左侧选择 **安全性**
3. 将"服务器身份验证"改为：**SQL Server 和 Windows 身份验证模式**
4. 点击**确定**

### 第三步：重启 SQL Server 服务

按 `Win + R`，输入 `services.msc`，回车：
1. 找到 `SQL Server (实例名)` 或 `SQL Server (MSSQLSERVER)`
2. 右键 → **重新启动**

### 第四步：创建数据库

在 SSMS 中打开 `schema.sql` 文件，点击**执行**（或按 F5）

### 第五步：修改 .env 配置

打开 `server/.env` 文件，修改以下内容：

```env
DB_USER=sa
DB_PASSWORD=Admin123456        # 改成你设置的密码
DB_SERVER=localhost            # 如果是Express版：localhost\\SQLEXPRESS
DB_NAME=ResearchGroupDB
DB_PORT=1433
JWT_SECRET=随便改成复杂字符串
PORT=3001
```

### 第六步：测试连接

打开 PowerShell，运行：

```powershell
cd d:\zuzhi_web2\server
npm install
npm run dev
```

如果看到 `SQL Server connected` 和 `Server running on port 3001`，说明成功了！

---

## 🔧 常见问题

### Q1: 找不到服务器名称？

在 SSMS 连接窗口看"服务器名称"输入框：
- `localhost` 或 `(local)` → 填 `localhost`
- `.\SQLEXPRESS` → 填 `localhost\\SQLEXPRESS`
- 其他具名实例 → 照抄，把 `\` 改成 `\\`

### Q2: Login failed for user 'sa'

可能原因：
1. 密码错误 → 重新运行 `ALTER LOGIN sa WITH PASSWORD = '新密码';`
2. sa 未启用 → 运行 `ALTER LOGIN sa ENABLE;`
3. 没开混合认证 → 按上面步骤二重新设置
4. 忘记重启服务 → 按上面步骤三重启

### Q3: Cannot open database "ResearchGroupDB"

数据库还没创建 → 在 SSMS 中执行 `schema.sql`

### Q4: 端口 1433 拒绝连接

1. 检查 SQL Server 服务是否启动
2. 检查防火墙是否开放 1433 端口
3. 检查 TCP/IP 协议是否启用：
   - 打开 **SQL Server Configuration Manager**
   - **SQL Server 网络配置** → **协议**
   - 启用 **TCP/IP**

---

## 🎓 进阶：创建专用数据库账户（可选）

不想用 sa 账户？可以创建专用账户：

```sql
-- 创建登录账户
CREATE LOGIN webuser WITH PASSWORD = 'WebUser123!';
GO

-- 切换到目标数据库
USE ResearchGroupDB;
GO

-- 创建数据库用户
CREATE USER webuser FOR LOGIN webuser;
GO

-- 授予权限
ALTER ROLE db_owner ADD MEMBER webuser;
GO
```

然后在 `.env` 中改成：
```env
DB_USER=webuser
DB_PASSWORD=WebUser123!
```
