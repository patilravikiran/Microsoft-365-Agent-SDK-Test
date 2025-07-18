@echo off
echo.
echo ===============================================
echo   Microsoft 365 Agent SDK - Screenshot Guide
echo ===============================================
echo.
echo To create screenshots for your README:
echo.
echo 1. Start your application:
echo    npm start
echo.
echo 2. Take screenshots using Windows Snipping Tool:
echo    - Press Windows Key + Shift + S
echo    - Select area to capture
echo    - Save as PNG in this directory
echo.
echo 3. Recommended screenshots:
echo    - main_interface.png (full application view)
echo    - configuration_modal.png (settings dialog)
echo    - chat_conversation.png (chat in action)
echo.
echo 4. After taking screenshots, run:
echo    update_readme_images.bat
echo.
echo Press any key to open Snipping Tool...
pause
start snippingtool.exe
