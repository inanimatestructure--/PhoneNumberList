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
if %num% == 3 goto close
goto loop
:close
powershell -Command "Get-Content *.csv | Add-Content gp_final.csv"
Dir *.csv -Exclude gp_final.csv -R | del
powershell -Command "Import-Csv gp_final.csv 
sort Phone –Unique 
powershell -Command "Export-CSV -Path gp_phone_list.csv -NoTypeInformation"
Dir *.csv -Exclude gp_phone_list.csv -R | del
:: Example if you wanted to get rid of postal codes that were not part of your search
:: Get-Content gp_phone_list.csv | Where{$_ -notmatch "B3K"} | Out-File gp2.csv
:: Get-Content gp2.csv | Where{$_ -notmatch "B3L"} | Out-File gp3.csv
:: Get-Content g3.csv | Where{$_ -notmatch "B3N"} | Out-File gp4.csv
:: Get-Content gp4.csv | Where{$_ -notmatch "B3P"} | Out-File gp_final.csv
ECHO All searching is complete...
pause
exit

