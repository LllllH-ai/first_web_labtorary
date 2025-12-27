-- ============================================
-- 快速修复 sa 账户登录问题
-- 请用 Windows 身份验证登录 SSMS 后运行此脚本
-- ============================================

USE master;
GO

PRINT '=== 步骤1：启用 sa 账户 ===';
ALTER LOGIN sa ENABLE;
GO

PRINT '=== 步骤2：重置 sa 密码（密码：Admin123456）===';
ALTER LOGIN sa WITH PASSWORD = N'Admin123456', CHECK_POLICY = OFF;
GO

PRINT '=== 步骤3：确认 sa 状态 ===';
SELECT 
    name AS [登录名],
    CASE WHEN is_disabled = 0 THEN '已启用 ✓' ELSE '已禁用 ✗' END AS [状态],
    create_date AS [创建时间],
    modify_date AS [修改时间]
FROM sys.sql_logins 
WHERE name = 'sa';
GO

PRINT '';
PRINT '========================================';
PRINT '✅ sa 账户已配置完成！';
PRINT '';
PRINT '登录信息：';
PRINT '  用户名：sa';
PRINT '  密码：Admin123456';
PRINT '';
PRINT '⚠️ 请在 services.msc 中重启 SQL Server 服务';
PRINT '========================================';
GO
