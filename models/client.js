const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const msgSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    senderUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recieverUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', msgSchema)