import userModel from "../../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../../Utils/error.handling.js";
import jwt from "jsonwebtoken";
import sendEmailService from "../../Services/sendEmailService.js";
import cloudinary from "../../Utils/cloudinaryConigrations.js";
import generateQrCode from "../../Utils/qrCodeFunction.js";

// =================  Verify Token ==============

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization.split(" ")[1]);
  const decodedData = jwt.verify(authorization.split(" ")[1], "testToken");
  res.json({ message: "Done", decodedData });
};

// =================  1- Sign Up   ==============

const signUp = asyncHandler(async (req, res, next) => {
  const { test } = req.query;
  const { username, email, password, gender } = req.body;
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    res.status(400).json({ message: "Email is already exist" });
  } else {
    const token = jwt.sign({ email }, "confirmToken", { expiresIn: "1h" });
    const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`;
    const isEmailSent = await sendEmailService({
      to: email,
      message: `<a href=${confirmLink}>Click To Confirm Email</a>`,
      subject: "Verification Email",
    });
    if (isEmailSent) {
      const hashedPassword = bcrypt.hashSync(
        password,
        parseInt(process.env.SALT_ROUND)
      );
      const userInstance = new userModel({
        username,
        email,
        password: hashedPassword,
        gender,
      });
      await userInstance.save();
      res
        .status(201)
        .json({ message: "Account Created Successfully", userInstance, test });
    } else {
      res.status(500).json({ message: "try again later" });
    }
  }
});

//===================== Confirm Email ==================
const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decodedData = jwt.verify(token, "confirmToken");
  const confirmedCheck = await userModel.findOne({ email: decodedData.email });
  if (confirmedCheck.isConfirmed) {
    res.status(400).json({ message: "Email is already confirmed" });
  } else {
    const user = await userModel.findOneAndUpdate(
      { email: decodedData.email },
      { isConfirmed: true },
      { new: true }
    );
    res.status(200).json({ message: "Confirm Completed", user });
  }
};

// =================  2- Sign In   ==============

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    const isPassMatch = bcrypt.compareSync(password, isUserExist.password);
    if (isPassMatch) {
      const userToken = jwt.sign(
        { email, _id: isUserExist._id },
        "testToken"
        // {expiresIn: "1h"}
      );
      res.status(201).json({ message: "Sign IN completed", userToken });
    } else {
      res.status(400).json({ message: "Invalid login" });
    }
  } else {
    res.status(400).json({ message: "Invalid login" });
  }
};

// =================  3- Update Profile   ==============

const updateProfile = async (req, res, next) => {
  const { _id } = req.authUser;
  const { username } = req.body;
  const { userId } = req.params;
  const decodedData = jwt.verify(authorization.split(" ")[1], "testToken");
  const userExist = await userModel.findOne({ email });
  // console.log(userExist._id.toString());
  if (userExist._id.toString() == _id) {
    const user = await userModel.findByIdAndUpdate(
      { _id: userId },
      { username },
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: "User Updated Successfully", user });
    } else {
      res.status(400).json({ message: "User Updated Failed" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized to update" });
  }
};

// =================  4- Get Profile Data   ==============

const getProfile = async (req, res, next) => {
  const { _id } = req.authUser;

  const user = await userModel.findById(_id, "username");
  if (user) {
    const qrcode = await generateQrCode({ data: user });
    res.status(200).json({ message: "Done ", user, qrcode });
  } else {
    res.status(400).json({ message: "Invalid ID" });
  }
};

//===========================  profile Pic(local)  =====================
const profilePic = async (req, res, next) => {
  const { _id } = req.authUser;
  if (req.file) {
    const user = await userModel.findByIdAndUpdate(
      { _id },
      { profilePic: req.file.path },
      { new: true }
    );
    res.json({ message: "Done", user });
  } else {
    return next(new Error("Please Upload a photo", { cause: 400 }));
  }
};

//===========================  profile Pic(Cloud)  =====================

const picCloud = async (req, res, next) => {
  const { _id } = req.authUser;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `User/Profile/${_id}`,
        resource_type: "auto",
        unique_filename: false,
        use_filename: true,
      }
    );
    const user = await userModel.findByIdAndUpdate(
      { _id },
      { profilePic: { secure_url, public_id } },
      { new: true }
    );
    if (!user) {
      await cloudinary.uploader.destroy(public_id);
    }
    res.status(200).json({ message: "Done", user });
  } else {
    next(new Error("Please Upload a new picture", { cause: 400 }), false);
  }
};

//===========================  Cover Pic(local)  =====================

const coverPics = async (req, res, next) => {
  const { _id } = req.authUser;
  if (req.files) {
    const coverImgs = [];
    for (const file of req.files) {
      coverImgs.push(file.path);
    }
    const user = await userModel.findById(_id);
    if (user.CoverPic.length) {
      coverImgs.push(...user.CoverPic);
    } else {
      coverImgs;
    }
    const userNew = await userModel.findByIdAndUpdate(
      { _id },
      { CoverPic: coverImgs },
      { new: true }
    );
    res.status(200).json({ message: "Done", userNew });
  } else {
    return next(new Error("Please Upload Cover Pics", { cause: 400 }));
  }
};

//===========================  profile Pic(Cloud)  =====================
const coverCloud = async (req, res, next) => {
  const { _id } = req.authUser;
  if (req.files) {
    const coverImgs = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `User/Cover/${_id}`, resource_type: "auto" }
      );
      coverImgs.push({ secure_url, public_id });
    }
    const user = await userModel.findById(_id);
    if (user.CoverPic.length) {
      coverImgs.push(...user.CoverPic);
    } else {
      coverImgs;
    }
    const userNew = await userModel.findByIdAndUpdate(
      { _id },
      { CoverPic: coverImgs },
      { new: true }
    );
    res.status(200).json({ message: "Done", userNew });
  } else {
    return next(new Error("Please Upload Cover Pics", { cause: 400 }));
  }
};

export {
  verifyToken,
  signUp,
  confirmEmail,
  signIn,
  updateProfile,
  getProfile,
  profilePic,
  coverPics,
  picCloud,
  coverCloud,
};
