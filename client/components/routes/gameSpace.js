import React from 'react';
import debounce from '../../utils/debounce';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PIXI from 'pixi.js';
//
function createGameWorld(size) {
    let x = window.innerWidth;
    let y = window.innerHeight - 64;
    let gameObj = {};
    gameObj.renderer = new PIXI.WebGLRenderer(x,y);
    gameObj.stage = new PIXI.ParticleContainer;
    gameObj.renderer.backgroundColor = 0xF5F5F6;
    gameObj.stage.width = x;
    gameObj.stage.height = y;
    gameObj.renderer.autoResize = true;
    let resize = debounce(function(){
        console.log('how often am i called')
        gameObj.renderer.resize(window.innerWidth, window.innerHeight - 64);
    },250);
    window.onresize = resize;
    return gameObj;
}

function syncGameWorld() {

}

export default React.createClass({
    componentDidMount() {
        this.game = createGameWorld([1200,800]);
        this.refs.gameCanvas.appendChild(this.game.renderer.view);
        //
        this.trolls = PIXI.loader.resources["static/warmachine/trolls.json"].textures;
        for(let i = 0; i < 1000; i++) {
            let model = new PIXI.Sprite(this.trolls[Object.keys(this.trolls)[Math.floor(Math.random() * 30)]]);
            model.x = Math.floor(Math.random() * 650) + 1;
            model.y = Math.floor(Math.random() * 650) + 1;
            this.game.stage.addChild(model);
        }
        //start the game
        this.animate();
    },

    animate() {
        let self = this;
        for (var i = self.game.stage.children.length - 1; i >= 0; i--) {self.game.stage.removeChild(self.game.stage.children[i]);};
        for(let i = 0; i < 1000; i++) {
            let model = new PIXI.Sprite(self.trolls[Object.keys(self.trolls)[Math.floor(Math.random() * 30)]]);
            model.x = Math.floor(Math.random() * 650) + 1;
            model.y = Math.floor(Math.random() * 650) + 1;
            self.game.stage.addChild(model);
        }

        // render the stage container
        this.game.renderer.render(this.game.stage);
        //requestAnimationFrame(self.animate);
    },

    render() {
        return (
            <div className="game-canvas-container" ref="gameCanvas">
            </div>
        );
    }

});
//
