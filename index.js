const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const jwt = require("jsonwebtoken");
const homeController = require("./api/controllers/homeController");
const adminController = require("./api/controllers/adminController");
const driveController = require("./api//controllers/driveController");
const socketController = require("./api/controllers/socketController");
const PORT = process.env.PORT|| 3000;
app.set("view engine","ejs");

app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,FETCH');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization,x-access-token');
  next();
});

mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost:27017/mExercises",{useNewUrlParser:true});
mongoose.connect("mongodb+srv://thanhgiau2604:ntgspkt2604@cluster0.uiqaq.mongodb.net/mExercises?retryWrites=true&w=majority");
mongoose.set('useCreateIndex',true);
let apiRouter = express.Router();

app.use("/api",apiRouter);
homeController(app);
adminController(app,jwt,apiRouter);
driveController(app);
socketController(app,io);

app.use(express.static(__dirname+"/public"));
server.listen(PORT, ()=> console.log("App listening on PORT "+PORT));