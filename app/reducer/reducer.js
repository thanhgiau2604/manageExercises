  
const redux = require("redux");
const admin = require("./admin");
var reducer = redux.combineReducers({
    admin:admin
});

module.exports = reducer;