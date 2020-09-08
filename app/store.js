const redux = require("redux");
const reducer = require("./reducer/reducer");

const store = redux.createStore(reducer, redux.compose(
    window.devToolsExtension?window.devToolsExtension(): f=>f
));

module.exports = store;