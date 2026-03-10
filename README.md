Blog Platform

A full-stack blog platform where users can create posts, like posts, and interact through comments.
Built with React, Node.js, Express, MongoDB, and TailwindCSS.

This project demonstrates full-stack development, REST API design, authentication, and modern UI styling.

Features
Authentication

User registration

User login

JWT authentication

Protected routes

Blog Posts

Create posts

View all posts

Like posts

Display author and date

Comments

Add comments

Edit comments

Delete comments

Comment ownership protection

UI / UX

Modern dashboard

Dark / light theme toggle

TailwindCSS styling

Responsive layout

Tech Stack
Frontend

React (Vite)

TailwindCSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

CORS

Installation

Clone the repository:

git clone https://github.com/nathanielkiwa/blog-platform.git

Go into the project:

cd blog-platform
Backend Setup
cd server
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

Start the server:

npm run dev
Frontend Setup
cd frontend/client
npm install
npm run dev

The frontend runs on:

http://localhost:5173

Backend API:

http://localhost:5000
API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
Posts
GET /api/posts
POST /api/posts
PUT /api/posts/:id/like
Comments
POST /api/posts/:postId/comments
PUT /api/posts/:postId/comments/:commentId
DELETE /api/posts/:postId/comments/:commentId
Future Improvements

Edit posts

Delete posts

User profiles

Image uploads

Pagination

Notifications

Author

Built by Kiwa

License

This project is open-source and available under the MIT License.
