var mongoose=require('mongoose')
var Schema=mongoose.Schema

var articleSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    tags:[String],
    author:String,
    likes:{type:Number,default:0},
    dislikes:{type:Number,default:0},
    comments:[{type:Schema.Types.ObjectId,ref:'Comment'}],
    userId:[{type:Schema.Types.ObjectId,ref:'User'}]
},{
    timestamps:true
})

module.exports=mongoose.model('article',articleSchema)