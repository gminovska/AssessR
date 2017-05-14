var mongoose = require('mongoose');

var resourceSchema = new mongoose.Schema({
    name: String,
    image: String,
    type: String,
    author: String,
    description: String
})

module.exports = mongoose.model("Resource", resourceSchema);