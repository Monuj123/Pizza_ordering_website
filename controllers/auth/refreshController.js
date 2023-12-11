import Joi from "joi";
import RefreshToken from "../../models/refreshToken.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtServices from "../../services/JWTservices.js";
import User from "../../models/user.js";
import { REFRESH_SECRET } from "../../config/index.js";
const refreshController = {
  async refresh(req, res, next) {
    //validation of refreshToken
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      console.log(error);
      return next(error);
    }

    //database
    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });

      if (!refreshtoken) {
        return next(CustomErrorHandler.unauthorized("Invalid refresh token"));
      }

      let userID;
      try {
        const { _id } = await JwtServices.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userID = _id;
      } catch (err) {
        return next(CustomErrorHandler.unauthorized("Invalid refresh token"));
      }

      const user = await User.findOne({ _id: userID });

      if (!user) {
        return next(CustomErrorHandler.unauthorized("No user found!!"));
      }
      const access_token = JwtServices.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtServices.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong" + err.message));
    }
  },
};
export default refreshController;
