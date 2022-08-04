import mongoos from "mongoose";

const CommentSchema = new mongoos.Schema({
 
    userId:{
        type:String,
        required:true,
    },
    videoId:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },

},{timestamps:true});

export default mongoos.model("Comment",CommentSchema);