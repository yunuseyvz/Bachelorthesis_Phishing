messenger.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  let phishingDetected = await dummyCheckForPhishing(message); // Dummy function
  if (phishingDetected) {
    let { warningType } = await browser.storage.local.get('warningType');
    displayWarning(tab.id, warningType || 'default');
  }
});

function displayBanner() {
  let banner = document.createElement('div');
  banner.textContent = 'Phishing Detected';
  banner.style.backgroundColor = 'red';
  banner.style.color = 'white';
  banner.style.padding = '10px';
  document.body.insertBefore(banner, document.body.firstChild);
}

function displayHover() {
  let links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', function() {
      let tooltip = document.createElement('div');
      tooltip.textContent = 'Warning! Possibly a phishing link!';
      tooltip.style.backgroundColor = 'red';
      tooltip.style.color = 'white';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '1000';
      tooltip.style.padding = '10px';
      document.body.appendChild(tooltip);
      tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY + 20) + 'px'; // Added 20 pixels
      tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX) + 'px';
      this.addEventListener('mouseout', function() {
        tooltip.remove();
      });
    });
  }
}

function displayAnrede() {
  let firstLine = document.body.innerText.split('\n')[0];
  let elements = document.body.getElementsByTagName('*');
  let firstLineElement;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].innerText === firstLine) {
      firstLineElement = elements[i];
      break;
    }
  }
  if (firstLineElement) {
    let tooltip = document.createElement('div');
    tooltip.textContent = '⚠️';
    tooltip.style.backgroundColor = 'red';
    tooltip.style.color = 'white';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    tooltip.style.padding = '10px';
    document.body.appendChild(tooltip);
    let rect = firstLineElement.getBoundingClientRect();
    tooltip.style.top = (rect.top + window.scrollY + 20) + 'px';
    tooltip.style.left = (rect.left + window.scrollX) + 'px';
    firstLineElement.addEventListener('mouseover', function () {
      tooltip.style.display = 'none';
    });
    firstLineElement.addEventListener('mouseout', function () {
      tooltip.style.display = 'block';
    });
  }
}

async function displayWarning(tabId, displayType) {
  let code;
  switch (displayType) {
    case 'banner':
      code = '(' + displayBanner.toString() + ')()';
      break;
    case 'hover':
      code = '(' + displayHover.toString() + ')()';
      break;
    case 'anrede':
      code = '(' + displayAnrede.toString() + ')()';
      break;
    default:
      break;
  }
  if (code) {
    browser.tabs.executeScript(tabId, { code });
  }
}

async function dummyCheckForPhishing(message) {
  return true; // Always returns true
}