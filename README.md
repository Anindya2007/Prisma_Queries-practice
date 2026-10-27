# Lab 16: Authentication Using Bcrypt

## Objective

In this lab, you will add password-based authentication to your existing Express and Prisma application.

You will learn:

- Authentication and authentication factors
- Plain-text passwords vs. hashed passwords
- `bcrypt.hash()`
- `bcrypt.compare()`
- Login using email and password
- Express authentication middleware
- Protecting routes using middleware

---

## Task 1: Update the Prisma Schema

Open `schema.prisma` and modify the existing `User` model.

### Requirements

- Add a required `password` field of type `String`.
- Update the `DATABASE_URL` in your `.env` file.

**After updating the Prisma schema, run the following commands in order:**

```bash
npm install
npm install bcrypt
npx prisma migrate reset
npx prisma migrate dev --name authentication
npx prisma generate
npx prisma db seed
npm run dev
```

**Note:** `prisma migrate reset` deletes existing database data. Use it only with your classroom/development database. Ensure the seed data includes passwords compatible with the updated schema.

---

## Task 2: Update User Registration — POST /users

Update the existing user registration endpoint.

### Requirements

- Accept `password` along with the existing user details.
- Use `bcrypt.hash()` to hash the password before saving it.
- Store the hashed password in the database.
- Do not return the password or its hash in the API response.

---

## Task 3: Create Login Endpoint — POST /users/login

Create a new endpoint that allows existing users to log in.

### Requirements

- Accept `email` and `password` from `req.body`.
- Find the user in the database using their email.
- Use `bcrypt.compare()` to verify the password.
- Return `200` with a success message for valid credentials.
- Return `401` for incorrect credentials or a user who does not exist.
- Return `400` if email or password is missing.
- Do not return the password hash.

---

## Task 4: Create Authentication Middleware

Create a new file:

```text
src/middleware/auth.middleware.js
```

### Requirements

- Read `email` and `password` from `req.body`.
- Return `401` if either field is missing.
- Find the user using their email.
- Verify the password using `bcrypt.compare()`.
- If credentials are valid, call `next()`.
- Otherwise, return `401`.
- Handle unexpected server errors appropriately.

---

## Task 5: Protect Existing GET Routes

Apply your authentication middleware to the following routes:

| Method | Endpoint | Authentication |
|--------|----------|----------------|
| GET | `/users` | Required |
| GET | `/posts` | Required |
| GET | `/profiles` | Required |

### Requirements

- Import and apply the middleware to all three routes.
- Allow access only when valid credentials are provided.
- Keep the existing route functionality unchanged.
- Ensure password hashes are not included in responses.

---

## Task 6: Test Your Implementation

Verify the following scenarios:

| Test Case | Expected Status |
|-----------|-----------------|
| Register a new user | 201 |
| Login with correct credentials | 200 |
| Login with incorrect password | 401 |
| Login with an unknown email | 401 |
| Login with missing credentials | 400 |
| Access protected GET route with valid credentials | 200 |
| Access protected GET route with incorrect credentials | 401 |
| Access protected GET route without credentials | 401 |

### Sample Login Request

**Endpoint:** `POST /users/login`

**Request Body:**

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Sample Protected GET Request

**Endpoint:** `GET /users`

**Request Body:**

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

Use the same credentials when testing `GET /posts` and `GET /profiles`.

---

## Important Notes

- Never store plain-text passwords in the database.
- Always use `bcrypt.hash()` when registering users.
- Always use `bcrypt.compare()` when verifying passwords.
- Never expose password hashes in API responses.
- For this lab, protected GET requests will receive `email` and `password` in `req.body`.
- This is only for learning middleware. GET request bodies are not reliably supported, and production applications should use session-based or token-based authentication.

---

## Expected Outcome

By the end of this lab, your application should support:

1. User registration with bcrypt-hashed passwords.
2. Login using email and password.
3. Authentication middleware for verifying user credentials.
4. Protected GET routes for users, posts, and profiles.