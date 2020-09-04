class Player {
  constructor(discClass, homeField, dieClass) {
    this.discClass = discClass;
    this.homeField = homeField;
    this.dieClass = dieClass;
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
      gameManager.currentPlayer.checkBearOffMoves()
    }
    $('li.clickable').on('click', gameManager.currentPlayer.getPiece);
  }


  checkLegalMoves() {

    if ($('#barredPieces li').hasClass(gameManager.currentPlayer.discClass)) {
      gameManager.currentPlayer.onBar = true;
    } else {
      gameManager.currentPlayer.onBar = false;
    }

    $('.piece').removeClass('clickable');
    gameManager.currentPlayer.occupiedPoints = [];
    gameManager.currentPlayer.legalPoints = [];

    if (gameManager.currentPlayer.onBar) {
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
        $('#gameInformation').append('<p class="alert">No legal moves! Skip turn.</p>');
        gameManager.switchPlayer();
      }
      for (let i = 0; i < gameManager.currentPlayer.legalPoints.length; i++) {
        if(gameManager.currentPlayer.legalPoints[i]) {
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
    // if all of a player's pieces that are still on the board are in their home field, then bearing off is legal
    const piecesinHomeField = gameManager.currentPlayer.homeField.children().children('.piecesList').children(`.${gameManager.currentPlayer.discClass}`).length;

    if (piecesinHomeField === 15 - gameManager.currentPlayer.piecesBornOff) {
      gameManager.currentPlayer.canBearOff = true;
    }
  }

  getPiece(e) {
    gameManager.$selectedPiece = $(e.target);
    $('.target').on('click', gameManager.checkPermittedDistance);
  }

  checkBearOffMoves() {
    gameManager.currentPlayer.checkCanBearOff();
    if (gameManager.currentPlayer.canBearOff) {

      let homePoints = gameManager.currentPlayer.homeField.children().children('.piecesList');
      let highestOccupiedIndex = 0;
      let highestNecessaryRoll = 0;

      const legalPoints = [];

      // scan through all points in the home field and find the highest occupied point
      for(let i = 0; i < homePoints.length; i++) {
        if(homePoints.eq(i).children().hasClass(`${this.discClass}`)) {
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

      
      for(let i = 0; i < homePoints.length; i++) {
        if(homePoints.eq(i).children().hasClass(`${this.discClass}`) && gameManager.dieResults.includes(i + 1)) {
            legalPoints.push(homePoints.eq(i));
        } 
      }

      legalPoints.forEach(function(point) {
        $(point).children().addClass('clickable');
      });

    }
  }

  bearOff() {

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

    }
    if(gameManager.currentPlayer.piecesBornOff === 15) {
      $('#victory').append(`${gameManager.currentPlayer.name} Wins!!`);
      $('#victory').css('display', 'flex');
    }
  }

}

const player1 = new Player('player1', $('#home .points.right'), 'p1die');
const player2 = new Player('player2', $('#home .points.left'), 'p2die');

const getPlayerNames = function() {

  player1.name = $('#player1').val();
  player2.name = $('#player2').val();

  $('#playerInformation').remove();
}


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
    } // bearing off if possible   
      else if($(e.target).attr('id') === 'freedom' &&  gameManager.currentPlayer.canBearOff) {
        gameManager.currentPlayer.bearOff();
      }
    }
  },

  checkValidMove(usedResult) {
    if (!gameManager.$selectedPoint.children().hasClass(`${gameManager.currentOpponent.discClass}`)) {
      gameManager.movePiece(usedResult);
    } else if (gameManager.$selectedPoint.children().length > 1) {
    } else {
      $('#barredPieces').append(gameManager.$selectedPoint.children().eq(0));
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
  
  gameManager.resetDice()
},
  rollDice() {
    $('.alert').remove();
    gameManager.dieResults = [];

    for(let i = 0; i < 2; i++) {
      let number = Math.ceil(Math.random() * 6)
      gameManager.dieResults.push(number);
      $('.diceWrapper').children().eq(i).text(number);
    }

    if (gameManager.dieResults[0] === gameManager.dieResults[1]){
      $('#gameInformation').append("<p class='alert'>Doubles mean double! Take 4 moves.</p>")
      while(gameManager.dieResults.length < 4) {
        gameManager.dieResults.push(gameManager.dieResults[0]);
      }
    }
      console.log(gameManager.dieResults);
      gameManager.currentPlayer.hasRolled = true;
      gameManager.currentPlayer.startTurn();
    },

    resetDice() {
      $('#currentPlayername').text('');
      $('#currentPlayerName').text(gameManager.currentPlayer.name);
      $('.dice').removeClass(gameManager.currentOpponent.discClass);
      $('.dice').addClass(gameManager.currentPlayer.discClass);
      $('.dice').text('');
  }
}


$('#submit').on('click', function() {
  getPlayerNames();
  let firstRoll = [];

  for (let i = 0; i < 2; i++) {
    firstRoll.push(Math.ceil(Math.random() * 6));
    if (firstRoll[i] === firstRoll[i-1]) {
      firstRoll.pop();
      i--
    }
  }
  gameManager.dieResults = firstRoll;

  $(`.dice.${player1.discClass}`).text(firstRoll[0]);
  $(`.dice.${player2.discClass}`).text(firstRoll[1]);


  if (firstRoll[0] < firstRoll[1]) {
    gameManager.currentPlayer = player2;
    gameManager.currentOpponent = player1;
    gameManager.points.reverse();
  } 

  $('#currentPlayerName').text(gameManager.currentPlayer.name);
  $('#gameInformation').css('display', 'block');

  gameManager.currentPlayer.hasRolled = true;
  gameManager.currentPlayer.startTurn();
});


// TODO if I can make it visually clearer which player has this color, switch the board population into the name-submit function
gameManager.setUp.forEach(gameManager.populateBoard);
$('.diceWrapper').on('click', gameManager.rollDice);
