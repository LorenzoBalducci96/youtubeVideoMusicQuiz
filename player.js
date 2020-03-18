var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        width: '100%',
        height: 'auto',
        playerVars: { 
            autoplay: 1, //start reprodution
            controls: 0, //disable controls
            showinfo: 0, //do not show track name
            rel: 0, 
            ecver: 2,
            suggestedQuality: 'medium'
        },
        events: {
            'onReady': startup,
            'onStateChange': onPlayerStateChange
        }
    });
}

function startup(){
    ready = true;
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING){
        initClearProgressBar();
        
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function stopVideo() {
    player.stopVideo();
}

function loadVideo(videoId, offset){
    player.loadVideoById({'videoId': videoId,
            'startSeconds': offset});
}