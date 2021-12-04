# Vanilla JS: LinkedPic

1. Background & Motivation
2. Frontend

  
## 1. Background & Motivation

Web-based applications are becoming the most common way to build a digital capability accessible to a mass audience. While there are modern tools that help us build these rapidly, it's important to understand the fundamental Javascript-based technology and architectures that exist, both to gain a deeper understanding for when these skills may be needed, but also to simply understand the mechanics of fundamental JS. Even when working with a high level framework like React, understanding (in-concept) the code that is transpiled-to will ensure you're a more well rounded web-based engineer.

This assignment consists of building a **front-end** website in Vanilla JS (no React or other frameworks). This front-end will interact with a RESTFUL API HTTP back-end that is built in Python/Flask.

The page is a single page app (SPA). Single page apps give websites an "app-like feeling", and are characterised by their use of a single full load of an initial HTML page, and then using AJAX/fetch to dynamically manipulate the DOM without ever required a full page reload. In this way, SPAs are generated, rendered, and updated using Javascript. Because SPAs don’t require a user to navigate away from a page to do anything, they retain a degree of user and application state. In short, this means you will only ever have `index.html` as your HTML page, and that any sense of "moving between pages" will just be modifications of the DOM.

## 2. Frontend

To work with your frontend code locally with the web server, you will have to run another web server to serve the frontend. To do this, in frontend folder you can run:

`$ python3 -m http.server`

This will start up a second HTTP server where if you navigate to `http://localhost:8000` (or whatever URL it provides) it will run your `index.html`

### 2.1. Registration & Login (15%)

This focuses on the basic user interface to register and log in to the site.

#### 2.1.1. Login
 * When the user isn't logged in, the site shall present a login form that contains:
   * a username field (text)
   * a password field (password)
   * a password confirm field (password)
   * submit button to login
 * When the submit button is pressed, if the two passwords don't match the user should receive an error popup. If they do match, the form data should be sent to `POST /auth/login` to verify the credentials. If there is an error during login an appropriate error should appear on the screen.

#### 2.1.2. Registration
 * When the user isn't logged in, the login form shall provide a link/button that opens the register form. The register form will contain: 
   * a username field (text)
   * a password field (password)
   * a confirm password field (password) - not passed to backend, but error thrown on submit if doesn't match other password
   * an email address (text)
   * a name (text)
   * submit button to register
 * When the submit button is pressed, the form data should be sent to `POST /auth/signup` to verify the credentials. If there is an error during login an appropriate error should appear on the screen.

#### 2.1.3. Error Popup
 * Whenever the frontend or backend produces an error, there shall be an error popup on the screen with a message (either a message derived from the backend error rresponse, or one meaningfully created on the frontend).
 * This popup can be closed/removed/deleted by pressing an "x" or "close" button.

### 2.2. Basic Feed (10%)

Milestone 2 focuses on fetching feed data from the API.

#### 2.2.1. Basic Feed

The application presents a "feed" of user content on the home page derived `GET /user/feed`.

The posts are displayed in reverse chronological order (most recent posts first). 

Each post should display:
1. Who the post was made by
2. When it was posted
3. The image itself
4. How many likes it has (or none)
5. The post description text
6. How many comments the post has


## 2.3. Advanced Feed (10%)

### 2.3.1. Show Likes
* Allow a user to see a list of all users who have liked a post.

### 2.3.2. Show Comments
* Allow a user to see all the comments on a post. 

### 2.3.3. Ability for you to like content
* A logged in user can like a post on their feed and trigger a api request (`PUT /post/like`)

## 2.4. Other users & profiles

### 2.4.1. Profile View / Profile View
* Let a user click on a user's name from a post and see a page with the users name, and any other info the backend provides.
* The user can see on this page all posts made by that person.
* The user can see their own page as well.

### 2.4.2. Follow
* Let a user follow/unfollow another user too add/remove their posts to their feed via (`PUT user/follow`)
* Add a list of everyone a user follows in their profile page.
* Add just the count of followers / follows to everyones public user page

## 2.5. Adding & updating content

### 2.5.1. Adding a post
* Users can upload and post new content from a modal or seperate page via (`POST /post`)

### 2.5.2. Updating & deleting  a post
* Let a user update a post they made or delete it via (`DELETE /post`) or (`PUT /post`).

### 2.5.3. Leaving comments
* Users can write comments on "posts" via (`POST post/comment`)

### 2.5.4. Updating the profile
* Users can update their personal profile via (`PUT /user`) E.g:
  * Update email address
  * Update password
  * Update name

## 2.6. Additional Components

### 2.6.1. Infinite Scroll
* Instead of pagination, users an infinitely scroll through results. 

## 3. Backend

### 3.1. Exploring the DB

If you're comfortable with basic SQL, in the `backend` folder, you can upload the `db/test.sqlite3` file to an online explorer such as (sqliteonline.com)[sqliteonline.com].

To get started, though, here are some usernames that you can have test accounts "follow":
* Andrew
* Ava
* Sarah
* Matthew
* Jack
* Harper
* Zoe
* Amelia

For example, after registering a user, you can call `PUT /user/follow` to follow one of these users. After that, if you call `GET /user/feed` you will be able to see updates on the feed.
