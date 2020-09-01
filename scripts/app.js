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

const populateBoard = function(object) {
  for (let i = 0; i < object.number; i++) {
    $(`${object.point} > .piecesList`).append($(`<li class="piece ${object.color}" />`));
  }

}
setUp.forEach(populateBoard);
let currentOpponent = 'player2';
let $selectedPiece = null;
let $selectedPoint = null;

const getPiece = function(e) {
  $selectedPiece = $(e.target);
  // TODO add a class that changes the way selected pieces look
  $('.point').on('click', checkValidMove);
}

const checkValidMove = function(e) {
  $selectedPoint = $(e.target).siblings('.piecesList');

  if (!$selectedPoint.children().hasClass(`${currentOpponent}`)) {
    movePiece();
  } else if ($selectedPoint.children().length > 1) {
    console.log(`Illegal move`);
  } else {
    console.log(`Capture piece`);
  }
}

const movePiece = function(e) {
  // let selectedPoint = $(e.target).siblings('.piecesList');
  $selectedPoint.append($selectedPiece);
}

$('.piece').on('click', getPiece);
