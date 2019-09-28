const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((error) => console.error('Could not connect to MongoDB...', error));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    // COMPARISON OPERATORS:
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater then or equal to)
    // lt (less then)
    // lte (less then or equal to)
    // in 
    // nin (not in)

    //EXAMPLES: 
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ price: { $in: [10, 15, 20] } })

    // LOGICAL OPERATORS:
    // or
    // and

    //EXAMPLES: 
    // .find()
    // .or([ { author: 'Mosh' }, { isPublished: true } ])
    // .and([ { author: 'Mosh' }, { isPublished: true } ])

    //REGULAR EXPRESSIONS:
    //Starts with Mosh
    // .find({ author: /^Mosh/ }) ^ - start of the string

    //Starts with Hamedani
    // .find({ author: /Hamedani$/i }) $ - end of the string, i - case insensitive

    //Contains Mosh
    // .find({ author: /.*Mosh.*/i }) - .* - zero or more characters.

    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .limit(10)
        .sort({ name: 1 }) //1: ascending, -1: descending
        .count()
        // .select({ name: 1, tags: 1 });
    console.log(courses);
}

getCourses();
// createCourse();
