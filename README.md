# Back End Project: Invent API

## Summary

Invent is a React inventory app.

[Hosted Version](https://invent-app.netlify.app)

[Front End Project](https://github.com/ismaelpaul/fe-invent)

## Getting started

### 1. Clone this repository

```
https://github.com/ismaelpaul/be-invent.git
cd be-invent
```

### 2. Install packages and dependencies

```
npm install
```

### 3. Set up environment variables

```
MONGO_URI=<URI used to connect to MongoDB database>
JWT_SECRET=<Your secret key>
EMAIL_HOST=<The email provider>
EMAIL_USER=<The email used to receive messages from the app>
EMAIL_PASS=<The email password>
CLIENT_URL=<Address of the client, e.g. http://localhost:3000/>
CLOUDINARY_URL=<Cloudinary API base URL>
```

### 4. Run server

```
npm start
```

## Endpoints

### Users

| **Description** | **Method** | **URL**                              |
| --------------- | :--------: | ------------------------------------ |
| Register        |    POST    | /api/user/register                   |
| Login           |    POST    | /api/user/login                      |
| Logout          |    GET     | /api/user/logout                     |
| Get profile     |    GET     | /api/user/profile                    |
| Login status    |    GET     | /api/user/loggedin                   |
| Update profile  |   PATCH    | /api/user/update-profile             |
| Update password |   PATCH    | /api/user/update-password            |
| Forgot password |    POST    | /api/user/forgot-password            |
| Reset password  |    PUT     | /api/user/reset-password/:resetToken |

### Items

| **Description** | **Method** | **URL**           |
| --------------- | :--------: | ----------------- |
| Add item        |    POST    | /api/products     |
| Get all items   |    GET     | /api/products     |
| Get single item |    GET     | /api/products/:id |
| Delete item     |   DELETE   | /api/products/:id |
| Update item     |   PATCH    | /api/products/:id |

### Contact

| **Description**      | **Method** | **URL**      |
| -------------------- | :--------: | ------------ |
| Send contact message |    POST    | /api/contact |
