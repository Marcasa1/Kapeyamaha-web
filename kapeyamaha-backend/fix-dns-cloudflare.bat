@echo off
echo Setting Cloudflare DNS (1.1.1.1)...
netsh interface ip set dns "Wi-Fi" static 1.1.1.1
netsh interface ip add dns "Wi-Fi" 1.0.0.1 index=2
ipconfig /flushdns
echo Done! Please restart your computer.
pause
