
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    //object, to access, use comment.author.id, comment.author.username
    author : {
        id:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username: String
    }
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;