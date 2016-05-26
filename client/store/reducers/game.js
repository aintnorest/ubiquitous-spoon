import createReducer from '../../utils/createReducer';
import { SET_GAME_PHASE } from '../../constants/action-types';

const initialState = {
    gamePhase: "setup"
};

export default createReducer(initialState, {
    [SET_GAME_PHASE]: (state, gamePhase) => ({ ...state, gamePhase })
});
