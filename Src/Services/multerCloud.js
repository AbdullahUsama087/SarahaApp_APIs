import multer from "multer";
import allowedExtensions from "../Utils/allowedExtensions.js";

const multerCloudFunction = (allowedExtensionsArr) => {
  if (allowedExtensionsArr) {
    const storage = multer.diskStorage({});
    const fileFilter = function (req, file, cb) {
      if (allowedExtensionsArr.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid Extension", { cause: 400 }), false);
      }
    };
    const fileUpload = multer({ fileFilter, storage });
    return fileUpload;
  } else {
    allowedExtensionsArr = allowedExtensions;
  }
};

export default multerCloudFunction;
