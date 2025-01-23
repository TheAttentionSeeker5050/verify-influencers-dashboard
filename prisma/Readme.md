# Prisma migration

## Explanation of the models

## Applying Database Migrations on PostgreSQL schema 
After defining your models, the next step is to apply these changes to your PostgreSQL database by running migrations. Migrations are used to update the database schema in a controlled and repeatable way.

1. Create Migration Files: Use Prisma CLI to create migration files based on the models you defined in the schema.prisma file.

```bash
npx prisma migrate dev --name init
```
​

This command creates a new migration file with the name init and applies it to your database. The migrate dev command is used for local development and includes a prompt to reset the database if needed.

2. Check the Migration Status: Verify that the migration was applied successfully by checking the status of your database.

```bash
npx prisma migrate status
```
​

This command shows the current state of your migrations and ensures that your database schema is up to date.

3. Generate Prisma Client: After applying migrations, generate the Prisma client to reflect the changes in your database schema.

```bash
npx prisma generate
```
​

This command regenerates the Prisma client in the node_modules directory, enabling you to use it to interact with your updated database schema.

4. Verify the Changes: You can use Prisma Studio, a visual editor for your database, to verify the changes and inspect your data.

```bash
npx prisma studio
```
​
## Initializing Prisma Client

With your environment variables set up, you can now initialize the Prisma client to connect to your PostgreSQL database. The Prisma client will allow you to interact with your database through your Next.js application.

1. Create the lib/prisma.js File: In your project, create a new directory called lib (if it doesn't already exist). Inside the lib directory, create a file named prisma.js.

```bash
mkdir lib
touch lib/prisma.js
```

2. Initialize and Export the Prisma Client: In lib/prisma.js, initialize the Prisma client and export it for use throughout your project.

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

This code imports the PrismaClient class from the @prisma/client package, creates an instance of the Prisma client, and exports it. This client will be used to perform database operations.

3. Using Prisma Client in API Routes: Now you can use the Prisma client in your Next.js API routes or any other part of your application. For example, create an API route to fetch all users from the database:

```javascript
import prisma from '../../lib/prisma';


export default async function handle(req, res) {
  const users = await prisma.user.findMany();
  res.json(users);
}
```

This API route uses the Prisma client to fetch all records from the User model and returns them as a JSON response.

4. Testing the Connection: Start your Next.js development server to test the database connection and ensure everything is working correctly.

```bash
npm run dev
```

## Sources
[Prisma implementation guide with Next.js](https://www.dhiwise.com/post/building-a-full-stack-app-with-nextjs-postgres-and-prisma)