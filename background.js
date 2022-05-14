// Inspired by https://stackoverflow.com/questions/16136275.
var isExtensionOn = false;

function turnOffScreenReader () {
    document._screenReader.cleanUp();
}

chrome.action.onClicked.addListener((tab) => {
    isExtensionOn = !isExtensionOn;

    if (isExtensionOn) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['site-unseen.min.js']
        });
        chrome.action.setIcon({
            path: "icon16-on.png",
            tabId:tab.id
        });
    }
    else {
        chrome.action.setIcon({
            path: "icon16.png",
            tabId:tab.id
        });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: turnOffScreenReader
        });
    }
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active && isExtensionOn) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['site-unseen.min.js']
        });
        chrome.action.setIcon({
            path: "icon16-on.png",
            tabId:tab.id
        });
    }
})
