const Login = require("../models/loginModel"); // Adjust the path to your actual model

// Controller for handling login actions
const loginController = {
    // Login
    async login(req, res) {
        try {
            const { Id, Password } = req.body;
    
            // Convert Id to lowercase for case-insensitive comparison
            const normalizedId = Id.toLowerCase();
    
            // Find the user by Id (making sure the stored Id is also compared in lowercase)
            const user = await Login.findOne({ Id: { $regex: new RegExp(`^${normalizedId}$`, 'i') } });
    
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
    
            // Validate the password (assuming it's stored hashed and you are using a library like bcrypt for secure comparison)
            if (user.Password !== Password) {
                return res.status(400).json({ message: "Incorrect password" });
            }
    
            // Successful login
            return res.status(200).json({
                message: "Login successful",
                Data: {
                    Id: user.Id,
                    Role: user.Role, // Return the role
                    // Add other user details here if needed
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },


    // Get user by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            const user = await Login.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // Get all users
    async getAll(req, res) {
        try {
            const users = await Login.find();
            return res.status(200).json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // Delete user by ID
    async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await Login.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async changePassword(req, res) {
        try {
            const { id } = req.params; // Assuming the user ID is passed as a URL parameter
            const { currentPassword, newPassword } = req.body;

            // Find the user by ID
            const user = await Login.findOne({ Id: id });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Validate the current password
            if (user.Password !== currentPassword) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            // Update the password
            user.Password = newPassword;
            await user.save();

            return res.status(200).json({ message: "Password changed successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // Update user by ID
    async put(req, res) {
        try {
            const { id } = req.params;
            const { Email, Password, Role } = req.body;

            // Find and update the user
            const user = await Login.findByIdAndUpdate(id, { Email, Password, Role }, { new: true });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "User updated successfully", user });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = loginController;
