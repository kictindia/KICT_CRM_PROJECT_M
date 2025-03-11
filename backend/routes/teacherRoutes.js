const express = require("express");
const router = express.Router();
const upload = require('./../config/multer');
const teacherController = require("../controllers/teacherController");

router.post("/add", upload.single('image'), teacherController.addTeacher);
router.get("/all", teacherController.getAllTeachers);
router.get("/get/:TeacherID", teacherController.getTeacherById);
router.put("/update/:TeacherID",upload.single('image'),teacherController.updateTeacher);
router.delete("/delete/:TeacherID", teacherController.deleteTeacher);
router.post("/bulk-upload", teacherController.bulkUploadTeacherData);

module.exports = router;
