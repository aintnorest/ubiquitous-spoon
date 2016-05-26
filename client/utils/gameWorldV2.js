import PIXI from 'pixi.js';
import debounce from './debounce';
//
function determineScale(x,y) {
    let gV;
    if(x >= y) gV = x;
    else gV = y;
    if(gV >= 2439) return 1;
    return (gV / 2439);
}
/*
*   object: {
*       tableSize: [width,height],
*
*   }
*/
export default function gameWorld(opts,gameObj = {}) {
    //SIZING & SCALING
    let x = window.innerWidth;
    let y = window.innerHeight - 64;
    let scale = determineScale(x,y);
    this.renderer = new PIXI.WebGLRenderer(x,y);
    this.renderer.autoResize = true;
    this.stage = new PIXI.Container();
    this.gameSpace = new PIXI.Container();
    this.gameSpace.position = new PIXI.Point(75,0);
    this.toolBar = new PIXI.ParticleContainer();
    this.toolBar.width = 75;
    this.toolBar.height = y;
    this.stage.width = opts.tableSize[0];
    this.stage.height = opts.tableSize[1];
    this.stage.scale.x = scale;
    this.stage.scale.y = scale;
    let resize = debounce(() => {
        this.renderer.resize(window.innerWidth, window.innerHeight - 64);
        scale = determineScale(x,y);
        this.stage.scale.x = scale;
        this.stage.scale.y = scale;
    },250);
    this.gameObj = gameObj;
    this.resources = PIXI.loader.resources;
    this.stage.addChild(this.gameSpace);
    this.stage.addChild(this.toolBar);
}
