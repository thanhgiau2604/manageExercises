import React from 'react'

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return(<footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-4">
              <div className="footer-logo">
                <a className="navbar-brand" href="#">mExercises</a>
                <p>This is the place to do your exercises and submit it online. Please complete and submit it on time.</p>
              </div>
            </div>
            <div className="col-md-12 col-lg-8">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.9265263056845!2d106.65460311384822!3d10.267503892668074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31755738f5992f6d%3A0xa64c6755be7c6d7c!2sPhu%20Thanh%20Schools%20High%20School!5e0!3m2!1sen!2s!4v1599186900318!5m2!1sen!2s" width="100%" height={200} frameBorder={0} style={{border: 0}} allowFullScreen aria-hidden="false" tabIndex={0} />
            </div>
          </div>
        </div>
        <div className="copyrights">
          <div className="container">
            <p>© Copyrights 2020. All rights reserved.</p>
            <div className="credits">
              Designed by NTG
            </div>
          </div>
        </div>
      </footer>)
    }
}

export default Footer;