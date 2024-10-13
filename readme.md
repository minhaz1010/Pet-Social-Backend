# Pet Care Tips & Stories - Backend

This is the backend for the Pet Care Tips & Stories project, built with Node.js, Express, TypeScript, and MongoDB.

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Zod (for validation)
- AamarPay (payment gateway integration)

## Features

- RESTful API design
- MongoDB database integration with Mongoose ODM
- TypeScript for type safety 
- Input validation using Zod
- Payment processing with AamarPay
- Authentication and authorization (integrated with Clerk on the frontend and  backend)

## Getting Started


### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/pet-care-tips-stories.git
   cd pet-care-tips-stories/backend
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of the backend directory and add the following variables:
   ```
    CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    CLERK_WEBHOOK_SECRET_KEY=
    DATABASE_URL=
    NODE_ENV=
    PORT=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    AMARPAY_API=
    PAYMENT_VERIFY_URL=
    STORE_ID=
    SIGNATURE_KEY=
    BACKEND_URL=
    CANCEL_URL=
   ```

4. Start the development server:
   ```
   npm run start:dev
   # or
   yarn run start:dev
   # or
   bun run start:dev
   ```

The server should now be running on `http://localhost:5000`.


## API Endpoints

### **User Routes**

These routes handle user-related operations, such as fetching user details, following/unfollowing users, and updating roles.

| Method | Endpoint                    | Description                           | Auth Required |
|--------|------------------------------|---------------------------------------|---------------|
| `GET`  | `/users/`                    | Get all users from the database       | Yes           |
| `GET`  | `/users/details/:userName`    | Get details of a user by username     | Yes            |
| `GET`  | `/users/me`                  | Get current authenticated user's details | Yes           |
| `POST` | `/users/follow/:followerId`   | Follow a user                         | Yes           |
| `POST` | `/users/unfollow/:followerId` | Unfollow a user                       | Yes           |
| `GET`  | `/users/get-all-users`        | Get all users (authenticated)         | Yes           |
| `PATCH`| `/users/update-role/:id`      | Update a user's role                  | Yes           |
| `DELETE`| `/users/delete/:id`          | Delete a user                         | Yes           |

### **Payment Routes**

These routes manage payments, such as initializing and confirming payments.

| Method | Endpoint                   | Description                          | Auth Required |
|--------|-----------------------------|--------------------------------------|---------------|
| `POST` | `/payments/`                | Initialize a payment                 | Yes           |
| `POST` | `/payments/confirmation`    | Confirm a payment                    | Yes            |
| `GET`  | `/payments/all-payment`     | Get all payments                     | Yes           |

### **Post Routes**

These routes allow for post creation, fetching, updating, and deleting posts, as well as liking and disliking posts.

| Method | Endpoint                    | Description                                  | Auth Required |
|--------|------------------------------|----------------------------------------------|---------------|
| `POST` | `/posts/create-post`         | Create a new post                            | Yes           |
| `GET`  | `/posts/`                    | Get all posts                                | No            |
| `GET`  | `/posts/:postId`             | Get a single post by ID                      | No            |
| `PATCH`| `/posts/:postId`             | Update a single post                         | Yes            |
| `DELETE`| `/posts/:postId`            | Delete a single post                         | Yes            |
| `PATCH`| `/posts/likes/:postId`       | Like a post                                  | Yes           |
| `PATCH`| `/posts/dislikes/:postId`    | Dislike a post                               | Yes           |

### **Comment Routes**

These routes handle creating, updating, deleting comments, as well as liking/disliking comments.

| Method | Endpoint                              | Description                                   | Auth Required |
|--------|----------------------------------------|-----------------------------------------------|---------------|
| `POST` | `/posts/comments/:postId`              | Create a comment on a post                    | Yes           |
| `GET`  | `/posts/comments/:postId`              | Get all comments of a post                    | Yes            |
| `PATCH`| `/posts/comments/:commentId`           | Update a single comment                       | Yes            |
| `DELETE`| `/posts/comments/:commentId`          | Delete a single comment                       | Yes           |
| `PATCH`| `/posts/comments/like/:commentId`      | Like a comment                                | Yes           |
| `PATCH`| `/posts/comments/dislike/:commentId`   | Dislike a comment                             | Yes           |

---
## **Authentication:**
- Endpoints that require authentication are protected by Clerk's `ClerkExpressRequireAuth` middleware.
- Users must be authenticated to perform actions like following, unfollowing, liking posts/comments, etc.


## Project Structure

```
  ├── bun.lockb
├── Dockerfile
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── public
│   ├── confirmation.html
│   └── fail.html
├── readme.md
├── src
│   ├── app
│   │   ├── builder
│   │   │   └── QueryBuilder.ts
│   │   ├── config
│   │   │   ├── cloudinary.config.ts
│   │   │   ├── index.ts
│   │   │   └── mutler.config.ts
│   │   ├── errors
│   │   │   ├── appError.ts
│   │   │   ├── handleCastError.ts
│   │   │   ├── handleDuplicateError.ts
│   │   │   ├── handleZodError.ts
│   │   │   ├── jwtError.ts
│   │   │   └── mongooseValidationError.ts
│   │   ├── interface
│   │   │   └── index.d.ts
│   │   ├── middleware
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   ├── resizImage.ts
│   │   │   └── validateRequest.ts
│   │   ├── module
│   │   │   ├── comment
│   │   │   │   ├── comment.controller.ts
│   │   │   │   ├── comment.interface.ts
│   │   │   │   ├── comment.model.ts
│   │   │   │   ├── comment.services.ts
│   │   │   │   └── comment.validation.ts
│   │   │   ├── payment
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── payment.interface.ts
│   │   │   │   ├── payment.model.ts
│   │   │   │   ├── payment.route.ts
│   │   │   │   └── payment.services.ts
│   │   │   ├── post
│   │   │   │   ├── post.controller.ts
│   │   │   │   ├── post.interface.ts
│   │   │   │   ├── post.model.ts
│   │   │   │   ├── post.route.ts
│   │   │   │   ├── post.services.ts
│   │   │   │   └── post.validation.ts
│   │   │   └── user
│   │   │       ├── user.controller.ts
│   │   │       ├── user.interface.ts
│   │   │       ├── user.model.ts
│   │   │       ├── user.route.ts
│   │   │       └── user.services.ts
│   │   ├── route
│   │   │   └── index.route.ts
│   │   ├── types
│   │   │   ├── clerk.d.ts
│   │   │   └── globals.d.ts
│   │   └── utils
│   │       ├── bookingUtils.ts
│   │       ├── catchAsyncError.ts
│   │       ├── formattedDate.ts
│   │       ├── sendImageToCloudinary.ts
│   │       ├── sendResponse.ts
│   │       └── webhook.ts
│   ├── app.ts
│   └── server.ts
├── tsconfig.json
├── uploads
└── vercel.json
```



