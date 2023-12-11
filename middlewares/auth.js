import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtServices from "../services/JWTservices.js";

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  console.log("Hello888");
  console.log(authHeader);
  if (!authHeader) {
    return next(CustomErrorHandler.unauthorized());
  }

  const token = authHeader.split("  ")[1];
  console.log("Hello");
  console.log(token);
  try {
    const { _id, role } = JwtServices.verify(token);
    const user = {
      _id,
      role,
    };
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    // console.log(err);
    return next(err);
  }
};
export default auth;
