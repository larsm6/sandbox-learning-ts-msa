# 1st Typescript express project

This project has been created by using
```
npx express-generator-typescript "project name (default is express-gen-ts)"
```
from the repository of [seanpmaxwell/express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript)

## 1st run:

You can adjust the routes/Users.ts in order to resolve the linting errors and run

```
# if you didn't use the express-generator-typescript initialization of this project:
npm install
# run the dev start command:
npm run start:dev
```
Go to [http://localhost:3000](http://localhost:3000) to see how everything's working out.
Nice! You should see some entries from the provided mock-data.

## 2nd step: Build for production

Let's build for production & start afterwards

```
npm run build
npm run start
```
Go to [http://localhost:8081](http://localhost:8081) to see how everything's working out.
Nice! It didn't crash ;). But this time you won't see a lot of entries, because there isn't any database connection provided and your src/daos/User/UserDao.ts file looks quite empty right now.

To resolve this we are going to continue our learnings by attaching a mssql database in 03rd-Prj-Consuming-a-MS-SQL-Server.
But if you don't know anything about docker right now. I would suggest to have a look into 02nd-Prj-Using-Docker.