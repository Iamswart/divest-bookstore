import dotenv from "dotenv";

dotenv.config();
import logger from "./logger";

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import db from "./database/models/index";

import { routes } from "./routes";
import { handleError, unknownResourceError } from "./error";

import httpLogger from "./httpLogger";
import swaggerSpec from "./swaggerConfig";
import swaggerUi from 'swagger-ui-express';


const app = express();
const PORT = 3000;

app.set("trust proxy", true);
app.use(helmet());

app.use(express.json());
app.use(cors());

app.use(httpLogger);
app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err);
  logger.error(err.name, err.message);
  process.exit(1);
});

app.get("/actuator/health", async (request: Request, response: Response) => {
  try {
    await db.sequelize.authenticate().then(() => {
      logger.info("Connected to database!");
    });

    response.status(200).json({
      message: "Server Okay and database connection OK",
      info: {
        url: `${request.protocol}://${request.hostname}${request.path}`,
      },
    });
  } catch (error) {
    response.status(500).json({
      message: "Database connection failed",
      error: error.message,
      info: {
        url: `${request.protocol}://${request.hostname}${request.path}`,
      },
    });
  }
});

// capture all 404 errors
app.use(function (request: Request, response: Response) {
  logger.error(`Route not found: ${request.path}`);
  throw unknownResourceError(
    `The route you are trying to reach (${request.path}) does not exist`
  );
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  logger.info(`App is listening on port ${PORT}`);
});
