#  News Aggregator API

This API provides user registration, authentication, and news fetching functionalities. Users can register, login, set their news preferences, and fetch news articles based on their preferences.

## Features

- **User Registration:** Register a new user.
- **Login User:** Log in a user.
- **Get user news preference:** Retrieve the news preferences for the logged-in user.
- **Update user news preference:** Update the news preferences for the logged-in user.
- **Fetch news article:** Fetch news articles based on the logged-in user's preferences..

## Installation

1. Clone the repository:

git clone https://github.com/AirtribeProjects/NewsAggregatorAPI.git

2. Navigate to the project directory:

cd NewsAggregatorAPI

3. Install dependencies:

npm install express
npm install axios
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install fs

## Usage

1. Start the server:

node app.js

2. Use Postman or any HTTP client to interact with the API.

## Endpoints

- **Register a New User:** 
    URL: `/register`
    Method: POST
    Request Body:
    {
        "username": "User's username",
        "email": "User's email",
        "password": "User's password"
        "preferences": "Users news preference"
    }

- **Log in a User:** 
     URL: `/login`
     Method: POST
     Request Body:
    {
        "username": "User's username",
        "password": "User's password"
    }
- **Retrieve News Preferences:** 
    URL : `/preferences`
    Method: GET
    Headers:
        Authorization: access token
- **Update News Preferences:** 
    URL: `PUT /preferences`
    Headers:
        Authorization: access token
    Request Body:
        {
        "preferences": "User's news preferences"
        }
- **Fetch News Articles:** 
    URL : `/preferences`
    Method: GET
    Headers:
        Authorization: access token

 ## Error Handling

- Invalid requests will receive appropriate HTTP status codes along with error messages in the response body.
- Authentication and authorization errors will return a 401 status code.
- Input validation errors will return a 400 status code.










