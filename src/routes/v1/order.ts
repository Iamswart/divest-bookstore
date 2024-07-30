import { celebrate } from 'celebrate';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import OrderController from '../../controllers/order';
import { apiKeyAuthMiddleware, protect } from '../../middlewares/authenticate';
import { createOrderSchema, getOrderByIdSchema } from '../../utils/validation-schema';
import { JWTUser } from '../../utils/jwt-user';

const orderRoutes: Router = Router();
const orderController = new OrderController();

orderRoutes.post(
  '/',
  apiKeyAuthMiddleware,
  protect,
  celebrate({ body: createOrderSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const { note } = request.body;
    const data = await orderController.createOrder(user.id, note);
    response.status(201).json(data).end();
  })
);

orderRoutes.get(
  '/',
  apiKeyAuthMiddleware,
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const data = await orderController.getOrderHistory(user.id);
    response.status(200).json(data).end();
  })
);

orderRoutes.get(
  '/:orderId',
  apiKeyAuthMiddleware,
  protect,
  celebrate({ params: getOrderByIdSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const { orderId } = request.params;
    const data = await orderController.getOrderById(user.id, orderId);
    response.status(200).json(data).end();
  })
);

export { orderRoutes };
