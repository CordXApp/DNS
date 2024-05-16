# CordX DNS
CordX DNS is a comprehensive RESTful API for managing our Domain Name System.

---

### Router
The router is a key component of our application. It is responsible for directing incoming requests to the appropriate handler functions based on the request's URL and HTTP method.

Our router is set up to handle the following routes:

- `GET /`: This route serves the homepage of our application.
- `GET /health`: This route is used to verify the server is online and check usage.
- `GET /domain/view/:domain`: This route is used to view a domain from our database.

Each route is associated with a handler function located in the [handlers](./src/server/handlers/) directory. These handler functions interact with the model layer of our application to retrieve or modify data.

For more information about how our router is implemented, please refer to the source code in the [routes](./src/server/routes/) directory.

---

### Prisma

Prisma is an open-source database toolkit. It replaces traditional ORMs and makes database access easy with an auto-generated and type-safe query builder that's tailored to your database schema. Here are some commands you might find useful:

- `db:init`: This command generates Prisma Client based on our [Prisma Schema](./src/prisma/schema.prisma). Prisma Client is an auto-generated database client that enables type-safe database access and reduces boilerplate. You can think of it as a query builder that you can use to build database queries in TypeScript or JavaScript.

- `db:push`: This command pushes the state of our [Prisma Schema](./src/prisma/schema.prisma) to our database without using migrations. It creates the database if it doesn't exist, creates the schema if it doesn't exist, and updates the schema to match our Prisma schema. This command is ideal for prototyping and local development where you don't need to version schema changes.

To run these commands, use your terminal and make sure you're in the root directory of the project.

---

## Getting Started

To get the application up and running, you'll need to run a few commands. Here's what each command does:

- `app:build`: This command runs the TypeScript compiler (`tsc`) which compiles your TypeScript code into JavaScript. The output is typically placed in a directory named `build`.

- `app:dev`: This command runs your application in development mode using `nodemon`. `nodemon` is a utility that automatically restarts your application whenever file changes in the directory are detected, making it useful for development.

- `app:prod`: This command runs the compiled JavaScript code in production mode. It starts the Node.js application using the compiled `app.js` file in the `build` directory.

To run these commands, use your terminal and make sure you're in the root directory of the project.

