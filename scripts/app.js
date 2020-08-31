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
  console.log(`Appending ${object.number} stones to point ${object.point} for ${object.color}`);

  for (let i = 0; i < object.number; i++) {
    $(`${object.point} > .piecesList`).append($(`<li class="piece ${object.color}" />`));
  }

}

setUp.forEach(populateBoard);

