const Events = require( 'events' );

class Loader extends Events.EventEmitter {
    constructor( game ){
        super();
        this.game = game;
        this.outstanding = 0;
        this.handlers = {};
        this.assets = {};
    }
    get( assetname ){
        return this.assets[ assetname ];
    }
    handle( extensions, handler ){
        extensions.forEach( ext => {
            this.handlers[ ext ] = handler;
        });
    }
    load( ...toLoad ){
        this.outstanding = toLoad.length;
        toLoad.forEach( l =>{
            let filename = l.src;
            let assetname = l.id;
            let ext = filename.split( '.' ).pop();
            let handler = this.handlers[ ext ];
            if( handler === undefined ) throw new Error( `LoaderError: No handler exists for loading .${ext} files.` );
            this.__loadEach( handler, filename, assetname );
        } )
    }
    __loadEach( handler, filename, assetname ){
        handler( 
            filename,
            ( result )=>{ 
                console.log( result );
                this.assets[ assetname ] = result;
                this.emit( 'loadeach', { data : result, name : assetname, filename : filename } )
                this.__completeEach();
            },
            ( filename )=>{
                throw new Error( `LoaderError: Failed to load ${filename}` );
            }  
        )
    }
    __completeEach(){
        this.outstanding--;
        if( this.outstanding > 0 ) return;
        this.emit( 'loadall', this.assets );
        this.game.emit( 'load' );
    }
}

module.exports = Loader;