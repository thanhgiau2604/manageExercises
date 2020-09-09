const Users = require("../models/users");
const Exercises = require("../models/exercises");
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
const time_exprired = "8h";
function getAllExercises(res){
    Exercises.find({isDelete:0}).sort({"id":"descending"}).exec(function(err,result){
        if (!err&&result){
            res.send(result);
        } else res.send([]);
    })
}

module.exports = function(app, jwt, apiRouter){
    var superSecret = 'phuthanhschool';
    // var user = {
    //     name: "Thuy Nguyen",
    //     username: "manguyen107",
    //     password: "1234567890"
    // }
    // Users.create(user)
    app.post("/login",parser,(req,res)=>{
        let {username,password} = req.body;
        username = username.toString().trim().toLowerCase();
        Users.findOne({username:username},function(err,user){
            if (err){
                res.json({success:0, err: "Có lỗi xảy ra!"});
            } else {
                if (!user) {
                    res.json({success:0, err: "Không đúng username hoặc password!"})
                } else {
                    let validPassword = user.comparePassword(password);
                    if (!validPassword) {
                        res.json({success: 0, err: "Không đúng username hoặc password!"});
                    } else {
                        let token = jwt.sign({
                            name: user.name,
                            username: user.username
                        }, superSecret, {
                            expiresIn: time_exprired
                        });
                        res.json({success:1,user:user,token:token});
                    }
                }
                
            }
        })
    })
    apiRouter.use(parser,function(req,res,next){
        let token = req.query.token || req.params.token || req.body.token;
        if (token){
            jwt.verify(token,superSecret,function(err,decoded){
                if (err){
                    return res.json({success:0,message:'Failed to authenticate token'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            return res.json({success:0});
        }
    });
    apiRouter.get("/",(req,res)=>res.json({success:1}));
    apiRouter.post("/updatePassword",parser,(req,res)=>{
        const {username, password} = req.body;
        Users.update({username:username},{$set:{password:password}},{new:true},function(err,data){
            if (err){
                res.json({success:0})
            } else {
                res.json({success:1, user:data})
            }
        })
    })
    apiRouter.post("/saveExercise",parser,(req,res)=>{
        let {id,title,requirement,deadline,name,view,download} = req.body;
        const status = false;
        const listSubmit = [];
        const isDelete = 0;
        deadline = new Date(deadline).getTime();
        const isTimeout =  (deadline - new Date().getTime()) <= 0;
        const singleExercise = {id,title,requirement,deadline,status,listSubmit,isDelete,
        file: {id,name,view,download}, isTimeout}
        Exercises.create(singleExercise,function(err,data){
            if (!err&&data){
                getAllExercises(res);
            }
        })
    });
    apiRouter.get("/allExercises",(req,res)=>{
        getAllExercises(res);
    });
    apiRouter.post("/updateExercise",parser,(req,res)=>{
        const {id,title,requirement,name, view, download} = req.body;
        const file = {name, view, download};
        const deadline = new Date(parseInt(req.body.deadline)).getTime();
        const isTimeout = deadline - new Date().getTime() <= 0;
        Exercises.findOneAndUpdate({id:id},{$set:{
            title:title, requirement:requirement,deadline:deadline,file:file, isTimeout:isTimeout
        }},{new:true},function(err,data){
            if (err){
                res.json({success:0});
            } else {
                getAllExercises(res);
            }
        })
    });
    apiRouter.post("/updateStatusExercise",parser,(req,res)=>{
        const {id,status} = req.body;
        Exercises.findOneAndUpdate({id:id},{$set:{status:status}},{new:true},function(err,data){
            if (!err && data){
                getAllExercises(res);
            }
        })
    });
    apiRouter.post('/deleteExercise',parser,(req,res)=>{
        const {id} = req.body;
        Exercises.findOneAndUpdate({id:id},{$set:{isDelete:1}},{new:true},function(err,data){
            if (err){
                res.json({success:0})
            } else {
                getAllExercises(res);
            }
        })
    })
    apiRouter.post("/setTimeoutExercises",parser,(req,res)=>{
        const {id} = req.body;
        Exercises.findOneAndUpdate({id:id},{$set:{isTimeout:true}},function(err,data){
            if (!err && data){
                getAllExercises(res);
            }
        })
    })
    apiRouter.post("/getListSubmits",parser,(req,res)=>{
        const {id} = req.body;
        Exercises.findOne({id:id},function(err,data){
            if (err){
                res.json({success:0});
            } else {
                res.send(data.listSubmit);
            }
        })
    })
    apiRouter.get("/beingExercises",parser,(req,res)=>{
        Exercises.find({status:true,isTimeout:false}).sort({"id":"descending"}).exec(function(err,result){
            if (err){
                res.send([]);
            } else {
                res.send(result);
            }
        })
    })
    apiRouter.post("/searchExercises",parser,(req,res)=>{
        const {value} = req.body;
        Exercises.find({title: {$regex : ".*"+value+".*",'$options' : 'i' }},function(err,data){
            if (err){
                throw err;
            } else {
                if (data.length==0){
                    Exercises.find({$text:{$search:value}},function(err,data){
                        if (err){
                            throw err;
                        } else {
                            res.send(data);
                        }
                    })
                } else {
                    res.send(data);
                }
            }
        })
    })
}