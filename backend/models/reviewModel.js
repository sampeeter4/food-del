import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true,index:true},orderId:{type:mongoose.Schema.Types.ObjectId,ref:"order",required:true},restaurantId:{type:mongoose.Schema.Types.ObjectId,ref:"restaurant",required:true,index:true},foodId:{type:mongoose.Schema.Types.ObjectId,ref:"food"},rating:{type:Number,required:true,min:1,max:5},comment:{type:String,default:"",maxlength:1000},isVisible:{type:Boolean,default:true}},{timestamps:true});
schema.index({userId:1,orderId:1},{unique:true});
export default mongoose.models.review||mongoose.model("review",schema);
