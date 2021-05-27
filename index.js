const express = require('express'); // load express
const app = express();
const find = require('array-find')
const port =  
const multer = require('multer');
const slug = require('slug');
const mongo = require('mongodb');

require('dotenv').config();

// where the uploaded files go
let upload = multer({dest: 'public/upload/'})

// database connect
let db = null;
let url = 'mongodb+srv://' + process.env.DB_HOST;

mongo.MongoClient.connect(
    url, { 
        useUnifiedTopology: true, 
    },
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
app.use(express.urlencoded({ extended : true }));
// routing
app.get('/', index)
app.get('/list', users)
app.get('/login', login)
app.get('/register', register)
app.get('/update', update)
app.get('/:id', person)
app.post('/', upload.single('avatar'), add)
app.post('/update', addUpdate)
app.use(notFound);


// port of server
app.listen(port, server);

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

//detail page
function person(req, res, next) {
    let id = req.params.id;
    console.log(id)

    db.collection('users').findOne({
        _id:  mongo.ObjectID(id)
    }, done)

    function done(err, data) {
        if(err) {
            next(err)
        } else {
            res.render('detail.ejs', {data: data});
            console.log('person found succesfully')
          }
        }
      
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
function update(req, res, data) {
    res.render('update', {data: data })
    
}

function addUpdate(req, res, next) {
    
    //console.log(req.body)
    db.collection('users').updateOne({
        _id: mongo.ObjectID('60abee196375cf653becd28f')},
        { $set: {
            name: req.body.name
        }       
    }, done)

    function done(err, data) {
        if(err) {
            next(err)
        } else {
            res.redirect('/' + mongo.ObjectID('60abee196375cf653becd28f')) // route to profile
            console.log('data update succes', req.body.name)
        }
    }
}

function notFound(req, res, next) {
    res.status(404).render('404');
}