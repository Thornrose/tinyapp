////////////// Config
/////////////////////

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;     // using default port 8080

app.set('view engine', 'ejs');


/////////////////////

const generateRandomString = function() {
  const randomString = Math.random().toString(36).replace('0.', ''); // disclaimer: not completely understanding the deep mechanics of .toString(36)
  return randomString.slice(0, 6); // this needs to be fixed. right now only able to set lower-case letters and 0-9
};

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.use(express.urlencoded({ extended: true })); // POST-related body-parser, must stay before all other routing

// home
app.get('/', (req, res) => {
  res.redirect('/urls');
});

// test
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// test
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// browse
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars); // passing template name and variable
});

// add
app.post('/urls', (req, res) => {         // POST FORM for new URLs
  console.log(req.body); // Log the POST request body to the console
  const randomURL = generateRandomString();
  urlDatabase[randomURL] = req.body.longURL;
  res.redirect(`/urls/${randomURL}`); // temporary: respond with 'Ok'
});

// read/add
app.get('/urls/new', (req, res) => {      // must stay before get /urls/:id
  res.render('urls_new');
});

// read
app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});

//edit
app.post('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  urlDatabase[urlID] = req.body.longURL;
  res.redirect(`/urls`); // can we redirect to same page though? this seems less functional
})

// delete
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

// short redirect
app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


