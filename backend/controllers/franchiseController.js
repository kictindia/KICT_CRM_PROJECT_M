const Franchise = require('../models/franchiseModel');
const Counter = require('../models/counterModel');
const Login = require('../models/loginModel');
const BatchModel = require('../models/batchModels');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');


const sendRegistrationEmail1 = async (receiver, OwnerName, Id, Password) => {
    const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                    }
    
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
    
                    h1 {
                        text-align: center;
                        color: #007bff;
                    }
    
                    p {
                        line-height: 1.6;
                    }
    
                    .footer {
                        font-size: 0.9em;
                        color: #777;
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Thank You For Registering at Blossobit</h1>
                    <p>Dear ${OwnerName},</p>
                    <p>Thank you for registering at Blossobit. We are thrilled to have you join our institution and look forward to
                        seeing you in our classes. Below are your registration details:</p>
    
                    <p><strong>Login ID:</strong> ${Id}</p>
                    <p><strong>Password:</strong> ${Password}</p>
    
                    <p>Thank you once again for choosing Blossobit. We wish you all the best in your academic journey.</p>
                    <p>Best regards,<br>The Blossobit Team</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Blossobit. All rights reserved.
                </div>
            </body>
        </html>
    `;

    // Configure nodemailer to send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'codifyinstitute@gmail.com',
            pass: 'sbhhkkayvzvbnqtw' // Use an app-specific password
        }
    });

    const mailOptions = {
        from: 'codifyinstitute@gmail.com',
        to: receiver,
        subject: 'Registration Successfully Completed',
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Get all franchises
const getAllFranchises = async (req, res) => {
    try {
        const franchises = await Franchise.find();
        // console.log(moment().format('YY'))
        res.status(200).json(franchises);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get franchise by FranchiseID
const getFranchiseById = async (req, res) => {
    try {
        const franchise = await Franchise.findOne({ FranchiseID: req.params.FranchiseID });
        if (!franchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }
        res.status(200).json(franchise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
function generateTimeSlots(startTime, endTime, slotDuration) {
    // Helper function to convert time in "HH:MM AM/PM" format to minutes since midnight
    function timeToMinutes(timeStr) {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) {
            hours += 12; // Convert PM to 24-hour time
        } else if (modifier === "AM" && hours === 12) {
            hours = 0; // Midnight is 00:00
        }
        return hours * 60 + minutes;
    }

    // Helper function to convert minutes back to "HH:MM AM/PM" format
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const modifier = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 === 0 ? 12 : hours % 12; // 12-hour format
        const displayMinutes = mins < 10 ? "0" + mins : mins;
        return `${displayHours}:${displayMinutes} ${modifier}`;
    }

    // Convert start and end times to minutes since midnight
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Define the result array to hold the time slots
    const timeSlots = [];

    // Loop through the times from start to end, generating slots
    for (let currentStart = startMinutes; currentStart < endMinutes; currentStart += slotDuration) {
        const currentEnd = currentStart + slotDuration;

        // If the current end time exceeds the specified end time, stop generating slots
        if (currentEnd > endMinutes) break;

        // Convert the current start and end times to "HH:MM AM/PM" format
        const startSlot = minutesToTime(currentStart);
        const endSlot = minutesToTime(currentEnd);

        // Format the time slot as "Start Time - End Time"
        timeSlots.push(`${startSlot.split(" ")[0]} ${startSlot.split(" ")[1]} - ${endSlot.split(" ")[0]} ${endSlot.split(" ")[1]}`);
    }

    return timeSlots;
}

const getSlot = (startTime, endTime, FranchiseID, FranchiseName) => {
    const oneHourSlots = generateTimeSlots(startTime, endTime, 60);
    const twoHourSlots = generateTimeSlots(startTime, endTime, 120);
    const threeHourSlots = generateTimeSlots(startTime, endTime, 180);
    return {
        FranchiseName: FranchiseName,
        FranchiseId: FranchiseID,
        Batch: [
            {
                Hour: "1 Hour",
                Slots: oneHourSlots.map((slot) => {
                    return { SlotTime: slot, Students: [] }
                })
            },
            {
                Hour: "2 Hour",
                Slots: twoHourSlots.map((slot) => {
                    return { SlotTime: slot, Students: [] }
                })
            },
            {
                Hour: "3 Hour",
                Slots: threeHourSlots.map((slot) => {
                    return { SlotTime: slot, Students: [] }
                })
            }
        ]
    }
}
// Generate slots with 1 hour interval
const passwordGenerator = () => {
    var num = Math.floor(Math.random() * 9000) + 1000
    return "KICT" + num;
}

// Add a new franchise
const addFranchise = async (req, res) => {
    try {
        const { FranchiseName, OwnerName, UPIId, Email, MobileNo, Address, State, StateCode, City, Area, Pincode, HeadOffice, OpenTime, CloseTime } = req.body;
        var role = (HeadOffice === "true" ? "HO" : "B")
        // Get the current month and year for FranchiseID
        const month = moment().format('MM');
        const year = moment().format('YYYY');

        // Find the current counter for the given year and month
        let counter = await Counter.findOne({ Title: `KICT${StateCode}${City.toUpperCase().slice(0, 2)}${role}` });

        // If counter doesn't exist for the month, initialize it
        if (!counter) {
            counter = new Counter({ Title: `KICT${StateCode}${City.toUpperCase().slice(0, 2)}${role}`, Count: 1 });
        } else {
            // Increment the count
            counter.Count += 1;
        }

        // Generate FranchiseID using the Role, Year, Month, and Counter count
        const FranchiseID = `KICT${StateCode}${City.toUpperCase().slice(0, 2)}${role}${counter.Count}`;
        const Password = passwordGenerator();


        // Get the image filename from the Multer uploaded file
        const image = req.file ? req.file.filename : null;

        // Create the new franchise document
        const newFranchise = new Franchise({
            FranchiseID,
            FranchiseName,
            OwnerName,
            UPIId,
            UPICode: image,
            Email,
            MobileNo,
            Address,
            State,
            City,
            Area,
            Pincode,
            HeadOffice,
            OpenTime,
            CloseTime,
            Date: moment().tz("Asia/Kolkata").format('YYYY-MM-DD')
        });

        var batchData = getSlot(OpenTime, CloseTime, FranchiseID, FranchiseName)
        const newBatch = new BatchModel(batchData);
        // console.log(batchData)
        // console.log(newBatch)
        var rule = (HeadOffice === "true" ? "HeadOffice" : "Franchise")
        const newUser = new Login({ Id: FranchiseID, Password: Password, Role: rule });

        // Save the counter and franchise
        await newFranchise.save();
        await counter.save();
        await newUser.save();
        await newBatch.save();
        sendRegistrationEmail1(Email, OwnerName, FranchiseID, Password);
        res.status(201).json(newFranchise);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

const updateFranchise = async (req, res) => {
    try {
        const { FranchiseID } = req.params;
        console.log(req.file)

        // Find the franchise by FranchiseID
        const franchise = await Franchise.findOne({ FranchiseID });

        if (!franchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }

        // Initialize updated data with the request body
        const updatedData = { ...req.body };

        // If the UPI image (UPICode) is uploaded, update the field with the file path
        if (req.file && req.file.filename) {
            console.log(1)
            updatedData.UPICode = req.file.filename; // Store the path of the uploaded file
        }

        // Update the franchise with the new data
        const updatedFranchise = await Franchise.findOneAndUpdate(
            { FranchiseID },
            updatedData,
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Franchise data updated successfully',
            updatedFranchise
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};




// Delete franchise
const deleteFranchise = async (req, res) => {
    try {
        const { FranchiseID } = req.params;
        const franchise = await Franchise.findOneAndDelete({ FranchiseID });
        const batch = await BatchModel.findOneAndDelete({ FranchiseId: FranchiseID });
        const login = await Login.findOneAndDelete({ Id: FranchiseID });

        if (!franchise) {
            return res.status(404).json({ message: 'Franchise not found' });
        }

        res.status(204).send(); // Successful deletion with no content returned
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllFranchises,
    getFranchiseById,
    addFranchise,
    updateFranchise,
    deleteFranchise
};
