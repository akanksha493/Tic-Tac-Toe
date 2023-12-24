const Gameboard = () =>{
    const rows = 3;
    const cols = 3;
    const board  = [];
    for(let i=0 ; i<rows ; i++){
        board[i] = [];
        for(let j=0 ; j<cols ; j++){
            board[i].push(" ");
        }
    }
    const getBoard = () => board;
    const resetBoard = () =>{
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                board[i][j] = " ";
            }
        }
    }
    const win = (x, y, marker) =>{
        //row win
        if(board[x][0] === marker && board[x][1]=== marker && board[x][2]===marker){
            return 1;
        } 
        //col win
        if(board[0][y]===marker && board[1][y]===marker && board[2][y]===marker){ 
            return 1;
        }

        //diagonal win
        //+ve diagonal
        if((x===0 && y===2) || (x===2 && y===0) || (x===1 && y===1)){
            if(board[0][2]===marker && board[1][1]===marker && board[2][0]===marker){ 
                return 1;
            }
        }
        //-ve diagonal
        if((x===0 && y===0) || (x===1 && y===1) || (x===2 && y===2)){
            if(board[0][0]===marker && board[1][1]===marker && board[2][2]===marker){ 
                return 1;
            }
        }
        //tie condition
        let allFilled = true;
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                if(board[i][j]===" "){
                    allFilled = false;
                    break;
                }
            }
        }
        if(allFilled) return 2;

        return 0;
    }
    const writeMarker = (xindex, yindex, marker) =>{
        if(board[xindex][yindex]===" "){
            board[xindex][yindex] = marker;
            return win(xindex, yindex, marker);
        }
        else{
            return -1;
        }
    }
    return {getBoard, writeMarker, resetBoard};
}



const GameController = (player1, player2) => {
    const gboard = Gameboard();
    let activePlayer = player1;
    const getActivePlayer = () => {return activePlayer};
    const switchActivePlayer = () =>{
        activePlayer = activePlayer === player1?player2: player1; 
    }
    const play = (x, y) =>{
        const result = gboard.writeMarker(x, y, activePlayer.marker);
        if(result===0) switchActivePlayer();
        return result;
    }
    const replay = () =>{
        gboard.resetBoard();
        activePlayer = player1;
    }
    return {play, getBoard: gboard.getBoard, getActivePlayer, replay};

}
class Player{
    constructor(_name, _marker, _color){
        this.name  = _name;
        this.marker = _marker
        this.color = _color;
    }
}


var colorsArray = ["#33658a", "#86bbd8", "#758e4f", "#f6ae2d", "#f26419" ];

function ScreenController(name1, name2){
    const player1 = new Player(name1, "X", "rgb(175, 4, 4)");
    const player2 = new Player(name2, "O", "rgb(7, 10, 82)");
    const gc = GameController(player1, player2);
    document.querySelector(".top-left .name").textContent = name1;
    document.querySelector(".top-right .name").textContent = name2;
    document.querySelector(".top-left .wins span").textContent = "0";
    document.querySelector(".top-right .wins span").textContent = "0";
    const replay_exit_Container = document.querySelector(".replay-exit-container");
    const turnMessage = document.querySelector(".turn-mssg");
    replay_exit_Container.style.display = "none";
    turnMessage.style.display = "block";
    const boardDiv = document.querySelector(".board");
    const resultMessage = document.querySelector(".result-mssg");
    const modal = document.querySelector(".result-modal");
    const closeModal = document.querySelector(".result-modal button");
    closeModal.addEventListener("click", ()=>{
        modal.close();
    })
    
    const replay = document.querySelector(".replay");
    replay.addEventListener("click", replayGame);
    const initialPage = document.querySelector(".initial-form");
    const exit = document.querySelector(".exit");
    exit.addEventListener("click", () => {
        playAudio(bttnClick);
        initialPage.style.display = "flex";
        playBoardContainer.style.display = "none";
    })
    
    function replayGame(){
        playAudio(bttnClick);
        gc.replay();
        createBoard();
        turnMessage.textContent = `${gc.getActivePlayer().name}'s Turn`;
        replay_exit_Container.style.display = "none";
        turnMessage.style.display = "block";
        boardDiv.style.pointerEvents = "auto";

    }
    const createBoard = () =>{
        boardDiv.textContent = "";
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                const cellBttn = document.createElement("button");
                cellBttn.classList.add("cell");
                cellBttn.dataset.row = i;
                cellBttn.dataset.column = j;
                cellBttn.addEventListener("click", clickHandler);
                boardDiv.appendChild(cellBttn);
            }
        }
    }
    const updateScreen = (x =-1, y=-1, cell, result, markerColor)=>{
        const board = gc.getBoard();
        const activePlayer = gc.getActivePlayer();
        turnMessage.textContent = `${activePlayer.name}'s Turn`;
        if((x===-1) || (y===-1)) return;
        cell.textContent = board[x][y];
        cell.style.color = markerColor;
        cell.style.pointerEvents = "none";
        
        if(result === 1 || result === 2){
            replay_exit_Container.style.display = "grid";
            turnMessage.style.display = "none";
            boardDiv.style.pointerEvents = "none";

            if(result === 1){
                resultMessage.textContent = `${activePlayer.name} Won`;
                let playerWinDiv = document.querySelector(".top-left .wins span");
                if(activePlayer===player2){
                    playerWinDiv = document.querySelector(".top-right .wins span");
                }
                let currentWin = playerWinDiv.textContent;
                currentWin = parseInt(currentWin)+1;
                playerWinDiv.textContent = currentWin;
            }
            else{
                resultMessage.textContent = "Its a Tie";
            }
            const random_color = colorsArray[Math.floor(Math.random()*colorsArray.length)];
            
            modal.showModal();
            resultMessage.style.color = random_color;
        }
    }
    function clickHandler(e){
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.column);
        const color = gc.getActivePlayer().color;
        const result = gc.play(row, col);
        updateScreen(row, col, e.target, result, color);
    }
    createBoard();
    updateScreen();
    
}

function playScreenLoader(e){
    playAudio(bttnClick);
    e.preventDefault();
    const player1name = document.querySelector(".player1").value;
    const player2name = document.querySelector(".player2").value;

    ScreenController(player1name, player2name);
    initialPage.style.display = "none";
    playBoardContainer.style.display = "flex";


}


function initialRenderPage(){
    const playButton = document.querySelector(".play");
    playButton.addEventListener("click", playScreenLoader);
}

function playAudio(audio){
    audio.play();
}

const playBoardContainer = document.querySelector(".container");
const initialPage = document.querySelector(".initial-form");
initialRenderPage();
const bttnClick = document.querySelector(".bttn-click-sound");
