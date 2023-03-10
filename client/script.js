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
    element.textContent += '.';
    if (element.textContent === '...')
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
          <div class="profile">
            <img 
              src = "${isAi ? bot : user}"
              alt = "${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>  ${value}  </div>
        </div>
      </div>
    `
  )
}

//Acts as a trigger to get the AI generated response
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  //user's chatstripüe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();
  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //Fetchc data from server - bot's response
  const response = await fetch('https://coder-crdd.onrender.com',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  //console.log(response);

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim() // trims any trailing spaces 

    typeText(messageDiv, parsedData)
  }
    else {
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong"
    alert(err)
    }
}

form.addEventListener('submit', handleSubmit);    //event listeners
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})