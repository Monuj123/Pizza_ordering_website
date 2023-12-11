import Joi from "joi";
import User from "../../models/user.js";
import RefreshToken from "../../models/refreshToken.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtServices from "../../services/JWTservices.js";
import bcrypt from "bcrypt";
import { REFRESH_SECRET } from "../../config/index.js";

const registerController = {
  async register(req, res, next) {
    //Validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });
    // console.log(req.body);
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if user already exists in db

    try {
      const exists = await User.exists({ email: req.body.email });
      if (exists) {
        return next(CustomErrorHandler.alreadyExists("Email already taken."));
      }
    } catch (err) {
      return next(err);
    }

    const { name, email, password } = req.body;
    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare the model

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    let acces_token;
    let refresh_token;
    try {
      const result = await user.save();

      acces_token = JwtServices.sign({ _id: result._id, role: result.role });
      refresh_token = JwtServices.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }

    return res.json({ acces_token, refresh_token });
  },
};
export default registerController;
