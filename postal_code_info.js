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
            {id: 'address', title: 'Address'},
            {id: 'multiple_dir', title: 'Directory #'}
        ]
    });

    csvWriter
    .writeRecords(postal_code)
    .then(()=> console.log('The CSV file was written successfully'));

}

function multiPageSearch(multipleResults,multiCount){
    let count = 1;
    while(true){
        if(multipleResults.querySelector('div#Contact'+count+'')){
            name = multipleResults.querySelector('div#Contact'+count+' .c411ListedName').textContent;
            address = multipleResults.querySelector('div#Contact'+count+' #ContactAddress'+count+'').textContent;
            number = multipleResults.querySelector('div#Contact'+count+' #ContactPhone'+count+'').textContent;
            postal_code.push({"phone_number" : number, "full_name": name, "address": address, "multiple_dir" : multiCount});
            count++;
        }
        else{
            break;
        }
    }
}

function asyncProc(req,front,fNum,midAlpha,lNum){
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
            postal_code.push({"phone_number" : number, "full_name": name, "address": address, "multiple_dir": "1" });
        }
        else if(multipleResults){
            console.log('multiple result page');
            let multiPageCount = 1;
           
            if(multipleResults.querySelectorAll("a[href='/search/si/2/-/"+multiPageCount+"/-/"+front+"+"+fNum+""+midAlpha+""+lNum+"/rci-Halifax?pgLen=25']")){
                multiPageCount++;
                console.log(multiPageCount++);
                multiPageSearch(multipleResults, multiPageCount.toString());
            }
            else{
                multiPageSearch(mutlipleResults,"1");
            }
        }
    }   
}

function callBack(url,firstDirectory,front,fNum,midAlpha,lNum,multiResults){
    var req = new XMLHttpRequest();
    if(!firstDirectory){
        req.onreadystatechange = function() {
            if(this.readyState == 4) {
                asyncProc(this,front,fNum,midAlpha,lNum);
                conf = convertToCSV();
            }
        }
    }
    else{
        req.onreadystatechange = function() {
            if(this.readyState == 4){
                multiPageSearch(multiResults,"1");
                conf = convertToCSV();
            }
        }
    }
    req.open("GET",url, !(!firstDirectory));
    req.send();
}

function info(dir){
    let url = "";
    let firstNum = process.argv[4];
    let lastNum = process.argv[6];
    let j = process.argv[8];
    while(firstNum <= process.argv[5]){
        while(lastNum <= process.argv[7]){
            while(j <= process.argv[9]){
                url = "https://www.canada411.ca/search/si/"+dir+"/-/"+process.argv[2]+"+"+firstNum+""+alphabet[j]+""+lastNum+"/rci-Halifax?pgLen=25";
                callBack(url, false, process.argv[2], firstNum, alphabet[j],lastNum, null);
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

info(1);