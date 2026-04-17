@echo off
setlocal
call "%~dp0.firebase-cli\node_modules\.bin\firebase.cmd" deploy --only database
