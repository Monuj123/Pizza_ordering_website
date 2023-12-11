import User from "../models/user.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const admin = async (req, res, next) => {
  try {
    const person = await User.findOne({ _id: req.user._id });

    if (person.role === "admin") {
      next();
    } else {
      return next(CustomErrorHandler.unauthorized());
    }
  } catch (err) {
    return next(err);
  }
};
export default admin;
