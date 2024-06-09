chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        let mainRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'hamivideo.hinet.net' },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        };
        let rules = [mainRule];
        chrome.declarativeContent.onPageChanged.addRules(rules);
    });
    chrome.action.setBadgeText({
        text: 'OFF',
    });
});

const slidebarToggle = (state) => {
    const slidebar = document.querySelector('.content-wrapper .sidebar');
    if (state === 'OFF') {
        slidebar.style.display = 'none';
    } else {
        slidebar.style.display = '';
    }
}

chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: slidebarToggle,
        args: [prevState],
    })
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
});