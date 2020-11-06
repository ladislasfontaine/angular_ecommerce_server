const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator');
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

/* LOGIN */
router.post('/login', [jsonParser, helper.hasAuthFields, helper.isPasswordAndUserMatch], (req, res) => {
  let token = jwt.sign({
    state: 'true', 
    email: req.body.email, 
    username: req.body.username
  }, helper.secret, {
    algorithm: 'HS512',
    expiresIn: '4h'
  });
  res.json({
    token: token,
    auth: true,
    email: req.body.email,
    username: req.body.username
  })
});

/* REGISTER */
router.post('/register', [
  jsonParser,
  check('email').isEmail()
    .not().isEmpty().withMessage('Field cannot be empty')
    .normalizeEmail({all_lowercase: true}),
  check('password').escape().trim()
    .not().isEmpty().withMessage('Field cannot be empty')
    .isLength({min: 6}).withMessage('Must be at least 6 characters long'),
  body('email').custom(value => {
    return helper.database.table('users')
      .filter({email: value})
      .get().then(user => {
        if (user) {
          return Promise.reject('Email already exists, choose another one.');
        }
      });
  })
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  } else {
    let email = req.body.email;
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, 10);
    let fname = req.body.fname;
    let lname = req.body.lname;
    /**
     * ROLE 777 = ADMIN
     * ROLE 555 = USER
    **/
    helper.database.table('users').insert({
      username: username || 'default',
      password,
      email,
      role: 555,
      fname: fname || null,
      lname: lname || null
    }).then(lastId => {
      if (lastId > 0) {
        res.status(201).json({message: 'Registration successful.'});
      } else {
        res.status(501).json({message: 'Registration failed.'});
      }
    }).catch(err => res.status(433).json({error: err}));
  }
});

module.exports = router;
