import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
class JwtServices {
  static sign(payload, expiry = "60s", secret = JWT_SECRET) {
    return Jwt.sign(payload, secret, { expiresIn: expiry });
  }
  static verify(token, secret = JWT_SECRET) {
    return Jwt.verify(token, secret);
  }
}
export default JwtServices;
