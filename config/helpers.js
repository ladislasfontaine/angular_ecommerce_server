const MySqli = require('mysqli');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let conn = new MySqli({
  host: 'localhost',
  port: 3308,
  user: 'user',
  passwd: 'secret',
  db: 'angular-ecommerce'
});

let db = conn.emit(false, '');

const secret = '1SBz93MsqTs7KgwARcB0I0ihpILIjk3w';

module.exports = {
  database: db,
  secret: secret,
  validJWTNeeded: (req, res, next) => {
    if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send();
        } else {
          req.jwt = jwt.verify(authorization[1], secret);
          return next();
        }
      } catch (err) {
        return res.status(403).send('Authentication failed.');
      }
    } else {
      return res.status(401).send('No authorization header found.');
    }
  },
  hasAuthFields: (req, res, next) => {
    let errors = [];

    if (req.body) {
      if (!req.body.email) errors.push('Missing email field');
      if (!req.body.password) errors.push('Missing password field');
      if (errors.length) {
        return res.status(400).send({errors: errors.join(',')});
      } else {
        return next();
      }
    } else {
      return res.status(400).send({errors: 'Missing email and password fields.'});
    }
  },
  isPasswordAndUserMatch: async (req, res, next) => {
    const myPlainTextPassword = req.body.password;
    const myEmail = req.body.email;
    const user = await db.table('users')
      .filter({$or:[{email: myEmail}, {username: myEmail}]})
      .get();

    if (user) {
      bcrypt.compare(myPlainTextPassword, user.password, function(err, result) {
        if (result) {
          req.username = user.username;
          req.email = user.email;
          next();
        } else {
          res.status(401).send({errors: 'Username or password incorrect.'});
        }
      });
    } else {
      res.status(401).send({errors: 'Username or password incorrect.'});
    }
  }
};
