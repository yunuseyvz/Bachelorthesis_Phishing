// Listener that gets the details of the message when it is displayed
messenger.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
  let code;
  const fullMessage = await messenger.messages.getFull(message.id);
  if (fullMessage.headers.subject == 'Urgent: Verify Your Account Information') {
    code = '(' + hover1.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Secure Your Account!') {
    code = '(' + hover2.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Mandatory Employee Survey!') {
    code = '(' + greeting1.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Participation Required: Strategic Employee Survey') {
    code = '(' + greeting2.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Important: Another Verification required!') {
    code = '(' + banner1.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Important: Verification required') {
    code = '(' + banner2.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Weekly Team Meeting Invitation') {
    code = '(' + signature1.toString() + ')()';
  }
  else if (fullMessage.headers.subject == 'Monthly Jour Fixe Invitation') {
    code = '(' + signature2.toString() + ')()';
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
*/
function hover1() {
  let links = document.getElementsByTagName('a');
  const phish = `assets/phished.html`;

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
      progressBar.style.backgroundColor = 'orange';
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
    links[i].addEventListener('click', () => {
      links[i].setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  }
}

function hover2() {
  let links = document.getElementsByTagName('a');
  const phish = `assets/phished.html`;

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
      text.textContent = '⚠️ Warning! Possibly a phishing link!';
      tooltip.appendChild(text);

      let progressBarContainer = document.createElement('div');
      progressBarContainer.style.height = '3px';
      progressBarContainer.style.width = '100%';
      progressBarContainer.style.backgroundColor = 'white';
      progressBarContainer.style.marginTop = '10px';

      let progressBar = document.createElement('div');
      progressBar.style.height = '3px';
      progressBar.style.width = '100%';
      progressBar.style.backgroundColor = 'orange';
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
          text.textContent = '⚠️ Warning! Possibly a phishing link!';
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
    links[i].addEventListener('click', () => {
      links[i].setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  }
}

/*
* Functions for the greeting warnings
*/
function greeting1() {
  // Get the warning banner and list items
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });
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
      @keyframes slide {
        0% {
          transform: translateX(1000px);
        }
        100% {
          transform: translateX(0);
        }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        transform: translateX(1000px);
        animation: slide 1s forwards, pulse 1s ease-out 2s;
      }
    `;
  // Append the style element to the head of the document
  document.head.appendChild(style);
}

function greeting2() {
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide {
        0% {
          transform: translateX(1000px);
        }
        100% {
          transform: translateX(0);
        }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        transform: translateX(1000px);
        animation: slide 1s forwards 1s, pulse 1s ease-out 3s;
      }
    `;
    document.head.appendChild(style);
  }
}

/*
* Functions for the signature warnings
*/
function signature1() {
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide {
        0% {
          transform: translateX(1000px);
        }
        100% {
          transform: translateX(0);
        }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        transform: translateX(1000px);
        animation: slide 1s forwards 1s, pulse 1s ease-out 3s;
      }
    `;
    document.head.appendChild(style);
  }
}

function signature2() {
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide {
        0% {
          transform: translateX(1000px);
        }
        100% {
          transform: translateX(0);
        }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        transform: translateX(1000px);
        animation: slide 1s forwards 1s, pulse 1s ease-out 3s;
      }
    `;
    document.head.appendChild(style);
  }
}

function signatureAlt() {
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes scaleUp {
        0% {
          transform: scale(0%);
          transform-origin: top left;
        }
        100% {
          transform: scale(100%);
          transform-origin: top left;
        }
      }
      .warning-banner {
        transform: scale(0%);
        animation: scaleUp 0.5s 1s forwards;
      }
    `;
    document.head.appendChild(style);
  }
}

/*
* Functions for the standard banner warnings
*/
function banner1() {
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });

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
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        
        animation: slide 1s forwards 1s, pulse 1s ease-out 3s;
      }
    `;
    document.head.appendChild(style);
  }
}

function banner2() {
  const warningBanner = document.querySelector('.warning-banner');
  const phish = `assets/phished.html`;
  const links = document.querySelectorAll('.link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      link.setAttribute('href', phish);
      browser.runtime.sendMessage({ openUrlInTab: phish });
    });
  });
  if (warningBanner) {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes slide {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(0%);
        }
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }
      .warning-banner {
        animation: slide 1s forwards, pulse 1s 3s forwards;
      }
      body {
        transform: translateY(-90px); 
        animation: pushDown 1s forwards;
        animation-delay: 1s;
      }
      @keyframes pushDown {
        0% {
          transform: translateY(-90px);
        }
        100% {
          transform: translateY(0px);
        }
      }
    `;
    document.head.appendChild(style);
  }
}
