class Player {
  constructor(discClass, homeField) {
    this.discClass = discClass;
    this.homeField = homeField;
    this.onBar = false;
    this.canDisbar = [];
    this.disbarOptions = [];
    this.piecesBornOff = 0;
    this.occupiedPoints = [];
    this.legalPoints = [];
    this.hasRolled = false;
    this.canBearOff = false;
  }

  startTurn() {
      if (this.hasRolled) {
        this.checkCanBearOff();
        this.checkLegalMoves();
        $('.clickable').on('click', this.getPiece);
      }
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
        this.legalPoints.push(this.checkCanMove(this.occupiedPoints[i]));
      }
      if(gameManager.dieResults.length > 0 && !this.legalPoints.includes(true)) {
        console.log('No legal moves, player must forfeit turn');
        gameManager.switchPlayer();
      }
      for (let i = 0; i < this.legalPoints.length; i++) {
        if(this.legalPoints[i]) {
          $(`#${this.occupiedPoints[i]} .piece`).addClass('clickable');
        }
      }
    }
}

  checkCanMove(startPoint) {
    let startIndex = gameManager.points.findIndex(point => point === startPoint);
    for (let i = 0; i < gameManager.points.length; i++) {

      if ($(`#${gameManager.points[i]} .piece`).hasClass(this.discClass) || $(`#${gameManager.points[i]} .piece`).length < 2) 
        if (gameManager.dieResults.includes(i - startIndex)) {
          return true;
        }
      } return false;
    }
  
    checkCanBearOff() {  
    // if all of a player's pieces that are still on the board are in their home field, then bearing off is legal
    const piecesinHomeField = this.homeField.children().children('.piecesList').children(`.${this.discClass}`).length;
    console.log(piecesinHomeField);

    if (piecesinHomeField === 15 - this.piecesBornOff) {
      this.canBearOff = true;
    }
  }

  getPiece(e) {
    gameManager.$selectedPiece = $(e.target);
    $('.target').on('click', gameManager.checkPermittedDistance);
  }

  attemptBearOff() {
    const bearOffIndex = gameManager.points.length - 1;
    console.log(bearOffIndex);
    let highestOccupiedIndex = 0;
    let highestNecessaryRoll = 0;

    this.occupiedPoints.forEach(function(point, index) {
      if (index > highestOccupiedIndex) {
        highestOccupiedIndex = index;
      }
    });
    highestNecessaryRoll = highestOccupiedIndex + 1;

    gameManager.dieResults.forEach(function(result, index) {
      if(result > highestNecessaryRoll) {
        gameManager.dieResults[index] = highestNecessaryRoll;
      }
    });
    console.log(gameManager.dieResults);
    
    // NOTE okay somehow not getting the selected piece index here?
    let distance = bearOffIndex - gameManager.selectedPieceIndex;
    console.log(distance);

    if(gameManager.dieResults.includes(distance)) {
      $('#freedom').append(gameManager.$selectedPiece);
      let usedResult = gameManager.dieResults.findIndex(number => number === distance);
      gameManager.dieResults.splice(usedResult, 1);
    }

    // TODO gotta make sure this still follow general die rules
    // and then remove the used roll
    // but hot damn!
  }

}

const player1 = new Player('player1', $('#home .points.right'));
const player2 = new Player('player2', $('#home .points.left'));


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
  selectedPieceIndex: null,
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
    let startPoint = gameManager.$selectedPiece.parent().parent().attr('id');
    gameManager.selectedPieceIndex = gameManager.points.findIndex(point => point === startPoint);
    console.log('grab selectedPieceIndex: ', gameManager.selectedPieceIndex)
    

    // Normal movement to another point
    if($(e.target).hasClass('point')) {
      gameManager.$selectedPoint = $(e.target).siblings('.piecesList');
      const target = gameManager.$selectedPoint.parent().attr('id');
      let targetIndex = gameManager.points.findIndex(point => point === target);
      let distance = targetIndex - gameManager.selectedPieceIndex;
 
      if(gameManager.dieResults.includes(distance)) {
  
        let usedResult = gameManager.dieResults.findIndex(number => number === distance);
        gameManager.checkValidMove(usedResult);
      }
    } // attempting to bear piece off the board 
    else if($(e.target).attr('id') === 'freedom' &&  gameManager.currentPlayer.canBearOff) {
      console.log('attempting to bear off');
      gameManager.currentPlayer.attemptBearOff();
    }
  },

  checkValidMove(usedResult) {
    console.log('checking validity of attempted move');
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
    player1.hasRolled = false;
    player2.hasRolled = false;
    gameManager.points.reverse();
    if(gameManager.currentPlayer === player1) {
      gameManager.currentPlayer = player2;
      gameManager.currentOpponent = player1;
    } else {
      gameManager.currentPlayer = player1;
      gameManager.currentOpponent = player2;
  } 
  console.log('now playing: ', gameManager.currentPlayer);
},
  rollDice() {
    this.dieResults = [];
    console.log('start turn');
    while(gameManager.dieResults.length < 2) {
      gameManager.dieResults.push(Math.ceil(Math.random() * 6));
    }
    if (gameManager.dieResults[0] === gameManager.dieResults[1]){
      while(gameManager.dieResults.length < 4) {
        gameManager.dieResults.push(gameManager.dieResults[0]);
      }
    }
      console.log(gameManager.dieResults);
      gameManager.currentPlayer.hasRolled = true;
      gameManager.currentPlayer.startTurn();
    }
}

gameManager.setUp.forEach(gameManager.populateBoard);
$('button').on('click', gameManager.rollDice);