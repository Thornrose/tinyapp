////////////// Config
/////////////////////

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // POST-related body-parser, must stay before all other routing
const PORT = 8080;     // using default port 8080

app.set('view engine', 'ejs');

// Databases and Tools
/////////////////////

const generateRandomString = function() {
  const randomString = Math.random().toString(36).replace('0.', ''); // disclaimer: not completely understanding the deep mechanics of .toString(36)
  return randomString.slice(0, 6); // this should be changed. right now only able to set lower-case letters and 0-9
};

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};

const getUserFromEmail = function(testEmail) {
  for (const user in users) {
    if (users[user].email === testEmail) {
      return users[user];
    }
  }
  return null;
};

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

//////////// Listener
/////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/////////////// Routing
/////////////////////

// Login

app.post('/login', (req, res) => {
  res.cookie('user_id', req.body.email);

  res.redirect('/urls');
});

// Logout

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');

  res.redirect('/urls');
});

// Register

app.get('/register', (req, res) => {
  const id = req.cookies['user_id'];
  const templateVars = {
    user: users[id]
  };

  console.log(users);

  res.render('user_register', templateVars);
});

app.post('/register', (req, res) => {
  const newUserID = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;

  if (!newEmail || !newPassword) {
    return res.status(400).send('Bad Request: Missing details');
  } else if (getUserFromEmail(newEmail)) {
    return res.status(400).send('Bad Request: User already exists in database');
  }

  users[newUserID] = {
    id: newUserID,
    email: newEmail,
    password: newPassword
  };
  res.cookie('user_id', newUserID);
  console.log(getUserFromEmail(newEmail));
  res.redirect('urls');
});

// home

app.get('/', (req, res) => {

  res.redirect('/urls');
});

// testing

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// browse

app.get('/urls', (req, res) => {
  const id = req.cookies['user_id'];
  const templateVars = {
    user: users[id],
    urls: urlDatabase
  };

  res.render('urls_index', templateVars); // passing template name and variable
});

// add (post)

app.post('/urls', (req, res) => {         // POST FORM for new URLs
  const randomURL = generateRandomString();
  urlDatabase[randomURL] = req.body.longURL;

  res.redirect(`/urls/${randomURL}`); // temporary: respond with 'Ok'
});

app.get('/urls/new', (req, res) => {      // must stay before get /urls/:id
  const id = req.cookies['user_id'];
  const templateVars = {
    user: users[id]
  };

  res.render('urls_new', templateVars);
});

// read

app.get('/urls/:id', (req, res) => {
  const id = req.cookies['user_id'];
  const templateVars = {
    user: users[id],
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };

  res.render('urls_show', templateVars);
});

//edit

app.post('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  urlDatabase[urlID] = req.body.longURL;

  res.redirect(`/urls`); // can we redirect to same page though? this seems less functional
});

// delete

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect('/urls');
});

// shortened redirect

app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];

  res.redirect(longURL);
});


