@ECHO OFF
ECHO ============================
ECHO RUN EXTRA DIRECTORY SEARCH ON POSTAL CODES
ECHO ============================
ECHO This may take a while .... 
node --max-old-space-size=7168 postal_code_info.js gp_phone.csv
timeout /t 10
ECHO Search all directories. This may take A LOT longer...
set num=2
:loop
node pc_multi_directories.js gp_phone.csv gp_phone_%num%.csv
set /a num = %num% + 1
if %num% == 150 goto close
goto loop
:close
timeout /t 10
copy *.csv gp_final_phone_list.csv
Import-Csv gp_final_phone_list.csv | sort Phone,Name –Unique
ECHO All searching is complete
pause
exit

