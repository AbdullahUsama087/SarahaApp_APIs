import msgModel from "../../../DB/Models/message.model.js";
import userModel from "../../../DB/Models/user.model.js";

//==================  1- Send Message ==================
const sendMsg = async (req, res, next) => {
  const { content, sendTo } = req.body;
  const isUserExist = userModel.findById(sendTo);
  if (isUserExist) {
    const msgInstance = new msgModel({ content, sendTo });
    await msgInstance.save();
    res.status(201).json({ message: "Done !", msgInstance });
  } else {
    res.status(404).json({ message: "User not Found" });
  }
};

//==================  2- Get User Messages ==================
const getUserMsgs = async (req, res, next) => {
  const { _id } = req.authUser;
  const message = await msgModel.find({ sendTo: _id });
  if (message.length) {
    res.status(200).json({ message: "Done", message });
  } else {
    res.status(401).json({ message: "No messages" });
  }
};

//==================  3- Delete Messages ==================
const deleteMsg = async (req, res, next) => {
  const { msgId } = req.params;
  const {_id}=req.authUser 
  const msg = await msgModel.findOneAndDelete({ _id: msgId, sendTo: _id });
  if (msg) {
    res.status(200).json({ message: "Done", msg });
  } else {
    res.status(400).json({ message: "Unauthorized to Delete" });
  }
};

export { sendMsg, getUserMsgs, deleteMsg };
