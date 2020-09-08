import React from 'react'
import $ from 'jquery'
import {connect} from 'react-redux'
var main;
class LoginForm extends React.Component {
    constructor(props){   
        super(props);
        this.state = {
            err:""
        }
    }
    loginInClick(){
        document.getElementById("header").style.height="100%";
        document.getElementById("login-toggle").style.backgroundColor="#57B846";
        document.getElementById("login-toggle").style.color="#fff";
        document.getElementById("signup-toggle").style.backgroundColor="#fff";
        document.getElementById("signup-toggle").style.color="#222";
        document.getElementById("signup-form").style.display="none";
        document.getElementById("login-form").style.display="block";
    }
    signUpClick(){
        document.getElementById("header").style.height="100%";
        document.getElementById("login-toggle").style.backgroundColor="#fff";
        document.getElementById("login-toggle").style.color="#222";
        document.getElementById("signup-toggle").style.backgroundColor="#57b846";
        document.getElementById("signup-toggle").style.color="#fff";
        document.getElementById("login-form").style.display="none";
        document.getElementById("signup-form").style.display="block";
    }
    login(){
        let that = this;
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        if (username.trim()=="" || password.trim()==""){
            this.setState({err:"Không được bỏ trống username hoặc password"});
        } else {
            this.setState({err:""});
            $.post("/login",{username,password},function(data){
                if (data.success==0){
                    that.setState({err:data.err});
                } else {
                    main.setState({showLogin: false});
                    document.getElementById("header").style.height="auto";
                    localStorage.setItem("username",data.user.username);
                    localStorage.setItem("token",data.token);
                    let {dispatch} = main.props;
                    dispatch({type:"UPDATE_STATE_ADMIN",newState:true});
                }
            })
        }
    }
    render(){
        return(<div className="form-modal">
        <div className="form-toggle">
          <button id="login-toggle" onClick={this.loginInClick.bind(this)}>log in</button>
          <button id="signup-toggle" onClick={this.signUpClick.bind(this)}>sign up</button>
        </div>
        <div id="login-form">
          <form>
            <input type="text" placeholder="Enter username" required ref="username"/>
            <input type="password" placeholder="Enter password" required ref="password"/>
            <button type="button" className="btn login" onClick={this.login.bind(this)}>login</button>
            {this.state.err ? <h4 style={{color:"red", paddingTop:"5px"}} className="text-center">{this.state.err}</h4> : "" }
          </form>
        </div>
        <div id="signup-form">
          <form>
            <input type="text" placeholder="Enter your name" />
            <input type="text" placeholder="Choose username" />
            <input type="password" placeholder="Create password" />
            <button type="button" className="btn signup">create account</button>
            <p>Clicking <strong>create account</strong> means that you are agree to our <a href="javascript:void(0)">terms of services</a>.</p>
            <hr />
          </form>
        </div>
      </div>)
    }
}
class UpdatePassword extends React.Component {
    constructor(props){   
        super(props);
        this.state = {
            err:""
        }
    }
    updatePassword(){
        var _this = this;
        const password = this.refs.password.value;
        const repassword = this.refs.repassword.value;
        if (password.trim()=="" || repassword.trim()==""){
            this.setState({err:"Bạn không được bỏ trống!"});
        } else 
        if (password!=repassword){
            this.setState({err:"Mật khẩu không khớp!"});
        } else {
            const username = localStorage.getItem("username");
            const token = localStorage.getItem("token");
            $.post("/api/updatePassword",{username:username,password:password, token:token},function(data){
                if (data.success==0){
                    _this.setState({err: "Có lỗi xảy ra. Vui lòng thử lại!"});
                } else {
                    main.setState({showChangePassword:false});
                    document.getElementById("header").style.height="auto";
                }
            })
        }
    }
    render(){
        return(<div className="form-modal">
        <div className="form-toggle">
          <button id="login-toggle">Update Password</button>
        </div>
        <div id="login-form">
          <form>
            <input type="password" placeholder="Enter new password" required ref="password"/>
            <input type="password" placeholder="Enter repeat new password" required ref="repassword"/>
            <button type="button" className="btn login"  onClick={this.updatePassword.bind(this)}>Update</button>
            {this.state.err ? <h4 style={{color:"red", paddingTop:"5px"}} className="text-center">{this.state.err}</h4> : "" }
          </form>
        </div>
      </div>)
    }
}
class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showLogin: false,
            showChangePassword: false
        }
        this.showLogin = this.showLogin.bind(this);
        main = this;
    }
    showLogin(){
        if (this.state.showLogin){
            document.getElementById("header").style.height="auto";
        } else {
            document.getElementById("header").style.height="100%";
            this.setState({changePassword:false});
        }
        this.setState({showLogin:!this.state.showLogin});
    }
    changePassword(){
        if (this.state.showChangePassword){
            document.getElementById("header").style.height="auto";
        } else {
            document.getElementById("header").style.height="100%";
            this.setState({showLogin:false});
        }
        this.setState({showChangePassword:!this.state.showChangePassword});
    }
    logout(){
        main.setState({showChangePassword:false});
        document.getElementById("header").style.height="auto";
        localStorage.clear();
        let {dispatch} = main.props;
        dispatch({type:"UPDATE_STATE_ADMIN",newState:false});
    }
    componentWillMount(){
        let that = this;
        const token = localStorage.getItem("token");
        var {dispatch} = main.props;
        if (!token){
            dispatch({type:"UPDATE_STATE_ADMIN",newState:false});
        } else {
            $.get("/api",{token:token},function(result){
                if (result.success!=1){
        	        dispatch({type:"UPDATE_STATE_ADMIN",newState:false});
                } else {
                    that.setState({isAdmin:true});
        	        dispatch({type:"UPDATE_STATE_ADMIN",newState:true});
                }
            })
        }
    }
    render(){
        return(
            <header id="header" className="header">
                <div className="container">
                    <div id="logo" className="pull-left">
                        <h1><a href="/"><span>m</span>Exercises</a></h1>
                    </div>
                    <nav id="nav-menu-container">
                        <ul className="nav-menu">
                            {main.props.isAdmin ? <li className="menu-active"><a className="btn-get-started" onClick={this.changePassword.bind(this)}>Đổi mật khẩu</a></li> :""}
                            {!main.props.isAdmin ? 
                            <li className="menu-active"><a className="btn-get-started" onClick={this.showLogin}>LOGIN</a></li>:
                            <li className="menu-active"><a className="btn-get-started" onClick={this.logout.bind(this)}>Đăng xuất</a></li>}
                        </ul>
                    </nav>
                </div>
                {this.state.showLogin ? <LoginForm/> : ""}
                {this.state.showChangePassword ? <UpdatePassword/> : ""}
            </header>)
    }
}

export default connect(function(state){
    return {
        isAdmin: state.admin
    }
})(Header);