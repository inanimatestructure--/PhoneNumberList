const papa = require('papaparse');
const fs = require('fs');
const file = process.argv[2];
var content = fs.readFileSync(file,"utf8");
const csvData = papa.parse(content,{header:true}).data;

var arr = [];

function searchMulti(){
    var count = 0;
    for(let key in csvData){
        if(csvData[key].Directory == "2"){
            if(arr.find(element => element == csvData[key].Url)){
            }
            else{
                arr.push(csvData[key].Url);
            }
        }
    }
    callBack(arr);
}

function callBack(arr){
    for(var i=0; i<arr.length;i++){
        console.log("Index: " + i + "\nContent: " + arr[i]);
    }
}

searchMulti();



