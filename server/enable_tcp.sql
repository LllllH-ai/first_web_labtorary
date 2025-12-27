-- ============================================
-- 通过 SQL 命令启用 TCP/IP 协议
-- 在 SSMS 中用 Windows 身份验证登录后运行此脚本
-- ============================================

USE master;
GO

PRINT '=== 启用 TCP/IP 协议 ===';

-- 方法1：启用 TCP/IP
EXEC xp_instance_regwrite 
    N'HKEY_LOCAL_MACHINE',
    N'Software\Microsoft\MSSQLServer\MSSQLServer\SuperSocketNetLib\Tcp',
    N'Enabled',
    REG_DWORD,
    1;

PRINT '✅ TCP/IP 已启用';
GO

-- 方法2：配置 TCP 端口（设置为 1433）
EXEC xp_regwrite 
    N'HKEY_LOCAL_MACHINE',
    N'Software\Microsoft\MSSQLServer\MSSQLServer\SuperSocketNetLib\Tcp\IPAll',
    N'TcpPort',
    REG_SZ,
    N'1433';

PRINT '✅ TCP 端口已设置为 1433';
GO

-- 方法3：清空动态端口
EXEC xp_regwrite 
    N'HKEY_LOCAL_MACHINE',
    N'Software\Microsoft\MSSQLServer\MSSQLServer\SuperSocketNetLib\Tcp\IPAll',
    N'TcpDynamicPorts',
    REG_SZ,
    N'';

PRINT '✅ 动态端口已清空';
GO

PRINT '';
PRINT '========================================';
PRINT '⚠️ 重要：必须重启 SQL Server 服务才能生效！';
PRINT '';
PRINT '请在 PowerShell 中运行：';
PRINT 'Restart-Service MSSQLSERVER -Force';
PRINT '';
PRINT '或在"服务"中手动重启 SQL Server 服务';
PRINT '========================================';
GO
