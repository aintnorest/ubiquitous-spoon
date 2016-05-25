# ubiquitous-spoon
 The goal is to make a web based alternative to http://www.vassalengine.org/ . I appreciate the creators of vassal but it can be horribly slow and is, at least for me, riddled with connection issues. Myself Chris Alatorre & Chris Dopuch are the main contributors at this time and as our primary use of vassal is warmachine / hordes our feature development once we're past the MVP milestone will probably be geared towards that.

 Didn't want to waste time trying to name it, ubiquitous-spoon was githubs random pick.
# MVP GOALS
 - Very simple chat for the purposes of finding people to play with.
 - Establish a peer to peer connection between the people playing.
 - Draggable circles that represent models in game.
 - Shared play space that updates real time using the peer to peer connection.

## Tech Stack
 - Server:
    - hapi js to serve the application and static files
    - webSockets for real time communication for the initial chat and for negotiating the WebRTC connection.
 - Client:
    - WebRTC for the chat and world data passing after a game has been initialized.
    - react for the view layer except for the game space.
    - redux for state management.
    - Pixi.js for the view layer of the game space.

## Browser Support
 Latest Chrome at least to start
