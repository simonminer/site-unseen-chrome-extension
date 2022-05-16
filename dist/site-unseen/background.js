var isExtensionLoaded = false;
var isExtensionOn = false;

/**
 * Turn the extensino on and off when its icon is pressed,
 * loading it into memory on the first time
 * Inspired by https://stackoverflow.com/questions/16136275.
 */
chrome.action.onClicked.addListener((tab) => {
    isExtensionOn = !isExtensionOn;

    if (isExtensionOn) {
        turnOnExtension(tab);
    }
    else {
        turnOffExtension(tab);
    }
});

/**
 * Make sure the extension is turned off when a new page loads.
*/
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
   if (changeInfo.status == 'complete' && tab.active && isExtensionOn) {
        isExtensionOn = false;
        toggleIcon(tab);
    }
});

/**
 * Activate the extension and change its
 * icon to show it is enabled.
 */
function setupScreenReader () {
    if (document._screenReader !== undefined) {
        document._screenReader.setup();
    }
}
function turnOnExtension(tab) {
    // Load the extension.
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['site-unseen.min.js']
    },
    // Once loaded, turn the extension on.
    () => {
        isExtensionLoaded = true;
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: setupScreenReader
        });
    });

    // Switch the icon to show the extension is on.
    isExtensionOn = true;
    toggleIcon(tab);
}

/**
 * Deactivate the extension and change its
 * icon to show it is disabled.
 */
function teardownScreenReader () {
    if (document._screenReader !== undefined) {
        document._screenReader.teardown();
    }
}

function turnOffExtension(tab) {
    // Switch the icon to show the extension is off.
    isExtensionOn = false;
    toggleIcon(tab);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: teardownScreenReader
    });
}

function toggleIcon(tab) {
    const icon = isExtensionOn === true ? 'icon16-on.png' : 'icon16.png';
    chrome.action.setIcon({
        path: icon,
        tabId:tab.id
    });
}
