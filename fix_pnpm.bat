@echo off
title pnpm Install - CodeNative
echo === PowerShell Execution Policy sozlanmoqda... ===
powershell -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
echo Tayyor!
echo.

:: pnpm joylashgan joyni topish
echo === pnpm topilmoqda... ===
where pnpm >nul 2>&1
if %errorlevel% == 0 (
    echo pnpm PATH da topildi!
    goto :install
)

:: bin papkasida qidirish
if exist "C:\Users\User\AppData\Local\pnpm\bin\pnpm.cmd" (
    set PNPM_CMD=C:\Users\User\AppData\Local\pnpm\bin\pnpm.cmd
    echo pnpm bin papkasida topildi!
    goto :install
)

if exist "C:\Users\User\AppData\Local\pnpm\pnpm.cmd" (
    set PNPM_CMD=C:\Users\User\AppData\Local\pnpm\pnpm.cmd
    echo pnpm topildi!
    goto :install
)

echo ERROR: pnpm topilmadi!
pause
exit /b 1

:install
echo.
echo === pnpm install boshlandi (2-3 daqiqa ketishi mumkin)... ===
cd /d C:\Users\User\CodeLet\codenative

if defined PNPM_CMD (
    call "%PNPM_CMD%" install
) else (
    pnpm install
)

echo.
echo ==========================================
echo   Install tugadi! Dev server ishga tushirilmoqda...
echo   Brauzerni oching: http://localhost:3000
echo ==========================================
echo.

if defined PNPM_CMD (
    call "%PNPM_CMD%" dev
) else (
    pnpm dev
)

pause
