const Exercises = require("../models/exercises");
const bodyParser = require("body-parser");
const multer = require('multer');
const { now } = require("jquery");
const parser = bodyParser.urlencoded({extended:false});

function getCurrentDayTime() {
    offset = "+7";
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var day = new Date(utc + (3600000*offset));
    var nowday = day.getDate().toString()+"-"+(day.getMonth()+1).toString()+"-"+day.getFullYear().toString()+" "
    +day.getHours().toString()+":"+day.getMinutes().toString();
    return nowday;
  }
function getValidExercises(res){
    Exercises.find({status:true, isTimeout:false}).sort({"id":"descending"}).exec(function(err,listExercises){
        if (!err && listExercises){
            res.send(listExercises);
        } else {
            res.send([]);
        }
    })
}
module.exports = function(app){

    // var ex = {
    //     id: new Date().getTime(),
    //     title: "Bài tập số 1",
    //     requirement: "Làm đầy đủ tất cả 4 bài",
    //     additional: "Submit file .docx hoặc .pdf",
    //     deadline: new Date("7/9/2020").getTime(),
    //     file: "",
    //     status: 1,
    //     listSubmit:[]
    // }

    // Exercises.create(ex,function(err,data){
    //     if (err) console.log(err);
    //     else console.log(data);
    // })
    app.get("/",(req,res)=> res.render("homepage"));

    var nameFile;
    var time;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "./public/upload"),
        filename: (req, file, cb) => {
            time = getCurrentDayTime();
            nameFile = time+" "+ file.originalname;
            cb(null, nameFile);
        }
    }); 

    const fileFilter = (req, file, cb) => {
        cb(null,true);
    }
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 20
        },
        fileFilter:fileFilter
    })
    app.post("/uploadFile", upload.single("fileData"), (req, res, next) => {
        if (req.fileValidationError){
            res.send({err:req.fileValidationError});
        } else {
            res.send({name:nameFile, time:time});
        }
    });

    app.get("/getValidExercises",(req,res)=>{
        getValidExercises(res);
    });

    app.post("/submitExercise",parser,(req,res)=>{
        const {idExercise,id,name,view,download} = req.body;
        const single_sumit = {id, name, view, download};
        console.log(single_sumit);
        console.log(idExercise);
        Exercises.findOneAndUpdate({id:idExercise},{$addToSet:{listSubmit:single_sumit}},function(err,data){
            if (err){
                console.log(err);
                res.json({success:0});
            } else {
                res.json({success:1});
            }
        })
    })

    app.post("/setTimeoutExercises",parser,(req,res)=>{
        const {id} = req.body;
        Exercises.findOneAndUpdate({id:id},{$set:{isTimeout:true}},function(err,data){
            if (!err && data){
                getValidExercises(res);
            }
        })
    })
}