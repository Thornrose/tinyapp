# TinyApp Project

TinyApp is an example full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

The purpose of this project was to become familiar with a variey of tools and concepts, ranging from HTTP routing and modular coding to password hashing and cookie encryption. 

## Final Product

!["Main URLs page when logged in"](https://github.com/Thornrose/tinyapp/blob/main/docs/urls-page.png?raw=true)
!["URL Details page"](https://github.com/Thornrose/tinyapp/blob/main/docs/url-details-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Open a browser of your choice and access the application by going to `localhost:8080/`.
  - The app is set to run on port 8080 by default, if you need to change this for any reason, simply open up `node express_server.js` in your favorite editor and change the `PORT` value.
- Navigate to the register page (in the top-right corner of the page) and register using the email/password format.
- Once registered you will be logged in and able to create, edit and delete tiny links at your leisure.


## Functionality

- 