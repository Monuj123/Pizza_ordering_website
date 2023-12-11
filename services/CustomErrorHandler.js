class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }
  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }
  static wrongCredentials(message = "Email or password is wrong!!") {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message = "User not found") {
    return new CustomErrorHandler(401, message);
  }
  static unauthorized(message = "Unauthorized") {
    return new CustomErrorHandler(401, message);
  }
  static serverError(message = "Internal server error") {
    return new CustomErrorHandler(500, message);
  }
}
export default CustomErrorHandler;
