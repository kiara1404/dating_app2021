const express = require('express'); // load express
const app = express();
const port = 1996;
const bodyParser = require('body-parser');
//const multer = require('multer');
const slug = require('slug');


// set templating engine
app.set('view engine', 'ejs');
//where the templates are stored
app.set('views', 'view');
// public folder location
app.use(express.static('public'));
app.get('/', index)
app.get('/login', login)
app.listen(port, server);

function server() {
    console.log('The server is running succesfully at http://localhost:1996 !')
}

function index(req, res) {
    res.render('index');
}

function login(req,res) {
    res.render('login')
}