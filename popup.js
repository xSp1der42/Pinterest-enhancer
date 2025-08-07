function setTheme(themeName) {
  chrome.storage.sync.set({ selectedTheme: themeName });

  chrome.tabs.query({ url: "*://*.pinterest.com/*", active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "APPLY_THEME",
        theme: themeName
      });
    }
  });
}

document.getElementById('theme-light').addEventListener('click', () => setTheme('light'));
document.getElementById('theme-dark').addEventListener('click', () => setTheme('dark'));