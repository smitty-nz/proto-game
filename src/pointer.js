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
        this.buttonsAlias = [ 'left', 'middle', 'right' ]
        this.BUTTON_LEFT = 0;
        this.BUTTON_RIGHT = 2;
        this.BUTTON_MIDDLE = 1;
        this.__register( game );
    }
    get left(){ return this.buttons[ 0 ]; }
    get right(){ return this.buttons[ 2 ]; }
    get middle(){ return this.buttons[ 1 ]; }
    isButtonDown( button ){ 
        return !!this.buttons[ button ]; 
    }
    __register( game ){
        game.on( 'mouseup', event => { this.__setButtonUp( event ) } );
        game.on( 'mousedown', event => { this.__setButtonDown( event ) } );
        game.on( 'mousemove', event => { this.__setPosition( event ) } );
        game.on( 'mousewheel', event =>{ this.__setWheel( event ) } );
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
        this.emit( 'press', this.buttonsAlias[ event.button ], this.position );
        if( event.button === this.BUTTON_LEFT ) this.emit( 'pressLeft', this.position );     // todo: streamline
        if( event.button === this.BUTTON_RIGHT ) this.emit( 'pressRight', this.position );
        if( event.button === this.BUTTON_MIDDLE ) this.emit( 'pressMiddle', this.position );
    }
    __setButtonUp( event ){
        this.buttons[ event.button ] = false;
        this.emit( 'release', this.buttonsAlias[ event.button ], this.position );
        if( event.button === this.BUTTON_LEFT ) this.emit( 'releaseLeft', this.position );       // todo: streamline
        if( event.button === this.BUTTON_RIGHT ) this.emit( 'releaseRight', this.position );
        if( event.button === this.BUTTON_MIDDLE ) this.emit( 'releaseMiddle', this.position );
    }
    __setWheel( event ){
        let delta = event.deltaY;
        if( delta < 0 ) this.emit( 'wheel', 'up', delta );
        if( delta > 0 ) this.emit( 'wheel', 'down', delta );
    }
}

module.exports = Pointer;