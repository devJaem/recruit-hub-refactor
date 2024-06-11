import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  ACCESS_KEY: process.env.ACCESS_SECRET_KEY ,
  REFRESH_KEY: process.env.REFRESH_SECRET_KEY ,
  PORT: process.env.PORT ,
};
