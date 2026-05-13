const chatContainer =
document.getElementById(
    "chatContainer"
);



const chatBody =
document.getElementById(
    "chatBody"
);



// ======================================
// TOGGLE CHAT
// ======================================

function toggleChat(){

    if(
        chatContainer.style.display === "flex"
    ){

        chatContainer.style.display = "none";

    }
    else{

        chatContainer.style.display = "flex";

    }

}



// ======================================
// SEND MESSAGE
// ======================================

async function sendMessage(){

    const input =
    document.getElementById(
        "userInput"
    );

    const message =
    input.value.trim();

    if(message === "") return;



    // USER MESSAGE

    addMessage(
        message,
        "user"
    );



    input.value = "";



    // LOADING

    const loading =
    addLoadingMessage();



    try{

        const response =
        await fetch(
            "http://localhost:5000/api/ai/chat",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    message
                })

            }
        );



        const data =
        await response.json();



        loading.remove();



        addMessage(
            data.reply,
            "ai"
        );

    }
    catch(error){

        loading.remove();

        addMessage(
            "Server Error",
            "ai"
        );

    }

}



// ======================================
// ADD MESSAGE
// ======================================

function addMessage(text, sender){

    const messageDiv =
    document.createElement("div");

    messageDiv.classList.add(
        "message"
    );



    let avatarClass =
    sender === "ai"
    ? "ai"
    : "user";



    let avatarText =
    sender === "ai"
    ? "AI"
    : "U";



    messageDiv.innerHTML =
    `
    <div class="avatar ${avatarClass}">
        ${avatarText}
    </div>

    <div class="text">
        ${text}
    </div>
    `;



    chatBody.appendChild(
        messageDiv
    );



    chatBody.scrollTop =
    chatBody.scrollHeight;
}



// ======================================
// LOADING
// ======================================

function addLoadingMessage(){

    const loadingDiv =
    document.createElement("div");

    loadingDiv.classList.add(
        "message"
    );



    loadingDiv.innerHTML =
    `
    <div class="avatar ai">
        AI
    </div>

    <div class="text">
        Thinking...
    </div>
    `;



    chatBody.appendChild(
        loadingDiv
    );



    chatBody.scrollTop =
    chatBody.scrollHeight;



    return loadingDiv;
}



// ======================================
// ENTER SEND
// ======================================

document.getElementById(
    "userInput"
).addEventListener(
    "keydown",
    function(e){

        if(
            e.key === "Enter" &&
            !e.shiftKey
        ){

            e.preventDefault();

            sendMessage();

        }

    }
);
