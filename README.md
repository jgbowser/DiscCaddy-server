# DiscCaddy API
See the API in action at [disccaddy.vercel.app](https://disccaddy.vercel.app)

## Summary
The DiscCaddy API is built on an Express framework and utilizes a postgreSQL database. The API is built to handle various bits of user data relating to disc golf, specifically user scorecards, user discs, and an extensive collection of the most popular discs available. <br>
The API's base url is : 'https://stark-waters-10224.herokuapp.com/api'
The API has 5 endpoints:
1. '/users' - Endpoint for user registration
2. '/auth/login' - Endpoint for user login authentication
3. '/discs' - Endpoint for requesting the entire list of discs in the DiscCaddy database
4. '/bags' - Endpoint for handling a user's personal disc list
5. '/scorecards' - Endpoint for handling a user's scorecards

## '/users'
The users endpoint accepts POST requests to create new user accounts.<br>
User details should be sent in the request body in JSON format.<br>
the required fields to POST a new user account are:
1. 'first_name' - string containing the new user's first name
2. 'last_name' - string containing the new user's last name
3. 'email' - string containing the new user's email
4. 'username' - string containing a username, will be validated as unique by the API
5. 'password' - string containing a password. Must include at least: 1 uppercase, 1 lowercase, 1 special character, 1 number and be between 8 and 72 characters. password is hashed using bcrypt

A succesful POST of a new user will return the newly created user object with all required fields serialized as well as the creation date and user ID.

## '/auth/login
The auth/login endpoint accepts POST requests to validate user login requests.<br>
Login details should be sent in the request body in JSON format.<br>
the required fields to POST a login request are:
1. 'username' - string containing username
2. 'password' - string containing password

The username is checked against the list of users in the database then the password is validated by comparing it to the hashed password stored in the database.<br>
A successful POST of a user login will return a response body containing an authToken that must be stored in the users browser storage to access the discs, bags, and scorecards endpoints.

## '/discs'
The discs endpoint accepts GET requests to receive the full list of discs in the DiscCaddy database. the endpoint requires authorization.<br>
the request header should include:<br>
{ 'Authorization': 'Bearer AUTH-TOKEN-FROM-LOGIN-RESPONSE }<br>
A successful GET request will return an array of all discs in the database in the response body.<br>
Each disc includes:
1. 'id' - unique integer id for each disc
2. 'brand' - string containing the manufacturer's name
3. 'name' - string containing the disc name
4. 'speed' - numeric value representing the speed of the disc
5. 'glide' - numeric value representing the glide of the disc
6. 'turn' - numeric value representing the turn of the disc
7. 'fade' - numeric value representing the fade of the disc

## '/bags'
The bag endpoint accepts GET and POST requests. GET returns the requested user's list of saved discs. POST adds new discs to the user's saved discs.<br>
Both methods require authorization in the request header.<br>
the request header should include:<br>
{ 'Authorization': 'Bearer AUTH-TOKEN-FROM-LOGIN-RESPONSE }<br>
No body is required for GET.<br>
A successful GET request returns an array of the user's saved discs. Each saved disc includes:
1. 'id' - unique integer id for the saved disc
2. 'user_id' - id of the user, used to return only the user's personal discs.
3. 'brand' - string containing the manufacturer's name
4. 'name' - string containing the disc name
5. 'speed' - numeric value representing the speed of the disc
6. 'glide' - numeric value representing the glide of the disc
7. 'turn' - numeric value representing the turn of the disc
8. 'fade' - numeric value representing the fade of the disc<br>

the POST method requires a request body that should include:
1. 'disc_id' - the associated unique id of the disc
A successful POST of a new user saved disc returns the newly created user disc object in the same format as the GET request.

## '/scorecards'
The scorecards endpoint accepts GET and POST requests. GET returns the requested user's list of saved scorecards. POST adds a new scorecard to the user's scorecard list.<br>
Both methods require authorization in the request header.
the request header should include:<br>
{ 'Authorization': 'Bearer AUTH-TOKEN-FROM-LOGIN-RESPONSE }<br>
No body is required for GET.<br>
A succesful GET request returns an array of the user's saved scorecards. Each saved scorecard includes:
1. 'id' - unique integer id for each scorecard
2. 'user_id' - id of the user the scorecard belongs to
3. 'date_created' - string containing the time the scorecard was POSTed
4. 'hole_1 ... hole_18' - integer representing the number of strokes for holes 1 - 18.

the POST method requires a request body that should include:
1. 'hole_1 ... hole_18' - integer representing the users score for each hole.
_note:_ A partial round may be submitted as all 18 holes with values of 0 in unplayed holes, or only the holes played can be included and the unplayed holes will be inserted as 0 by the API.


## Dependencies and Docs
Express was used as the framework for handling HTTP requests. PostgreSQL was used to handle the database. Knex.js was used to build SQL queries. the full list of the tech stack used as well as dependencies and their docs can be seen below.<br>

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