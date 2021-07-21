# Installation instructions:

Requirments:

* at least Node 14 
* MySQL 5.x database (not 8.x)

**backend:**

1. use forum_proj_dusan.sql file to create a MySQL database with test data 

2. go to backend folder and install necessary packages with "npm install" command

3. configure parameters in backend/config/default.json to match your database

4. run with "node ." in backend folder

**frontend:**

1. go to frontend folder and install necessary packages with "npm install" command

2. run with "npm start" in fronted folder. Make sure backend is already running

------------------------

- Admin username is "admin" and password is "admin123"

- One of ordinary pre-made users has username "SomeGuy" and password "SomeGuy123"

- Backend is deliberately slowed down to simulate slow network and showcase caching

- Backend uses a custom validator, also made by me

- Frontend uses React Query and Pullstate for state management

- Forum uses markdown rules for formatting posts

- Only admin can lock and pin threads. Only admin can delete and edit posts and threads not his own

- Anyone can delete or edit their own posts and threads, except anonymous posters

- It is possible to register, but admin needs to approve you so you may post

- Search only looks for threads (title and body) at the moment

Dušan Benašić dbenasic@zoho.com