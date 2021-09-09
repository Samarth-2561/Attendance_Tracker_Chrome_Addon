data = [];

people = document.getElementsByClassName('ZjFb7c');
if(people.length == 0){
    let button = document.getElementsByClassName('google-material-icons VfPpkd-kBDsod NtU4hc')
    for(var i of button){
      if(i.innerText == 'people_outline'){
        i.click();
        break;
      }
    }
    people = document.getElementsByClassName('ZjFb7c');
}

extractInfo(people);

function extractInfo(people){
    for(var i of people){
        let name = i.innerText;
        var today = new Date().toUTCString();
        data.push({
          name: name, 
          join_time: today,
          leaving_time: null
        });
      }
    // test = chrome.extension.getBackgroundPage().test
    // console.log(test);
}
data;