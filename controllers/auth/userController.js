import User from "../../models/user.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const userController = {
  async me(req, res, next) {
    // console.log("id is: " + req.user._id);
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        " -password -updatedAt -__v"
      );
      // console.log(user);
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      // console.log(err);
      return next(err);
    }
  },
};

export default userController;
