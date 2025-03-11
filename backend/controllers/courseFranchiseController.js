const CourseFranchise = require('../models/courseFranchiseModel');

// Function to add or update course data
const addCourseFranchise = async (req, res) => {
    try {
        // Destructuring the data from the request body
        const { FranchiseId, FranchiseName, CourseData } = req.body;

        // Check if FranchiseId already exists
        const existingFranchise = await CourseFranchise.findOne({ FranchiseId });

        if (existingFranchise) {
            // If FranchiseId exists, push new CourseData into the existing array
            existingFranchise.CourseData.push(...CourseData);

            // Save the updated franchise data
            await existingFranchise.save();
            
            return res.status(200).json({
                message: "Course data successfully added to existing franchise.",
                data: existingFranchise
            });
        } else {
            // If FranchiseId does not exist, create a new franchise record
            const newFranchise = new CourseFranchise({
                FranchiseId,
                FranchiseName,
                CourseData
            });

            // Save the new franchise data
            await newFranchise.save();

            return res.status(201).json({
                message: "New franchise and course data added successfully.",
                data: newFranchise
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error adding course data",
            error: error.message
        });
    }
};

// Get all franchise and course data
const getAllCourseFranchises = async (req, res) => {
    try {
        const franchiseRecords = await CourseFranchise.find();
        res.status(200).json(franchiseRecords);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get franchise and course data by FranchiseId
const getCourseFranchiseById = async (req, res) => {
    try {
        const { FranchiseId } = req.params;
        const franchise = await CourseFranchise.findOne({ FranchiseId });

        if (!franchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }

        res.status(200).json(franchise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update franchise and course data
const updateCourseFranchise = async (req, res) => {
    const { CourseId } = req.params;

    try {
        // Find the franchise by FranchiseId and update
        const updatedFranchise = await CourseFranchise.findOneAndUpdate(
            { CourseId },
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedFranchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }

        res.status(200).json({
            message: 'Franchise and course data updated successfully',
            data: updatedFranchise
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const updateCourseFee = async (req, res) => {
    try {
        const { fran, CourseId } = req.params; // Get FranchiseId and CourseId from route parameters
        const { Price } = req.body; // Get the updated Price data from the request body

        // Find the franchise by FranchiseId
        const franchise = await CourseFranchise.findOne({
            FranchiseId: fran, // Match by the FranchiseId
            'CourseData.CourseId': CourseId // Match by the CourseId inside CourseData
        });

        if (!franchise) {
            return res.status(404).json({
                message: "Franchise or course not found"
            });
        }

        // Find the specific course by CourseId
        const course = franchise.CourseData.find(course => course.CourseId === CourseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Update the course's Price data (specifically the Plans)
        if (Price && Price.Plans) {
            course.Price.Plans = Price.Plans; // Update Plans in the course's Price
        }

        // Save the updated franchise document with the new course data
        await franchise.save();

        return res.status(200).json({
            message: "Course fee data updated successfully",
            data: course
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error updating course fee data",
            error: error.message
        });
    }
};

// Delete franchise and course data
const deleteCourseFranchise = async (req, res) => {
    const { FranchiseId } = req.params;

    try {
        const franchise = await CourseFranchise.findOneAndDelete({ FranchiseId });

        if (!franchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }

        res.status(204).send(); // Successfully deleted, no content to send back
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addCourseFranchise,
    getAllCourseFranchises,
    getCourseFranchiseById,
    updateCourseFee,
    updateCourseFranchise,
    deleteCourseFranchise
};
