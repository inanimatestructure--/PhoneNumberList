const papa = require('papaparse');
const fs = require('fs');
const file = process.argv[2];
var content = fs.readFileSync(file,"utf8");
const csvData = papa.parse(content,{header:true}).data;
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var arr = [];
var arr2 = [];

let csvUrl = process.argv[3];
function convertToCSV(){
    let csv ="";

    for(let row = 0; row < arr2.length; row++){
        let keysAmount = Object.keys(arr2[row]).length
        let keysCounter = 0
    
        if(row === 0){
           for(let key in arr2[row]){
               csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
               keysCounter++
           }
        }else{
           for(let key in arr2[row]){
               csv += arr2[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
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
    .writeRecords(arr2)
    .then(()=> console.log('The CSV file was written successfully'));
}

function searchMulti(){
    var count = 0;
    for(let key in csvData){
        if(csvData[key].Directory == "2"){
            if(arr.find(element => element == csvData[key].Url)){
                //ignore
            }
            else{
                arr.push(csvData[key].Url);
            }
        }
    }
    callBack(arr);
}

function call(rec,dir){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState == 4) {
            procedure(this,rec);
            conf = convertToCSV();
        }
    }
    req.open("GET",rec);
    req.send();
}

function callBack(arr){
    for(var i=0; i<arr.length;i++){
        let dir = process.argv[4];
        let rec = arr[i];
        console.log(rec.replace('/2/','/'+dir+'/'));
        call(rec.replace('/2/','/'+dir+'/'),dir);
    }
}

function procedure(req,url,dir){
    var doc = new JSDOM(req.responseText).window.document;
    let pageHTML = doc.createElement('html');
    pageHTML.innerHTML = req.responseText;
    mR = pageHTML.querySelector('div.c411ResultList');
    multiSearch(mR,url,dir);
}

function multiSearch(multipleResults,url,dir){
    let count = 1;
    if(multipleResults != null){
        while(true){
            if(multipleResults.querySelector('div#Contact'+count+'')){
                let name = multipleResults.querySelector('div#Contact'+count+' .c411ListedName').textContent.toString();
                let address = multipleResults.querySelector('div#Contact'+count+' #ContactAddress'+count+'').textContent.toString();
                let number = multipleResults.querySelector('div#Contact'+count+' #ContactPhone'+count+'').textContent.toString();
                arr2.push({"phone_number": number, "full_name": name, "address": address,"url": url,"multiple_dir": dir});
                count++;
            }
            else{
                break;
            }
        }
    }
}

searchMulti();



