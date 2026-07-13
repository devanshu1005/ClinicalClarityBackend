const mongoose = require('mongoose');

const doctorReviewSchema = new mongoose.Schema(
{
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },

    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },

    review:{
        type:String,
        trim:true,
        default:""
    }

},
{
    timestamps:true
});

doctorReviewSchema.index(
{
    appointmentId:1
},
{
    unique:true
});

module.exports = mongoose.model(
    "DoctorReview",
    doctorReviewSchema
);