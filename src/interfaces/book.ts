export interface CreateBookInterface {
    title: string;
    author: string;
    genre: string;
    price: number;
    stock: number;
  }
  
  export interface SearchBooksInterface {
    title?: string;
    author?: string;
    genre?: string;
  }
  