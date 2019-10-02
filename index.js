const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((error) => console.error('Could not connect to MongoDB...', error));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const result = v && v.length > 0;
                        resolve(result);
                    }, 4000);
                });

            },
            message: 'A course should have at least one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });

    try {
        const result = await course.save();
        console.log(result);
    }
    catch (exception) {
        for (field in exception.errors) {
            console.log(exception.errors[field]);
        }
    }

}
createCourse();

async function getCourses() {
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .limit(10)
        .sort({ name: 1 }) 
        .countDocuments()
    console.log(courses);
}

getCourses();

async function updateCourse(id) {
    const course = await Course.findById(id);
    if (!course) return;

    course.isPublished = true;
    course.author = 'Another author1';
    const result = await course.save();
    console.log(result);
}
// updateCourse('5d8f34e9ce6d060451f47b65');

async function updateCourse2(id) {

    const result = await Course.updateOne({ _id: id }, {
        $set: {
            author: 'Artem',
            isPublished: false
        }
    });
    console.log(result);
}
updateCourse2('5d8f34e9ce6d060451f47b65');

async function removeCourse(id) {

    const result = await Course.deleteOne({ _id: id })
    console.log(result);
}
removeCourse('5d8f34e9ce6d060451f47b65');
