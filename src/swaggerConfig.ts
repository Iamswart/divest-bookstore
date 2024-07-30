import { OpenAPIV3 } from "openapi-types";
import config from "./config";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "This is the API documentation for Divest online Bookstore.",
  },
  servers: [
    {
      url: config.localServerUrl,
      description: "Local server"
    },
    {
      url: config.productionServerUrl,
      description: "Production server"
    }
  ],
  paths: {
    "/auth/login": {
      post: {
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Register",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
        },
      },
    },
    "/books": {
      get: {
        summary: "Search books",
        parameters: [
          {
            name: "title",
            in: "query",
            schema: {
              type: "string",
            },
            required: false,
          },
          {
            name: "author",
            in: "query",
            schema: {
              type: "string",
            },
            required: false,
          },
          {
            name: "genre",
            in: "query",
            schema: {
              type: "string",
            },
            required: false,
          },
        ],
        responses: {
          200: {
            description: "Books retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Book",
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid query parameters",
          },
        },
      },
      post: {
        summary: "Create a new book",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBook",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Book created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Book",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
        },
      },
    },
    "/books/{id}": {
      get: {
        summary: "View book details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          200: {
            description: "Book details retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Book",
                },
              },
            },
          },
          404: {
            description: "Book not found",
          },
        },
      },
    },
    // Cart endpoints
    "/cart": {
      get: {
        summary: "View cart",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Cart retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cart",
                },
              },
            },
          },
          404: {
            description: "Cart not found",
          },
        },
      },
      post: {
        summary: "Add a book to cart",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateCartItem"
              },
            },
          },
        },
        responses: {
          201: {
            description: "Book added to cart successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cart",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
        },
      },
      put: {
        summary: "Update cart item quantity",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateCartItem",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Cart item updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cart",
                },
              },
            },
          },
          400: {
            description: "Invalid data",
          },
        },
      },
    },
    "/cart/{cartItemId}": {
      delete: {
        summary: "Remove item from cart",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cartItemId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          200: {
            description: "Item removed from cart successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cart",
                },
              },
            },
          },
          404: {
            description: "Cart item not found",
          },
        },
      },
    },
    "/orders": {
        post: {
          summary: "Create a new order",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateOrder"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Order created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order"
                  }
                }
              }
            },
            400: {
              description: "Invalid data"
            }
          }
        },
        get: {
          summary: "Get order history",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Order history retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order"
                    }
                  }
                }
              }
            },
            404: {
              description: "Order history not found"
            }
          }
        }
      },
      "/orders/{orderId}": {
        get: {
          summary: "Get order by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid"
              }
            }
          ],
          responses: {
            200: {
              description: "Order retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Order"
                  }
                }
              }
            },
            404: {
              description: "Order not found"
            }
          }
        }
      }
  },
  components: {
    schemas: {
      Login: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
        required: ["email", "password"],
      },
      Register: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
            minLength: 8,
          },
        },
        required: ["name", "email", "password"],
      },
      LoginResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              email: {
                type: "string",
              },
            },
          },
          accessToken: {
            type: "string",
          },
          refreshToken: {
            type: "string",
          },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              email: {
                type: "string",
              },
            },
          },
          accessToken: {
            type: "string",
          },
          refreshToken: {
            type: "string",
          },
        },
      },
      Book: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          title: {
            type: "string",
          },
          author: {
            type: "string",
          },
          genre: {
            type: "string",
          },
          price: {
            type: "number",
          },
          stock: {
            type: "number",
          },
        },
      },
      CreateBook: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          author: {
            type: "string",
          },
          genre: {
            type: "string",
          },
          price: {
            type: "number",
          },
          stock: {
            type: "number",
          },
        },
        required: ["title", "author", "genre", "price", "stock"],
      },
      Cart: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          userId: {
            type: "string",
          },
          cartItems: {
            type: "array",
            items: {
              $ref: "#/components/schemas/CartItem",
            },
          },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          bookId: {
            type: "string",
          },
          quantity: {
            type: "number",
            minimum: 1
          },
          book: {
            $ref: "#/components/schemas/Book",
          },
        },
      },
      CreateCartItem: {
        type: "object",
        properties: {
          bookId: {
            type: "string",
            format: "uuid"
          },
          quantity: {
            type: "integer",
            minimum: 1
          }
        },
        required: ["bookId", "quantity"]
      },
      UpdateCartItem: {
        type: "object",
        properties: {
          cartItemId: {
            type: "string",
            format: "uuid"
          },
          quantity: {
            type: "number",
            minimum: 1
          }
        },
        required: ["cartItemId", "quantity"]
      },
      CreateOrder: {
        type: "object",
        properties: {
          note: {
            type: "string"
          }
        },
        required: []
      },
      Order: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          userId: {
            type: "string"
          },
          orderNumber: {
            type: "string"
          },
          note: {
            type: "string"
          },
          totalCost: {
            type: "number"
          },
          paymentStatus: {
            type: "string"
          },
          orderItems: {
            type: "array",
            items: {
              $ref: "#/components/schemas/OrderItem"
            }
          }
        }
      },
      OrderItem: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          orderId: {
            type: "string"
          },
          bookId: {
            type: "string"
          },
          quantity: {
            type: "integer"
          },
          price: {
            type: "number"
          },
          book: {
            $ref: "#/components/schemas/Book"
          }
        }
      }
    }
  }
};

export default swaggerDocument;
