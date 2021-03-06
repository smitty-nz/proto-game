# proto-game
Tiny, event-driven game loop for the browser. Requires packaging via browserify or similar to use.

## Initialization:
The ```Game``` object is a singleton so the state is constant across multiple references.
The singleton must be initialized to register it with DOM events.

```js
const Game = require( 'proto-game' );

Game.init( {
  inputElement : window,                                    // where inputs will be received
  outputElement : document.getElementById( 'my-canvas' ),   // where the game will be displayed
} )
```




## Events:

The ```Game``` object extends the node ```EventEmitter``` and will pass through any relevant DOM events.

```js
Game.on( 'mousedown', event => {
  if( event.button === 0 ) console.log( 'Left mouse button pressed!' );
} )
```

Also adds events on each animation frame.
```js
Game.on( 'update', delta =>{} );  // delta is time in seconds since last update
Game.on( 'render', delta =>{} );
```

## Keyboard:

```Game.keyboard``` abstracts keyboard events, also maintains key state.

```js
Game.keyboard.on( 'press', key =>{
  console.log( 'you pressed', key );
} )

Game.on( 'update', ()=>{
  if( Game.keyboard.isKeyDown( 'a' ) ) console.log( 'key a is held!' );
} )

```

## Pointer/Mouse:

```Game.pointer``` abstracts mouse events, also maintains mouse state.

```js
Game.pointer.on( 'press', ( button, position ) =>{
  console.log( button, 'pressed at position: ', position.x, position.y );
} )

Game.pointer.on( 'pressLeft', position =>{
  console.log( 'left click @', position.x, position.y );
} )

Game.pointer.on( 'wheel', ( direction, delta ) =>{
  if( direction == 'up' ) console.log( 'scrolled up' );
} )

Game.on( 'update', ()=>{
  if( Game.pointer.left ) console.log( 'mouse left is held!' );
} )
```

## Loader:

```Game.loader``` handles loading and storing assets. The library defines a default handler for image types.

```js
Game.on( 'init', ()=>{
  Game.loader.load( 
    { src : 'image.png', id : 'assetName' },
  )
} )

Game.on( 'load', ()=>{
  let img = Game.loader.get( 'assetName' );

  Game.on( 'render', ()=>{
    context.clearRect( 0, 0, canvas.width, canvas.height );
    context.drawImage( img, 0, 0 );
  } )
} )
```

To load other types, or to override the default image loading, you can call ```Game.loader.handle()```
Here is the default image loader as an example:

```js
Game.loader.handle( [ 'png', 'jpeg', 'jpg', 'bmp', 'gif' ], ( filename, finish, error ) =>{
    let image = new Image();
    image.onload = ()=>{ finish( image ); }
    image.onerror = ()=>{ error( filename ); }
    image.src = filename;
} )
```