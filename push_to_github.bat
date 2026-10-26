@echo off
echo ========================================================
echo Pushing DriveTrust Codebase to GitHub
echo Remote: https://github.com/vardhan96harsh/DriveTrust.git
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking and staging files...
git add .

echo [2/4] Creating initial commit...
git commit -m "Initial commit: DriveTrust platform (Customer & Driver Android apps, Go backend services, Next.js admin portal)"

echo [3/4] Ensuring branch is 'main'...
git branch -M main

echo [4/4] Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo SUCCESS: Code successfully pushed to GitHub!
    echo View repo at: https://github.com/vardhan96harsh/DriveTrust
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo If push was rejected because the remote has existing files:
    echo Run: git pull origin main --rebase
    echo Then run: git push -u origin main
    echo ========================================================
)

pause
