import User from "../../models/user.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtServices from "../../services/JWTservices.js";
import Joi from "joi";
import RefreshToken from "../../models/refreshToken.js";
import { REFRESH_SECRET } from "../../config/index.js";
const loginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const acces_token = JwtServices.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtServices.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      await RefreshToken.create({ token: refresh_token });

      res.json({ acces_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },
  async logout(req, res, next) {
    //validation

    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 1 });
  },
};
export default loginController;
