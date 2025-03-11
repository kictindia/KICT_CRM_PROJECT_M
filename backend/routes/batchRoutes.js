const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController"); // Adjust to the path where you save the controller

// Route to add a new batch
router.post("/add", batchController.addBatch);

// Route to get all batches
router.get("/all", batchController.getAllBatches);

// Route to get a batch by ID
router.get("/get/:id", batchController.getBatchById);

// Route to get batches by Hour
router.get("/get/hour/:hour", batchController.getBatchesByHour);

// Route to get batches by Franchise
router.get("/get/franchise/:franchiseId", batchController.getBatchesByFranchise);

// Route to update a batch by ID
router.put("/update/:batchId", batchController.updateBatch);

// Route to delete a batch by ID
router.delete("/delete/:id", batchController.deleteBatch);

module.exports = router;
