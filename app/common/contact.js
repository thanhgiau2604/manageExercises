import React from 'react'

class ContactForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return(<section id="contact" className="padd-section">
        <div className="container" data-aos="fade-up">
          <div className="section-title text-center">
            <h2>Liên hệ</h2>
          </div>
          <div className="row justify-content-center" data-aos="fade-up" data-aos-delay={100}>
            <div className="col-lg-3 col-md-4">
              <div className="info">
                <div>
                  <i className="fa fa-map-marker" />
                  <p>Văn phòng phẩm Thúy Nguyên</p>
                </div>
                <div className="email">
                  <i className="fa fa-envelope" />
                  <p>manguyen@gmail.com</p>
                </div>
                <div>
                  <i className="fa fa-phone" />
                  <p />
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-8">
              <div className="form">
                <form action="forms/contact.php" method="post" role="form" className="php-email-form">
                  <div className="form-group">
                    <input type="text" name="name" className="form-control" id="name" placeholder="Tên" />
                    <div className="validate" />
                  </div>
                  <div className="form-group">
                    <input type="email" className="form-control" name="email" id="email" placeholder="Đỉa chỉ Email" />
                    <div className="validate" />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" name="subject" id="subject" placeholder="Chủ đề" />
                    <div className="validate" />
                  </div>
                  <div className="form-group">
                    <textarea className="form-control" name="message" rows={5} placeholder="Nội dung" defaultValue={""} />
                    <div className="validate" />
                  </div>
                  <div className="mb-3">
                    <div className="loading">Loading</div>
                    <div className="error-message" />
                    <div className="sent-message">Thư của bạn đã được gửi đi!</div>
                  </div>
                  <div className="text-center"><button type="submit">Gửi</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>)
    }
}

export default ContactForm;