# Installation instructions:

**backend:**

1. use forum_proj_dusan.sql file to create a MySQL database with test data 

2. go to backend folder and install necessary packages with "npm install" command

3. configure server parameters in config/default.json to connect to database

4. run with "node ."

**frontend:**

1. go to frontend folder and install necessary packages with "npm install" command

2. run with "npm start". Make sure backend is already running

------------------------

- Admin username is "admin" and password is "admin123"

- Backend is deliberately slowed down to showcase chaching

- Frontend uses React Query and Pullstate for state management

- Forum uses markdown rules for formatting posts

- Only admin can lock and pin threads. Only admin can delete and edit posts and threads not his own

- It is possible to register, but admin needs to approve you so you may post.

- Search only looks for titles at the moment

Dušan Benašić dbenasic@zoho.com