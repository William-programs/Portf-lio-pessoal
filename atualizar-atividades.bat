@echo off
chcp 65001 >nul
py atualizar-atividades.py || python atualizar-atividades.py
echo.
pause
