import React from 'react'
import ReactDOM from 'react-dom'
import Header from '../common/header'
import Hero from '../common/hero'
import Exercises from '../homepage/exercises'
import Contact from '../common/contact'
import Footer from '../common/footer'
var {Provider} = require("react-redux");
var store = require("../store");
class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
    return(<div>
            <Header/>
            <Hero/>
            <main id="main">
                <Exercises/>
                <Contact/>
            </main>
            <Footer/>
        </div>)
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Homepage/>
    </Provider>, document.getElementById('homepage')
)