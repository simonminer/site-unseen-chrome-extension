// Inspired by:
// https://stackoverflow.com/questions/16136275/how-to-make-on-off-buttons-icons-for-a-chrome-extension
var isExtensionOn = false;

function turnOffScreenReader () {
    document._screenReader.overlay.hide();
}

chrome.action.onClicked.addListener((tab) => {
    isExtensionOn = !isExtensionOn;

    if (isExtensionOn) {
        chrome.action.setIcon({
            path: "icon16-on.png",
            tabId:tab.id
        });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['site-unseen.min.js']
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
