const express = require('express'); // load express
const app = express();
const find = require('array-find')
const port = process.env.PORT;
const multer = require('multer');
const slug = require('slug');
const mongo = require('mongodb');

require('dotenv').config();

let upload = multer({dest: 'public/upload/'})

// database connect
let db = null;
let url = 'mongodb+srv://' + process.env.DB_HOST;

mongo.MongoClient.connect(url, 
    { useUnifiedTopology: true, },
    function (err, client) {
    if (err){
         throw err
    }
    db = client.db(process.env.DB_NAME);
    console.log('Succesfully connected to MongoDB')

}
);

// set templating engine
app.set('view engine', 'ejs');
//where the templates are stored
app.set('views', 'view');
// public folder location
app.use(express.static('public'));
app.use(express.urlencoded());
// routing
app.get('/', index)
app.get('/list', users)
app.get('/login', login)
app.get('/register', register)
app.get('/:id', person)
app.get('/users', users)
app.post('/', upload.single('avatar'), add)

// port of server
app.listen(port, server);

// detail page
function person(req, res, next) {
    let id = req.params.id;

    db.collection('users').findOne({
        _id: new mongo.ObjectID(id),
    }, done)

    function done(err, data) {
        if(err) {
            next(err)
        } else {
            res.render('detail.ejs', {data:data});
            console.log('person found succesfully')
          }
        }
      
}

function server() {
    console.log('The server is running succesfully!')
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

// adding new person to database
function add(req, res, next) {
    let id = slug(req.body.name).toLowerCase();
    db.collection('users').insertOne({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profession: req.body.profession,
        bio: req.body.bio,
        avatar: req.file ? req.file.filename : null
    }, done)

    function done(err, data) {
        if(err) {
            next(err)
        } else {
            res.redirect('/' + data.insertedId) // route to new profile
            console.log('data input succes', req.body.name)
        }
    }

}

function users(req, res){
    db.collection('users').find().toArray(done)
  
    function done(err, data) {
      if(err){
        next(err)
      } else{
         res.render('list', {data: data});
        }
      }
  }