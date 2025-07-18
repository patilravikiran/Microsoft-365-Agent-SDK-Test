@echo off
echo.
echo ===============================================
echo   Updating README with Screenshots
echo ===============================================
echo.

REM Check if screenshot files exist
if exist "main_interface.png" (
    echo ✓ Found main_interface.png
) else (
    echo ✗ Missing main_interface.png
    echo   Please take a screenshot of the main application interface
)

if exist "configuration_modal.png" (
    echo ✓ Found configuration_modal.png
) else (
    echo ✗ Missing configuration_modal.png
    echo   Please take a screenshot of the configuration modal
)

if exist "chat_conversation.png" (
    echo ✓ Found chat_conversation.png
) else (
    echo ✗ Missing chat_conversation.png
    echo   Please take a screenshot of a chat conversation
)

echo.
echo Manual steps to update README.md:
echo.
echo 1. Replace this line:
echo    ![Main Interface](https://via.placeholder.com/800x600/f8f9fa/343a40?text=Main+Interface+Screenshot+Here)
echo    With:
echo    ![Main Interface](./main_interface.png)
echo.
echo 2. Replace this line:
echo    ![Configuration Modal](https://via.placeholder.com/600x400/667eea/ffffff?text=Configuration+Modal+Screenshot+Here)
echo    With:
echo    ![Configuration Modal](./configuration_modal.png)
echo.
echo 3. Replace this line:
echo    ![Chat Interface](https://via.placeholder.com/800x500/11998e/ffffff?text=Chat+Interface+Screenshot+Here)
echo    With:
echo    ![Chat Interface](./chat_conversation.png)
echo.
echo 4. Then run: git add . && git commit -m "Add application screenshots" && git push
echo.
pause
