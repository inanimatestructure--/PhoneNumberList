const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let postal_code = [];
let flag = false;
let conf = "";
let csvUrl = process.argv[3];


function convertToCSV(){
    let csv ="";

    for(let row = 0; row < postal_code.length; row++){
        let keysAmount = Object.keys(postal_code[row]).length
        let keysCounter = 0
    
        if(row === 0){
           for(let key in postal_code[row]){
               csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
               keysCounter++
           }
        }else{
           for(let key in postal_code[row]){
               console.log(postal_code[row][key]);
               csv += postal_code[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
               keysCounter++
           }
        }
    
        keysCounter = 0
    }
    const csvWriter = createCsvWriter({
        path: csvUrl,
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

function asyncProc(req){
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

function callBack(url,asyncFlag){
    var req = new XMLHttpRequest();
    if(asyncFlag){
        req.onreadystatechange = function() {
            if(this.readyState == 4) {
                asyncProc(this);
                conf = convertToCSV();
            }
            
        }
    }
    else{
        req.timeout = 4000;
    }
    req.open("GET",url, !(!asyncFlag));
    req.send();
}

function info(){
    let j = 0;
    var request = "";
    var arr = [];
    let url = "";
    let firstNum = 1;
    let lastNum = 1;
    while(firstNum < 7){
        while(lastNum < 7){
            while(j < 25){
                url = "https://www.canada411.ca/search/si/"+1+"/-/"+process.argv[2]+"+"+firstNum+""+alphabet[j]+""+lastNum+"/rci-Halifax?pgLen=25";
                callBack(url, true);
                j++;
            }
            j=0;
            lastNum++;
        }
        lastNum=1;
        firstNum++;
    }
    firstNum=1;
}

info();