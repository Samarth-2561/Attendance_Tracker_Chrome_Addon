document.addEventListener("DOMContentLoaded", () => {
  button.onclick = () => {
    console.log("Runned");
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if(tabs[0].url.includes("zoom" )){
        chrome.tabs.executeScript(tabs[0].id, {
          file: "/zoomMeetTracker.js"
        });
      }else if(tabs[0].url.includes("webex")){
        chrome.tabs.executeScript(tabs[0].id, {
          file: "/webexTracker.js"
        });
      }
      else{
        var currentTab = tabs[0];
        chrome.runtime.sendMessage(
          currentTab
        );
      }
    });
  }
});