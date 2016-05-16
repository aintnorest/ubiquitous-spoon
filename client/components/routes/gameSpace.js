import React from 'react';
import debounce from '../../utils/debounce';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PIXI from 'pixi.js';
//
function determineScale(x,y) {
    let gV;
    if(x >= y) gV = x;
    else gV = y;
    if(gV >= 2439) return 1;
    return (gV / 2439);
}

function createGameWorld() {
    let self = this;
    let x = window.innerWidth;
    let y = window.innerHeight - 64;
    let gameObj = {};
    gameObj.renderer = new PIXI.WebGLRenderer(x,y);
    gameObj.stage = new PIXI.Container;
    gameObj.renderer.backgroundColor = 0xF5F5F6;
    gameObj.stage.width = 2439;
    gameObj.stage.height = 2439;
    let scale = determineScale(x,y);
    gameObj.stage.scale.x = scale;
    gameObj.stage.scale.y = scale;
    gameObj.renderer.autoResize = true;
    let resize = debounce(function(){
        gameObj.renderer.resize(window.innerWidth, window.innerHeight - 64);
        let scale = determineScale(x,y);
        gameObj.stage.scale.x = scale;
        gameObj.stage.scale.y = scale;
        self.game.renderer.render(self.game.stage);
    },250);
    window.onresize = resize;
    return gameObj;
}

function syncGameWorld() {

}

export default React.createClass({
    componentDidMount() {
        this.game = createGameWorld.call(this);
        this.refs.gameCanvas.appendChild(this.game.renderer.view);
        this.game.models = new PIXI.ParticleContainer;
        this.game.stage.addChild(this.game.models);
        //
        this.trolls = PIXI.loader.resources["static/warmachine/trolls.json"].textures;
        for(let i = 0; i < 1000; i++) {
            let model = new PIXI.Sprite(this.trolls[Object.keys(this.trolls)[Math.floor(Math.random() * 30)]]);
            model.x = Math.floor(Math.random() * 650) + 1;
            model.y = Math.floor(Math.random() * 650) + 1;
            this.game.models.addChild(model);
        }
        //start the game
        this.animate();
        document.addEventListener("keypress", this.keyboardHandler, false);
        document.addEventListener("keydown", this.keydownHandler, false);
        document.addEventListener("keyup",this.keyupHandler,false);
    },
    componentWillUnmount() {
        document.removeEventListener("keypress", this.keyboardHandler, false);
        document.removeEventListener("keydown", this.keydownHandler, false);
        document.removeEventListener("keyup",this.keyupHandler,false);
    },

    animate() {
        let self = this;
        for (var i = self.game.models.children.length - 1; i >= 0; i--) {self.game.models.removeChild(self.game.models.children[i]);};
        for(let i = 0; i < 1000; i++) {
            let model = new PIXI.Sprite(self.trolls[Object.keys(self.trolls)[Math.floor(Math.random() * 30)]]);
            model.x = Math.floor(Math.random() * 650) + 1;
            model.y = Math.floor(Math.random() * 650) + 1;
            self.game.models.addChild(model);
        }

        // render the stage container
        this.game.renderer.render(this.game.stage);
        //requestAnimationFrame(self.animate);
    },

    keyboardHandler(e) {
        if(e.charCode == 115){
            console.log('up');
            this.game.stage.position.y = this.game.stage.position.y + 5;
            this.game.renderer.render(this.game.stage);
        } else if(e.charCode == 119) {
            console.log('down');
            this.game.stage.position.y = this.game.stage.position.y - 5;
            this.game.renderer.render(this.game.stage);
        } else if(e.charCode == 100){
            console.log('right');
            this.game.stage.position.x = this.game.stage.position.x + 7;
            this.game.renderer.render(this.game.stage);
        } else if(e.charCode == 97) {
            console.log('left');
            this.game.stage.position.x = this.game.stage.position.x - 7;
            this.game.renderer.render(this.game.stage);
        } else if(e.charCode == 114) {
            console.log('zoom in');
            this.game.stage.scale.x = this.game.stage.scale.x + 0.1;
            this.game.stage.scale.y = this.game.stage.scale.y + 0.1;
            this.game.renderer.render(this.game.stage);
        } else if(e.charCode == 102) {
            console.log('zoom out');
            this.game.stage.scale.x = this.game.stage.scale.x - 0.1;
            this.game.stage.scale.y = this.game.stage.scale.y - 0.1;
            this.game.renderer.render(this.game.stage);
        }
    },
    keydownHandler(e) {
        if(e.charCode == 0 && e.shiftKey) {
            document.addEventListener("mousemove", this.moveStage, false);
        }
    },
    keyupHandler(e) {
        if(e.code == "ShiftLeft") {
            try {
                this.prevMsPst = [];
                document.removeEventListener("mousemove", this.moveStage, false);
            } catch(d) {
                console.log('didnt exist');
            }
        }
    },

    prevMsPst: [],
    moveStage(e) {
        if(this.prevMsPst.length == 0){
            this.prevMsPst = [e.clientX,e.clientY];
            return;
        }
        let dX = this.prevMsPst[0] - e.clientX;
        let dY = this.prevMsPst[1] - e.clientY;
        this.prevMsPst = [e.clientX,e.clientY];
        this.game.stage.position.y = this.game.stage.position.y + (dY * this.game.stage.scale.x);
        this.game.stage.position.x = this.game.stage.position.x + (dX * this.game.stage.scale.x);
        this.game.renderer.render(this.game.stage);
    },

    wheel(e) {
        let scale = this.game.stage.scale.x + (e.deltaY * 0.01);
        if(scale < 0.3) scale = 0.3;
        else if(scale > 3) scale = 3;
        this.game.stage.scale.x = scale;
        this.game.stage.scale.y = scale;
        /*SHOULD BE ABLE TO REMOVE ONCE WE HAVE A LOOP */
        this.game.renderer.render(this.game.stage);
        e.preventDefault();
    },

    render() {
        return (
            <div onWheel={this.wheel} className="game-canvas-container" ref="gameCanvas">
            </div>
        );
    }

});
//
