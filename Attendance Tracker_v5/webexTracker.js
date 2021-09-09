data_webex = [];

var iframe = document.getElementById("pb-app-container").children;
var document1 = iframe[0].contentDocument;

people_webex = document1.getElementsByClassName("styles-user-name-gpTpQ");
if(people_webex.length == 0){
    let button = document1.getElementsByClassName('style-text-Yq3gZ controlbar-label');
    for(var i of button){
      if(i.innerText == 'Participants'){
        i.click();
        break;
      }
    }
    people_webex= document1.getElementsByClassName("styles-user-name-gpTpQ");
}

extractInfo(people_webex);
function extractInfo(people_webex){
    for(var i of people_webex){
          if(i.className == "styles-user-name-gpTpQ"){
            let name = i.innerText;
            data_webex.push({
              name: name
            });
        }
    }
    JSONToCSVConvertor(data_webex,'Attendance',true);
    console.log(people_webex,data_webex);

    // test = chrome.extension.getBackgroundPage().test
    // console.log(test);
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    console.log(JSONData);
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    console.log(arrData);

    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Webex_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}