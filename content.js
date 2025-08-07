console.log('Pinterest Enhancer V3 (Dark Mode Focus) загружен!');

let hoveredPinImageUrl = null;

const themeManager = {
  apply(themeName) {
    document.body.classList.remove('pne-theme-dark');
    
    if (themeName === 'dark') {
      document.body.classList.add('pne-theme-dark');
      console.log('Активирована тёмная тема');
    } else {
      console.log('Тема сброшена на светлую');
    }
  }
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'APPLY_THEME') {
    themeManager.apply(request.theme);
  }
  if (request.action === 'hotkey_download') {
    if (hoveredPinImageUrl) {
      chrome.runtime.sendMessage({ action: 'download', url: hoveredPinImageUrl });
    }
  }
});

chrome.storage.sync.get('selectedTheme', (data) => {
  if (data.selectedTheme) {
    themeManager.apply(data.selectedTheme);
  }
});


function addDownloadButton(pinElement) {
  if (pinElement.querySelector('.pne-download-button')) return;
  const img = pinElement.querySelector('img[src*="i.pinimg.com"]');
  if (!img) return;
  const highQualityUrl = img.src.replace(/(\/\d+x\/|\/236x\/)/, '/originals/');
  const button = document.createElement('button');
  button.innerText = 'Скачать';
  button.className = 'pne-download-button';
  button.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.runtime.sendMessage({ action: 'download', url: highQualityUrl });
  };
  pinElement.appendChild(button);
  pinElement.addEventListener('mouseover', () => { hoveredPinImageUrl = highQualityUrl; });
  pinElement.addEventListener('mouseout', () => { hoveredPinImageUrl = null; });
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1) {
        node.querySelectorAll('div[data-grid-item="true"]').forEach(addDownloadButton);
        if (node.matches('div[data-grid-item="true"]')) addDownloadButton(node);
      }
    }
  }
});
observer.observe(document.body, { childList: true, subtree: true });
document.querySelectorAll('div[data-grid-item="true"]').forEach(addDownloadButton);