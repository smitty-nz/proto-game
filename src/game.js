const Events = require( 'events' );

class Game extends Events.EventEmitter {
    constructor(){
        super();
        this.outputElement = null;
        this.inputElement = null;
    }
    init( { outputElement, inputElement = window } ){
        const game = this;
        game.inputElement = inputElement;
        game.outputElement = outputElement;
        const map = ( inEvent, outEvent = inEvent, allowDefault = true )=>{
            if( allowDefault ){
                inputElement.addEventListener( inEvent, event => {
                    game.emit( outEvent, event );
                } )
            } else {
                inputElement.addEventListener( inEvent, event => {
                    game.emit( outEvent, event );
                    event.preventDefault();
                } )
            }
        }

        map( 'contextmenu', 'contextmenu', false );
        map( 'wheel', 'mousewheel', false );
        map( 'mousedown', 'mousedown', false );
        map( 'mousemove' );
        map( 'mouseup' );
        map( 'keydown' );
        map( 'keyup');
        map( 'resize' );

        const loop = ()=>{
            requestAnimationFrame( loop );
            let current = Date.now();
            let last = game.__lastTick;
            let deltaMilli = (current - last);
            let deltaSeconds = deltaMilli / 1000; 
            game.emit( 'update', deltaSeconds );
            game.emit( 'render', deltaSeconds );
            game.__lastTick = current;
        }
        loop();
        return game;
    }
}


module.exports = new Game();    // singleton