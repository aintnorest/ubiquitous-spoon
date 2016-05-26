import PIXI from 'pixi.js';

function determineScale(x,y) {
    let gV;
    if(x >= y) gV = x;
    else gV = y;
    if(gV >= 2439) return 1;
    return (gV / 2439);
}
/*
gameWorld:[
    {
        name: 'setup', type: 'ParticleContainer', data:{
            cacheAsBitmap: true,
            children: [

            ]
        }
    },
    {
        name: 'model', type: 'ParticleContainer', data:{}
    }
]
*/
export function setData(elm, data = {}) {
    Object.keys(data).forEach(function(prop) {
        if(props === 'children') return;
        elm[prop] = data[prop];
    });
}
//
export function initWorld(location, dataObj) {
    Object.defineProperty(dataObj, 'pixi', {
        enumerable: false,
        value: new PIXI[dataObj.type]()
    });
    setData(dataObj.pixi, dataObj.data);
    if(obj.data.children.length > 0) {
        obj.data.children.forEach(function(child) {
            if(child.type === "ParticleContainer" || child.type === "Container") {
                initContainer(data.child)
            }
        });
    }
    parent.addChild(obj.pixi);
    location.push(obj);
};
/*
*   object: {
*       tableSize: [width,height],
*
*   }
*/
export default function gameWorld(opts,gameObj = {}) {
    this.dirty = false;
    //SIZING & SCALING
    let x = window.innerWidth;
    let y = window.innerHeight - 64;
    let scale = determineScale(x,y);
    this.renderer = new PIXI.WebGLRenderer(x,y);
    this.renderer.autoResize = true;
    this.stage = new PIXI.Container;
    this.stage.width = opts.tableSize[0];
    this.stage.height = opts.tableSize[1];
    this.stage.scale.x = scale;
    this.stage.scale.y = scale;
    let resize = debounce(() => {
        this.renderer.resize(window.innerWidth, window.innerHeight - 64);
        scale = determineScale(x,y);
        this.stage.scale.x = scale;
        this.stage.scale.y = scale;
        this.dirty = true;
    },250);
    this.gameObj = gameObj;
    this.resources = PIXI.loader.resources;
}
/*
    Can only add containers to the main stage.
*/
gameWorld.prototype.addToStage = function(section,type) {
    initContainer(this.gameObj, section, this.stage, type);
};
gameWorld.prototype
/**/
gameWorld.prototype.initializeGameWorld = function() {
    let Stage = Object.keys(this.gameObj);
    Stage.forEach((name) => {
        if(!this.gameObj[name].container) Object.defineProperty(this.gameObj[name], 'container', {
            enumerable: false,
            value: new PIXI[this.gameObj[name].type]
        });
        this.stage.addChild(this.gameObj[name].container);
        let Children = Object.keys(this.gameObj[name].children);
    });
}
