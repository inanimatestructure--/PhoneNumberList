@ECHO OFF
ECHO ============================
ECHO RUN EXTRA DIRECTORY SEARCH ON POSTAL CODES
ECHO ============================
ECHO This may take a while .... 
mkdir C:\phone_temp
node --max-old-space-size=7168 postal_code_info.js C:\phone_temp\gp_phone.csv
ECHO Search all directories. This may take A LOT longer...
set num=2
:loop
node pc_multi_directories.js C:\phone_temp\gp_phone.csv C:\phone_temp\gp_phone_%num%.csv %num%
set /a num = %num% + 1
if %num% == 3 goto close
goto loop
:close
powershell -Command "Get-Content C:\phone_temp\*.csv | Add-Content C:\phone_temp\gp_final.csv"
powershell -Command "Import-Csv C:\phone_temp\gp_final.csv | sort Name -Unique | Export-CSV -Path C:\phone_temp\gp_phone_list.csv -NoTypeInformation"
powershell -Command "Dir C:\phone_temp\*.csv -Exclude C:\phone_temp\gp_phone_list.csv -R | del"
:: Example if you wanted to get rid of postal codes that were not part of your search
:: Get-Content gp_phone_list.csv | Where{$_ -notmatch "B3K"} | Out-File gp2.csv
:: Get-Content gp2.csv | Where{$_ -notmatch "B3L"} | Out-File gp3.csv
:: Get-Content g3.csv | Where{$_ -notmatch "B3N"} | Out-File gp4.csv
:: Get-Content gp4.csv | Where{$_ -notmatch "B3P"} | Out-File gp_final.csv
ECHO All searching is complete...
pause
exit

