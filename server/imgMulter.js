// uploadHandler.js
import multer from "multer";
import path from "path";

// Set up multer to save files to a specific folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Save images in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Create a unique filename
  },
});

const upload = multer({ storage });

export default upload;
