var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var Schema=mongoose.Schema


var userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    age:{type:Number},
    phone:{type:Number},
},{
    timestamps:true
})

userSchema.pre('save',function(next){
    // this is refer mongoose database
    console.log(this)
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashed)=>{
            if(err)return next(err)
            this.password=hashed
            return next()
        })
    }else{
        return next()
    }
})

module.exports=mongoose.model('User',userSchema)