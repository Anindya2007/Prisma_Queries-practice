
# Lab: Prisma Relations

## Objective

In this lab, you will learn how to work with relationships in Prisma:

1. One-to-Many: User and Post
2. Connecting a post to an existing user
3. Cascade Delete
4. One-to-One: User and Profile
5. Many-to-Many: Student and Course

---

## Step 1: Get the Latest Project

Before starting, pull the latest changes from the `main` branch. The updated repository contains the new seed file.

Run:

```bash
git checkout main
git pull origin main
```

---

## Step 2: Update `schema.prisma`

**File:** `prisma/schema.prisma`

Before running the migration commands, make the following changes to your existing schema.

### A. Update the User Model

Keep all existing fields and add:

- A `posts` relation so one user can have multiple posts.
- A `profile` relation so a user can have at most one profile.

### B. Update the Post Model

Keep all existing fields and add:

- A required `userId` field to store the associated user's ID.
- A `user` relation connecting each post to one user.
- The `onDelete: Cascade` option so deleting a user also deletes their posts.

### C. Add the Profile Model

Create a new model named `Profile` with:

- An auto-incrementing ID.
- A required `bio` field.
- A required `userId` field.
- A unique constraint on `userId`.
- A relation connecting the profile to a user.
- The `onDelete: Cascade` option.

**Important:** Complete all these schema changes now. You should not need to modify the schema again for Questions 1–4.

---

## Step 3: Reset and Migrate the Database

The new schema requires fresh data because posts must now belong to users. Follow these steps in order.
Also, make sure your DATABASE_URL is updated correctly. 

### A. Update .evn file with correct DATABASE_URL

```bash
DATABASE_URL="postgresql://<username>@localhost:5432/<database>"
```

Replace username with your Postgres user name and database with your database name.

### B. Install all dependencies 

```bash
npm install
```

This will install all the dependencies mentioned in package.json.


### C. Reset the Existing Database

```bash
npx prisma migrate reset
```

**Warning:** This permanently deletes the existing data in the database being reset. Use only your development database.

### D. Create and Apply the New Migration

```bash
npx prisma migrate dev --name add_relations
```

This creates and applies a migration for your schema changes.

### E. Generate Prisma Client

```bash
npx prisma generate
```

### F. Seed the Database

```bash
npx prisma db seed
```

This creates fresh users, posts connected to users, and profiles for selected users.

You do not need to manually assign posts to users.

---

## Step 4: Start the Application

Start your Express application using the command already configured in your project's `package.json`.

For example, if the project has a development script, use:

```bash
npm run dev
```

If your project uses a different start command, use that command instead.

---

## Question 1: One-to-Many — User and Post

**Task:** Understand and verify the relationship between users and posts. (No coding required)

### Requirements

- One user can have multiple posts.
- Each post belongs to one user.
- Each post stores the associated user's ID.

### How to Check

Use your API testing tool to call:

```http
GET /users
```

```http
GET /posts
```

Identify a user who has multiple posts and note the relationship.

No additional schema changes are required.

---

## Question 2: Connect a Post to an Existing User

**Task:** Update the existing endpoint to connect a new post to a user.

**File:** `src/routes/posts.route.js`

**Endpoint:** `POST /posts`

### Requirements

- Accept `imageUrl`, `caption`, `location`, and `userId` in the request body.
- Connect the post to an existing user using Prisma's `connect` operation.
- Return the created post with its associated user.
- Update `GET /posts` so each post includes its associated user.

### How to Check

1. Call `GET /users` and select a valid user ID.
2. Send a POST request to `/posts` with the required fields and that user's ID.
3. Check that the response includes the created post and its associated user.
4. Call `GET /posts` and verify that the new post appears with its user information.

---

## Question 3: Cascade Delete

**Task:** Verify that deleting a user also deletes their associated posts.

**File:** `src/routes/user.route.js`

**Endpoint:** `DELETE /users/:id`

### Requirements

- Use the existing delete endpoint.
- Do not add separate post-deletion logic.
- Verify the behavior of `onDelete: Cascade`.

### How to Check

1. Use `GET /posts` to identify posts belonging to a particular user.
2. Delete that user using `DELETE /users/:id`.
3. Call `GET /posts` again.
4. Verify that the deleted user's posts are gone and other users' posts remain.

Use test data carefully because deletion cannot be undone easily.

---

## Question 4: One-to-One — User and Profile

**Task:** Create and retrieve profiles associated with users.

A new file is already created:

```text
src/routes/profile.route.js
```

### Implement These Endpoints

- `POST /profiles`: Create a profile and connect it to an existing user.
- `GET /profiles`: Retrieve profiles along with their associated users.

Register the new profile router in your main Express application file, alongside the existing User and Post routers.

### How to Check

1. Use `GET /users` to identify a user who does not already have a profile.
2. Send a POST request to `/profiles` with the profile's bio and the selected user's ID.
3. Call `GET /profiles`.
4. Verify that the profile and its associated user are returned.
5. Try creating another profile for the same user and observe the unique constraint.

**Note:** In the provided seed data, David and Emma do not have profiles initially.

---

## Question 5: Many-to-Many — Student and Course

**Task:** Understand how students and courses can have a many-to-many relationship.

### Requirements

- A student can enroll in multiple courses.
- A course can have multiple students.
- Understand how Prisma represents this relationship.
- Understand how to connect an existing student to an existing course.
- Understand how to retrieve a student along with their courses.

**Important:** This is a separate schema example. Do not modify the main project's schema for this question.

---

## Final Submission Checklist

- [ ] Pulled the latest project changes from `main`.
- [ ] Updated `schema.prisma` before running migrations.
- [ ] Reset the development database and applied the new migration.
- [ ] Generated Prisma Client and ran the updated seed file.
- [ ] Verified the User–Post one-to-many relationship.
- [ ] Updated `POST /posts` to connect a post to an existing user.
- [ ] Updated `GET /posts` to return associated user information.
- [ ] Verified cascade delete.
- [ ] Implemented and tested `POST /profiles` and `GET /profiles`.
- [ ] Understood the separate Student–Course many-to-many example.
