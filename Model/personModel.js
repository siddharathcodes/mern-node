const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({

    Name : {
    type : String
    },

    Age : {
    type : String
    },

    Grade : {
        type : String
    },

    Photo : {
        type : String
    } 
})

const personDetail = mongoose.model("StudentData",personSchema )
module.exports = personDetail;