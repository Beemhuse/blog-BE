const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL of the image
        required: false
    },
    author: {
        type: String, // Name of the author
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);
