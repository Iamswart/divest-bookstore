import { celebrate } from 'celebrate';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import CartController from '../../controllers/cart';
import { apiKeyAuthMiddleware, protect } from '../../middlewares/authenticate';
import { createCartItemSchema, updateCartItemSchema, deleteCartItemSchema } from '../../utils/validation-schema';
import { JWTUser } from '../../utils/jwt-user';

const cartRoutes: Router = Router();
const cartController = new CartController();

cartRoutes.post(
  '/',
  apiKeyAuthMiddleware,
  celebrate({ body: createCartItemSchema }),
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const cartData = request.body;
    const data = await cartController.addBookToCart(user.id, cartData);

    response.status(201).json(data).end();
  })
);

cartRoutes.get(
  '/',
  apiKeyAuthMiddleware,
  protect,
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const data = await cartController.viewCart(user.id);

    response.status(200).json(data).end();
  })
);

cartRoutes.delete(
  '/:cartItemId',
  apiKeyAuthMiddleware,
  protect,
  celebrate({ params: deleteCartItemSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const { cartItemId } = request.params;
    const data = await cartController.deleteCartItem(user.id, cartItemId);

    response.status(200).json(data).end();
  })
);

cartRoutes.put(
  '/',
  apiKeyAuthMiddleware,
  protect,
  celebrate({ body: updateCartItemSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const user = response.locals.user as JWTUser;
    const cartItemData = request.body;
    const data = await cartController.updateCartItem(user.id, cartItemData);

    response.status(200).json(data).end();
  })
);

export { cartRoutes };
