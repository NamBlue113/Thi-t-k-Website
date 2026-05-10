function startSpeech() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function(event) {

        const speechResult =
            event.results[0][0].transcript;

        const correctSentence =
            document.getElementById("targetSentence")
            .innerText;

        checkAccuracy(
            speechResult,
            correctSentence
        );
    };
}



function checkAccuracy(userSpeech, correctSentence) {

    userSpeech = userSpeech.toLowerCase();
    correctSentence = correctSentence.toLowerCase();

    let correctWords = 0;

    const userWords = userSpeech.split(" ");
    const correctWordsArray =
        correctSentence.split(" ");

    for(let i = 0; i < correctWordsArray.length; i++) {

        if(userWords[i] === correctWordsArray[i]) {
            correctWords++;
        }

    }

    const accuracy =
        (correctWords / correctWordsArray.length) * 100;

    document.getElementById("speechResult")
        .innerHTML =
        `
        You said: ${userSpeech}
        <br>
        Accuracy: ${accuracy.toFixed(2)}%
        `;
}