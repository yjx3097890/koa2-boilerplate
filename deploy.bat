@echo off
xcopy .\*.* D:\temp  /Y /E /Q /C
if errorlevel 0 echo 'Copy Success.'
