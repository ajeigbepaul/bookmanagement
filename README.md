<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Book Management API

A NestJS RESTful API for managing books, users, comments, and user relationships (follow/unfollow), with JWT authentication, PostgreSQL, Redis caching, and Swagger documentation.

---

## Features

- User registration and login (JWT authentication)
- CRUD for books
- Comment on books
- Follow/unfollow users
- Pagination for books and comments
- Redis caching for book data
- API documentation with Swagger

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/) (for PostgreSQL and Redis)
- [npm](https://www.npmjs.com/)

---

## Setup Instructions

### 1. **Clone the Repository**

```bash
 git clone <your-repo-url>
 cd bookmanagement
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root:

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
REDIS_HOST=
REDIS_PORT=
CACHE_TTL=
```

### 4. **Start PostgreSQL and Redis with Docker**

```bash
docker-compose up -d
```

### 5. **Run the Application**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3333`.

### 6. **Access Swagger API Docs**

Visit: [http://localhost:3333/api](http://localhost:3333/api)

---

## API Endpoints

### **Authentication**

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT

### **Books**

- `GET /books` — List books (paginated)
- `GET /books/:id` — Get book by ID
- `POST /books` — Create book (JWT required)
- `PUT /books/:id` — Update book (JWT required)
- `DELETE /books/:id` — Delete book (JWT required)

### **Comments**

- `GET /books/:id/comments` — List comments for a book (paginated)
- `POST /books/:id/comments` — Add comment (JWT required)
- `DELETE /comments/:id` — Delete comment (JWT required)

### **Users**

- `GET /users/me` — Get current user profile (JWT required)
- `POST /users/:id/follow` — Follow a user (JWT required)
- `DELETE /users/:id/follow` — Unfollow a user (JWT required)
- `GET /users/:id/followers` — List followers
- `GET /users/:id/following` — List following

---

## **Authentication**

- All protected endpoints require an `Authorization: Bearer <token>` header.
- Obtain the token via `/auth/login`.

---

## **Pagination**

- For book and comment lists, use `?page=1&limit=10` query params.

---

## **Caching**

- Book list and book details are cached in Redis for 60 seconds.
- Cache is invalidated on book create, update, or delete.

---

## **Swagger API Documentation**

- Visit [http://localhost:3333/api](http://localhost:3333/api) for interactive API docs.
- All endpoints, request/response schemas, and authentication are documented.

---

## **Testing**

- You can use Postman, Insomnia, or Swagger UI to test all endpoints.

---

## **Code Comments & In-Code Documentation**

- The codebase includes comments explaining key logic, especially in services and controllers.
- DTOs and entities are annotated for Swagger and validation.
- For further details, see the Swagger UI or the code itself.

---

## **Contribution Guidelines**

We welcome contributions! To contribute:

1. Fork the repository and create your branch from `main`.
2. Write clear, well-commented code and add/modify tests as needed.
3. Ensure all tests pass (`npm run test` and `npm run test:e2e`).
4. Document any new endpoints or features in the README and Swagger.
5. Submit a pull request with a clear description of your changes.

---

## **Example Requests & Responses**

### Register a User

**Request:**

```json
POST /auth/register
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com"
}
```

### Login

**Request:**

```json
POST /auth/login
{
  "usernameOrEmail": "alice@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "<jwt-token>",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com"
  }
}
```

### Get Books (Paginated)

**Request:**

```
GET /books?page=1&limit=2
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "My Book Title",
      "author": "Author Name",
      "description": "A description",
      "createdBy": {
        "id": 1,
        "username": "alice",
        "email": "alice@example.com"
      },
      "createdAt": "2025-07-16T07:03:48.334Z",
      "updatedAt": "2025-07-16T07:03:48.334Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 2
}
```

### Add a Comment

**Request:**

```json
POST /books/1/comments
{
  "content": "Great book!"
}
```

**Response:**

```json
{
  "id": 1,
  "content": "Great book!",
  "book": { ... },
  "user": { ... },
  "createdAt": "2025-07-16T07:03:48.334Z"
}
```

### Follow a User

**Request:**

```
POST /users/2/follow
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Followed successfully"
}
```

---

## **License**

MIT
