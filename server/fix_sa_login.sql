-- ============================================
-- SQL Server sa 账户修复脚本
-- 请用 Windows 身份验证登录 SSMS 后运行此脚本
-- ============================================

-- 步骤1：检查 sa 账户当前状态
PRINT '=== 检查 sa 账户状态 ===';
SELECT 
    name AS '登录名',
    is_disabled AS '是否禁用',
    is_policy_checked AS '密码策略',
    is_expiration_checked AS '密码过期'
FROM sys.sql_logins 
WHERE name = 'sa';
GO

-- 步骤2：启用 sa 账户
PRINT '';
PRINT '=== 启用 sa 账户 ===';
ALTER LOGIN sa ENABLE;
PRINT 'sa 账户已启用';
GO

-- 步骤3：重置 sa 密码（密码：Admin123456）
PRINT '';
PRINT '=== 重置 sa 密码 ===';
ALTER LOGIN sa WITH PASSWORD = 'Admin123456', CHECK_POLICY = OFF;
PRINT 'sa 密码已设置为：Admin123456';
GO

-- 步骤4：检查服务器身份验证模式
PRINT '';
PRINT '=== 检查身份验证模式 ===';
DECLARE @LoginMode INT;
EXEC xp_instance_regread 
    N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer', 
    N'LoginMode', 
    @LoginMode OUTPUT;

IF @LoginMode = 1
    PRINT '当前是 Windows 身份验证模式 ❌ (需要改成混合模式)';
ELSE IF @LoginMode = 2
    PRINT '当前是混合身份验证模式 ✅';
GO

-- 步骤5：如果需要，修改为混合身份验证模式
-- 注意：修改后必须重启 SQL Server 服务才能生效
PRINT '';
PRINT '=== 设置混合身份验证模式 ===';
EXEC xp_instance_regwrite 
    N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer', 
    N'LoginMode', 
    REG_DWORD, 
    2;
PRINT '已设置为混合模式';
PRINT '⚠️ 重要：必须重启 SQL Server 服务才能生效！';
GO

-- 步骤6：验证配置
PRINT '';
PRINT '=== 验证最终配置 ===';
SELECT 
    name AS '登录名',
    CASE WHEN is_disabled = 0 THEN '✅ 已启用' ELSE '❌ 已禁用' END AS '状态'
FROM sys.sql_logins 
WHERE name = 'sa';
GO

PRINT '';
PRINT '========================================';
PRINT '✅ 脚本执行完成！';
PRINT '';
PRINT '📋 后续操作：';
PRINT '1. 按 Win+R，输入 services.msc';
PRINT '2. 找到 SQL Server (实例名) 服务';
PRINT '3. 右键 → 重新启动';
PRINT '4. 重启完成后，用以下信息登录：';
PRINT '   - 身份验证：SQL Server 身份验证';
PRINT '   - 登录名：sa';
PRINT '   - 密码：Admin123456';
PRINT '========================================';
GO
