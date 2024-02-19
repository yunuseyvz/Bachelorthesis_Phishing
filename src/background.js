// Listener that gets the details of the message when it is displayed
messenger.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  let code;
  const fullMessage = await messenger.messages.getFull(message.id);
  if (fullMessage.headers.subject == 'Urgent: Verify Your Account Information') {
    code = '(' + hover.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Mandatory Employee Survey!') {
    code = '(' + greeting.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Important: Verification required') {
    code = '(' + color.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Important: Another Verification required!') {
    code = '(' + slide.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Weekly Team Meeting Invitation') {
    code = '(' + pulse.toString() + ')()';
  }
  browser.tabs.executeScript(tab.id, { code });
});

// Listener that opens a new tab when the user clicks on the corresponding emails in the greeting warning, 
// workaround to actually make it work :)
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.openUrlInTab) {
    browser.tabs.create({ url: message.openUrlInTab });
  }
});

/*
* Display a phishing warning when the user hovers over a link.
* Shows a tooltip with a warning message and a countdown before the link becomes clickable
*/
function hover() {
  let links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {

    const mouseoverHandler = function () {
      let tooltip = document.createElement('div');
      tooltip.style.backgroundColor = '#ff4d4d';
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
      let url = new URL(this.href);
      let hostname = url.hostname;
      text.textContent = '⚠️ Warning! Possibly a phishing link: ' + hostname;
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
      tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY - 8) + 'px';
      tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX) + 'px';

      tooltip.style.transition = 'left 1s ease-out';

      let countdown = 2;
      progressBar.style.width = (countdown * 33.33) + '%';
      countdown--;

      let countdownInterval = setInterval(() => {
        if (countdown >= 0) {
          text.textContent = '⚠️ Warning! Possibly a phishing link: ' + hostname;
          progressBar.style.width = (countdown * 33.33) + '%';
          countdown--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);

      setTimeout(() => {
        tooltip.style.left = '38%'; // Move tooltip to the side
        clearInterval(countdownInterval);
      }, 3000);

      this.removeEventListener('mouseover', mouseoverHandler);
    };

    links[i].addEventListener('mouseover', mouseoverHandler);
  }
}

/*
* Display a warning next to the greeting message in the email
* Add an event listener to each list item to open a new tab with the corresponding email
*/
function greeting() {
  // Get the warning banner and list items
  const warningBanner = document.querySelector('.warning-banner');
  const listItems = document.querySelectorAll('.past-emails li');
  // Add an event listener to each list item
  listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Send a message to the background script to open a new tab
      const url = `assets/email${index + 1}.html`;
      browser.runtime.sendMessage({ openUrlInTab: url });
    });
  });
  // Create a new style element
  const style = document.createElement('style');
  // Add CSS for the list items
  style.innerHTML = `
      .past-emails li {
        cursor: pointer;
        background-color: #4CAF50; 
        border: none; 
        color: white;
        padding: 10px 20px; 
        text-decoration: none; 
        display: inline-block;
        font-size: 14px; 
        margin: 4px 2px;
        transition-duration: 0.4s; 
        overflow: auto; 
        border-radius: 5px; 
      }
      .past-emails li:hover {
        background-color: #45a049; 
      }
    `;
  // Append the style element to the head of the document
  document.head.appendChild(style);
}


/*
* Function for the pulse animation
*/
function pulse() {
  const warningBanner = document.querySelector('.warning-banner');
  if (warningBanner) {
    console.log('Pulse warning banner');
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.07);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

/*
* Function for the sliding animation
*/
function slide() {
  const warningBanner = document.querySelector('.warning-banner');
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(0);
        }
      }
      .warning-banner {
        transform: translateX(100%);
        animation: slide 2s forwards;
        
      }
    `;
    document.head.appendChild(style);
  }
}

/*
* Function for the color change animation
*/
function color() {
  const warningBanner = document.querySelector('.warning-banner');
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes colorChange {
        0% {
          background-color: #ff0000;  
        }
        50% {
          background-color: #ff7f7f;  
        }
        100% {
          background-color: #ff0000; 
        }
      }
      .warning-banner {
        animation: colorChange 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }
}