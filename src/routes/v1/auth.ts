import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import AuthController from "../../controllers/auth";
import { apiKeyAuthMiddleware } from "../../middlewares/authenticate";

import {
  loginSchema,
  registerAccountSchema,
} from "../../utils/validation-schema";

const authRoutes: Router = Router();
const authController = new AuthController();



authRoutes.post(
  "/login",
  apiKeyAuthMiddleware,
  celebrate({ body: loginSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const loginData = request.body;
    const data = await authController.loginUser(loginData);

    response.status(200).json(data).end();
  })
);

authRoutes.post(
  "/register",
  apiKeyAuthMiddleware,
  celebrate({ body: registerAccountSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const userData = request.body;
    const data = await authController.registerUser(userData);

    response.status(201).json(data).end();
  })
);

export { authRoutes };
