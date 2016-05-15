import createReducer from '../../utils/createReducer';
import {SET_USER_NAME, SET_SIGNED_IN, SET_ERROR_MESSAGE, SET_GAME, SET_LOADING} from '../../constants/action-types';

const initialState = {
    userName: '',
    signedIn: false,
    errorMessage: null,
    game: null,
    loading: {}
};

export default createReducer(initialState, {
    [SET_USER_NAME]: (state, userName) => ({ ...state, userName }),
    [SET_SIGNED_IN]: (state, signedIn) => ({ ...state, signedIn }),
    [SET_ERROR_MESSAGE]: (state, errorMessage) => ({ ...state, errorMessage }),
    [SET_GAME]: (state, game) => ({...state, game}),
    [SET_LOADING]: (state, payload) => {
        console.log('set loading: ',payload);
        let s = {...state};
        if(payload.progress >= 100) delete s.loading[payload.type];
        else s.loading[payload.type] = payload.progress;
        return s;
    }
});
