const Course = require('../models/courseModel');
const Counter = require('../models/counterModel');

// Add a new course
const addCourse = async (req, res) => {
    try {
        let counter = await Counter.findOne({ Title: `COURSE` });
        if (!counter) {
            counter = new Counter({ Title: `COURSE`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        // Generate a new student ID using the counter
        const id = `COU${counter.Count}`;
        const {
            CourseId,
            Category,
            CourseName,
            CourseDescription,
            CourseDuration,
            FranchiseId,
            State
        } = req.body;

        // Create a new course document
        const newCourse = new Course({
            CourseId:id,
            Category,
            CourseName,
            CourseDescription,
            CourseDuration,
            Syllabus: [{
                Title: "",
                Topics: []
            }],
            Content: [{
                Title: "",
                Topics: [{
                    TopicName: "",
                    VideoLink: ""
                }]
            }],
            Price: {
                BaseFee: 0,
                Plans: [
                    {
                        PlanName: "One Times",
                        TotalFee: 0,
                        Installment: [0]
                    },
                    {
                        PlanName: "Two Times",
                        TotalFee: 0,
                        Installment: [0, 0]
                    },
                    {
                        PlanName: "Three Times",
                        TotalFee: 0,
                        Installment: [0, 0, 0]
                    }
                ]
            },
            FranchiseId,
            State
        });

        // Save the course to the database
        await counter.save();
        await newCourse.save();

        res.status(201).json({
            message: 'Course added successfully!',
            data: newCourse
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get course by CourseId
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({ CourseId: req.params.CourseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update course by CourseId
const updateCourse = async (req, res) => {
    try {
        const { CourseId } = req.params;

        // Find and update the course by CourseId
        const updatedCourse = await Course.findOneAndUpdate(
            { CourseId },
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({
            message: 'Course updated successfully',
            data: updatedCourse
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete course by CourseId
const deleteCourse = async (req, res) => {
    try {
        const { CourseId } = req.params;

        // Find and delete the course by CourseId
        const course = await Course.findOneAndDelete({ CourseId });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(204).send(); // Successfully deleted, no content to return
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};
