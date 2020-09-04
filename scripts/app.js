class Player {
<<<<<<< HEAD
  constructor(discClass, homeField) {
    this.discClass = discClass;
    this.$homeField = homeField;
    this.canBearOff = false;
=======
  constructor(discClass, homeField, dieClass) {
    this.discClass = discClass;
    this.homeField = homeField;
    this.dieClass = dieClass;
>>>>>>> rewind
    this.onBar = false;
    this.piecesBornOff = 0;
    this.occupiedPoints = [];
    this.legalPoints = [];
    this.hasRolled = false;
<<<<<<< HEAD
    this.occupiedPoints = [];
    this.legalPoints = [];
  }
takeTurn() {
    if (this.hasRolled) {
      this.checkCanBearOff();
      this.checkLegalMoves();
    }
=======
    this.canBearOff = false;
  }

  startTurn() {
    // once the player has rolled:
    // first check if there are any legal moves available to them
    if(gameManager.currentPlayer.hasRolled) {
      gameManager.currentPlayer.checkLegalMoves();
      // gameManager.currentPlayer.checkBearOffMoves()
    }
    $('li.clickable').on('click', gameManager.currentPlayer.getPiece);
>>>>>>> rewind
  }
  checkLegalMoves() {
    gameManager.currentPlayer.checkOnBar();
    // remove clickability from all pieces, start from a clean slate
    $('.piece').removeClass('clickable');
    gameManager.currentPlayer.occupiedPoints = [];
    gameManager.currentPlayer.legalPoints = [];

    
    // if player is on bar, they can only interact with those pieces until it is resolved
    if (gameManager.currentPlayer.onBar) {
      $(`#barredPieces .${gameManager.currentPlayer.discClass}`).addClass('clickable');
    } else {
      // otherwise, determine where all of the current player's pieces are located on the board and if any of them can be borne off
      gameManager.currentPlayer.checkBearOffMoves();
      for (let i = 0; i < gameManager.points.length; i++) {
        if($(`#${gameManager.points[i]} .piece`).hasClass(gameManager.currentPlayer.discClass)) {
          gameManager.currentPlayer.occupiedPoints.push(gameManager.points[i]);
        }
<<<<<<< HEAD
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
=======
      } // once all pieces are located, run them through a different function that determines if there are legal moves from that point
      for(let i = 0; i < gameManager.currentPlayer.occupiedPoints.length; i++) {
        gameManager.currentPlayer.legalPoints.push(gameManager.currentPlayer.checkCanMove(gameManager.currentPlayer.occupiedPoints[i]));
      } // end turn early if player cannot move
        if(!gameManager.currentPlayer.legalPoints.includes(true) && !$('.piece.clickable')){
        $('#gameInformation').append('<p class="alert">No legal moves! Skip turn.</p>');
        gameManager.switchPlayer();
      } // make pieces with legal moves interactable
      for (let i = 0; i < gameManager.currentPlayer.legalPoints.length; i++) {
        if(gameManager.currentPlayer.legalPoints[i]) {
          $(`#${gameManager.currentPlayer.occupiedPoints[i]} .piece`).addClass('clickable');
>>>>>>> rewind
        }
      }
    }
    $('.clickable.piece').on('click', this.getPiece);
  }
<<<<<<< HEAD

=======
>>>>>>> rewind
  checkCanMove(startPoint) {
    let startIndex = gameManager.points.findIndex(point => point === startPoint);
    for (let i = 0; i < gameManager.points.length; i++) {

      // check whether or not points available through the dice are blocked by two or more opposing pieces
      if ($(`#${gameManager.points[i]} .piece`).hasClass(this.discClass) || $(`#${gameManager.points[i]} .piece`).length < 2) 
        if (gameManager.dieResults.includes(i - startIndex)) {
          return true;
        }
      } return false;
  }
<<<<<<< HEAD

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
=======
  checkCanBearOff() {  
    // if all of a player's pieces that are still on the board are in their home field, then bearing off is legal
    const piecesinHomeField = gameManager.currentPlayer.homeField.children().children('.piecesList').children(`.${gameManager.currentPlayer.discClass}`).length;
>>>>>>> rewind

    if (piecesinHomeField === 15 - gameManager.currentPlayer.piecesBornOff) {
      gameManager.currentPlayer.canBearOff = true;
    }
  }
  checkOnBar() {
    if ($('#barredPieces li').hasClass(gameManager.currentPlayer.discClass)) {
      gameManager.currentPlayer.onBar = true;
    } else {
      gameManager.currentPlayer.onBar = false;
    }
  }
  getPiece(e) {
<<<<<<< HEAD
    $('.piece').removeClass('clickable');
    $(e.target).addClass('selected');
    $('.point').on('click', gameManager.checkPermittedDistance);
    // TODO still gotta figure out how to make it possible to move by clicking the pieces occupying a bar
  }
}

const player1 = new Player('player1', '#player1home');
const player2 = new Player('player2', '#player2home');
=======
    // grabs location of clickable piece
    gameManager.$selectedPiece = $(e.target);
    // begins checking if move is legal when player then clicks on a point or off the board for bearing off
    $('.target').on('click', gameManager.checkPermittedDistance);
  }
  checkBearOffMoves() {
    gameManager.currentPlayer.checkCanBearOff();
    if (gameManager.currentPlayer.canBearOff) {

      // in the event that bearing off is legal, limit the scope of where we're looking to the player's home field
      let homePoints = gameManager.currentPlayer.homeField.children().children('.piecesList');
      let highestOccupiedIndex = 0;
      let highestNecessaryRoll = 0;
      const legalPoints = [];

      // scan through all points in the home field and find the highest occupied point
      for(let i = 0; i < homePoints.length; i++) {
        if(homePoints.eq(i).children().hasClass(`${gameManager.currentPlayer.discClass}`)) {
          if (i > highestOccupiedIndex) {
            highestOccupiedIndex = i;
          }
        } 
      }
      // allow player to bear off from their highest occupied point, if there is a larger number on the die
      highestNecessaryRoll = highestOccupiedIndex + 1;
      gameManager.dieResults.forEach(function(result, index) {
        if(result > highestNecessaryRoll) {
          gameManager.dieResults[index] = highestNecessaryRoll;
        }
      });

      // collect points from which player can legally bear off into an array
      for(let i = 0; i < homePoints.length; i++) {
        if(homePoints.eq(i).children().hasClass(`${gameManager.currentPlayer.discClass}`) && gameManager.dieResults.includes(i + 1)) {
            legalPoints.push(homePoints.eq(i));
        } 
      }
      // make those points interactable
      legalPoints.forEach(function(point) {
        $(point).children().addClass('clickable');
      });
    }
  }
  bearOff() {
    // ensures that the index we're working with is relative to the home field and not the whole board
    if(gameManager.selectedPieceIndex > 5) {
      gameManager.selectedPieceIndex = 23 - gameManager.selectedPieceIndex;
    }

    // finds the die result being utilized in the dieResult array
    let usedResult = gameManager.selectedPieceIndex + 1;
    let spliceIndex = gameManager.dieResults.findIndex(value => value === usedResult);

    // moves the piece from the board, wipes its starting location from memory, removes the used die, and tracks how many pieces player has born off in total
    if (gameManager.dieResults.includes (usedResult)) {
      gameManager.dieResults.splice((spliceIndex), 1);
      $('#freedom').append(gameManager.$selectedPiece);
      gameManager.$selectedPiece = null;
      gameManager.selectedPieceIndex = null;
      gameManager.currentPlayer.piecesBornOff++;
    }
    
    // if piece borne off is player's 15th, end game
    if(gameManager.currentPlayer.piecesBornOff === 15) {
      $('#victory').append(`${gameManager.currentPlayer.name} Wins!!`);
      $('#victory').css('display', 'flex');
    } else {
      gameManager.postMoveCheck(usedResult);
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
>>>>>>> rewind


const gameManager = {
  // starting layout of pieces on the board
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
  // i made weird choices about naming points in the dom, whoops, so here's an array of their ids in order to reference
  points: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11', 'l12', 'r12', 'r11', 'r10', 'r9', 'r8', 'r7', 'r6', 'r5', 'r4', 'r3', 'r2', 'r1'],
<<<<<<< HEAD
=======
  $selectedPiece: null,
  selectedPieceIndex: null,
>>>>>>> rewind
  $selectedPoint: null,
  dieResults: [],
  currentPlayer: player1,
  currentOpponent: player2,

  populateBoard(object) {
    // put pieces on the board
    for (let i = 0; i < object.number; i++) {
      $(`${object.point} > .piecesList`).append($(`<li class="piece ${object.class}" />`));
    } 
  },
  checkPermittedDistance(e) {
<<<<<<< HEAD
    if($(e.target).hasClass('.piece')) {
      gameManager.$selectedPoint = $(e.target).parent();
    } else {
      gameManager.$selectedPoint = $(e.target).siblings('.piecesList');
    }
    const start = $('.selected').parent().parent().attr('id');
    const target = gameManager.$selectedPoint.parent().attr('id');
=======
    let startPoint = null;
    // if the player has clicked a piece that has been made interactable, go ahead and run the rest of this function
    if((gameManager.$selectedPiece) && gameManager.$selectedPiece.hasClass('clickable')) {
>>>>>>> rewind


      startPoint = gameManager.$selectedPiece.parent().parent().attr('id');
    
      // find the piece the player is moving from in the point id array
      if(gameManager.selectedPieceIndex !== gameManager.points.findIndex(point => point === startPoint)){
        gameManager.selectedPieceIndex = gameManager.points.findIndex(point => point === startPoint);
      }

    // Normal movement to another point
    if($(e.target).hasClass('point')) {
      // grabs the target point and its id
      gameManager.$selectedPoint = $(e.target).siblings('.piecesList');
      const target = gameManager.$selectedPoint.parent().attr('id');
      // finds that id in the points id array
      let targetIndex = gameManager.points.findIndex(point => point === target);
      // checks the distance between the piece's origin and the potential target
      let distance = targetIndex - gameManager.selectedPieceIndex;

      // if that number is on the die, run one more function to see if the chosen point is a legal destination
      if(gameManager.dieResults.includes(distance)) {
        let usedResult = gameManager.dieResults.findIndex(number => number === distance);
        gameManager.checkValidMove(usedResult);
      }
    } // if they clicked off the board to bear off, make sure it's legal before executing
      else if($(e.target).attr('id') === 'freedom') {
        gameManager.currentPlayer.checkCanBearOff;

        if(gameManager.currentPlayer.canBearOff) {
          gameManager.currentPlayer.bearOff();
        }
      }
    }
  },

  checkValidMove(usedResult) {
    // free to move if the target point has player's own piece
    if (!gameManager.$selectedPoint.children().hasClass(`${gameManager.currentOpponent.discClass}`)) {
      gameManager.movePiece(usedResult);

      // if the target point has opposing pieces, check how many. If there's only one, send that piece to the bar and take the move
    } else if (gameManager.$selectedPoint.children().length > 1) {
      // TODO maybe add some visual cue indicating that this move is illegal
    } else {
      $('#barredPieces').append(gameManager.$selectedPoint.children().eq(0));
      gameManager.movePiece(usedResult);
    }
  },
  movePiece(usedResult) {
<<<<<<< HEAD
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
=======
    // move the piece
    gameManager.$selectedPoint.append(gameManager.$selectedPiece);
    gameManager.postMoveCheck(usedResult);
  },
  postMoveCheck(usedResult) {
     // remove used die results from pool of potential move distances
    gameManager.dieResults.splice(usedResult, 1);


    // if the player has not used all die, check for legal moves again and continue turn
    if(gameManager.dieResults.length >= 1) {
      gameManager.currentPlayer.checkLegalMoves();  
    } else {
      // switch player if all moves have been taken
      gameManager.switchPlayer();
    }
>>>>>>> rewind
  },

  switchPlayer() {
    // gatekeeping! make sure the program waits for a new roll and knows whose turn it is
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
<<<<<<< HEAD
    console.log('start turn');
    gameManager.dieResults = [];
    while(gameManager.dieResults.length < 2) {
      gameManager.dieResults.push(Math.ceil(Math.random() * 6));
=======
    // make sure any alerts from the last player's turn are removed from the sidebar, and that memory is not retaining roll results from a previous turn
    $('.alert').remove();
    gameManager.dieResults = [];

    // get two numbers between 1 and 6 and show them on the die images
    for(let i = 0; i < 2; i++) {
      let number = Math.ceil(Math.random() * 6)
      gameManager.dieResults.push(number);
      $('.diceWrapper').children().eq(i).text(number);
>>>>>>> rewind
    }

    // give player four moves of the same distane if they rolled doubles
    if (gameManager.dieResults[0] === gameManager.dieResults[1]){
      $('#gameInformation').append("<p class='alert'>Doubles mean double! Take 4 moves.</p>")
        while(gameManager.dieResults.length < 4) {
        gameManager.dieResults.push(gameManager.dieResults[0]);
      }
    }
<<<<<<< HEAD
      console.log(gameManager.dieResults);
      gameManager.currentPlayer.hasRolled = true;
      gameManager.currentPlayer.takeTurn();
    }
=======
    // start turn
    gameManager.currentPlayer.hasRolled = true;
    gameManager.currentPlayer.startTurn();
    },

    resetDice() {
      // match dice visuals to curren player color
      $('#currentPlayername').text('');
      $('#currentPlayerName').text(gameManager.currentPlayer.name);
      $('.dice').removeClass(gameManager.currentOpponent.discClass);
      $('.dice').addClass(gameManager.currentPlayer.discClass);
      $('.dice').text('');
  }
>>>>>>> rewind
}


$('#submit').on('click', function() {
  gameManager.setUp.forEach(gameManager.populateBoard);
  getPlayerNames();
  let firstRoll = [];

  // roll one die for each player, making sure it's not a tie
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

  // if the second player's number is higher than the first, set things up for them to go first
  if (firstRoll[0] < firstRoll[1]) {
    gameManager.currentPlayer = player2;
    gameManager.currentOpponent = player1;
    gameManager.points.reverse();
  } 

  // show game information sidebar
  $('#currentPlayerName').text(gameManager.currentPlayer.name);
  $('#gameInformation').css('display', 'block');

  // begin the rest of the game
  gameManager.currentPlayer.hasRolled = true;
  gameManager.currentPlayer.startTurn();
});


// TODO if I can make it visually clearer which player has this color, switch the board population into the name-submit function
$('.diceWrapper').on('click', gameManager.rollDice);
