const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let postal_code = [];
let conf = "";
let csvUrl = process.argv[3];

const convertToCSV = () => {
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
            {id: 'multiple_dir', title: 'Directory'},
            {id: 'url', title: 'Url'}
        ]
    });

    csvWriter
    .writeRecords(postal_code)
    .then(()=> console.log('The CSV file was written successfully'));

}

const multiPageSearch = (multipleResults,multiCount,url) => {
    let count = 1;
    while(true){
        if(multipleResults.querySelector('div#Contact'+count+'')){
            name = multipleResults.querySelector('div#Contact'+count+' .c411ListedName').textContent.toString();
            address = multipleResults.querySelector('div#Contact'+count+' #ContactAddress'+count+'').textContent.toString();
            number = multipleResults.querySelector('div#Contact'+count+' #ContactPhone'+count+'').textContent.toString();
            postal_code.push({"phone_number" : number, "full_name": name, "address": address, "multiple_dir": multiCount, "url": url});
            count++;
        }
        else{
            break;
        }
    }
}

const asyncProc = (req,front,fNum,midAlpha,lNum,url) => {
    var doc = new JSDOM(req.responseText).window.document;
    let pageHTML = doc.createElement('html');
    pageHTML.innerHTML = req.responseText;
    let singleResult = pageHTML.querySelector('div#contact.vcard');
    let multipleResults = pageHTML.querySelector('div.c411ResultList');
    let multiPaging = pageHTML.querySelector('.c411Paging');
    let number, name, address;
    if(pageHTML.querySelector('div.ypalert.ypalert--warning')){
        console.log("No Results");
    }
    else if(pageHTML.querySelector('div.ypalert.ypalert--error')){
        console.log("No Results");
    }
    else{
        if(singleResult){
            console.log('single result page');
            number = singleResult.querySelector('span.vcard__label').textContent.toString();
            name = singleResult.querySelector('h1.vcard__name').textContent.toString();
            address = singleResult.querySelector('div.c411Address.vcard__address').textContent.toString();
            postal_code.push({"phone_number" : number, "full_name": name, "address": address, "multiple_dir": "1", "url": ""});
        }
        else if(multipleResults){
            console.log('multiple result page');
            if(multiPaging.querySelector('a:not(.active)')){
                multiPageSearch(multipleResults,"2",url.replace('/1/','/2/'));
            }
            else{
                multiPageSearch(multipleResults,"1","");
            }
        }
    }   
}

const callBack = (url,firstDirectory,front,fNum,midAlpha,lNum,multiResults) => {
    var req = new XMLHttpRequest();
    if(!firstDirectory){
        req.onreadystatechange = function() {
            if(this.readyState == 4) {
                asyncProc(this,front,fNum,midAlpha,lNum,url);
                conf = convertToCSV();
            }
        }
    }
    else{
        req.onreadystatechange = function() {
            if(this.readyState == 4){
                multiPageSearch(multiResults,"1",url);
                conf = convertToCSV();
            }
        }
    }
    req.open("GET",url, !(!firstDirectory));
    req.send();
}

const info = (dir) => {
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
