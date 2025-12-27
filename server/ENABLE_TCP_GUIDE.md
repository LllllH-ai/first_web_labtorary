# 🔧 启用 SQL Server TCP/IP 协议

## 方法一：通过 SQL Server Configuration Manager（推荐）

### 步骤：

1. **打开配置管理器**
   - 按 `Win + R`
   - 输入：`SQLServerManager16.msc`（SQL Server 2022）
   - 或：`SQLServerManager15.msc`（SQL Server 2019）
   - 或：`SQLServerManager14.msc`（SQL Server 2017）
   - 如果找不到，直接搜索"SQL Server Configuration Manager"

2. **启用 TCP/IP**
   - 展开：**SQL Server 网络配置**
   - 点击：**MSSQLSERVER 的协议**（或你的实例名）
   - 右键 **TCP/IP** → **启用**
   - 如果已经是"已启用"，继续下一步

3. **配置 TCP/IP 端口**
   - 双击 **TCP/IP** → 选择 **IP 地址** 选项卡
   - 滚动到最底部找到 **IPAll**
   - 确认：
     - **TCP 动态端口**：留空（删除 0）
     - **TCP 端口**：填入 `1433`
   - 点击**确定**

4. **重启 SQL Server 服务**
   - 左侧点击：**SQL Server 服务**
   - 右键 **SQL Server (MSSQLSERVER)** → **重新启动**

5. **测试连接**
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 1433
   ```
   如果显示 `TcpTestSucceeded : True` 说明端口开放成功。

---

## 方法二：通过 PowerShell 脚本（快速）

在 **管理员权限** PowerShell 中运行：

```powershell
# 导入 SQL Server 模块
Import-Module "SQLPS" -DisableNameChecking

# 启用 TCP/IP
$smo = 'Microsoft.SqlServer.Management.Smo.'
$wmi = new-object ($smo + 'Wmi.ManagedComputer')
$uri = "ManagedComputer[@Name='$env:COMPUTERNAME']/ServerInstance[@Name='MSSQLSERVER']/ServerProtocol[@Name='Tcp']"
$Tcp = $wmi.GetSmoObject($uri)
$Tcp.IsEnabled = $true
$Tcp.Alter()

Write-Host "✅ TCP/IP 已启用，请重启 SQL Server 服务"

# 重启服务
Restart-Service -Name "MSSQLSERVER" -Force
Write-Host "✅ SQL Server 服务已重启"
```

---

## 如果还是连不上，检查防火墙

```powershell
# 添加防火墙规则允许 1433 端口
New-NetFirewallRule -DisplayName "SQL Server" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow
```

---

## 验证配置

运行以下命令测试：

```powershell
# 测试端口是否开放
Test-NetConnection -ComputerName localhost -Port 1433

# 如果显示 TcpTestSucceeded : True，说明成功
```

然后重新启动后端服务器：
```powershell
cd d:\zuzhi_web2\server
npm run dev
```

---

## 常见问题

### Q: 找不到 Configuration Manager？
A: 在开始菜单搜索"SQL Server Configuration Manager"，或者用 PowerShell 方法。

### Q: TCP/IP 已经是启用状态但还是连不上？
A: 检查 IPAll 的 TCP 端口是否设置为 1433，然后重启服务。

### Q: 显示"无法连接到 WMI 提供程序"？
A: 需要管理员权限运行 Configuration Manager。
