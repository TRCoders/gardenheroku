module.exports = function(app, passport, db, multer, ObjectId) {
  const fs = require('fs');
  const imageModel = require('../model');
  const path = require('path');
// normal routes ===============================================================

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


    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // // PROFILE SECTION =========================
    // app.get('/profile', isLoggedIn, function(req, res) {
    //     db.collection('messages').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

    // Images upload
    
  app.get('/plants', function(req, res) {
    db.collection('plantlists').find({common_name: req.query.common_name}, {duration: req.query.duration}).limit(5).toArray((err, result) => {
        if (err) return console.log(err)
            console.log(result)
            res.render('plants.ejs', {
            plantInfo: result
        }
    )
  });

  })

  app.get('/guide', function(req, res) {
      res.render('guide.ejs')
  })

  app.get('/posts', function(req, res) {
    res.render('posts.ejs')
  })

  app.get('/forumpage', function(req, res) {
    res.render('forumpage.ejs')
  })

  app.get('/forum', function(req, res) {
    res.render('forum.ejs')
  })

  app.post('/', upload.single('image'), (req, res, next) => {
    
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
            // item.save();
            res.redirect('/profile');
        }
    });
});

    app.get('/profile', isLoggedIn, (req, res) => {
      imageModel.find({}, (err, items) => {
          if (err) {
              console.log(err);
              res.status(500).send('Error occured', err);
          }
          else {
              res.render('profile.ejs', { items: items });
          }
      });
  });
  
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
          if (err) {
              console.log(err);
          }
          else {
              // item.save();
              res.redirect('/profile');
          }
      });
  });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    // app.post('/messages', (req, res) => {
    //   db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/profile')
    //   })
    // })

    app.put('/messages', (req, res) => {
      db.collection('plantlists')
      .find({_id: 0, })

    app.put('/thumbDown', (req, res) => {
      db.collection('plantlists')
      .findOneAndUpdate({
        name: req.body.name,
        msg: req.body.msg
      }, {
        $set: {
          thumbUp:req.body.thumbUp - 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
})

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
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
