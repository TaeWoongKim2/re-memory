var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET sing-up page. */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', { title: 'sign-up' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

module.exports = router;
