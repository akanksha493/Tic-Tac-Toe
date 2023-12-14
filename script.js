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
    const printBoard = () =>{
        for(let i = 0;i<rows;i++){
            let row = "";
            for(let j = 0; j<cols;j++){
                row+=board[i][j]+","
            }
            console.log(row);
        }
    }
    const win = (x, y, marker) =>{
        //row win
        if(board[x][0] === marker && board[x][1]=== marker && board[x][2]===marker){
            console.log("its row"); 
            return 1;
        } 
        //col win
        if(board[0][y]===marker && board[1][y]===marker && board[2][y]===marker){ 
            console.log("its col");
            return 1;
        }

        //diagonal win
        //+ve diagonal
        if((x===0 && y===2) || (x===2 && y===0) || (x===1 && y===1)){
            if(board[0][2]===marker && board[1][1]===marker && board[2][0]===marker){ 
                console.log("its +ve diagonal");
                return 1;
            }
        }
        //-ve diagonal
        if((x===0 && y===0) || (x===1 && y===1) || (x===2 && y===2)){
            if(board[0][0]===marker && board[1][1]===marker && board[2][2]===marker){ 
                console.log("its -ve diagonal");
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
    return {getBoard, writeMarker, printBoard, resetBoard};
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
        // playRound();
    }
    return {play, getBoard: gboard.getBoard, getActivePlayer, replay};

}

class Player{
    constructor(_name, _marker){
        this.name  = _name;
        this.marker = _marker
    }
}



function ScreenController(){
    const player1 = new Player("player1", "X");
    const player2 = new Player("player2", "O");
    const gc = GameController(player1, player2);
    const turnDiv = document.querySelector(".turn-mssg");
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");
    const resultMssg = document.querySelector(".result p");
    const replay = document.querySelector(".replay");
    replay.addEventListener("click", replayGame);
    
    function replayGame(){
        gc.replay();
        createBoard();
        resultDiv.style.display = "none";
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
    const updateScreen = (x =-1, y=-1, cell, result)=>{
        const board = gc.getBoard();
        const activePlayer = gc.getActivePlayer();
        turnDiv.textContent = `${activePlayer.name}'s Turn`;
        if((x===-1) || (y===-1)) return;
        cell.textContent = board[x][y];
        if(result === 1){
            resultDiv.style.display = "block";
            resultMssg.textContent = `${activePlayer.name} Won`;
        }
        else if(result === 2){
            resultDiv.style.display = "block";
            resultMssg.textContent = "Its a Tie";
        }
    }
    function clickHandler(e){
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.column);
        const result = gc.play(row, col);
        updateScreen(row, col, e.target, result);
    }
    createBoard();
    updateScreen();
    
}
ScreenController();