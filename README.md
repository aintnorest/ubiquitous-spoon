# ubiquitous-spoon
    Didn't want to waste time trying to name it.
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
