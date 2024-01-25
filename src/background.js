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
  banner.textContent = '⚠️ Warning! This email might be a phishing attempt!';

  banner.style.backgroundColor = '#ff4d4d';
  banner.style.color = 'white';
  banner.style.padding = '20px';
  banner.style.textAlign = 'center';
  banner.style.fontWeight = 'bold';
  banner.style.fontSize = '1.2em';
  banner.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
  banner.style.marginBottom = '10px';

  // The banner is inserted at the top of the body of the webpage
  document.body.insertBefore(banner, document.body.firstChild);

  // Create a div for the dropdown menu
  let dropdownMenu = document.createElement('div');

  // Style the dropdown menu
  dropdownMenu.style.display = 'none'; // Hide the dropdown menu by default
  dropdownMenu.style.backgroundColor = '#ff4d4d'; // Match the color of the main div
  dropdownMenu.style.padding = '10px';
  dropdownMenu.style.marginTop = '5px';

  // Create a p element for the warning text
  let warningText = document.createElement('p');
  warningText.textContent = 'Do not click on any links in this email. These links lead to the following domains:';
  warningText.style.color = 'white'; // Set the color to white to match the color of the main div
  dropdownMenu.appendChild(warningText); // Append the warning text to the dropdown menu

  // Get all the links in the email
  let links = document.getElementsByTagName('a');
  let uniqueHostnames = new Set(); // Use a Set to store the unique hostnames
  for (let i = 0; i < links.length; i++) {
    // Create a new URL object from the href of the link
    let url = new URL(links[i].href);

    // Add the hostname to the Set
    uniqueHostnames.add(url.hostname);
  }

  // Create an `a` element for each unique hostname
  for (let hostname of uniqueHostnames) {
    let a = document.createElement('a');
    a.textContent = hostname;
    a.href = 'http://' + hostname; // Set the href to the hostname
    a.style.display = 'block'; // Make it a block element so each link is on a new line

    // Append the link to the dropdown menu
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


// Display a phishing warning when the user hovers over a link
function displayHover() {
  // All links in the email are retrieved, create tooltip for every link
  let links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', function () {
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
      this.addEventListener('mouseout', function () {
        tooltip.remove();
      });
    });
  }
}

// Display a phishing warning on the first line of the email
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

// Display a phishing warning banner with a progress bar
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
  // Create a progress bar
  let progressBar = document.createElement('progress');
  let percentage = Math.floor(Math.random() * 101); // Generate a random number between 0 and 100
  progressBar.value = percentage; // Set the value to the generated number
  progressBar.max = 100; // Set the maximum value to 100
  // Style the progress bar
  progressBar.style.width = '100%';
  progressBar.style.height = '20px';
  progressBar.style.display = 'block'; // Make it a block element so it appears on a new line
  // Create a span element for the percentage text
  let percentageText = document.createElement('span');
  percentageText.textContent = percentage + '% probability for phishing'; // Set the text to the percentage value
  percentageText.style.color = 'white'; // Set the color to white to match the color of the banner
  percentageText.style.fontWeight = 'bold'; // Make the text bold
  percentageText.style.display = 'block'; // Make it a block element so it appears on a new line
  // Append the progress bar and the percentage text to the banner
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