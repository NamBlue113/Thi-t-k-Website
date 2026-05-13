// ======================================================
// FILE: FrontEnd/assets/js/speech-analysis.js
// REALTIME SPEECH ANALYSIS
// ======================================================

let recognition;
let isListening = false;



function startSpeechAnalysis(){

    if(isListening) return;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert(
            "Speech Recognition is not supported in this browser."
        );

        return;
    }

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    recognition.start();

    isListening = true;



    document.getElementById("speech-status")
    .innerHTML =
    `
    🎤 Listening...
    `;



    recognition.onresult = async function(event){

        let transcript = "";

        for(let i = 0; i < event.results.length; i++){

            transcript +=
            event.results[i][0].transcript + " ";
        }

        transcript = transcript.trim();



        document.getElementById(
            "speech-text"
        ).innerHTML =
        `
        ${transcript}
        `;



        // SEND TO BACKEND

        const response =
            await fetch(
                "http://localhost:5000/api/speech/analyze",
                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        transcript
                    })
                }
            );



        const data =
            await response.json();



        renderSpeechResult(data);

    };



    recognition.onerror = function(event){

        document.getElementById(
            "speech-status"
        ).innerHTML =
        `
        ❌ Error:
        ${event.error}
        `;

        isListening = false;

    };



    recognition.onend = function(){

        isListening = false;

        document.getElementById(
            "speech-status"
        ).innerHTML =
        `
        ✅ Analysis Completed
        `;
    };
}




function renderSpeechResult(data){

    document.getElementById(
        "speech-result"
    ).innerHTML =
    `
    <div class="speech-card">

        <h2>
            Speaking Score:
            ${data.score}%
        </h2>

        <div class="speech-bar">

            <div
                class="speech-progress"
                style="width:${data.score}%">
            </div>

        </div>

        <br>

        <h3>AI Feedback</h3>

        <p>${data.feedback}</p>

        <br>

        <h3>Grammar</h3>

        <p>${data.grammar}</p>

        <br>

        <h3>Fluency</h3>

        <p>${data.fluency}</p>

    </div>
    `;
}
