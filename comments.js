// Create web server
// 1. Create web server
// 2. Create route
// 3. Create controller
// 4. Create view

const express = require('express');
const bodyParser = require('body-parser');
const comments = require('./comments');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(comments.getComments());
});

app.post('/add', (req, res) => {
  const { comment } = req.body;
  comments.addComment(comment);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});
