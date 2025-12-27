@echo off
chcp 65001 >nul
echo ============================================
echo    启动前端服务器
echo ============================================
echo.

echo [1/2] 检查 Python...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] Python 未安装 - 将直接打开 HTML 文件
    set USE_PYTHON=0
) else (
    echo [OK] Python 已安装
    set USE_PYTHON=1
)

echo.
echo [2/2] 启动前端...
if "%USE_PYTHON%"=="1" (
    echo 使用 Python http.server...
    start "前端服务器" cmd /k "color 0B && echo 前端服务器启动中... && python -m http.server 8000"
    timeout /t 2 >nul
    start http://localhost:8000/
) else (
    echo 直接打开 HTML 文件...
    start index.html
)

echo.
echo [OK] 前端已启动
echo.
pause