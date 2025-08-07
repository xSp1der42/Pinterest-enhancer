chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    if (request.url) {
      chrome.downloads.download({
        url: request.url,
      });
    }
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "download_hovered_pin") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "hotkey_download" });
      }
    });
  }
});