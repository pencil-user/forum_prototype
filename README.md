# Installation instructions:

**backend:**

1. use forum_proj_dusan.sql file to create a MySQL database with test data 

2. go to server folder and install necessary packages with "npm install" command

3. configure server parameters in config/default.json to connect to database

4 run with "node ."

**frontend:**

1. go to client folder and install necessary packages with "npm install" command

2. run with "npm start"

------------------------

- Admin username is "admin" and password is "admin123"

- Server is deliberately slowed down to showcase chaching

- Forum uses markdown rules for formatting posts

- only admin can lock and pin threads. Only admin can delete and edit posts and threads not his own

- It is possible to register, but admin needs to approve you so you may post.

- search only looks for titles at the moment

Dušan Benašić dbenasic@zoho.com