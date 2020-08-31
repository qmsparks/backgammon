# backgammon

## User Story
- Before play, users can input their names and select their disc and die colors
- The game begins with pressing a start button. This rolls one die from each player's cup. Whichever player has the higher result goes first, using those two dice together as their roll.
- The players move their discs either by dragging and dropping or by clicking the piece and then a valid destination
- The number on the dice determine how far a player's discs can move. The moves can both be taken by a single disc, or each die result can go to a different disc. 
- In the event of a double, the player can take **4** moves of that size.
- Discs cannot be moved to spaces that have more than one of your opponent's pieces.
- Moving a disc into a space that has one of your opponent's pieces moves that piece to the bar. A player with a piece on the bar cannot move any others until they are able to bring it back into play, by rolling for an available space in their opponent's home table
- Once a player has moved all their pieces into their home table, they may begin to bear them off. 
  - Rolling a 1 allow the player to bear off a disc from their innermost space, a 2 from the second space, and so on
  - If a player rolls a number higher than their highest occupied space, they may bear off from the next highest space
  - A player does not have to bear off just because they are able to.
- The first player to bear off all their pieces wins

## MVP
At minimum, a bare-bones game of backgammon played against another person at the computer with you. No stakes, no custom rules - just two players rolling dice to determine how far they can move their discs on a turn, attempting to move all their pieces into their home field and off the board without being captured and moved to the bar. 

## Wireframe
![image](https://user-images.githubusercontent.com/65870863/91685249-6fc64600-eb1f-11ea-90b4-fc6878d09ac3.png)

## Stretch Goals
- Highlight valid moves when a piece is selected
- Option to play against the computer instead of another person
- Betting element
  - Doubling cube
- Dutch Backgammon mode