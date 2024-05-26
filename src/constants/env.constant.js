import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  ACCESS_KEY: process.env.ACCESS_SECRET_KEY,
  ACCESS_TIME: process.env.ACCESS_EXPIRATION_TIME,
  REFRESH_KEY: process.env.REFRESH_SECRET_KEY,
  REFRESH_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  PORT: process.env.PORT,
  HASH_ROUND: process.env.HASH_ROUND
};