const Game = require( './src/game' );
const Pointer = require( './src/pointer' );
const Keyboard = require( './src/keyboard' );

Game.pointer = new Pointer( Game );
Game.keyboard = new Keyboard( Game );

module.exports = Game;
