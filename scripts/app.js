class Player {
  constructor(discClass, homeField) {
    this.discClass = discClass;
    this.$homeField = homeField;
    this.canBearOff = false;
    this.onBar = false;
    this.piecesBornOff = 0;
    this.occupiedPoints = [];
    this.legalPoints = [];
    this.hasRolled = false;
    this.occupiedPoints = [];
    this.legalPoints = [];
  }
takeTurn() {
    if (this.hasRolled) {
      this.checkCanBearOff();
      this.checkLegalMoves();
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
      for(let i = 0; i < this.occupiedPoints.length; i++) {
        this.legalPoints.push(this.checkCanMove(this.occupiedPoints[i]));
      }
      if(gameManager.dieResults.length > 0 && !this.legalPoints.includes(true)) {
        console.log('No legal moves, player must forfeit turn');
        gameManager.switchPlayer();
      }

      for (let i = 0; i < this.legalPoints.length; i++) {
        if(this.legalPoints[i]) {
          // NOTE modify appearance of mobile discs here
          $(`#${this.occupiedPoints[i]} .piece`).addClass('clickable');
        }
      }
    }
    $('.clickable.piece').on('click', this.getPiece);
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
    // if (this.$homeField.length === 15 - this.piecesBornOff) {
    //   this.canBearOff = true;
    // } else {
    //   this.canBearOff = false;
    // }

    if(this.canBearOff) {
      console.log('go ahead and bear off');
      // TODO think about how this works
      $()

    } else {
      console.log('cannot bear off yet');
    }
  }

  getPiece(e) {
    $('.piece').removeClass('clickable');
    $(e.target).addClass('selected');
    $('.point').on('click', gameManager.checkPermittedDistance);
    // TODO still gotta figure out how to make it possible to move by clicking the pieces occupying a bar
  }
}

const player1 = new Player('player1', '#player1home');
const player2 = new Player('player2', '#player2home');


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
    if($(e.target).hasClass('.piece')) {
      gameManager.$selectedPoint = $(e.target).parent();
    } else {
      gameManager.$selectedPoint = $(e.target).siblings('.piecesList');
    }
    const start = $('.selected').parent().parent().attr('id');
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
    gameManager.$selectedPoint.append($('.selected'));
    $('.selected').toggleClass('selected');
    if (gameManager.dieResults.length === 0) {
      gameManager.switchPlayer();
    }
    if(!$('#barredPieces .piece').hasClass(gameManager.currentPlayer.discClass)) {
      gameManager.currentPlayer.onBar = false;
    }
    gameManager.currentPlayer.checkCanBearOff();
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
    console.log('start turn');
    gameManager.dieResults = [];
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
      gameManager.currentPlayer.takeTurn();
    }
}

gameManager.setUp.forEach(gameManager.populateBoard);
$('button').on('click', gameManager.rollDice);