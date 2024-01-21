messenger.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  let phishingDetected = await dummyCheckForPhishing(message); // Dummy function, always returns true 
  if (phishingDetected) {
     // The type of warning to display is retrieved from the local storage.
    let { warningType } = await browser.storage.local.get('warningType');
    displayWarning(tab.id, warningType || 'default');
  }
});

// Display a phishing warning banner on the top of the email
function displayBanner() {
  let banner = document.createElement('div');
  banner.textContent = 'Phishing Detected';
  banner.style.backgroundColor = 'red';
  banner.style.color = 'white';
  banner.style.padding = '10px';
  // The banner is inserted at the top of the body of the webpage
  document.body.insertBefore(banner, document.body.firstChild);
}

// Display a phishing warning when the user hovers over a link
// TODO Link anzeigen
function displayHover() {
  // All links in the email are retrieved, create tooltip for every link
  let links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', function() {
      let tooltip = document.createElement('div');
      // Include the href attribute of the link in the tooltip text
      tooltip.textContent = 'Warning! Possibly a phishing link: ' + this.href;
      tooltip.style.backgroundColor = 'red';
      tooltip.style.color = 'white';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '1000';
      tooltip.style.padding = '10px';
      document.body.appendChild(tooltip);
      tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY + 20) + 'px';
      tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX) + 'px';
      // The tooltip is removed when the user moves the mouse away from the link
      this.addEventListener('mouseout', function() {
        tooltip.remove();
      });
    });
  }
}

// Display a phishing warning on the first line of the email
// TODO: This function is not really working as expected, needs another way
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

// Display a phishing warning based on the type of warning
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