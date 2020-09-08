import React from 'react'
import {connect} from 'react-redux'
var file, main;
function getCurrentDay() {
  var offset = "+7";
  var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  var day = new Date(utc + (3600000*offset));
var nowday = "Ngày: "+day.getDate().toString()+"/"+(day.getMonth()+1).toString()+"/"+day.getFullYear().toString();
return nowday;
}
function getDateTime(){
  var offset = "+7";
  var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  var dateObj = new Date(utc + (3600000*offset));
  var month = (dateObj.getMonth() + 1).toString(); 
  if (month.length==1) month="0"+month;
  var day = dateObj.getDate().toString();
  if (day.length==1) day="0"+month;
  var year = dateObj.getFullYear().toString();
  var hour = dateObj.getHours().toString();
  if (hour.length==1) hour="0"+hour;
  var minu = dateObj.getMinutes().toString();
  if (minu.length==1) minu="0"+minu;
  var nowdatetime = year+month+day+hour+minu;
  return parseInt(nowdatetime);
}

class SingleExercise extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          submitSuccess:-1,
          fileName: "",
          urlFile: ""
        }
        this.ChangeFile = this.ChangeFile.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
    }
    ChangeFile(e){
      file = e.target.files[0];
      this.setState({fileName:file.name});
    }
    submitExercise(){
      var that = this;
      let fileFormObj = new FormData();
      fileFormObj.append("fileData", file);
      this.setState({submitSuccess:2,urlFile:""});
      $.ajax({
        type: "POST", 
        url: "/uploadFile",
        data: fileFormObj,
        processData: false,
        contentType: false,
        success: function (data) {
          if (data.err) {
            that.setState({submitSuccess:0});
          } else {
            $.post("/uploadToDrive", {name: data.name }, function (driveData) {
              if (driveData.success == 1) {         
                var idFile = driveData.idFile;
                var urlFile = "https://drive.google.com/open?id="+idFile;
                that.setState({submitSuccess: 1,urlFile:urlFile});
              } else {
                that.setState({submitSuccess: 0})
              }
            })
          }
        },
        fail: function (err) {
          that.setState({submitSuccess: 0});
        }
      })
    }
    render(){
        return(
       <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div className="blog-slider">
          <div className="blog-slider__wrp swiper-wrapper">
            <div className="blog-slider__item swiper-slide">
              <div className="blog-slider__img">
                <h4>Hạn nộp bài: 4/9/2020 10:30;</h4>
                <span>Còn lại: 00:10:40</span>
              </div>
              <div className="blog-slider__content">
                <span className="blog-slider__code">Ngày 4 tháng 9 năm 2020</span>
                <div className="blog-slider__title">LỚP 7/1: NỘP BÀI TẬP SỐ 1</div>
                <div className="blog-slider__text">Một số yêu cầu ...</div>
              </div>
            </div>
            <div className="blog-slider__item swiper-slide">
              <div className="blog-slider__img">
                <h4>Hạn nộp bài: 4/9/2020 10:30;</h4>
                <span>Còn lại: 00:10:40</span>
              </div>
              <div className="blog-slider__content">
                <span className="blog-slider__code">Ngày 4 tháng 9 năm 2020</span>
                <div className="blog-slider__title">Thông tin/Ghi chú</div>
                <div className="blog-slider__text" />
              </div>
            </div>
            <div className="blog-slider__item swiper-slide">
              <div className="blog-slider__img">
                <h4>Hạn nộp bài: 4/9/2020 10:30;</h4>
                <span>Còn lại: 00:10:40</span>
              </div>
              <div className="blog-slider__content">
                <span className="blog-slider__code">Ngày 4 tháng 9 năm 2020</span>
                <div className="blog-slider__title">Nộp bài</div>
                <form className="form-submit">
                  <div className="custom-file">
                    <input type="file" className="custom-file-input" id="customFile" 
                    onChange={(e) => this.ChangeFile(e)}/>
                    <label className="custom-file-label" htmlFor="customFile">Chọn file</label>
                    {this.state.fileName!="" ? <h4 class="nameFile">File đã chọn: {this.state.fileName}</h4> : ""}
                  </div>
                </form>
                {this.state.submitSuccess==1 ? <div class="alert alert-success"><strong>Nộp bài thành công</strong></div> :
                (this.state.submitSuccess==0) ? <div class="alert alert-danger"><strong>Có lỗi xảy ra. Refresh và thử lại!</strong></div> :
                (this.state.submitSuccess==2 ? <div class="spinner-border text-success"></div> : "")}
                <button type="button" className="btn btn-danger btn-submit" onClick={this.submitExercise}>Nộp bài</button>
                <h4>{this.state.urlFile!="" ? <a href={this.state.urlFile} target="_blank" class="toFile">Đi đến file của bạn</a> : ""}</h4>
              </div>
            </div>
          </div>
          <div className="blog-slider__pagination" />
        </div>
      </div>)
    }
}
class SingleExerciseAdmin extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div className="blog-slider">
        <div class="sharebutton">
          <ul>
            <li class="li-1"> <a class="button circle twitter" href="#">Instapaper</a> </li>
            <li class="li-2"> <a class="button circle tags" href="#">Google+</a> </li>
          </ul>
          <a class="button circle share">Share</a>
        </div>
      <div className="blog-slider__wrp swiper-wrapper">
        <div className="blog-slider__item swiper-slide">
          <div className="blog-slider__img">
            <h4>Hạn nộp bài: 4/9/2020 10:30;</h4>
            <span>Còn lại: 00:10:40</span>
          </div>
          <div className="blog-slider__content">
            <span className="blog-slider__code">Ngày 4 tháng 9 năm 2020</span>
            <div className="blog-slider__title">LỚP 7/1: NỘP BÀI TẬP SỐ 1</div>
            <div className="blog-slider__text">Một số yêu cầu ...</div>
          </div>
        </div>
        <div className="blog-slider__item swiper-slide">
          <div className="blog-slider__img">
            <h4>Hạn nộp bài: 4/9/2020 10:30;</h4>
            <span>Còn lại: 00:10:40</span>
          </div>
          <div className="blog-slider__content">
            <span className="blog-slider__code">Ngày 4 tháng 9 năm 2020</span>
            <div className="blog-slider__title">Thông tin/Ghi chú</div>
            <div className="blog-slider__text" />
          </div>
        </div>
      </div>
      <div className="blog-slider__pagination" />
    </div>
  </div>)
  }
}
class Exercises extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
        main = this;
    }
    componentDidUpdate(){
      console.log("Exercises: "+main.props.isAdmin);
    }
    componentDidMount(){
      var swiper = new Swiper('.blog-slider', {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        mousewheel: {
          invert: false,
        },
        // autoHeight: true,
        pagination: {
          el: '.blog-slider__pagination',
          clickable: true,
        }
      });
    }
    render(){
        return(<section id="get-started" className="padd-section text-center">
                <div className="container" data-aos="fade-up">
                    <div className="section-title text-center">
                        <h2>Danh sách bài tập đang mở</h2>
                    </div>
                    <div className="row">
                      {main.props.isAdmin==true ? <SingleExerciseAdmin/> :<SingleExercise/>}
                    </div>
                </div>
            </section>)
    }
}

export default connect(function(state){
  return {
      isAdmin: state.admin
  }
})(Exercises);