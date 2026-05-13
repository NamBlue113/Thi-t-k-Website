let mediaRecorder;
let audioChunks = [];

async function startRecording(){

    const stream =
        await navigator.mediaDevices.getUserMedia({
            audio:true
        });

    mediaRecorder =
        new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.start();
}



async function stopRecording(){

    mediaRecorder.stop();

    mediaRecorder.onstop = async () => {

        const audioBlob =
            new Blob(audioChunks,{
                type:'audio/wav'
            });

        const audioUrl =
            URL.createObjectURL(audioBlob);

        document.getElementById(
            "audioPlayback"
        ).src = audioUrl;

        // SEND TO SERVER

        const formData = new FormData();

        formData.append(
            "audio",
            audioBlob,
            "speech.wav"
        );

        formData.append(
            "correctText",
            "I love learning English"
        );

        const response =
            await fetch(
                "http://localhost:3000/analyze-speech",
                {
                    method:"POST",
                    body:formData
                }
            );

        const data = await response.json();

        document.getElementById("result")
        .innerHTML = `
            Accuracy:
            ${data.accuracy}%
            <br>
            AI Heard:
            ${data.transcript}
        `;
    };
}
