import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');  //used to target specific elements in html as we are using vanilla js
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

/*  This function is to show visualization in the answer box '°°°', 
    while the API collects data which needs to be shown to the user.  */
function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '°';
    if (element.textContent === '°°°')
      element.textContent = '';
  }, 300)
}

/*  This function helps us to show the answers in a humanly possible manner. 
    Similar to how a we take time to convey our thoughts. */
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

/*  This function helps us to generate a unique ID from 
    current time and a random number generated from JS library functions  */
function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNum = Math.random();
  const hexadecstr = randomNum.toString(16);

  return `id-${timeStamp}-${hexadecstr}`;       //returning the Unique Id as a string.
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class = "wrapper ${isAi && 'ai'}">
        <div class ="chat">
          <div className="profile>
            <img 
              src = "${isAi ? bot : user}"
              alt = "${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}


