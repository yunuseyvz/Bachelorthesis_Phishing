messenger.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  let phishingDetected = await dummyCheckForPhishing(message); // Dummy function, always returns true 
  if (phishingDetected) {
    // The type of warning to display is retrieved from the local storage.
    let { warningType } = await browser.storage.local.get('warningType');
    displayWarning(tab.id, warningType || 'default');
  }
});

/*
* Display a phishing warning when the user hovers over a link
* Shows a tooltip with a warning message and a countdown before the link becomes clickable
*/  
function displayHover() {
  let links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {

    const mouseoverHandler = function() {
      let tooltip = document.createElement('div');
      tooltip.textContent = 'Warning! Possibly a phishing link: ' + this.href + '. Clickable in 10 seconds.';
      tooltip.style.backgroundColor = '#ff0000';
      tooltip.style.color = 'white';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '1000';
      tooltip.style.padding = '10px';
      tooltip.style.borderRadius = '5px'; 
      tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)'; 
      tooltip.style.fontFamily = 'Arial, sans-serif'; 
      tooltip.style.fontSize = '16px'; 
      document.body.appendChild(tooltip);
      tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY - 10) + 'px';
      tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX) + 'px';

      // Show tooltip for 10 seconds
      let countdown = 9;
      let countdownInterval = setInterval(() => {
        if (countdown > 0) {
          tooltip.textContent = 'Warning! Possibly a phishing link: ' + this.href + '. Clickable in ' + countdown + ' seconds.';
          countdown--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);

      setTimeout(() => {
        tooltip.remove(); 
        clearInterval(countdownInterval);
      }, 10000);
      
      this.removeEventListener('mouseover', mouseoverHandler);
    };

    links[i].addEventListener('mouseover', mouseoverHandler);
  }
}

/*
* Display a phishing warning when the user hovers over a link. Same as before, but with a progress bar
* Shows a tooltip with a warning message and a countdown before the link becomes clickable
*/  
function displayHoverAnimated() {
  let links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {

    const mouseoverHandler = function() {
      let tooltip = document.createElement('div');
      tooltip.style.backgroundColor = '#ff0000';
      tooltip.style.color = 'white';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '1000';
      tooltip.style.padding = '10px';
      tooltip.style.borderRadius = '5px'; 
      tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)'; 
      tooltip.style.fontFamily = 'Arial, sans-serif'; 
      tooltip.style.fontSize = '16px'; 
      tooltip.style.display = 'flex';
      tooltip.style.alignItems = 'center';
      tooltip.style.flexDirection = 'column';

      let text = document.createElement('div');
      text.textContent = 'Warning! Possibly a phishing link: ' + this.href;
      tooltip.appendChild(text);

      let progressBarContainer = document.createElement('div');
      progressBarContainer.style.height = '3px';
      progressBarContainer.style.width = '100%';
      progressBarContainer.style.backgroundColor = 'white';
      progressBarContainer.style.marginTop = '10px'; 

      let progressBar = document.createElement('div');
      progressBar.style.height = '3px';
      progressBar.style.width = '100%'; 
      progressBar.style.backgroundColor = 'blue';
      progressBar.style.transition = 'width 1s linear';
      progressBarContainer.appendChild(progressBar);

      tooltip.appendChild(progressBarContainer);

      document.body.appendChild(tooltip);
      tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY - 10) + 'px';
      tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX) + 'px';

      // Show tooltip for 10 seconds
      let countdown = 9;
      progressBar.style.width = (countdown * 10) + '%';
      countdown--;

      let countdownInterval = setInterval(() => {
        if (countdown >= 0) {
          text.textContent = 'Warning! Possibly a phishing link: ' + this.href;
          progressBar.style.width = (countdown * 10) + '%';
          countdown--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);

      setTimeout(() => {
        tooltip.remove(); 
        clearInterval(countdownInterval);
      }, 10000);
      
      this.removeEventListener('mouseover', mouseoverHandler);
    };

    links[i].addEventListener('mouseover', mouseoverHandler);
  }
}


/* 
* Display a phishing warning banner on the top of the email, with a list of the links in the mail
* Deprecated -> Hardcoded now
*/ 
function displayBanner() {
  let banner = document.createElement('div');
  banner.textContent = '⚠️ Warning! This email might be a phishing attempt!';

  banner.style.backgroundColor = '#ff4d4d';
  banner.style.color = 'white';
  banner.style.padding = '20px';
  banner.style.textAlign = 'center';
  banner.style.fontWeight = 'bold';
  banner.style.fontSize = '1.2em';
  banner.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
  banner.style.marginBottom = '10px';

  // The banner is inserted at the top of the body
  document.body.insertBefore(banner, document.body.firstChild);
  let dropdownMenu = document.createElement('div');

  dropdownMenu.style.display = 'none'; 
  dropdownMenu.style.backgroundColor = '#ff4d4d'; 
  dropdownMenu.style.padding = '10px';
  dropdownMenu.style.marginTop = '5px';

  let warningText = document.createElement('p');
  warningText.textContent = 'Do not click on any links in this email. These links lead to the following domains:';
  warningText.style.color = 'white'; 
  dropdownMenu.appendChild(warningText); 

  // Get all the links in the email
  let links = document.getElementsByTagName('a');
  let uniqueHostnames = new Set(); 
  for (let i = 0; i < links.length; i++) {
    let url = new URL(links[i].href);
    uniqueHostnames.add(url.hostname);
  }

  for (let hostname of uniqueHostnames) {
    let a = document.createElement('a');
    a.textContent = hostname;
    a.href = 'http://' + hostname; 
    a.style.display = 'block'; 
    dropdownMenu.appendChild(a);
  }

  // Create a link for the dropdown
  let dropdownLink = document.createElement('a');
  dropdownLink.textContent = 'More Information';
  dropdownLink.href = '#'; // Set the href to '#' to make it a clickable link
  dropdownLink.style.color = 'lightblue'; // Set the color to blue
  dropdownLink.style.textDecoration = 'underline'; // Add an underline
  dropdownLink.style.marginTop = '20px';
  dropdownLink.style.display = 'block'; // Make it a block element so the margin applies

  // Add a click event listener to the dropdown link
  dropdownLink.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default action of the link
    // Toggle the display of the dropdown menu when the link is clicked
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
  });

  // Append the dropdown link and the dropdown menu to the banner
  banner.appendChild(dropdownLink);
  banner.appendChild(dropdownMenu);
}

/* 
* Display a phishing warning next to the greeting line
* Deprecated -> Hardcoded now, doesn't really work as expected anyways
*/ 
function displayGreeting() {
  let firstLine = document.body.innerText.split('\n')[0];
  let firstLineElement = document.body.firstElementChild; // Get the first element in the body

  if (firstLineElement) {
    let warningMessage = '⚠️ Unusual Greeting! This email might be a phishing attempt!';
    let tooltip = document.createElement('div');
    tooltip.textContent = warningMessage;
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '1px solid black';
    tooltip.style.padding = '5px';
    tooltip.style.marginLeft = '10px';
    // Create a container for the firstLineElement and the tooltip
    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'flex-start';
    firstLineElement.parentNode.replaceChild(container, firstLineElement);
    container.appendChild(firstLineElement);
    // Add the tooltip to the container
    container.appendChild(tooltip);
  }
}

/* 
* Display a phishing warning banner with a progress bar
* Deprecated -> Not really needed at the moment
*/ 
function displayProgressBar() {
  let banner = document.createElement('div');
  //banner.textContent = '⚠️ Warning! This email might be a phishing attempt!';
  banner.style.backgroundColor = '#ff4d4d';
  banner.style.color = 'white';
  banner.style.padding = '20px';
  banner.style.textAlign = 'center';
  banner.style.fontWeight = 'bold';
  banner.style.fontSize = '1.2em';
  banner.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
  banner.style.marginBottom = '10px';
  let progressBar = document.createElement('progress');
  let percentage = Math.floor(Math.random() * 101); 
  progressBar.value = percentage; 
  progressBar.max = 100; 
  progressBar.style.width = '100%';
  progressBar.style.height = '20px';
  progressBar.style.display = 'block'; 
  let percentageText = document.createElement('span');
  percentageText.textContent = percentage + '% probability for phishing'; 
  percentageText.style.color = 'white'; 
  percentageText.style.fontWeight = 'bold'; 
  percentageText.style.display = 'block'; 
  banner.appendChild(progressBar);
  banner.appendChild(percentageText);
  document.body.insertBefore(banner, document.body.firstChild);
}

// Modify the displayWarning function to include the new warning type
async function displayWarning(tabId, displayType) {
  let code;
  switch (displayType) {
    case 'banner':
      code = '(' + displayBanner.toString() + ')()';
      break;
    case 'hover':
      code = '(' + displayHover.toString() + ')()';
      break;
    case 'hoverAnimated':
      code = '(' + displayHoverAnimated.toString() + ')()';
      break;
    case 'greeting':
      code = '(' + displayGreeting.toString() + ')()';
      break;
    case 'progress':
      code = '(' + displayProgressBar.toString() + ')()';
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