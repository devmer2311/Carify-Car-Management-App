const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: { type: String, required: true , unique: true},
    description: { type: String },
    tags: [{ type: String }],
    images: [{ type: String }], 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
