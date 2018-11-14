const Events = require( 'events' );

class Pointer extends Events.EventEmitter {
    constructor( game ){
        super();
        this.position = { x : 0, y : 0 };
        this.normal = { x : 0, y : 0 };
        this.screen = this.position;
        this.pixel = this.position;
        this.game = game;
        this.buttons = [];
        this.__register( game );
    }
    get left(){ return this.buttons[ 0 ] };
    get right(){ return this.buttons[ 2 ] };
    get middle(){ return this.buttons[ 1 ] };
    __register( game ){
        game.on( 'mouseup', event => { this.__setButtonUp( event ) } );
        game.on( 'mousedown', event => { this.__setButtonDown( event ) } );
        game.on( 'mousemove', event => { this.__setPosition( event ) } );
    }
    __setPosition( event ){
        let target = this.game.outputElement;
        let width = target.width;
        let height = target.height;
        let px = event.clientX - target.offsetLeft;
        let py = event.clientY - target.offsetTop;
        let nx = ( px / width ) * 2 - 1;
        let ny = ( py / height ) * 2 - 1;
        this.position.x = px;
        this.position.y = py;
        this.normal.x = nx;
        this.normal.y = -ny;
        this.emit( 'move', this.position, this.normal );
    }
    __setButtonDown( event ){
        this.buttons[ event.button ] = true;
        if( event.button == 0 ) this.emit( 'pressLeft', this.position );     // todo: streamline
        if( event.button == 2 ) this.emit( 'pressRight', this.position );
        if( event.button == 1 ) this.emit( 'pressMiddle', this.position );
    }
    __setButtonUp( event ){
        this.buttons[ event.button ] = false;
        if( event.button == 0 ) this.emit( 'releaseLeft', this.position );       // todo: streamline
        if( event.button == 2 ) this.emit( 'releaseRight', this.position );
        if( event.button == 1 ) this.emit( 'releaseMiddle', this.position );
    }
}

module.exports = Pointer;