var gameFunctions = {
    resources:[
        'static/warmachine/backgrounds.json',
        'static/warmachine/trolls.json',
        'static/warmachine/tools.json'
    ],
    gamePhases: {
        setup: {
            toolBar: {
                resource:'static/warmachine/setupToolBar.json',
                items: {
                    Backgrounds: {
                        
                    },
                    Terrain: {

                    },
                    Scenario: {

                    },
                }
            }
        }
    }
};

/*

tools: {
    //'Ruler': {}
    '1d6': {
        resourceSheet:'static/warmachine/tools.json',
        resourceName:'d6.png',
        target: 'dialog',
        fnc: function() {
            return ('1d6: '+(Math.floor(Math.random() * 6) + 1));
        }
    },
    '2d6': {
        resourceSheet:'static/warmachine/tools.json',
        resourceName:'d6.png',
        target: 'dialog',
        fnc: function() {
            let d1 = Math.floor(Math.random() * 6) + 1;
            let d2 = Math.floor(Math.random() * 6) + 1;
            return ('2d6: ('+d1+','+d2+') ['+(d1+d2)+']');
        }
    },
    '3d6': {
        resourceSheet:'static/warmachine/tools.json',
        resourceName:'d6.png',
        target: 'dialog',
        fnc: function() {
            let d1 = Math.floor(Math.random() * 6) + 1;
            let d2 = Math.floor(Math.random() * 6) + 1;
            let d3 = Math.floor(Math.random() * 6) + 1;
            return ('3d6: ('+d1+','+d2+','+d3+') ['+(d1+d2+d3)+']');
        }
    },
    '4d6': {
        resourceSheet:'static/warmachine/tools.json',
        resourceName:'d6.png',
        target: 'dialog',
        fnc: function() {
            let d1 = Math.floor(Math.random() * 6) + 1;
            let d2 = Math.floor(Math.random() * 6) + 1;
            let d3 = Math.floor(Math.random() * 6) + 1;
            let d4 = Math.floor(Math.random() * 6) + 1;
            return ('4d6: ('+d1+','+d2+','+d3+','+d4+') ['+(d1+d2+d3+d4)+']');
        }
    }
},
setup: {
    Backgrounds: [
        {
            resourceSheet: 'static/warmachine/backgrounds.json',
            type: ['extras', 'TilingSprite'],
            opts: {
                cacheAsBitmap: true,
                filterArea: {x:0, y:0, width:2439, height: 2439}
            }
        }
    ],
    Terrain: [],
    Scenario: []
},
game: {

}
*/
