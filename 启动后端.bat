@echo off
chcp 65001 >nul
echo ============================================
echo    启动后端服务器
echo ============================================
echo.

echo [1/4] 检查 Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

echo.
echo [2/4] 检查 SQL Server 服务...
sc query MSSQLSERVER | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo [错误] SQL Server 服务未运行
    echo 正在启动 SQL Server...
    net start MSSQLSERVER >nul 2>&1
    if %errorlevel% neq 0 (
        echo [错误] 启动失败，请以管理员身份运行
        pause
        exit /b 1
    )
    echo [OK] SQL Server 已启动
) else (
    echo [OK] SQL Server 正在运行
)

echo.
echo [3/4] 检查后端文件...
if not exist "server\index.js" (
    echo [错误] 后端文件不存在
    pause
    exit /b 1
)
echo [OK] 后端文件完整

echo.
echo [4/4] 启动后端服务器...
cd server
echo.
echo ============================================
echo    后端服务器启动中...
echo    端口: 3001
echo    按 Ctrl+C 停止服务器
echo ============================================
echo.
npm run dev