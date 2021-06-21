const express = require('express'); // load express
const app = express();
const find = require('array-find');
const port = 1996; //process.env.PORT;
const multer = require('multer');
const slug = require('slug');
const mongo = require('mongodb');
const session = require('express-session');
const sessionID = 'unniqueSessionID';
require('dotenv').config();

// where the uploaded files go
let upload = multer({ dest: 'public/upload/' });

// database connect
let db = null;
let url = 'mongodb+srv://' + process.env.DB_HOST;

mongo.MongoClient.connect(
  url,
  {
    useUnifiedTopology: true,
  },
  function (err, client) {
    if (err) {
      throw err;
    }

    db = client.db(process.env.DB_NAME);
    console.log('Succesfully connected to MongoDB');
  }
);

// set templating engine
app.set('view engine', 'ejs');
//where the templates are stored
app.set('views', 'view');
// public folder location
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: sessionID,
    resave: false,
    saveUninitialized: false,
    // store: store,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30,
      sameSite: true,
      // duration before the session is lost = 30 min
    },
  })
);
// routing
app.get('/', index);
app.get('/list', users);
app.get('/login', renderLogin);
app.get('/dashboard', dashboard);
app.get('/register', register);
app.get('/update', update);
app.get('/:id', person);
app.post('/', upload.single('avatar'), add);
app.post('/update', addUpdate);
app.post('/login', loginPost);
app.use(notFound);

function server() {
  console.log('The server is running succesfully!');
}
function dashboard(req, res, data) {
  let { userId } = req.session;
  console.log(req.session.userId);
  db.collection('users').findOne({ email: req.session.email }, done);
  function done(err, data) {
    if (err) {
      next(err);
    } else {
      //
      res.render('dashboard', { data: req.session.userId });
      console.log(req.session.userId);
    }
  }
}

function loginPost(req, res) {
  let gebruikers = db.collection('users');
  const email = req.body.loginEmail;
  const password = req.body.loginPassword;

  if (email && password) {
    gebruikers.findOne(
      {
        email: email,
      },
      (err, data) => {
        if (err) {
          next(err);
        } else {
          req.session.userId = data;
          res.redirect('/dashboard');
          console.log(req.session.userId);
        }
      }
    );
  }
}

function index(req, res) {
  res.render('index');
}

function renderLogin(req, res) {
  let { userId } = req.session;
  if (!userId) {
    res.render('login');
  } else {
    res.redirect('dashboard');
  }
}

function register(req, res) {
  res.render('register');
}

// detail page
function person(req, res, data) {
  let id = req.params.id;
  console.log(id);

  db.collection('users').findOne(
    {
      _id: mongo.ObjectID(id),
    },
    done
  );

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render('detail.ejs', { data: data });
      console.log('person found succesfully');
    }
  }
}
// adding new person to database
function add(req, res, next) {
  let id = slug(req.body.name).toLowerCase();
  db.collection('users').insertOne(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profession: req.body.profession,
      bio: req.body.bio,
      avatar: req.file ? req.file.filename : null,
    },
    done
  );

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.redirect('/' + data.insertedId); // route to new profile
      console.log('data input succes', req.body.name);
    }
  }
}

function users(req, res) {
  db.collection('users').find().toArray(done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render('list', { data: data });
    }
  }
}
function update(req, res, data) {
  res.render('update', { data: data });
}

function addUpdate(req, res, next) {
  //console.log(req.body)
  db.collection('users').updateOne(
    {
      _id: mongo.ObjectID('60abee196375cf653becd28f'),
    },
    {
      $set: {
        name: req.body.name,
      },
    },
    done
  );

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.redirect('/' + mongo.ObjectID('60abee196375cf653becd28f')); // route to profile
      console.log('data update succes', req.body.name);
    }
  }
}

function notFound(req, res, next) {
  res.status(404).render('404');
}

// port of server
app.listen(port, server);
