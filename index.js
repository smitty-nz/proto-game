const Game = require( './src/game' );
const Loader = require( './src/loader' );
const Pointer = require( './src/pointer' );
const Keyboard = require( './src/keyboard' );

Game.loader = new Loader( Game );
Game.pointer = new Pointer( Game );
Game.keyboard = new Keyboard( Game );

/* basic default handler for loading images */
Game.loader.handle( [ 'png', 'jpeg', 'jpg', 'bmp', 'gif' ], ( filename, finish, error ) =>{
    let image = new Image();
    image.onload = ()=>{ finish( image ); }
    image.onerror = ()=>{ error( filename ); }
    image.src = filename;
} )

module.exports = Game;
