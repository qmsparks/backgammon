class Player {
  constructor(discClass) {
    this.discClass = discClass;
    this.onBar = false;
    this.canDisbar = [];
    this.disbarOptions = [];
    this.piecesBornOff = 0;
  }

  startTurn() {
    if (this.onBar) {
      $(`.piecesList .piece.${this.discClass}`).removeClass('clickable');
    }
    $('.clickable').on('click', this.getPiece);
  }

  getPiece(e) {
    gameManager.$selectedPiece = $(e.target);
    $('.point').on('click', gameManager.checkPermittedDistance);
  }
}

const player1 = new Player('player1');
const player2 = new Player('player2');


const gameManager = {
  setUp: [
    {
      point: '#l1',
      class: 'player1',
      number: 5
    },
    {
      point: '#l5',
      class: 'player2',
      number: 3
    },
    {
      point: '#l7',
      class: 'player2',
      number: 5
    },
    {
      point: '#l12',
      class: 'player1',
      number: 2
    },
    {
      point: '#r1',
      class: 'player2',
      number: 5
    },
    {
      point: '#r5',
      class: 'player1',
      number: 3
    },
    {
      point: '#r7',
      class: 'player1',
      number: 5
    },
    {
      point: '#r12',
      class: 'player2',
      number: 2
    }
  ],
  points: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11', 'l12', 'r12', 'r11', 'r10', 'r9', 'r8', 'r7', 'r6', 'r5', 'r4', 'r3', 'r2', 'r1'],
  $selectedPiece: null,
  $selectedPoint: null,
  dieResults: [],
  currentPlayer: player1,
  currentOpponent: player2,

  populateBoard(object) {
    for (let i = 0; i < object.number; i++) {
      $(`${object.point} > .piecesList`).append($(`<li class="piece clickable ${object.class}" />`));
    } 
  },
  checkPermittedDistance(e) {
    gameManager.$selectedPoint = $(e.target).siblings('.piecesList');
    let distance = gameManager.points.findIndex(gameManager.getTargetIndex) - gameManager.points.findIndex(gameManager.getStartIndex);

    if(gameManager.dieResults.includes(distance)) {
      let usedResult = gameManager.dieResults.findIndex(function(number){
        return number === distance;
      });
      gameManager.checkValidMove(usedResult);
    }
  },
  checkValidMove(usedResult) {
    if (!gameManager.$selectedPoint.children().hasClass(`${gameManager.currentOpponent.discClass}`)) {
      gameManager.movePiece(usedResult);
    } else if (gameManager.$selectedPoint.children().length > 1) {
      console.log(`Illegal move`);
    } else {
      $('#barredPieces').append(gameManager.$selectedPoint.children().eq(0));
      gameManager.currentOpponent.onBar = true;
      gameManager.movePiece(usedResult);
    }
  },
  movePiece(usedResult) {
    gameManager.dieResults.splice(usedResult, 1);
    gameManager.$selectedPoint.append(gameManager.$selectedPiece);
    if(!$('#barredPieces').children().hasClass(`${gameManager.currentPlayer.discClass}`)) {
      gameManager.currentPlayer.onBar = false;
      $(`.${gameManager.currentPlayer.discClass}`).addClass('clickable');
    }

    if (gameManager.dieResults.length === 0) {
      gameManager.switchPlayer();
    }
  },
  getStartIndex(element) {
    return element ==gameManager.$selectedPiece.parent().parent().attr('id');
  },
  getTargetIndex(element) {
    return element == gameManager.$selectedPoint.parent().attr('id');
  },
  switchPlayer() {
    gameManager.points.reverse();
    if(gameManager.currentPlayer === player1) {
      gameManager.currentPlayer = player2;
      gameManager.currentOpponent = player1;
    } else {
      gameManager.currentPlayer = player1;
      gameManager.currentOpponent = player2;
    }
  },
  rollDice() {
    while(gameManager.dieResults.length < 2) {
      gameManager.dieResults.push(Math.ceil(Math.random() * 6));
    }
    if (gameManager.dieResults[0] === gameManager.dieResults[1]){
      while(gameManager.dieResults.length < 4) {
        gameManager.dieResults.push(gameManager.dieResults[0]);
      }
    }
      console.log(gameManager.dieResults);
      gameManager.currentPlayer.startTurn();
    }
}

gameManager.setUp.forEach(gameManager.populateBoard);
$('button').on('click', gameManager.rollDice);
