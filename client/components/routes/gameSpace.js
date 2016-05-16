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
    console.log('SCALE :',scale);
    gameObj.stage.scale.x = scale;
    gameObj.stage.scale.y = scale;
    gameObj.renderer.autoResize = true;
    let resize = debounce(function(){
        console.log('how often am i called')
        gameObj.renderer.resize(window.innerWidth, window.innerHeight - 64);
        let scale = determineScale(x,y);
        console.log('SCALE :',scale);
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
        document.addEventListener("keyPress", this.keyboardHandler, false);
    },
    componentWillUnmount() {
        document.removeEventListener("keyPress", this.keyboardHandler, false);
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
        console.log(e);
    },

    render() {
        return (
            <div className="game-canvas-container" ref="gameCanvas">
            </div>
        );
    }

});
//
