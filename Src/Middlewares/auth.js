import jwt from "jsonwebtoken";
import userModel from "../../DB/Models/user.model.js";

const isAuth = () => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
      if (authorization.startsWith("Saraha")) {
        const splittedToken = authorization.split(" ")[1];
        const decodedData = jwt.verify(splittedToken, "testToken");
        if (decodedData || decodedData._id) {
            // console.log(decodedData);
          const findUser = await userModel.findById({_id:decodedData._id});
          if (findUser) {
            req.authUser = findUser;
            next();
          } else {
            res.status(400).json({ message: "Please SignUp" });
          }
        } else {
          res.status(400).json({ message: "Invalid Token" });
        }
      } else {
        res.status(400).json({ message: "Invalid Token Perfix" });
      }
    } else {
      res.status(400).json({ message: "Please LogIn" });
    }
  };
};

export default isAuth