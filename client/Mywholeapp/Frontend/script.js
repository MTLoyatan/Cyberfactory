import bot from './assets/bot.svg';
import user from './assets/user.svg';
import send from './assets/send.svg';
import autosize from 'https://cdn.skypack.dev/autosize@v4.0.2';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
function Loader(element){
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent +='.';
        if (element.textContent==='....'){
            element.textContent='';
        }
    }, 300);
}

function typeText (element,text){
    let index=0;
    let interval = setInterval(() => {
        if(index < text.length){
            element.innerHTML +=text.charAt(index);
            index++;

        }else 
        clearInterval(interval);

    }, 20)
}

function generateUniqueId(){
    const timestamp = Date.now();
    const randomnumber = Math.random();
    const hexadecimalString = randomnumber.toString(16);

    return  `id-${timestamp}-${hexadecimalString}`;

}
  
function chatStrip (isAi, value, uniqueId) {

    return(
        `
        <div class="wrapper ${isAi && 'ai'}" style="background-color: ${isAi ? 'rgba(0, 0, 0, 0.7)' : 'rgba(128, 128, 128, 0.7)'}">  
        <div class="chat">  
           <div class="profile">  
            <img  
            src= "${isAi ? bot : user}" 
            alt="${isAi ? bot : user}" 
          />  
           </div>  
        <div class="message" id=${uniqueId}>${value}</div>  
        </div>  
        </div>
        `
    )

}

const handleSubmit = async(e) => {
e.preventDefault();

const data = new FormData(form);
//user's chatStrip
chatContainer.innerHTML +=chatStrip(false,data.get('prompt'));

form.reset();

//bot
const uniqueId = generateUniqueId();
chatContainer.innerHTML +=chatStrip(true," ",uniqueId);

chatContainer.scrollTop= chatContainer.scrollHeight;

const messageDiv= document.getElementById(uniqueId);
Loader(messageDiv);
//http://localhost:5000/    //https://aidan-ai.onrender.com/
const response = await fetch ('http://localhost:30000/',{
    method :'POST',
    headers : {
        'content-Type' : 'application/json'
    },
    body: JSON.stringify({
        prompt: data.get('prompt')
    })
})

clearInterval(loadInterval);
messageDiv.innerHTML='';

if(response.ok){
    const data=await response.json();
    const parsedData= data.bot.trim();

    typeText(messageDiv,parsedData);
}else{

    const err = await response.text();


    messageDiv.innerHTML="something went wrong";

    alert(err);
}

}

form.addEventListener('submit',handleSubmit);

form.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        handleSubmit(e);
    }
});



