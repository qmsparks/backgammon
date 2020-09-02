class Player {
  constructor(discClass) {
    this.discClass = discClass;
    this.onBar = false;
    this.canDisbar = [];
    this.disbarOptions = [];
    this.piecesBornOff = 0;
    this.occupiedPoints = [];
    this.legalPoints = [];
  }

  startTurn() {
    this.checkLegalMoves();
    $('.clickable').on('click', this.getPiece);
  }
  
  checkLegalMoves() {
    $('.piece').removeClass('clickable');
    this.occupiedPoints = [];
    this.legalPoints = [];

    if (this.onBar) {
      $(`#barredPieces .${this.discClass}`).addClass('clickable');
    } else {
      for (let i = 0; i < gameManager.points.length; i++) {
        if($(`#${gameManager.points[i]} .piece`).hasClass(this.discClass)) {
          this.occupiedPoints.push(gameManager.points[i]);
        }
      }
      console.log('occupied points: ', this.occupiedPoints);
      for(let i = 0; i < this.occupiedPoints.length; i++) {
        // NOTE okay so this is where stuff is starting to go wrong for me
        this.legalPoints.push(this.checkCanMove(this.occupiedPoints[i]));
      }
      console.log('theoretically legal points: ', this.legalPoints);
      if(!this.legalPoints.includes(true)) {
        console.log('No legal moves, player must forfeit turn');
        gameManager.switchPlayer();
      }
  
      // console.log('theoreticaly legal points: ', this.legalPoints);
      for (let i = 0; i < this.legalPoints.length; i++) {
        if(this.legalPoints[i]) {
          $(`#${this.occupiedPoints[i]} .piece`).addClass('clickable');
        }
      }
    }
  }

  checkCanMove(startPoint) {
    let startIndex = gameManager.points.findIndex(point => point === startPoint);
    // console.log('start index of current piece: ', startIndex);
    // const legalTargetIndices = [];
    for (let i = 0; i < gameManager.points.length; i++) {
      // console.log(`comparing start index(${startIndex}) against potential target index(${i})`);
      if ($(`#${gameManager.points[i]} ul`).hasClass(this.discClass) || $(`#${gameManager.points[i]} ul`).length < 2) {
        if (gameManager.dieResults.includes(i - startIndex)) {
          // this is a legal move
          // console.log('this distance: ', i-startIndex);
          // legalTargetIndices.push(i);
          // console.log('starting point: ', startPoint);
          // console.log('legal target indices: ', legalTargetIndices);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
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
      $(`${object.point} > .piecesList`).append($(`<li class="piece ${object.class}" />`));
    } 
  },
  checkPermittedDistance(e) {
    gameManager.$selectedPoint = $(e.target).siblings('.piecesList');
    const start = gameManager.$selectedPiece.parent().parent().attr('id');
    const target = gameManager.$selectedPoint.parent().attr('id');

    let distance = gameManager.points.findIndex(point => point === target) - gameManager.points.findIndex(point => point === start);

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
    if (gameManager.dieResults.length === 0) {
      gameManager.switchPlayer();
    }
    gameManager.currentPlayer.checkLegalMoves();    
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
