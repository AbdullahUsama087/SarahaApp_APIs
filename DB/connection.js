import mongoose from "mongoose";
const DbConnection = async (req, res, next) => {
  return await mongoose
    .connect("mongodb://127.0.0.1:27017/sarahaApp")
    .then((res) => console.log("DB connection Success"))
    .catch((error) => console.log("DB connection Fail"));
};

export default DbConnection