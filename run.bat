@ECHO OFF
ECHO ============================
ECHO RUN EXTRA DIRECTORY SEARCH ON POSTAL CODES
ECHO ============================
ECHO This may take a while .... 
node --max-old-space-size=7168 postal_code_info.js gp_phone.csv
ECHO Search all directories. This may take A LOT longer...
set num=2
:loop
node pc_multi_directories.js gp_phone.csv gp_phone_%num%.csv %num%
set /a num = %num% + 1
if %num% == 63 goto close
goto loop
:close
Get-Content *.csv| Add-Content gp_final.csv
Dir *.csv -Exclude gp_final.csv -R | del
Import-Csv gp_final.csv | sort Phone,Name –Unique
ECHO All searching is complete
pause
exit

