@echo off
echo ========================================================
echo Pushing DriveTrust Codebase to GitHub
echo Remote: https://github.com/vardhan96harsh/DriveTrust.git
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking and staging files...
git add .

echo [2/4] Creating commit...
git commit -m "fix(ci): remove obsolete setup-android action and use pre-installed runner SDK"

echo [3/4] Ensuring branch is 'main'...
git branch -M main

echo [4/4] Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo SUCCESS: Code successfully pushed to GitHub!
    echo Check GitHub Actions builds at:
    echo https://github.com/vardhan96harsh/DriveTrust/actions
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo Push encountered a conflict or error.
    echo Trying: git pull origin main --rebase
    git pull origin main --rebase
    git push -u origin main
    echo ========================================================
)

pause
