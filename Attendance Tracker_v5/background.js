let google = "https://meet.google.com/"

function logURL(requestDetails) {
    chrome.extension.getBackgroundPage().console.log("Loading: " , requestDetails.url , requestDetails.tabId);
    if(requestDetails.url.includes(google)){
      chrome.tabs.executeScript(requestDetails.tabId, {
        file: "/googleMeetTracker.js"
      }, function(result) {
        chrome.tabs.sendMessage(requestDetails.tabId,{result});
      });
    }
}


chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]}
);

chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
  chrome.tabs.sendMessage(message.id,"download");
});