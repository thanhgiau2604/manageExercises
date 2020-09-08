let adminReducer = (state=false,action) => {
    switch(action.type) {
        case 'UPDATE_STATE_ADMIN':
            return action.newState;
        default:
            return state;
    }
}

module.exports = adminReducer;