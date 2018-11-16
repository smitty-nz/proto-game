const Events = require( 'events' );

class Game extends Events.EventEmitter {
    constructor(){
        super();
        this.outputElement = null;
        this.inputElement = null;
    }
    init( { outputElement, inputElement = window } ){
        this.inputElement = inputElement;
        this.outputElement = outputElement;
        const map = ( inEvent, outEvent = inEvent, allowDefault = true )=>{
            if( allowDefault ){
                inputElement.addEventListener( inEvent, event => {
                    this.emit( outEvent, event );
                } )
            } else {
                inputElement.addEventListener( inEvent, event => {
                    this.emit( outEvent, event );
                    event.preventDefault();
                } )
            }
        }

        window.onload = ()=>{ this.emit( 'init' ); }
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
            let last = this.__lastTick;
            let deltaMilli = (current - last);
            let deltaSeconds = deltaMilli / 1000; 
            this.emit( 'update', deltaSeconds );
            this.emit( 'render', deltaSeconds );
            this.__lastTick = current;
        }
        loop();
    }
}


module.exports = new Game();    // singleton