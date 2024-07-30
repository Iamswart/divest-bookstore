import { SearchBooksInterface, CreateBookInterface } from '../interfaces/book';
import logger from '../logger';
import BookService from '../services/book';

export default class BookController {
  private bookService = new BookService();

  async getBooks(query: SearchBooksInterface) {
    try {
      return await this.bookService.getBooks(query);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async viewBookDetails(id: string) {
    try {
      return await this.bookService.viewBookDetails(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async createBook(input: CreateBookInterface) {
    try {
      return await this.bookService.createBook(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
