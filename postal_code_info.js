const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let postal_code = [];
let flag = false;
let conf = "";


function convertToCSV(){
    let csv ="";

    // Loop the array of objects
    for(let row = 0; row < postal_code.length; row++){
        let keysAmount = Object.keys(postal_code[row]).length
        let keysCounter = 0
    
        // If this is the first row, generate the headings
        if(row === 0){
    
           // Loop each property of the object
           for(let key in postal_code[row]){
                               // This is to not add a comma at the last cell
                               // The '\r\n' adds a new line
               csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
               keysCounter++
           }
        }else{
           for(let key in postal_code[row]){
               csv += postal_code[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
               keysCounter++
           }
        }
    
        keysCounter = 0
    }
    const csvWriter = createCsvWriter({
        path: 'gp_phone_list.csv',
        header: [
            {id: 'phone_number', title: 'Phone'},
            {id: 'full_name', title: 'Name'},
            {id: 'address', title: 'Address'}
        ]
    });

    csvWriter
    .writeRecords(postal_code)
    .then(()=> console.log('The CSV file was written successfully'));

}

function callBack(url){
    var req = new XMLHttpRequest();
    req.open("GET",url);
    req.onload = function() {
        if(req.status === 200) {
            var doc = new JSDOM(req.responseText).window.document;
            let pageHTML = doc.createElement('html');
            pageHTML.innerHTML = req.responseText;

            let singleResult = pageHTML.querySelector('div#contact.vcard');
            let multipleResults = pageHTML.querySelector('div.c411ResultList');
            let number, name, address;
            if(pageHTML.querySelector('div.ypalert.ypalert--warning')){
                console.log("No Results");
                flag = false;
            }
            else if(pageHTML.querySelector('div.ypalert.ypalert--error')){
                console.log("No Results");
                flag = false;
            }
            else{
                if(singleResult){
                    flag = false;
                    console.log('single result page');
                    number = singleResult.querySelector('span.vcard__label').textContent;
                    name = singleResult.querySelector('h1.vcard__name').textContent;
                    address = singleResult.querySelector('div.c411Address.vcard__address').textContent;
                    postal_code.push({"phone_number" : number, "full_name": name, "address": address });
                }
                else if(multipleResults){
                    console.log('multiple result page');
                    let count = 1;
                    while(true){
                        if(multipleResults.querySelector('div#Contact'+count+'')){
                            name = multipleResults.querySelector('div#Contact'+count+' .c411ListedName').textContent;
                            address = multipleResults.querySelector('div#Contact'+count+' #ContactAddress'+count+'').textContent;
                            number = multipleResults.querySelector('div#Contact'+count+' #ContactPhone'+count+'').textContent;
                            postal_code.push({"phone_number" : number, "full_name": name, "address": address });
                            count++;
                        }
                        else{
                            break;
                        }
                    }
                    if(count >= 25){
                        flag = true;
                    }
                }
            }   
        }
        conf = convertToCSV();
    }
    req.send();
}

function info(){
    let i = 0;
    let j = 0;
    let url = "";
    while(i < 3){
        let dir = 1;
        let firstNum = 1;
        let lastNum = 1;
        while(firstNum < 9){
            while(lastNum < 9){
                while(j < 16){
                    do{
                        url = "https://www.canada411.ca/search/si/"+dir+"/-/B3"+alphabet[i+7]+"+"+firstNum+""+alphabet[j]+""+lastNum+"/rci-Halifax?pgLen=25";
                        callBack(url);
                        dir++;
                    } while(flag == true);
                    dir=1;
                    j++;
                }
                j=0;
                lastNum++;
            }
            lastNum=1;
            firstNum++;
        }
        firstNum=1;
        i++;
    }
}
info();