import * as dotenv from "dotenv";

dotenv.config();

export const VERSION = {
  v1: "/api/v1",
};

export default {
  db: {
    url: process.env.DATABASE_URL as string,
    sync: false,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialect: "postgres",
    
  },
  env: process.env.NODE_ENV || ("development" as string),
  isProduction:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
  port: process.env.PORT as string,
  auth: {
    secretToken: process.env.JWT_SECRET_KEY as string,
    tokenExpiration: Number(process.env.JWT_EXPIRATION),
    secretRefreshToken: process.env.REFRESH_TOKEN_SECRET as string,
    tokenRefreshExpiration: Number(process.env.REFRESH_TOKEN_EXPIRATION),
    apiKey: process.env.API_KEY as string,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY as string,
    secretKey: process.env.AWS_SECRET_KEY as string,
    region: process.env.AWS_REGION as string,
    sqsUrl: process.env.SQS_QUEUE_URL as string,
  },
  localServerUrl: process.env.LOCAL_SERVER_URL as string,
  productionServerUrl: process.env.PRODUCTION_SERVER_URL as string
};
