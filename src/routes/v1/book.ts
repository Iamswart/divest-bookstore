import { celebrate } from 'celebrate';
import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import BookController from '../../controllers/book';
import { apiKeyAuthMiddleware, isAdmin, protect } from '../../middlewares/authenticate';
import { createBookSchema, searchBooksSchema, viewBookDetailsSchema } from '../../utils/validation-schema';
import { SearchBooksInterface } from '../../interfaces/book';

const bookRoutes: Router = Router();
const bookController = new BookController();

bookRoutes.get(
  '/',
  apiKeyAuthMiddleware,
  celebrate({ query: searchBooksSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const query = request.query as SearchBooksInterface;
    const data = await bookController.getBooks(query);

    response.status(200).json(data).end();
  })
);

bookRoutes.get(
  '/:id',
  apiKeyAuthMiddleware,
  celebrate({ params: viewBookDetailsSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const { id } = request.params;
    const data = await bookController.viewBookDetails(id);

    response.status(200).json(data).end();
  })
);

bookRoutes.post(
  '/',
  apiKeyAuthMiddleware,
  protect,
  isAdmin,
  celebrate({ body: createBookSchema }),
  asyncHandler(async (request: Request, response: Response) => {
    const bookData = request.body;
    const data = await bookController.createBook(bookData);

    response.status(201).json(data).end();
  })
);

export { bookRoutes };
