var actualplaylistName;
var correctAnswer;
var correctAnswerNum; //0, 1, 2 or 3
var currentVideoImg; //https://youtube....
var playlistJson; //all the json elements of the choosen playlist

var totalQuestions; //the number of questions for this match

var answers = []; //all the given answers {correctAnswer, givenAnswer, img}

var time = 100;

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
            console.log(`SW registration failed`);
        }
    }
}

window.onload = function(){
    
    this.fireTick();
    this.registerSW();
}

function fireTick(){//loop every 750ms fire a tick
    var event = new CustomEvent("tick");
    setTimeout(function(){
        document.dispatchEvent(event);
        fireTick();
    }, 750);
}

function initClearProgressBar(){
    document.getElementById("progress_of_progressbar").style.width = "100%";
    time = 100;
    document.addEventListener("tick", handleTick);
}

function handleTick(){
    time = time - 5;
    document.getElementById("progress_of_progressbar").style.width = time + "%";
}

function loadGame(playlistName){
    if(ready){
        totalQuestions =3;
        answers = [];

        actualplaylistName = playlistName;
        document.getElementById("turn_label").innerHTML = 1;
        document.getElementById("points").innerHTML = 0;
        goOnGameView();
        
        switch(playlistName){
            case "actualHits": playlistJson = actualHits(); break;
        }
        loadQuestion();
    }
}

function loadQuestion(){
    //reset buttons colors and hide next buttons
    document.getElementById("progress_of_progressbar").style.width = "100%";
    document.getElementById("turn_label").innerHTML = answers.length + 1;
    time = 100;

    let count = 0;
    for(count = 0; count < 4; count++){
        document.getElementById("btn-" + count).classList.remove("btn-success");
        document.getElementById("btn-" + count).classList.remove("btn-danger");
        document.getElementById("btn-" + count).classList.add("btn-dark");
    }
    document.getElementById("btn-next").classList.add("hided-next");
    document.getElementById("btn-end").classList.add("hided-next");
    //end of reset buttons colors and hide next buttons

    let availableSongs = playlistJson.items.length;
    let extractedSongNum = Math.floor(Math.random() * availableSongs);
    correctAnswer = playlistJson.items[extractedSongNum].snippet.title;
    console.log("correct answer: " + correctAnswer + "\n")
    currentVideoImg = playlistJson.items[extractedSongNum].snippet.thumbnails.default.url;

    correctAnswerNum = Math.floor(Math.random() * 4);
    count = 0;
    for(count = 0; count < 4; count++){
        if(count == correctAnswerNum){
            document.getElementById("btn-" + count).innerHTML = correctAnswer;
            console.log("one option (correct): " + document.getElementById("btn-" + count).innerHTML + "\n")
        }else{
            document.getElementById("btn-" + count).innerHTML = playlistJson.items[random(0, availableSongs)].snippet.title;
            console.log("one option: " + document.getElementById("btn-" + count).innerHTML + "\n")
        }
    }
    loadVideo(playlistJson.items[extractedSongNum].snippet.resourceId.videoId, 120);
}

function answer(choosedButton){
    if(document.getElementById("btn-" + choosedButton).classList.contains("btn-dark")){
        document.removeEventListener("tick", handleTick);
        let correct;
        if(choosedButton == correctAnswerNum){
            correct = true;
            document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML) + 100
        }else{
            correct = false;
        }
        answers.push({
            givenAnswer: document.getElementById("btn-" + choosedButton).innerHTML,
            correctAnswer: correctAnswer,
            correct: false,
            videoImg: currentVideoImg
        })

        let count = 0;
        for(count = 0; count < 4; count++){
            document.getElementById("btn-" + count).classList.remove("btn-dark");
            if(count == correctAnswerNum){
                document.getElementById("btn-" + count).classList.add("btn-success");
            }else{
                document.getElementById("btn-" + count).classList.add("btn-danger");
            }
        }
        
        if(answers.length < totalQuestions){
            
            document.getElementById("btn-next").classList.remove("hided-next");
        }else{
            document.getElementById("btn-end").classList.remove("hided-next");
        }
    }
}

function endGame(){
    stopVideo();

    document.getElementById("resultModalBody").innerHTML = "";
    answers.forEach(elmnt => {
        let row = document.createElement("div");
        row.classList.add("row");
        let col_left = document.createElement("div");
        col_left.classList.add("col-4");
        let img = document.createElement("img");
        img.src = elmnt.videoImg;//TODO memorize 
        col_left.appendChild(img);
        row.appendChild(col_left);

        let col_center = document.createElement("div");
        col_center.classList.add("col-8");
        let label = document.createElement("label");
        label.innerHTML = elmnt.correctAnswer;
        col_center.appendChild(label);
        row.appendChild(col_center);

        document.getElementById("resultModalBody").appendChild(row);
    });
    
    $('#resultModal').modal('show');
}

function goOnGameView(){
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameView").style.marginTop = "0px";
}

function returnOnMenu(){
    document.getElementById("menu").style.display = "";
    document.getElementById("gameView").style.marginTop = "100vh";
}

function random(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

