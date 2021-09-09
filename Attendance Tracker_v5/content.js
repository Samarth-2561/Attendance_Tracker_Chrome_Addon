let button = document.getElementById('changeColor')

global_data = [];
let current_name = [];
let all_name = [];

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse){
  if(message == "download"){
    JSONToCSVConvertor(global_data,'Attendance',true);
    sendResponse(true);
    return;
  }
  current_name = []
  people_data = message.result[0];
  for(var i of people_data){
    current_name.push(i.name);
    if(!(all_name.includes(i.name))){
       var today = new Date();
       var current_date_time = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()  + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
       global_data.push({
        name: i.name, 
        join_time: current_date_time,
        leaving_time: ''
       });
       all_name.push(i.name);
       console.log(global_data);
    }
  }
  for(var i of all_name){
    if(!current_name.includes(i)){
      var today = new Date();
      for(var j of global_data){
        if(j.name == i){
          if(j.leaving_time == ""){
            j.leaving_time = today.toString().slice(0,24);
            all_name.splice(all_name.indexOf(i),1);
            console.log(global_data);
            break;
          }
        }
      }
    }
  }
  sendResponse(true);
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    console.log(JSONData);
    var CSV = 'sep=,' + '\r\n\n';

    CSV += " , Joining Log, Leaving Log\r\n";
    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "Attendee, Join Time, Leave Time";
        
        //append Label row with line break
        CSV +=  row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if(arrData[i][index] == ""){
              row += '"' + new Date().toString().slice(0,24)+ '",';
            }else{
              row += '"' + arrData[i][index] + '",';
            }
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    CSV += '\r\n\r\n';

    CSV += 'Attendees, Duration attended(In min)\r\n';
    
    let attend_hashtable = new Map()
    for(var i of JSONData){
      console.log(i.leaving_time);
      if(i.leaving_time == ""){
        var Difference_In_Time = new Date().getTime() - new Date(i.join_time).getTime();
      }else{
        var Difference_In_Time = new Date(i.leaving_time).getTime() - new Date(i.join_time).getTime();
      }
      if(attend_hashtable.has(i.name)){
        attend_hashtable.set(i.name, attend_hashtable.get(i.name) + (Difference_In_Time/(1000*60)));
      }else{
        attend_hashtable.set(i.name, Difference_In_Time/(1000*60));
      }
    }

    for (let [key, value] of attend_hashtable) {
      console.log(key,value);
      CSV+= key + ',' + value + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "GMeet_";
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