////////////// Config
/////////////////////

const express = require('express');
const app = express();
const PORT = 8080;     // using default port 8080

app.set('view engine', 'ejs');


/////////////////////

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars); // passing template name and variable
});

app.get('/urls/new', (req, res) => {      // must stay before get /urls/:id
  res.render('urls_new');
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});
