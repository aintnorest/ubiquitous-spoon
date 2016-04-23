export default function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        if (typeof(action) === 'undefined') {
            console.error('Invalid action');
            return;
        }
        return reducer ? reducer(state, action.payload) : state;
  };
};
