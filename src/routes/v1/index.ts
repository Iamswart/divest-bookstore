import { Router } from "express";
import { authRoutes } from "./auth";
import { bookRoutes } from "./book";
import { cartRoutes } from "./cart";
import { orderRoutes } from "./order";


const v1Routes: Router = Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/books", bookRoutes);
v1Routes.use("/carts", cartRoutes);
v1Routes.use("/orders", orderRoutes);


export { v1Routes };
