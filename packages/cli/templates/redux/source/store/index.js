export function reducer(state, action) {
    switch(action.type) {
        case 'ADD': 
            return {
                ...state,
                value: state.value + 1
            };
        case 'MINUS': 
            return {
                ...state,
                value: state.value - 1
            };
        case 'CHANGE': 
            return {
                ...state,
                inputVal: action.payload
            };
        default:
            return state;
    }
}
