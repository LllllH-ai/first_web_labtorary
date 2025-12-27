@echo off
chcp 65001 >nul
title 课题组网站 - 一键启动

:: 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ============================================
    echo    提示：建议以管理员身份运行此脚本
    echo    需要启动 SQL Server 服务
    echo ============================================
    echo.
    timeout /t 3 >nul
)

echo.
echo ============================================
echo    课题组网站 - 一键启动
echo ============================================
echo.

:: 1. 检查 Node.js
echo [1/5] 检查 Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Node.js 未安装
    echo 请先安装: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

:: 2. 检查 Python
echo.
echo [2/5] 检查 Python...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] Python 未安装 - 将使用浏览器直接打开
    set USE_PYTHON=0
) else (
    echo [OK] Python 已安装
    set USE_PYTHON=1
)

:: 3. 启动 SQL Server
echo.
echo [3/5] 启动 SQL Server...
sc query MSSQLSERVER | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo SQL Server 未运行，正在启动...
    net start MSSQLSERVER >nul 2>&1
    if %errorlevel% neq 0 (
        echo [错误] 启动失败，请以管理员身份运行
        pause
        exit /b 1
    )
    echo [OK] SQL Server 已启动
    timeout /t 2 >nul
) else (
    echo [OK] SQL Server 正在运行
)

:: 4. 启动后端服务器
echo.
echo [4/5] 启动后端服务器...
if not exist "server\index.js" (
    echo [错误] 后端文件不存在
    pause
    exit /b 1
)
start "后端服务器" cmd /k "color 0A && cd /d %~dp0server && echo 后端服务器启动中... && npm run dev"
echo [OK] 后端服务器启动中...
timeout /t 3 >nul

:: 5. 启动前端服务器
echo.
echo [5/5] 启动前端服务器...
if "%USE_PYTHON%"=="1" (
    start "前端服务器" cmd /k "color 0B && cd /d %~dp0 && echo 前端服务器启动中... && python -m http.server 8000"
    echo [OK] 前端服务器启动中...
    timeout /t 2 >nul
)

:: 完成
echo.
echo ============================================
echo    启动完成！
echo ============================================
echo.
echo 后端服务器: http://localhost:3001
echo 前端页面: http://localhost:8000
echo 测试页面: http://localhost:8000/test.html
echo.
echo ============================================
echo.
echo 正在打开前端页面...

if "%USE_PYTHON%"=="1" (
    start http://localhost:8000/
) else (
    start index.html
)

echo.
echo 注意：
echo - 请保持命令窗口打开
echo - 按 Ctrl+C 可停止服务
echo.
pause