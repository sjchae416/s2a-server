const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../google_oauth');



function isLoggedIn(req, res, next) {
  console.log(req.user)
  req.user ? next() : res.sendStatus(401);
}

router.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

router.get('/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

router.get('/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/google/failure'
  })
);

router.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Name: ${req.user.displayName}<br>
            Email: ${req.user.emails[0].value}
  
  `);
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session:', err);
        res.status(500).send('Error destroying session');
      } else {
        res.clearCookie('connect.sid'); // Replace 'connect.sid' with the name of your session cookie if it's different
        res.send('Goodbye!');
      }
    });
  });
});


router.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

module.exports = router;