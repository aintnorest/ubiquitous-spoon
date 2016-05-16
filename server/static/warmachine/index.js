var gameFunctions = {
    terrain: {
        keyboard:{},
        movement:{},
        sprites:[]
    },
    scenario: {
        keyboard:{},
        movement:{},
        sprites:[]
    },
    widgets: {
        keyboard:{},
        movement:{},
        sprites:[]
    },
    factions: {
        keyboard: {
            //r for reach
            '82': function() {
                //should show react in increments 0.5 - 1 - 2
                console.log('r was hit');
            }
        },
        movement: {

        },
        sprites:['static/warmachine/trolls.json']
    }
};
