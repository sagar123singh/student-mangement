const mongoose= require("mongoose")
const studentSchema= new mongoose.Schema({
    firstName:{type:String,trim:true,required:true},
    lastName:{type:String,trim:true,required:true},
    schoolName:{type:String,trim:true,required:true},
    email:{type:String,trim:true,required:true,unique:true},
    mobile:{type:Number,trim:true,required:true,unique:true},
    password:{type:String,trim:true,required:true},
  //  photo:{type:String,required:true},
  assignment:{type:String}
},{timestamps:true})
module.exports=mongoose.model("student",studentSchema)