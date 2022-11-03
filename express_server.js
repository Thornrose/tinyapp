////////////// Config
/////////////////////

const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  urlChecker
} = require('./helpers');

const app = express();
const PORT = 8080;     // using default port 8080

app.use(express.urlencoded({ extended: true })); // POST-related body-parser, must stay before all other routing
app.use(cookieSession({
  name: 'session',
  keys: ['firstKey', 'secondKey', 'thirdKey']
}));

app.set('view engine', 'ejs');

/////////// Databases
/////////////////////

// databases - example user and url for testing and structure reference

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'test'
  }
};

const urlDatabase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'userRandomID'
  }
};

//////////// Listener
/////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/////////////// Routing
/////////////////////

// Register

app.get('/register', (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id]
  };

  if (templateVars.user) {
    return res.redirect('/urls');
  }

  res.render('user_register', templateVars);
});

app.post('/register', (req, res) => {
  const newUserID = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  if (!newEmail || !newPassword) {
    return res.status(400).send('Bad Request: Missing details');
  } else if (getUserByEmail(newEmail, users)) {
    return res.status(400).send('Bad Request: User already exists in database');
  }

  users[newUserID] = {
    id: newUserID,
    email: newEmail,
    password: hashedPassword
  };

  req.session.user_id = newUserID;

  res.redirect('urls');
});

// Login

app.get('/login', (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id]
  };
  if (templateVars.user) {
    return res.redirect('/urls');
  }

  res.render('user_login', templateVars);
});

app.post('/login', (req, res) => {
  const reqPassword = req.body.password;
  const reqUser = getUserByEmail(req.body.email, users);

  if (!reqUser) {
    return res.status(403).send('Forbidden: User not found in database');
  }
  if (!bcrypt.compareSync(reqPassword, reqUser.password)) {
    return res.status(403).send('Forbidden: Incorrect password');
  }

  req.session.user_id = reqUser.id;

  res.redirect('/urls');
});

// Logout

app.post('/logout', (req, res) => {
  req.session = null;

  res.redirect('/login');
});

// home

app.get('/', (req, res) => {

  res.redirect('/login');
});

// browse

app.get('/urls', (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id],
    urls: urlsForUser(id, urlDatabase)
  };

  res.render('urls_index', templateVars); // passing template name and variable
});

// add (post)

app.post('/urls', (req, res) => {         // POST FORM for new URLs
  const id = req.session.user_id;
  const templateVars = {
    user: users[id],
    urls: urlDatabase
  };

  if (!templateVars.user) {
    return res.status(403).send('Forbidden: You cannot shorten URLs because you are not logged in!');
  }

  if (!req.body.longURL) {
    return res.status(400).send('Bad Request: URL field was left blank!');
  }

  const randomURL = generateRandomString();
  urlDatabase[randomURL] = {
    longURL: req.body.longURL,
    userID: id
  };

  res.redirect(`/urls/${randomURL}`); // temporary: respond with 'Ok'
});

app.get('/urls/new', (req, res) => {      // must stay before get /urls/:id
  const id = req.session.user_id;
  const templateVars = {
    user: users[id]
  };

  if (!templateVars.user) {
    return res.redirect('/login');
  }

  res.render('urls_new', templateVars);
});

// read

app.get('/urls/:id', (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id],
    id: req.params.id,
    urls: urlDatabase
  };

  if (!templateVars.user) {
    return res.status(403).send('Forbidden: Please log in to access individual URL pages!');
  }

  if (!urlChecker(templateVars.id, urlDatabase)) {
    return res.status(404).send('Not found: not a valid short link!');
  }

  if (urlDatabase[templateVars.id].userID !== id) {
    return res.status(403).send('Forbidden: You do not own this URL page!');
  }

  res.render('urls_show', templateVars);
});

//edit

app.post('/urls/:id', (req, res) => {
  const id = req.session.user_id;
  const urlID = req.params.id;

  if (!id) { // for this series of checks I tried setting up as helper function, but return values went out of scope
    return res.status(403).send('Forbidden: Please log in to access individual URL pages!');
  }
  if (!users[id]) {
    return res.status(403).send('Forbidden: Please register to access individual URL pages!');
  }
  if (id !== urlDatabase[urlID].userID) {
    return res.status(403).send('Forbidden: You do not own this URL page!');
  }


  urlDatabase[urlID].longURL = req.body.longURL;

  res.redirect(`/urls`);
});

// delete

app.post('/urls/:id/delete', (req, res) => {
  const id = req.session.user_id;
  const urlID = req.params.id;

  if (!id) {
    return res.status(403).send('Forbidden: Please log in to access individual URL pages!');
  }
  if (!users[id]) {
    return res.status(403).send('Forbidden: Please register to access individual URL pages!');
  }
  if (id !== urlDatabase[urlID].userID) {
    return res.status(403).send('Forbidden: You do not own this URL page!');
  }


  delete urlDatabase[req.params.id];

  res.redirect('/urls');
});

// shortened redirect

app.get('/u/:id', (req, res) => {
  const urlID = req.params.id;
  
  if (!urlDatabase[urlID]) {
    return res.status(404).send('Not Found: Invalid TinyApp link');
  }

  res.redirect(urlDatabase[urlID].longURL);
});

// 404 message for all other routes - must remain as final route in this file

app.get('/*', (req, res) => {
  return res.status(404).send('Not Found: Page Not Found');
})