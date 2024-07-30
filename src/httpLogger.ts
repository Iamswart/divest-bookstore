import { format } from "winston";
import { Request, Response, NextFunction } from "express";
import moment from "moment";
import logger from "./logger";

const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, headers } = req;

  // Filter headers
  const filteredHeaders = { ...headers };
  delete filteredHeaders.authorization;

  // Get response time
  const start = process.hrtime();
  res.on("finish", () => {
    const elapsed = process.hrtime(start)[1] / 1000000;
    const responseTime = elapsed.toFixed(3);

    // Get IP address
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    // Build log data
    const logData = {
      timestamp: moment().format(),
      ip,
      method,
      url,
      headers: filteredHeaders,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    };

    logger.info("HTTP Request Log", logData);
  });

  next();
};
export default httpLogger;
