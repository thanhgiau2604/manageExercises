const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

//user schema
const ExerciseSchema = new Schema({
    id: Number,
    title: String,
    requirement: String,
    deadline: Number,
    file: {name:String, view:String, download: String},
    status: Boolean,
    listSubmit: [
        {
            id: String, name: String, view: String, download: String
        }
    ],
    isDelete: Number,
    isTimeout: Boolean
});

module.exports = mongoose.model('Exercises',ExerciseSchema);