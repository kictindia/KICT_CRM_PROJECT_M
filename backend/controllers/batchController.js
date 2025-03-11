const BatchModel = require("../models/batchModels");

// Add a new batch
const addBatch = async (req, res) => {
    try {
        const { FranchiseId, Hour, Slots } = req.body;
        console.log(req.body)
        const newBatch = new BatchModel({ FranchiseId, Hour, Slots });
        await newBatch.save();
        res.status(201).json({ message: "Batch added successfully", batch: newBatch });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error adding batch", error: err });
    }
};

// Get all batches
const getAllBatches = async (req, res) => {
    try {
        const batches = await BatchModel.find();
        res.status(200).json(batches);
    } catch (err) {
        res.status(500).json({ message: "Error fetching batches", error: err });
    }
};

// Get a batch by ID
const getBatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const batch = await BatchModel.findById(id);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json(batch);
    } catch (err) {
        res.status(500).json({ message: "Error fetching batch", error: err });
    }
};

// Get batches by Hour
const getBatchesByHour = async (req, res) => {
    try {
        const { hour } = req.params;
        const batches = await BatchModel.find({ Hour: hour });
        if (batches.length === 0) {
            return res.status(404).json({ message: "No batches found for this hour" });
        }
        res.status(200).json(batches);
    } catch (err) {
        res.status(500).json({ message: "Error fetching batches by hour", error: err });
    }
};

// Get batches by Hour
const getBatchesByFranchise = async (req, res) => {
    try {
        const { franchiseId } = req.params;
        const batches = await BatchModel.findOne({ FranchiseId: franchiseId });
        if (batches.length === 0) {
            return res.status(404).json({ message: "No batches found for this hour" });
        }
        res.status(200).json(batches);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error fetching batches by hour", error: err });
    }
};

// Update a batch by ID
// const updateBatch = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { Hour, Slots } = req.body;

//         const updatedBatch = await Batch.findByIdAndUpdate(
//             id,
//             { Hour, Slots },
//             { new: true } // This returns the updated document
//         );
//         if (!updatedBatch) {
//             return res.status(404).json({ message: "Batch not found" });
//         }
//         res.status(200).json({ message: "Batch updated successfully", batch: updatedBatch });
//     } catch (err) {
//         res.status(500).json({ message: "Error updating batch", error: err });
//     }
// };
const updateBatch = async (req, res) => {
    const { batchId } = req.params;
    const { FranchiseId, Batch } = req.body; // Assuming this data is passed from the client

    try {
        var temp = await BatchModel.findById(batchId);
        console.log(temp);
        // Find the batch by ID and update the data
        const updatedBatch = await BatchModel.findByIdAndUpdate(
            batchId,
            { FranchiseId, Batch },
            { new: true } // Return the updated document
        );

        if (!updatedBatch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        return res.status(200).json(updatedBatch);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// Delete a batch by ID
const deleteBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBatch = await BatchModel.findByIdAndDelete(id);
        if (!deletedBatch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json({ message: "Batch deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting batch", error: err });
    }
};

module.exports = {
    addBatch,
    getAllBatches,
    getBatchById,
    getBatchesByHour,
    getBatchesByFranchise,
    updateBatch,
    deleteBatch,
};
