const setUp = [
  {
    point: '#l1',
    color: 'player1',
    number: 5
  },
  {
    point: '#l5',
    color: 'player2',
    number: 3
  },
  {
    point: '#l7',
    color: 'player2',
    number: 5
  },
  {
    point: '#l12',
    color: 'player1',
    number: 2
  },
  {
    point: '#r1',
    color: 'player2',
    number: 5
  },
  {
    point: '#r5',
    color: 'player1',
    number: 3
  },
  {
    point: '#r7',
    color: 'player1',
    number: 5
  },
  {
    point: '#r12',
    color: 'player2',
    number: 2
  }
];

const points = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11', 'l12', 'r12', 'r11', 'r10', 'r9', 'r8', 'r7', 'r6', 'r5', 'r4', 'r3', 'r2', 'r1'];

const populateBoard = function(object) {
  for (let i = 0; i < object.number; i++) {
    $(`${object.point} > .piecesList`).append($(`<li class="piece ${object.color}" />`));
  }

}
setUp.forEach(populateBoard);
let currentPlayer = 'player1';
let currentOpponent = 'player2';
let $selectedPiece = null;
let $selectedPoint = null;
let dieResults = [];

const getPiece = function(e) {
  $selectedPiece = $(e.target);
  // TODO add a class that changes the way selected pieces look
  $('.point').on('click', checkPermittedDistance);
}

const checkPermittedDistance = function(e) {
  $selectedPoint = $(e.target).siblings('.piecesList');
  let distance = points.findIndex(getTargetIndex) - points.findIndex(getStartIndex);
  
  if(dieResults.includes(distance)) {
    let usedResult = dieResults.findIndex(function(number){
      return number === distance;
    });
    dieResults.splice(usedResult, 1);
    checkValidMove();
  }
}

const getStartIndex = function(element) {
  return element == $selectedPiece.parent().parent().attr('id');
}

const getTargetIndex = function(element) {
  return element == $selectedPoint.parent().attr('id');
}

const checkValidMove = function(e) {
  if (!$selectedPoint.children().hasClass(`${currentOpponent}`)) {
    movePiece();
  } else if ($selectedPoint.children().length > 1) {
    console.log(`Illegal move`);
    // TODO fix bug where attempting illegal moves still removes that number from the die result array
  } else {
    $('#barredPieces').append($selectedPoint.children().eq(0));
    movePiece();
  }
}

const movePiece = function(e) {
  $selectedPoint.append($selectedPiece);

  if(dieResults.length === 0) {
    switchPlayer();
  }
}



$('button').on('click', function() {
  dieResults.push(Math.ceil(Math.random() * 6));
  dieResults.push(Math.ceil(Math.random() * 6));

  if(dieResults[0] === dieResults[1]) {
    dieResults.push(dieResults[0]);
    dieResults.push(dieResults[1]);
  }
  console.log(dieResults);
  startTurn();
});

const startTurn = function(){
  if ($('#barredPieces').children().hasClass(`${currentPlayer}`)) {
    addressBar();
  }
  $('.piece').on('click', getPiece);
}

const switchPlayer = function() {
  points.reverse();
  if (currentPlayer === 'player1') {
    currentPlayer = 'player2';
    currentOpponent = 'player1';
  } else {
    currentPlayer = 'player1';
    currentOpponent = 'player2';
  }
}

const addressBar = function() {
  const canDisbar = [];
  console.log(`${currentPlayer} has a barred piece!`);
  for (let i = 0; i < 6; i++) {
    if ($(`#${points[i]} ul`).children().hasClass(`${currentPlayer}`) || $(`#${points[i]} ul`).children().length < 2) {
      canDisbar.push(true);
    } else {
      canDisbar.push(false);
    }
  }
  if (canDisbar.includes(true)) {
    console.log(`You can move!`);
    // TODO make sure the player can't move any other pieces until they have disbarred
  } else {
    console.log(`No valid moves. Player must forfeit turn`);
    switchPlayer();
  }

}