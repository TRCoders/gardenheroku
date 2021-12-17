module.exports = function (app, passport, db, multer, ObjectId) {
  const fs = require('fs');
  const imageModel = require('../model');
  const path = require('path');
  const pathurl = './uploads/'
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
  
  const upload = multer({ storage: storage });

  // Webpage routes ===============================================================

  // Renders main webpage
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // Searches through database to find Common Name of the plants and limit to only 5 search results
  app.get('/plants', function (req, res) {
    db.collection('plantlists').find({ common_name: req.query.common_name }).limit(5).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.render('plants.ejs', {
        plantInfo: result
      }
      )
    });

  })

  // Renders guide page then retrieve info from imageModel to show on guide web page.
  app.get('/guide', function (req, res) {
    imageModel.find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error occured', err);
      }
      else {
        res.render('guide.ejs', { items: items });
      }
    });
  })

  // User Profile, finds name, desc and img then displays them to profile.
  app.get('/profile', isLoggedIn, (req, res) => {
    imageModel.find({ createdBy: req.user._id }, (err, items) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error occured', err);
      }
      else {
        res.render('profile.ejs', { items: items });
      }
    });
  });

  // Creates a POST request for name, description, and image then post them to profile.
  app.post('/profile', upload.single('image'), (req, res, next) => {
    db.collection('users').save({ createdBy: req.user._id }, (err, result) => {
      const obj = {
        name: req.body.name,
        desc: req.body.descc,
        img: {
          data: fs.readFileSync(path.join(pathurl + req.file.filename)),
          contentType: 'image/png'
        }
      }
      imageModel.create(obj, (err, item) => {
        if (err) {
          console.log(err);
        }
        else {
          res.redirect('/profile');
        }
      });
    })
  });

  // Post tutorial to current profile page.
  app.post('/', upload.single('image'), (req, res, next) => {
    const obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
        data: fs.readFileSync(path.join(pathurl + req.file.filename)),
        contentType: 'image/png'
      }
    }
    imageModel.create(obj, (err, item) => {
      db.collection('image').find({ createdBy: req.user._id }, (err, result) => {

        if (err) {
          console.log(err);
        }
        else {
          res.redirect('/profile');
        }
      });
    })
  });

  // WIP =====================================
  // Forum Posts
  app.get('/posts', function (req, res) {
    res.render('posts.ejs')
  })

  // Forum Page
  app.get('/forumpage', function (req, res) {
    res.render('forumpage.ejs')
  })

  // Forum Main Page
  app.get('/forum', function (req, res) {
    res.render('forum.ejs')
  })

  // WIP ====================================

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    let user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.local.username = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
};
