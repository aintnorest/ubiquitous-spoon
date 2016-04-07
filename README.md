# ubiquitous-spoon
 The goal is to make a web based alternative to http://www.vassalengine.org/ using WebRTC. I appreciate the creators of vassal but it can be horribly slow and is, at least for me, riddled with connection issues. Myself Chris Alatorre & Chris Dopuch are the main contributors at this time and as our primary use of vassal is warmachine / hordes our feature development once we're past the MVP milestone will probably be geared towards that.

 Didn't want to waste time trying to name it, ubiquitous-spoon was githubs random pick.
# MVP GOALS
 - Very simple chat for the purposes of finding people to play with.
 - Establish a peer to peer connection between the people playing.
 - Draggable circles that represent models in game.
 - Shared play space that updates real time using the peer to peer connection.
## Tech Stack
 - Server:
    - hapi js to serve the application and static files
    - socket.io to setup the initial chat to facilitate the peer to peer connection using socketio's p2p which uses WebRTC.
 - Client:
    - react
    - redux

Need to figure out what will be performant given the constraints.
 - div/spans using css shapes
 - svg
 - canvas

Canvas was my initial thought but after a little reading it seems like canvas can have trouble when the render space of the canvas is really large.

## Browser Support
 Latest Chrome
