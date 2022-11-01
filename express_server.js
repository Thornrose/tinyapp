////////////// Config
/////////////////////

const express = require('express');
const app = express();
const PORT = 8080;     // using default port 8080

app.set('view engine', 'ejs');


/////////////////////

function generateRandomString () {
  const randomString = Math.random().toString(36).replace('0.', ''); // disclaimer: not completely understanding the deep mechanics of .toString(36)
  return randomString.slice(0, 6);
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.use(express.urlencoded({ extended: true })); // POST-related body-parser, must stay before all other routing


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

app.post('/urls', (req, res) => {         // POST FORM for new URLs
  console.log(req.body); // Log the POST request body to the console
  res.send('Ok'); // temporary: respond with 'Ok'
})

app.get('/urls/new', (req, res) => {      // must stay before get /urls/:id
  res.render('urls_new');
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});
