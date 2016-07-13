# Ubiquitous-Table
 The goal is to make a web based alternative to http://www.vassalengine.org/ . I appreciate the creators of vassal but it can be horribly slow and is, at least for me, riddled with connection issues. Myself Chris Alatorre & Chris Dopuch are the main contributors at this time and as our primary use of vassal is warmachine / hordes our feature development once we're past the MVP milestone will probably be geared towards that.

 Didn't want to waste time trying to name it, ubiquitous-spoon was githubs random pick. After a bit I thought, not as a final name, but as a small change Ubiquitous-Table might make it more descriptive.

# MVP GOALS
 - ~~Very simple chat for the purposes of finding people to play with.~~
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

## To Do
 - Add request for game.
 - ~~Fix chat so that it is by game instead of global~~
 - Clean up & organize css. Thinking ITCSS for organization.
    - http://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528
    - https://medium.com/@shaunbent/css-at-bbc-sport-part-1-bab546184e66#.81r9rdhpz
 - Make the site more responsive.
 - Implement Simple Chess game.
 - Add universal rendering.
 - Implement service worker for faster game asset loading
 - Add ability to send private messages
 - Add web app manifest
 - Switch chat listener off the component and onto the action / store
 - Make the chat clear when you sign in and out.
## Browser Support
 Latest Chrome at least to start
