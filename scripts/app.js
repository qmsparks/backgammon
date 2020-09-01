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
let selectedPiece = null;

const getPiece = function(e) {
  // let selectedPiece = $(e.target);
  selectedPiece = $(e.target);
  console.log(`I will make this piece look different from the others`);
  
  $('.point').on('click', movePieceTo);
}

const movePieceTo = function(e) {
  let selectedPoint = $(e.target).siblings('.piecesList');

  console.log()
  // console.log(`Move piece from ${startPoint} to ${selectedPoint}`);
  $(selectedPoint).append(selectedPiece);
}


$('.piece').on('click', getPiece);
