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
  } else {
    console.log(`Capture piece`);
  }
}

const movePiece = function(e) {
  $selectedPoint.append($selectedPiece);
}

$('.piece').on('click', getPiece);

$('button').on('click', function() {
  dieResults.push(Math.ceil(Math.random() * 6));
  dieResults.push(Math.ceil(Math.random() * 6));

  if(dieResults[0] === dieResults[1]) {
    dieResults.push(dieResults[0]);
    dieResults.push(dieResults[1]);
  }
  console.log(dieResults);
});