import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,required:true,index:true},title:{type:String,required:true},message:{type:String,required:true},type:{type:String,default:"general"},data:{type:mongoose.Schema.Types.Mixed,default:{}},isRead:{type:Boolean,default:false}},{timestamps:true});
export default mongoose.models.notification||mongoose.model("notification",schema);
