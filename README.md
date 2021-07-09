# PhoneNumberList

# How to setup 
    npm install XMLHttpRequest
    npm install csv-writer
    npm install jsdom

# Example command to run the phone number list script

#### The command line arguments are the first 3 values in a postal code so for Nova Scotia it would be B3H but for other provinces it's different and then followed by the name of the csv you want to save it to.
#### The last 6 arguments are the boundaries for what kind of postal code range you want to cover, ie. the first number in the second half of the postal code would be in the range of 1-9 in this example and same with the last.
#### The alphabet, or the middle value, is from 0-25

##### Example below:
    node postal_code_info.js B3H phone_list_1.csv 1 3 1 5 0 6

