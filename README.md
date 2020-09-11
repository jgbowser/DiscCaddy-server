# DiscCaddy API
See the API in action at [disccaddy.vercel.app](https://disccaddy.vercel.app)

## Summary
The DiscCaddy API is built on an Express framework and utilizes a postgreSQL database. The API is built to handle various bits of user data relating to disc golf, specifically user scorecards, user discs, and an extensive collection of the most popular discs available. <br>
The API has 5 endpoints:
1. '/api/users' - Endpoint for user registration
2. '/api/auth/login' - Endpoint for user login authentication
3. '/api/discs' - Endpoint for requesting the entire list of discs in the DiscCaddy database
4. '/api/bags' - Endpoint for handling a user's personal disc list
5. '/api/scorecards' - Endpoint for handling a user's scorecards

## Dependencies and Docs

postgreSQL [postgreSQL docs](https://www.postgresql.org/docs/12/index.html)<br>
Express [express docs](https://expressjs.com/)


1. cors - middleware for enabling cross origin resource sharing [cors docs](https://www.npmjs.com/package/cors)
2. dotenv - loads variables from .env files to process.env [dotenv docs](https://www.npmjs.com/package/dotenv)
3. helmet - secure express apps by setting/hiding http headers [helmet docs](https://helmetjs.github.io/)
4. knex - SQL query builder for postgreSQL and various other SQL databases [knex docs](https://helmetjs.github.io/)
5. morgan - http request logger middleware [morgan docs](https://www.npmjs.com/package/morgan)
6. pg - postgres drivers needed for winston and knex [pg docs](https://www.npmjs.com/package/pg)
7. winston - creates a log file of http requests [winston docs](https://www.npmjs.com/package/winston)
8. xss - filters cross site scripting from user input [xss docs](https://www.npmjs.com/package/xss)
9. chai - test assertion library, pairs with mocha [chai docs](https://www.chaijs.com/)
10. mocha - test framework [mocha docs](https://mochajs.org/)
11. nodemon - monitors for code changes and refreshes server [nodemon docs](https://nodemon.io/)
12. postgrator(-cli) - command line SQL database migration tool [postgrator docs](https://www.npmjs.com/package/postgrator-cli?activeTab=readme)
13. supertest - http assertion tool to be used with mocha/chai [supertest docs](https://www.npmjs.com/package/supertest)