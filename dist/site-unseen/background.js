/** Turn the extensino on and off when its icon is pressed.
 * Inspired by https://stackoverflow.com/questions/16136275.
 */
var isExtensionOn = false;
chrome.action.onClicked.addListener((tab) => {
    isExtensionOn = !isExtensionOn;

    if (isExtensionOn) {
        turnOnExtension(tab);
    }
    else {
        turnOffExtension(tab);
    }
});

/** Keep the extension turned on when the page is (re)loaded).
 * Inspired by https://stackoverflow.com/questions/6497548.
 */
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active && isExtensionOn) {
        turnOnExtension(tab);
    }
})

/**
 * Activate the extension and change its
 * icon to show it is enabled.
 */
function turnOnExtension(tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['site-unseen.min.js']
    });
    chrome.action.setIcon({
        path: "icon16-on.png",
        tabId:tab.id
    });
}

/**
 * Deactivate the extension and change its
 * icon to show it is disabled.
 */
function cleanUpScreenReader () {
    document._screenReader.cleanUp();
}

function turnOffExtension(tab) {
    chrome.action.setIcon({
        path: "icon16.png",
        tabId:tab.id
    });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: cleanUpScreenReader
    });
}
