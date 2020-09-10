import React from 'react'
import {connect} from 'react-redux'
import $ from 'jquery'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import io from 'socket.io-client'
const socket = io('https://mexercises.herokuapp.com');
var file, main, edit, deleted, submit;
class NewExercise extends React.Component {
  constructor(props){
    super(props);
    this.changeFile = this.changeFile.bind(this);
    this.state = {
      file: "",
      err: "",
      processing: 0
    }
  }
  changeFile(e){
    if (e.target.files.length>0){
      this.setState({file: e.target.files[0]});
    }
    
  }
  saveExercise(){
    const title = this.refs.nameExercise.value; 
    const requirement = this.refs.requireExercise.value;
    let deadline = this.refs.deadline.value;
    const file = this.state.file.name;
    if (!title.trim() || !requirement.trim() || !deadline || !file){
      this.setState({err:"Chưa điền đẩy đủ các trường!"});
      return;
    }
    this.setState({err:"", processing:1});
    var that = this;
    let fileFormObj = new FormData();
    fileFormObj.append("fileData", this.state.file);
    $.ajax({
      type: "POST", url: "/uploadFile", data: fileFormObj, processData: false, contentType: false,
      success: function (data) {
        if (data.err) {
          that.setState({err:"Di chuyển file!"});
        } else {
          $.post("/uploadToDrive", { name: data.name }, function (driveData) {
            if (driveData.success == 1) {
              let idFile = driveData.idFile;
              let view = "https://drive.google.com/open?id=" + idFile;
              let name = driveData.name;
              let download = "https://drive.google.com/u/0/uc?id=" + idFile + "&export=download";
              let token  = localStorage.getItem("token");
              $.post("/api/saveExercise", {idFile,title,requirement,deadline,name,view,download,token}, function (data) {
                if (data.success == 0) {
                  that.setState({ err: "Có lỗi lưu dữ liệu!"});
                } else {
                  let element = document.getElementById("close_modal");
                  element.click();
                  that.setState({processing:0});
                  main.setState({listExercises:data});
                }
              })
            } else {
              that.setState({ err: "Lỗi upload lên Google Drive!"});
            }
          })
        }
      },
      fail: function (err) {
        that.setState({ err: "Lỗi di chuyển file" });
      }
    })   
  }
  render(){
    return(<div className="modal fade" id="newExercise">
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">New Exercise</h3>
          <button type="button" className="close" data-dismiss="modal">×</button>
        </div>
        <div className="modal-body">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="group">
									<input type="text" required ref="nameExercise"/>
									<span class="highlight"></span>
									<span class="bar"></span>
									<label class="labelMaterialButton">Tên bài tập</label>
								</div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="group requirement">
									<textarea type="text" required rows="5" className="form-control" 
                  placeholder="Yêu cầu" ref="requireExercise">
                  </textarea>
								</div>
            </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <form className="form-submit">
                  <div className="custom-file">
                    <input type="file" className="custom-file-input" id="customFile" onChange={this.changeFile}/>
                    <label className="custom-file-label" htmlFor="customFile">Chọn file tài liệu</label>
                    {this.state.file!="" ? <h4 class="nameFile">File đã chọn: {this.state.file.name}</h4> : ""}
                  </div>
                </form>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                   <form className="form-group date_input">
                      <label>{"Hạn nộp bài :"}</label>
                      <input className="form-control" type="datetime-local" name="deadline" ref="deadline"/>
                    </form> 
              </div>
              {this.state.err ?
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-danger">
                  <strong>Lỗi: </strong>{this.state.err}.
                </div>
              </div> : <div></div>}
          </div>
          
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.saveExercise.bind(this)}>
          {this.state.processing==1 ? <div><span class="spinner-border spinner-border-sm"></span> 
          Đang xử lý..</div>: "Lưu"}</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal" id="close_modal">Đóng</button>
        </div>
      </div>
    </div>
  </div>)
  }
}
class EditExercise extends React.Component {
  constructor(props){
    super(props);
    this.changeFile = this.changeFile.bind(this);
    this.state = {
      file: "",
      err: "",
      exer: {
        title: "",
        requirement: "",
        deadline: "",
        file: {name:""}
      },
      isChangeFile: false,
      isChangeDate: false,
      processing: 0
    }
    edit = this;
  }
  changeFile(e){
    if (e.target.files.length>0){
      this.setState({file: e.target.files[0], isChangeFile:true});
    }
  }
  changeDate(e){
    this.setState({isChangeDate:true});
  }
  saveExercise(){
    const title = this.refs.nameExercise.value; 
    const requirement = this.refs.requireExercise.value;
    let deadline = this.refs.deadline1.value;
    const file = this.state.file.name;
    if (!title.trim() || !requirement.trim() || !file){
      this.setState({err:"Chưa điền đẩy đủ các trường!"});
      return;
    }
    this.setState({processing:1});
    let id = this.state.exer.id;
    let token = localStorage.getItem("token");
    if (!this.state.isChangeDate) deadline = parseInt(this.state.exer.deadline);
    var that = this;
    if (this.state.isChangeFile==true){
      let fileFormObj = new FormData();
      fileFormObj.append("fileData", this.state.file);
      this.setState({ err: "" });
      $.ajax({
        type: "POST", url: "/uploadFile", data: fileFormObj, processData: false, contentType: false,
        success: function (data) {
          if (data.err) {
            that.setState({ err: "Di chuyển file!" });
          } else {
            $.post("/uploadToDrive", { name: data.name }, function (driveData) {
              if (driveData.success == 1) {
                let idFile = driveData.idFile;
                let view = "https://drive.google.com/open?id=" + idFile;
                let name = driveData.name;
                let download = "https://drive.google.com/u/0/uc?id=" + idFile + "&export=download";
                deadline = new Date(deadline).getTime();
                $.post("/api/updateExercise", { id, title, requirement, deadline, name, view, download, token, idFile }, function (data) {
                  if (data.success == 0) {
                    that.setState({ err: "Có lỗi lưu dữ liệu!" });
                  } else {
                    let element = document.getElementById("close_modaledit");
                    element.click();
                    that.setState({processing:0, isChangeFile:false});
                    if (that.state.isChangeDate) that.setState({isChangeDate:false})
                    main.setState({ listExercises: data });
                    if (that.state.exer.status){
                      let sendData = {
                        id: that.state.exer.id,
                        deadline: deadline
                      }
                      socket.emit("update-for-client-list-exercises",sendData);
                    }
                  }
                })
              } else {
                that.setState({ err: "Lỗi upload lên Google Drive!" });
              }
            })
          }
        },
        fail: function (err) {
          that.setState({ submitSuccess: 0 });
        }
      })
    } else {
      let {name, view, download} = this.state.exer.file;
      let idFile = this.state.exer.file.id;
      deadline = new Date(deadline).getTime();
      $.post("/api/updateExercise", {id, title, requirement, deadline, name, view, download, token, idFile}, function (data) {
        if (data.success == 0) {
          that.setState({ err: "Có lỗi lưu dữ liệu!" });
        } else {
          let element = document.getElementById("close_modaledit");
          element.click();
          that.setState({processing:0});
          if (that.state.isChangeDate) that.setState({isChangeDate:false})
          main.setState({ listExercises: data });
          if (that.state.exer.status){
            let sendData = {
              id: that.state.exer.id,
              deadline: deadline
            }
            socket.emit("update-for-client-list-exercises",sendData);
          }
        }
      })
    }
  }
  render(){
    return(<div className="modal fade" id="editExercise" key={this.state.exer.id}>
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Edit Exercise</h3>
          <button type="button" className="close" data-dismiss="modal">×</button>
        </div>
        <div className="modal-body">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="group">
									<input type="text" required ref="nameExercise" defaultValue={this.state.exer.title}/>
									<span class="highlight"></span>
									<span class="bar"></span>
									<label class="labelMaterialButton">Tên bài tập</label>
								</div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="group requirement">
									<textarea type="text" required rows="5" className="form-control" 
                  placeholder="Yêu cầu" ref="requireExercise" defaultValue={this.state.exer.requirement}>
                  </textarea>
								</div>
            </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <form className="form-submit">
                  <div className="custom-file">
                    <input type="file" className="custom-file-input" id="customFile" onChange={this.changeFile}/>
                    <label className="custom-file-label" htmlFor="customFile">Chọn file tài liệu</label>
                    {this.state.file!="" ? <h4 class="nameFile">File đã chọn: {this.state.file.name}</h4> : ""}
                  </div>
                </form>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                   <form className="form-group date_input">
                      <label>{"Hạn nộp bài :"}</label>
                      <input className="form-control" type="datetime-local" name="deadline" ref="deadline1" onChange={this.changeDate.bind(this)}/>
                    </form> 
              </div>
              {this.state.err ?
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-danger">
                  <strong>Lỗi: </strong>{this.state.err}.
                </div>
              </div> : <div></div>}
          </div>
          
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.saveExercise.bind(this)}>
          {this.state.processing==1 ? <div><span class="spinner-border spinner-border-sm"></span> 
          Đang xử lý..</div>: "Lưu"}
          </button>
          <button type="button" className="btn btn-danger" data-dismiss="modal" id="close_modaledit">Đóng</button>
        </div>
      </div>
    </div>
  </div>)
  }
}
class AllSubmition extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      listSubmits: [],
      idExercise: ""
    }
    submit = this;
  }
  componentDidMount(){
    let _this = this;
    socket.on("admin-update-list-submits",function(data){
      if (data == _this.state.idExercise){
        const token = localStorage.getItem("token");
        const id = data;
        $.post("/api/getListSubmits", {id, token}, function (result) {
          if (result.success != 0) {
            _this.setState({listSubmits: result});
          }
        })
      }
    })
  }
  render(){
    return(<div className="modal right fade" id="modalSubmit" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel2">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="myModalLabel2">Danh sách bài nộp:</h4>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
        </div>
        <div className="modal-body">
            <ul class="list-group list-group-flush list-submits">
              {this.state.listSubmits.map(function(submit, index){
                return <li class="list-group-item" key={submit.id}>
                  {index+1}. File: {submit.name},<a href={submit.view} target="_blank">{" view"}</a>, 
                  <a href={submit.download}>{" download"}</a>
                </li>
              })}
            </ul>
        </div>
      </div>
    </div>
  </div>)
  }
}
class ConfirmDelete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      processing: false,
      id: ""
    }
    deleted = this;
  }
  deleteExercise(){
    const token = localStorage.getItem("token");
    const id = this.state.id;
    let _this = this;
    this.setState({processing:true});
    $.post("/api/deleteExercise",{token,id},function(data){
      if (data.success!=0){
        main.setState({listExercises:data});
        let element = document.getElementById("close_delete");
        element.click();
        _this.setState({processing:false});
      }
    })
  }
  render(){
    return(<div className="modal fade" id="deleteExercise">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Confirm</h3>
          <button type="button" className="close" data-dismiss="modal">×</button>
        </div>
        <div className="modal-body">
          <h4>Bạn có chắc chắn xóa không?</h4>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.deleteExercise.bind(this)}>
          {this.state.processing==true ? <div><span class="spinner-border spinner-border-sm"></span> 
          Đang xử lý..</div>: "Xóa"}</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal" id="close_delete">Hủy</button>
        </div>
      </div>
    </div>
  </div>)
  }
}
class SingleExercise extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          submitSuccess:-1,
          fileName: "",
          urlFile: "",
          day: "__", hour: "__", minute:"__", second: "__",
          interval: ""
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
                let idFile = driveData.idFile;
                let view = "https://drive.google.com/open?id="+idFile;
                that.setState({submitSuccess: 1,urlFile:view});
                let idExercise = that.props.exer.id;
                let name = driveData.name;
                let download = "https://drive.google.com/u/0/uc?id="+idFile+"&export=download";
                $.post("/submitExercise",{idExercise,idFile,name,view,download},function(data){
                  if (data.success==0){
                    that.setState({submitSuccess:0})
                  } else {
                    let submitted = JSON.parse(localStorage.getItem("submitted"));
                    if (submitted==null) submitted = [];
                    submitted.push(idExercise);
                    localStorage.setItem("submitted",JSON.stringify(submitted));
                    socket.emit("update-for-admin-list-submits",idExercise);
                    socket.emit("update-for-admin-count-submits",idExercise);
                  }
                })
              } else {
                that.setState({submitSuccess: 0});
              }
            })
          }
        },
        fail: function (err) {
          that.setState({submitSuccess: 0});
        }
      })
    }
    componentDidUpdate(){
      let condition = localStorage.getItem(this.props.exer.id);
      if (condition == "true") {
        clearInterval(this.state.interval);
        localStorage.setItem(this.props.exer.id, "false");
        let _this = this;
        let deadline = parseInt(localStorage.getItem(this.props.exer.id+"deadline"));
        $.get("/getTime",function(data){
          let now = data.now;
          let distance = deadline - now + 1000;
          var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
          _this.state.interval = setInterval(function () {
            if (distance - 1000 <= 0) {
              clearInterval(_this.state.interval);
              const id = _this.props.exer.id;
              $.post("/setTimeoutExercises", { id }, function (data) {
                main.setState({ listExercises: data });
              })
            } else {
              distance -= 1000;
              var objDateTime = {
                ngay: Math.floor(distance / day),
                gio: Math.floor((distance % day) / hour),
                phut: Math.floor((distance % hour) / minute),
                giay: Math.floor((distance % minute) / second)
              }
              if (objDateTime.ngay < 10) objDateTime.ngay = '0' + objDateTime.ngay;
              if (objDateTime.gio < 10) objDateTime.gio = '0' + objDateTime.gio;
              if (objDateTime.phut < 10) objDateTime.phut = '0' + objDateTime.phut;
              if (objDateTime.giay < 10) objDateTime.giay = '0' + objDateTime.giay;
              _this.setState({
                day: objDateTime.ngay, hour: objDateTime.gio, minute: objDateTime.phut,
                second: objDateTime.giay
              });
            }
          }, 1000)
        })
      }
    }
    componentWillUnmount(){
      clearInterval(this.state.interval);
    }
    componentDidMount(){
      var swiper = new Swiper('.blog-slider', {
        effect: 'fade'
      });
      let _this = this;
      let deadline = this.props.exer.deadline;
      $.get("/getTime",function(data){
        let now = data.now;
        let distance = deadline - now + 1000;
        var second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
        _this.state.interval = setInterval(function () {
          if (distance - 1000 <= 0) {
            clearInterval(_this.state.interval);
            const id = _this.props.exer.id;
            $.post("/setTimeoutExercises", { id }, function (data) {
              main.setState({ listExercises: data });
            })
          } else {
            distance -= 1000;
            var objDateTime = {
              ngay: Math.floor(distance / day),
              gio: Math.floor((distance % day) / hour),
              phut: Math.floor((distance % hour) / minute),
              giay: Math.floor((distance % minute) / second)
            }
            if (objDateTime.ngay < 10) objDateTime.ngay = '0' + objDateTime.ngay;
            if (objDateTime.gio < 10) objDateTime.gio = '0' + objDateTime.gio;
            if (objDateTime.phut < 10) objDateTime.phut = '0' + objDateTime.phut;
            if (objDateTime.giay < 10) objDateTime.giay = '0' + objDateTime.giay;
            _this.setState({
              day: objDateTime.ngay, hour: objDateTime.gio, minute: objDateTime.phut,
              second: objDateTime.giay
            });
          }
        }, 1000)
      })
    }
    render(){
      var _this = this;
      var submitted = JSON.parse(localStorage.getItem("submitted"));
      if (submitted==null) submitted=[];
        return(
       <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div className="blog-slider">
          <div className="blog-slider__wrp swiper-wrapper">
            <div className="blog-slider__item swiper-slide">
              <div className="blog-slider__img">
                    <ul class="countdown">
                      <li class="countdown-item"><span class="countdown-number days">{this.state.day}</span><span class="countdown-text">Ngày</span></li>
                      <li class="countdown-item"><span class="countdown-number hours">{this.state.hour}</span><span class="countdown-text">Giờ</span></li>
                      <li class="countdown-item"><span class="countdown-number minutes">{this.state.minute}</span><span class="countdown-text">Phút</span></li>
                      <li class="countdown-item"><span class="countdown-number seconds">{this.state.second}</span><span class="countdown-text">Giây</span></li>
                    </ul>
              </div>
              <div className="blog-slider__content">
                <div className="blog-slider__title">{this.props.exer.title}</div>
                <div className="blog-slider__text"><b>Hạn nộp bài: </b> {new Date(this.props.exer.deadline).toLocaleString()}</div>
                <div className="blog-slider__text"><b>Yêu cầu:</b> {this.props.exer.requirement}</div>
                {this.props.exer.file ?
               <div className="blog-slider__text">
                 <b>File tài liệu: </b><a href={this.props.exer.file.download}>Click để tải tài liệu</a><span>, </span>
                 <a href={this.props.exer.file.view} target="_blank">Click để xem tài liệu</a>
               </div> : <div></div>}
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
                (this.state.submitSuccess==0) ? <div class="alert alert-danger"><strong>Có lỗi xảy ra. Refresh và thử lại!</strong></div>  : ""}
                {submitted.findIndex(item => item == _this.props.exer.id)==-1 ?
                <button type="button" className="btn btn-danger btn-submit" onClick={this.submitExercise}>
                  {this.state.submitSuccess==2 ? <div><span class="spinner-border spinner-border-sm"></span> Đang xử lý..</div>: "Nộp bài"}
                </button> :
                <button type="button" className="btn btn-success btn-submit" disabled>Đã Nộp bài</button>}
                <h4>{this.state.urlFile!="" ? <a href={this.state.urlFile} target="_blank" class="toFile">Đi đến file của bạn</a> : ""}</h4>
              </div>
            </div>
          </div>
          <div className="blog-slider__pagination"></div>
        </div>
      </div>)
    }
}
class SingleExerciseAdmin extends React.Component {
  constructor(props){
    super(props);
    this.changeStatus = this.changeStatus.bind(this);
    this.state = {
      isChecked: this.props.exer.status,
      interval: "",
      countSubmit: this.props.exer.listSubmit.length
    }
  }
  componentDidUpdate(){
    let _this = this;
    $.get("/getTime",function(data){
      let deadline = parseInt(_this.props.exer.deadline);
      let now = data.now;
      let distance = deadline - now + 1000;
      clearInterval(_this.state.interval);
      if (distance > 0) {
        _this.state.interval = setInterval(function () {
          if (distance - 1000 <= 0) {
            clearInterval(_this.state.interval);
            const id = _this.props.exer.id;
            const token = localStorage.getItem("token");
            $.post("/api/setTimeoutExercises", { id, token }, function (data) {
              main.setState({ listExercises: data });
            })
          }
          distance -= 1000;
        }, 1000);
      }
    })
  }
  componentWillUnmount(){
    clearInterval(this.state.interval);
  }
  componentDidMount() {
    var swiper = new Swiper('.blog-slider', {
      effect: 'fade'
    });
    $('.button' + this.props.pos).click(function () {

      $(this).parent().toggleClass('animated');

      return false;
    });
    let _this = this;
    $.get("/getTime",function(data){
      let deadline = parseInt(_this.props.exer.deadline);
      let now = data.now;
      console.log(now+" "+deadline);
      let distance = deadline - now + 1000;
      clearInterval(_this.state.interval);
      if (distance <= 0) {
        const id = _this.props.exer.id;
        const token = localStorage.getItem("token");
        $.post("/api/setTimeoutExercises", { id, token }, function (data) {
          main.setState({ listExercises: data });
        })
      } else {
        _this.state.interval = setInterval(function () {
          if (distance - 1000 <= 0) {
            clearInterval(_this.state.interval);
            const id = _this.props.exer.id;
            const token = localStorage.getItem("token");
            $.post("/api/setTimeoutExercises", { id, token }, function (data) {
              main.setState({ listExercises: data });
            })
          }
          distance -= 1000;
        }, 1000);
      }
    })

    socket.on("admin-update-count-submits",function(data){
      if (_this.props.exer.id==data){
        _this.setState({countSubmit: _this.state.countSubmit+1});
      }
    })
  }
  changeStatus(e){
    this.setState({isChecked: !this.state.isChecked});
    const token = localStorage.getItem("token");
    const id = this.props.exer.id;
    const status = e.target.checked;
    $.post("/api/updateStatusExercise",{id,status,token},function(data){
      socket.emit("update-for-client-list-exercises","");
    })
  }
  edit(){
    edit.setState({exer:this.props.exer, file:this.props.exer.file});
  }
  delete(){
    deleted.setState({id: this.props.exer.id});
  }
  viewSubmits(){
    const token = localStorage.getItem("token");
    const id = this.props.exer.id;
    $.post("/api/getListSubmits",{id,token}, function(data){
      if (data.success!=0){
        submit.setState({idExercise:id,listSubmits:data});
      }
    })
  }
  render(){
    let timeoutClass = "";
    if (this.props.exer.isTimeout) timeoutClass = "deadline_timeout";
    return(
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
       <div className={"blog-slider "+timeoutClass}>
         <div className="blog-slider__wrp swiper-wrapper">
           <div className="blog-slider__item swiper-slide">
             <div className="blog-slider__img">
                <ul class="deadline_exercise">
                  <h3><b>Deadline: </b>{new Date(this.props.exer.deadline).toLocaleString()}</h3>
                </ul>
             </div>
             <div className="blog-slider__content">
               <div className="blog-slider__title">{this.props.exer.title}</div>
               <div className="blog-slider__text"><b>Yêu cầu: </b>{this.props.exer.requirement}</div>
               {this.props.exer.file ?
               <div className="blog-slider__text">
                 <b>File tài liệu: </b> <a href={this.props.exer.file.view} target="_blank">Click để xem tài liệu</a>
               </div> : ""}
                <button type="button" className="btn btn-primary btn-submit" data-toggle="modal" data-target="#modalSubmit"
                onClick={this.viewSubmits.bind(this)}>Bài đã nộp: 
                <span className="countSubmit">{" "+this.state.countSubmit}</span></button>
                <div className="button_manage">
                    <button className="btn btn-warning btnEdit" data-toggle="modal" data-target="#editExercise" onClick={this.edit.bind(this)}>
                      <i class="fa fa-pencil-square" aria-hidden="true"></i> Edit</button>
                    <button className="btn btn-danger btnDelete" data-toggle="modal" data-target="#deleteExercise" onClick={this.delete.bind(this)}>
                      <i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
                      <input type="checkbox" id={"switch"+this.props.exer.id} class="switch-input" checked={this.state.isChecked}
                      onChange={this.changeStatus}/>
                      <label for={"switch"+this.props.exer.id} class="switch"></label>
                </div>
             </div>
           </div>
         </div>
       </div>
     </div>)
  }
}
var previousState, update;
class Exercises extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          listExercises:[],
          processing: false
        }
        main = this;
    }
    componentDidUpdate(){
      if (update ==1){
         update = 0;
        return;
      }
      let _this = this;
      if (previousState!=main.props.isAdmin){
        if (main.props.isAdmin){
          const token = localStorage.getItem("token");
          $.get("/api/allExercises",{token},function(data){
            previousState = main.props.isAdmin;
            update = 0;
            _this.setState({listExercises:data});
          })
        } else {
          $.get("/getValidExercises",function(data){
            update = 0;
            previousState = main.props.isAdmin;
            _this.setState({listExercises:data});
        })
        }
      }
    }
    componentDidMount(){
      this.setState({processing:true});
      update = 1;
      var _this = this;
      const token = localStorage.getItem("token");
      if (!token){
        //cập nhật khi admin thay đổi on/off bài tập
        socket.on("client-update-list-exercises", function (receiveData) {
          if (main.props.isAdmin == false){
            localStorage.setItem(receiveData.id,"true");
            localStorage.setItem(receiveData.id+"deadline",receiveData.deadline);
            _this.setState({processing:true});
            $.get("/getValidExercises", function (data) {
              main.setState({ listExercises: data, processing:false});
            })
          }     
        })
        $.get("/getValidExercises",function(data){
          _this.setState({listExercises:data, processing:false});
      })
      } else {
        $.get("/api",{token},function(data){
          if (data.success==1){
            $.get("/api/allExercises",{token},function(data){
              _this.setState({listExercises:data, processing:false})
            })
          } else {
            socket.on("client-update-list-exercises", function (receiveData) {
              if (main.props.isAdmin == false){
                localStorage.setItem(receiveData,"true");
                _this.setState({processing:true});
                $.get("/getValidExercises", function (data) {
                  main.setState({ listExercises: data, processing:false});
                })
              } 
            })
            $.get("/getValidExercises",function(data){
            _this.setState({listExercises:data, processing:false});
          })
          }
        })
      }  
    }
    beingExer(){
      this.refs.search.value="";
      const token = localStorage.getItem("token");
      this.setState({processing:true});
      $.get("/api/beingExercises",{token},function(data){
        main.setState({listExercises:data, processing:false});
      })
    }
    allExer(){
      this.refs.search.value="";
      const token = localStorage.getItem("token");
      this.setState({processing:true});
      $.get("/api/allExercises",{token},function(data){
        main.setState({listExercises:data, processing:false});
      })
    }
    searchExer(e){
      $("#all").click();
      this.setState({processing:true});
      const value = e.target.value;
      const token = localStorage.getItem("token");
      $.post("/api/searchExercises",{token,value},function(data){
        main.setState({listExercises:data, processing:false});
      })
    }
    render(){
        return(<section id="get-started" className="padd-section text-center">
                <div className="container" data-aos="fade-up">
                    <div className="section-title text-center">
                        <h2>Danh sách bài tập</h2>
                    </div>
                {main.props.isAdmin ?
                <div className="option_box">
                    <input type="radio" id="all" class="radio-input" name="option" defaultChecked="true" onClick={this.allExer.bind(this)} value="all" ref="all"/>
                    <label for="all" class="radio-label">Tất cả</label>
                    <input type="radio" id="being" class="radio-input" name="option" onClick={this.beingExer.bind(this)} value="being" ref="being"/>
                    <label for="being" class="radio-label">Đang diễn ra</label> <br/> 
                    <div class="search-form"><i class="fa fa-search" aria-hidden="true"></i>
                    <input type="text" placeholder="Search" class="search-form__input" onChange={this.searchExer.bind(this)} ref="search"/></div>
                    <button className="btn btn-success btnAdd" data-toggle="modal" data-target="#newExercise">
                      <i class="fa fa-plus" aria-hidden="true"></i> New Exercise</button>
                </div> : <div></div>}
                {this.state.processing ? <div class="line-loading"></div> : <div></div>}
                    <div className="row">
                    {this.state.listExercises.map(function(exer,index){
                      let component;
                      if (main.props.isAdmin ? component = <SingleExerciseAdmin exer={exer} key={exer.id} pos={index}/> 
                      :  component = <SingleExercise exer={exer} key={exer.id}/>)
                      return component;
                      })} 
                      {this.state.listExercises.length==0 ? <h3 className="align-center">Hiện chưa có bài tập nào</h3> : ""}
                    </div>
                </div>
                <NewExercise/>
                <EditExercise/>
                <AllSubmition/>
                <ConfirmDelete/>
            </section>)
    }
}

export default connect(function(state){
  return {
      isAdmin: state.admin
  }
})(Exercises);