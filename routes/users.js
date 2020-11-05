const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { database } = require('../config/helpers');

const jsonParser = bodyParser.json();

/* GET ALL USERS */
router.get('/', (req, res) => {
  database.table('users')
    .withFields(['id', 'username', 'email', 'fname', 'lname', 'age', 'role'])
    .getAll().then(list => {
      if (list.length > 0) {
        res.json({users: list});
      } else {
        res.json({message: 'NO USERS FOUND'});
      }
    }).catch(err => res.json(err));
});

/* GET SINGLE USER */
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;

  database.table('users')
    .filter({id: userId})
    .withFields(['id', 'username', 'email', 'fname', 'lname', 'age', 'role'])
    .get().then(user => {
      if (user) {
        res.json({user});
      } else {
        res.json({message: `NO USER FOUND WITH ID ${userId}`});
      }
    }).catch(err => res.json(err));
});

/* UPDATE USER INFORMATION */
router.patch('/:userId', jsonParser, async (req, res) => {
  const userId = req.params.userId;
  const user = await database.table('users').filter({id: userId}).get();

  if (user) {
    const { email, fname, lname, username, age } = req.body;

    database.table('users').filter({id: userId})
      .update({
        email: email !== undefined ? email : user.email,
        fname: fname !== undefined ? fname : user.fname,
        lname: lname !== undefined ? lname : user.lname,
        username: username !== undefined ? username : user.username,
        age: age !== undefined ? age : user.age
      }).then(result => {
        if (result) {
          res.json('User updated successfully');
        } else {
          res.json({message: `Problem with user update with error code: ${result}`});
        }
      }).catch(err => res.json(err));
  }
});

module.exports = router;
