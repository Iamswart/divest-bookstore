import { Joi } from "celebrate";

export const registerAccountSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .message(
      '"password" must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

export const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

export const searchBooksSchema = Joi.object({
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  genre: Joi.string().optional(),
});

export const viewBookDetailsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createCartItemSchema = Joi.object({
  bookId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const updateCartItemSchema = Joi.object({
  cartItemId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const deleteCartItemSchema = Joi.object({
  cartItemId: Joi.string().uuid().required(),
});

export const createOrderSchema = Joi.object({
  note: Joi.string().optional(),
});

export const getOrderByIdSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
});
