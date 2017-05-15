var mongoose = require('mongoose');

var resourceSchema = new mongoose.Schema({
    name: String,
    image: String,
    type: String,
    author: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports = mongoose.model("Resource", resourceSchema);