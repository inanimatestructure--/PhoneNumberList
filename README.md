# Canadian Reverse Postal Code Phone Number Application

## Scrape through the Canada411.com website url html to find the names, landline phone numbers and addresses and put them into the spreadsheet.

# How to setup

## Install nodejs, and then install these node packages
    npm install XMLHttpRequest
    npm install csv-writer
    npm install jsdom
    npm install fs
    npm install papa

## You will need to create a text file called postalCodeList.txt with the list of Canadian Postal Codes you want IN THIS FORMAT. 
    A1A+0A0
    
## I recommend this site as an example and looking under the postal code extensions: 
    https://postal-codes.cybo.com/canada/V3N_burnaby/
    

## On Windows, all you need to do is change the directory to the project folder so,
    cd PhoneNumberlist
    
## And run the below commands in Powershell. I'll make a bash file for linux and mac eventually.
    ./run.bat
    
## Then just sit back and wait a bit, it takes a while. You'll end up with a file called gp_phone_list.csv in C:\phone_temp\real folder.

## If you would like to change how many times the batch file loops through the directories change the 
    %num% == value 
on line 14 of run.bat
