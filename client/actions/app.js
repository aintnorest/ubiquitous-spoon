import { push } from 'react-router-redux';
import {SET_GAME, SET_LOADING} from '../constants/action-types';
import loadScript from '../utils/loadScript';
import PIXI from 'pixi.js';
//
export function setGame(game) {
    return (dispatch, getState) => {
        let loadProgressHandler = function(loader, resource) {
            dispatch({type: SET_LOADING, payload:{
                type:resource.url, progress:loader.progress
            }});
        };
        dispatch({type: SET_LOADING, payload:{
            type:'Game Data', progress:0
        }});
        loadScript('static/'+game+'/index.js').then(function(d) {
            Object.keys(gameFunctions).forEach(function(key) {
                gameFunctions[key].sprites.forEach(function(url) {
                    dispatch({type: SET_LOADING, payload:{
                        type:url, progress:0
                    }});
                    PIXI.loader.add(url).on("progress", loadProgressHandler);
                });
            });
            PIXI.loader.load(function() {
                dispatch({
                   type: SET_GAME,
                   payload: game
                });
            });
            dispatch({type: SET_LOADING, payload:{
                type:'Game Data', progress:100
            }});
        }).catch(function(err) {
            dispatch({type: SET_LOADING, payload:{
                type:'Game Data', progress:-1
            }});
        });
    };
}
