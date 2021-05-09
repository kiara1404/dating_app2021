const express = require('express'); // load express
const app = express();
const find = require('array-find')
const port = 1996;
//const multer = require('multer');
const slug = require('slug');

let data = [
    {
        id: 'kiara',
        name: 'kiara',
        email: 'test@test.nl',
        profession: 'photographer',
        bio: 'I am a starting professional photographer who likes to think outside of the box'
    },
    {
        id: 'gaby',
        name: 'gaby',
        email: 'test@test.nl',
        profession: 'model',
        bio: 'I love all types of modeling but my preference is for fashion'
    }
]


// set templating engine
app.set('view engine', 'ejs');
//where the templates are stored
app.set('views', 'view');
// public folder location
app.use(express.static('public'));
app.use(express.urlencoded());
// routing
app.get('/', index)
app.get('/login', login)
app.get('/register', register)
app.get('/:id', person)
app.post('/', add)

// port of server
app.listen(port, server);

function list(req, res) {
    res.render('list')
}

function person(req, res) {
    let id = req.params.id;
    let person = find(data, function (value) {
        return value.id === id
    })
    
    res.render('detail.ejs', {data:person})
}
function server() {
    console.log('The server is running succesfully at http://localhost:1996 !')
}

function index(req, res) {
    res.render('index');
}

function login(req,res) {
    res.render('login')
}

function register(req, res) {
    res.render('register')
}

function add(req, res) {
    let id = slug(req.body.name).toLowerCase();

    data.push({
        id: id,
        name: req.body.name,
        email: req.body.email,
        profession: req.body.profession,
        bio: req.body.bio
    })

    res.redirect('/' + id)
}