let player;



// =========================================
// LOAD YOUTUBE PLAYER
// =========================================

function onYouTubeIframeAPIReady(){

    player = new YT.Player(
        'player',
        {

            height:'500',

            width:'100%',

            videoId:'aqz-KE-bpKQ',

            playerVars:{
                autoplay:0,
                controls:1
            },

            events:{
                'onReady':onPlayerReady
            }

        }
    );
}



// =========================================
// PLAYER READY
// =========================================

function onPlayerReady(){

    document.getElementById(
        "status"
    ).innerHTML =
    `
    ✅ Player Ready
    `;
}



// =========================================
// PLAY
// =========================================

function playVideo(){

    player.playVideo();

    document.getElementById(
        "status"
    ).innerHTML =
    `
    ▶ Playing
    `;
}



// =========================================
// PAUSE
// =========================================

function pauseVideo(){

    player.pauseVideo();

    document.getElementById(
        "status"
    ).innerHTML =
    `
    ⏸ Paused
    `;
}



// =========================================
// REWIND 5s
// =========================================

function rewind5s(){

    const currentTime =
        player.getCurrentTime();

    player.seekTo(
        currentTime - 5,
        true
    );

    document.getElementById(
        "status"
    ).innerHTML =
    `
    ⏪ Rewind 5 seconds
    `;
}



// =========================================
// FORWARD 5s
// =========================================

function forward5s(){

    const currentTime =
        player.getCurrentTime();

    player.seekTo(
        currentTime + 5,
        true
    );

    document.getElementById(
        "status"
    ).innerHTML =
    `
    ⏩ Forward 5 seconds
    `;
}



// =========================================
// CHANGE SPEED
// =========================================

function changeSpeed(speed){

    player.setPlaybackRate(speed);

    document.getElementById(
        "status"
    ).innerHTML =
    `
    ⚡ Speed:
    ${speed}x
    `;
}