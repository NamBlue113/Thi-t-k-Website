JAVA SCRIPT 

/* ========= 1. VIDEO PLAYER ========= */

const CONFIG = {
  videoId: "3d1RP1DwOos"
};

let player;

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("video", {
    videoId: CONFIG.videoId,
    playerVars: {
      autoplay: 1,
      mute: 1
    },
    events: {
      onReady: (e) => {
        e.target.playVideo();
        setTimeout(() => player.unMute(), 1500);
      }
    }
  });
}

/* ===== CONTROL VIDEO ===== */

function playVideo() {
  player.playVideo();
}

function pauseVideo() {
  player.pauseVideo();
}

function rewind5s() {
  let t = player.getCurrentTime();
  player.seekTo(t - 5);
}

function changeSpeed(speed) {
  player.setPlaybackRate(speed);
}

/* ========= 2. XỬ LÝ CHẤM ĐIỂM ========= */

function normalize(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");
}

/* Levenshtein AI-like */
function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function calculateScore(input, correct) {
  input = normalize(input);
  correct = normalize(correct);

  let dist = levenshtein(input, correct);
  let maxLen = Math.max(input.length, correct.length);

  return Math.round((1 - dist / maxLen) * 100);
}

/* ========= 3. HIỂN THỊ + HIỆU ỨNG ========= */

const ANSWER = "learning english is very important";

function checkAnswer() {
  const input = document.getElementById("inputText").value;

  let score = calculateScore(input, ANSWER);

  let resultBox = document.getElementById("result");

  if (score >= 90) {
    resultBox.innerHTML = `
      <h3 class="correct">✅ Correct (${score}%)</h3>
    `;
    confetti();
  } else if (score >= 60) {
    resultBox.innerHTML = `
      <h3 style="color:orange">⚠️ Almost (${score}%)</h3>
    `;
  } else {
    resultBox.innerHTML = `
      <h3 class="wrong">❌ Wrong (${score}%)</h3>
      <p>Correct: ${ANSWER}</p>
    `;
    shakeInput();
  }
}

/* ========= EFFECT ========= */

function confetti() {
  for (let i = 0; i < 25; i++) {
    let d = document.createElement("div");
    d.style.position = "fixed";
    d.style.width = "6px";
    d.style.height = "6px";
    d.style.background = `hsl(${Math.random()*360},100%,50%)`;
    d.style.top = "0";
    d.style.left = Math.random() * window.innerWidth + "px";
    d.style.animation = "fall 2s linear forwards";

    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2000);
  }
}

function shakeInput() {
  const input = document.getElementById("inputText");
  input.style.animation = "shake 0.3s";

  setTimeout(() => {
    input.style.animation = "";
  }, 300);
}