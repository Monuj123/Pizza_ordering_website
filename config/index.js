import dotenv from "dotenv";

dotenv.config();

export const {
  APP_PORT,
  DEBUG_MODE,
  DB_URL,
  JWT_SECRET,
  APP_URL,
  ON_HEROKU,
  REFRESH_SECRET,
} = process.env;
