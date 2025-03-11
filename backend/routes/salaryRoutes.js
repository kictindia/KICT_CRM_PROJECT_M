const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController"); // Adjust the path to your controller

// Route to add a new salary
router.post("/add", salaryController.addSalary);

// Route to get all salaries
router.get("/all", salaryController.getAllSalaries);

// Route to get a salary by ID
router.get("/get/:id", salaryController.getSalaryById);

// Route to get salaries by Month and Year
router.get("/get/month/:month/year/:year", salaryController.getSalariesByMonthAndYear);

// Route to update a salary by ID
router.put("/update/:id", salaryController.updateSalary);

// Route to delete a salary by ID
router.delete("/delete/:id", salaryController.deleteSalary);

router.get('/month/:month/:franchiseId', salaryController.getAttendanceByMonth);

router.post('/pay', salaryController.paySalary);

module.exports = router;
