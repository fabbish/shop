const {Schema, model} = require("mongoose");

const course = new Schema({
    title: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    img: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

course.method('toClient', function() {
    const Course = this.toObject();

    Course.id = Course._id;
    delete Course._id;
    return Course;
})

module.exports = model('Course', course);