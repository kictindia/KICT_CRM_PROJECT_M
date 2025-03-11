const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController"); // Adjust path as necessary

// Login route (POST for login authentication)
router.post("/login", loginController.login);

// Get user by ID (GET)
router.get("/get/:id", loginController.getById);

// Get all users (GET)
router.get("/all", loginController.getAll);

// Delete user by ID (DELETE)
router.delete("/delete/:id", loginController.delete);

router.put("/:id/change-password", loginController.changePassword);

// Update user (PUT)
router.put("/update/:id", loginController.put);

module.exports = router;
