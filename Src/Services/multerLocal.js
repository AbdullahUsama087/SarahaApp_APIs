import multer from "multer";
import { customAlphabet } from "nanoid";
import path from "path";
import fs from "fs";
const nanoid = customAlphabet("abde1234", 7);

const multerFunction = (allowedExtensionsArr, customPath) => {
  //======================== Storage ===========================
  if (!customPath) {
    customPath = "General";
  }
  const destPath = path.resolve(`uploads/${customPath}`);

  if (fs.existsSync(destPath)) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, destPath);
      },
      filename: function (req, file, cb) {
        const uniqueFileName = nanoid() + file.originalname;
        cb(null, uniqueFileName);
      },
    });
    const fileFilter = function (req, file, cb) {
      if (allowedExtensionsArr.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid Extension", { cause: 400 }), false);
      }
    };
    const fileUpload = multer({
      fileFilter,
      storage,
      limits: {
        files: 3,
        fields: 3,
      },
    });
    return fileUpload;
  } else {
    fs.mkdirSync(destPath, { recursive: true });
  }
};

export default multerFunction;
