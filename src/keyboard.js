const Events = require( 'events' );

class Keyboard extends Events.EventEmitter {
    constructor( game ){
        super();
        this.keys = {};
        this.codes = [];
        this.aliases = {};
        this.game = game;
        this.__register( game );
    }
    isKeyDown( key ){
        return !!this.keys[ key ];
    }
    isCodeDown( code ){
        return !!this.codes[ code ];
    }
    __register( game ){
        game.on( 'keyup', event => { this.__setKeyUp( event ) } );
        game.on( 'keydown', event => { this.__setKeyDown( event ) } );
    }
    __setKeyDown( event ){
        this.keys[ event.key ] = true;
        this.codes[ event.keyCode ] = true;
        this.emit( 'press', event.key );
    }
    __setKeyUp( event ){
        this.keys[ event.key ] = false;
        this.codes[ event.keyCode ] = false;
        this.emit( 'release', event.key );
    }
}

module.exports = Keyboard;