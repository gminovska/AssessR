var mongoose = require('mongoose');

var resourceSchema = new mongoose.Schema({
    name: String,
    image: String,
    type: String,
    author: String,
    description: String,
    addedBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    dateAdded: {
        type: Date,
        default: Date.now    
    }
})

module.exports = mongoose.model("Resource", resourceSchema);