async function generateQuiz() {

    const transcript =
        document.getElementById("transcript").value;

    const response = await fetch(
        "http://localhost:3000/generate-quiz",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                transcript: transcript
            })

        }
    );

    const data = await response.json();

    document.getElementById("quizResult")
        .innerText = data.quiz;
}