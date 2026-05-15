async function loadLesson() {

    const res = await fetch("https://thi-t-k-website.onrender.com/api");

    const lessons = await res.json();

    const lesson = lessons[0];

    document.getElementById("lessonVideo").src =
        lesson.youtubeUrl;
}

loadLesson();