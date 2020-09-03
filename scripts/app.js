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

    // once the player has rolled:
    // first check if there are any legal moves available to them


    if(gameManager.currentPlayer.hasRolled) {
      gameManager.currentPlayer.checkLegalMoves();
    }
    gameManager.currentPlayer.checkCanBearOff();

    $('li.clickable').on('click', gameManager.currentPlayer.getPiece);


      // if (gameManager.currentPlayer.hasRolled) {
      //   gameManager.currentPlayer.checkCanBearOff();

      //   if(gameManager.$selectedPiece) {
      //     gameManager.currentPlayer.checkLegalMoves();
      //   }
      // }
      // $('li.clickable').on('click', gameManager.currentPlayer.getPiece);
  }
  
  checkLegalMoves() {
    console.log('checking to see if player has any pieces on the bar');
    if ($('#barredPieces li').hasClass(gameManager.currentPlayer.discClass)) {
      gameManager.currentPlayer.onBar = true;
    } else {
      gameManager.currentPlayer.onBar = false;
    }

    console.log('removing clickable class from all pieces');
    $('.piece').removeClass('clickable');
    gameManager.currentPlayer.occupiedPoints = [];
    gameManager.currentPlayer.legalPoints = [];

    if (gameManager.currentPlayer.onBar) {
      console.log('applying clickable class to barred pieces')
      $(`#barredPieces .${gameManager.currentPlayer.discClass}`).addClass('clickable');
    } else {
      for (let i = 0; i < gameManager.points.length; i++) {
        if($(`#${gameManager.points[i]} .piece`).hasClass(gameManager.currentPlayer.discClass)) {
          gameManager.currentPlayer.occupiedPoints.push(gameManager.points[i]);
        }
      }
      for(let i = 0; i < gameManager.currentPlayer.occupiedPoints.length; i++) {
        gameManager.currentPlayer.legalPoints.push(gameManager.currentPlayer.checkCanMove(gameManager.currentPlayer.occupiedPoints[i]));
      }
      if(gameManager.dieResults.length > 0 && !gameManager.currentPlayer.legalPoints.includes(true)) {
        console.log('No legal moves, player must forfeit turn');
        gameManager.switchPlayer();
      }
      for (let i = 0; i < gameManager.currentPlayer.legalPoints.length; i++) {
        if(gameManager.currentPlayer.legalPoints[i]) {
          console.log('applying clickable class to legal pieces on the field');
          $(`#${gameManager.currentPlayer.occupiedPoints[i]} .piece`).addClass('clickable');
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
      console.log('checking if player can bear off');
      // NOTE may need to add something in here about checking move legality? 
    // if all of a player's pieces that are still on the board are in their home field, then bearing off is legal
    const piecesinHomeField = gameManager.currentPlayer.homeField.children().children('.piecesList').children(`.${gameManager.currentPlayer.discClass}`).length;

    if (piecesinHomeField === 15 - gameManager.currentPlayer.piecesBornOff) {
      gameManager.currentPlayer.canBearOff = true;

      // TODO okay this might actually need to be where I handle the legality of bearing off, since it's being....weird
    }
  }

  getPiece(e) {
    gameManager.$selectedPiece = $(e.target);
    $('.target').on('click', gameManager.checkPermittedDistance);
  }

  attemptBearOff() {

    let bearOffPoints = gameManager.currentPlayer.homeField.children().children('.piecesList');
    let highestOccupiedIndex = 0;
    let highestNecessaryRoll = 0;

    // scan through all points in the home field and find the highest occupied point
    for(let i = 0; i < bearOffPoints.length; i++) {
      if(bearOffPoints.eq(i).children().hasClass(`${this.discClass}`)) {
        if (i > highestOccupiedIndex) {
          highestOccupiedIndex = i;
        }
      } 
    }
    highestNecessaryRoll = highestOccupiedIndex + 1;

    gameManager.dieResults.forEach(function(result, index) {
      if(result > highestNecessaryRoll) {
        gameManager.dieResults[index] = highestNecessaryRoll;
      }
    });

    // make sure that the program is getting the home field equivalent of the selected piece's index


    if(gameManager.selectedPieceIndex > 5) {
      gameManager.selectedPieceIndex = 23 - gameManager.selectedPieceIndex;
    }

    let usedResult = gameManager.selectedPieceIndex + 1;

    let spliceIndex = gameManager.dieResults.findIndex(value => value === usedResult);

    if (gameManager.dieResults.includes (usedResult)) {
      gameManager.dieResults.splice((spliceIndex), 1);
      $('#freedom').append(gameManager.$selectedPiece);
      gameManager.$selectedPiece = null;
      gameManager.selectedPieceIndex = null;
      gameManager.currentPlayer.piecesBornOff++;
      console.log(gameManager.currentPlayer.piecesBornOff);
    }
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
    let startPoint = null;

    // if (!gameManager.$selectedPiece.hasClass('clickable')) {
    //   gameManager.$selectedPiece = null;
    // }

    if((gameManager.$selectedPiece) && gameManager.$selectedPiece.hasClass('clickable')) {
      startPoint = gameManager.$selectedPiece.parent().parent().attr('id');
    

  if(gameManager.selectedPieceIndex !== gameManager.points.findIndex(point => point === startPoint)){
    gameManager.selectedPieceIndex = gameManager.points.findIndex(point => point === startPoint);
    console.log('hey do I still fire a billion times?');
  }

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
      if(gameManager.selectedPieceIndex !== -1) {
      gameManager.currentPlayer.attemptBearOff();
      }
    }
  }
  },

  checkValidMove(usedResult) {
    if (!gameManager.$selectedPoint.children().hasClass(`${gameManager.currentOpponent.discClass}`)) {
      gameManager.movePiece(usedResult);
    } else if (gameManager.$selectedPoint.children().length > 1) {
      console.log(`Illegal move`);
    } else {
      $('#barredPieces').append(gameManager.$selectedPoint.children().eq(0));
      // gameManager.currentOpponent.onBar = true;
      gameManager.movePiece(usedResult);
    }
  },
  movePiece(usedResult) {
    gameManager.dieResults.splice(usedResult, 1);
    console.log(this.dieResults);
    gameManager.$selectedPoint.append(gameManager.$selectedPiece);
    gameManager.currentPlayer.checkLegalMoves();  
    

    if (gameManager.dieResults.length === 0) {
      gameManager.switchPlayer();
    }  
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
},
  rollDice() {
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
      gameManager.currentPlayer.startTurn();
    }
}

gameManager.setUp.forEach(gameManager.populateBoard);
$('button').on('click', gameManager.rollDice);