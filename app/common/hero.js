import React from 'react'

class Hero extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return(
            <section id="hero">
                <div class="hero-container" data-aos="fade-in">
                    <img src="assets/img/hero-img.png" alt="Hero Imgs" data-aos="zoom-out" data-aos-delay="100" />
                </div>
            </section>)
    }
}

export default Hero;