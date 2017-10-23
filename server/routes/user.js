const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var User = require('./../models/user');
// var userService = require('./../services/user.service');


router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUser);
router.delete('/:_id', deleteUser);


function deleteUser(req, res, next) {
  const id = req.params._id;

  console.log('deleteUser id: ', id);

  User.remove({_id: id})
    .then(function (result) {
      console.log('user removed, result: ', result);
      // res.sendStatus(200);

      return res
      .status(204)
      .json({
        title: 'User deleted successfully'
      });
    })
    .catch(function (err) {
      console.log('User deleted, err:', err);

      return res
      .status(400)
      .json({
        title: 'Error during deleting the user',
        obj: err
      });
    });
}

function getAllUser(req, res, next) {
  User.find().lean()
  .then((result) => {
    const users = _.map(result, function (user) {
      return _.pick(user, '_id', 'firstName', 'lastName', 'email');
    });

    return res
    .status(200)
    .json({
      title: 'Got all users',
      obj: users
    });
  })
  .catch((err) => {
    console.log('Error during getting all users: ', err);

    return res
    .status(400)
    .json({
      title: 'Error during getting all users',
      obj: err
    });
  });

}


function register(req, res, next) {

  var body = req.body;

  console.log('register body: ', body);

  User.findOne({email: body.email})
  .then((user) => {

    if (user) {
      // user already registered, registration failed
      return res
      .status(409)
      .json({
        title: 'Registration failed',
        error: {
          message: 'User is already registered'
        }
      });
    }

    // user will be registered, pw is hashed
    const options = {
      hashLength: 128,
      timeCost: 10,
      memoryCost: 15,
      parallelism: 100,
      type: argon2.argon2id
    }

    return argon2.hash(body.password, options);
  })
  .then((hash) => {
    var user = new User({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hash
    });

    return user.save();
  })
  .then((result) => {

    return res
    .status(201)
    .json({
      title: 'Registration successful'
    });
  })
  .catch((err) => {

    return res
    .status(500)
    .json({
      title: 'Server error during registration occured',
      error: err
    })
  });
}


function login(req, res, next) {
  const body = req.body;
  let user;

  User.findOne({email: body.email})
  .then((user) => {

    if (!user) {
      // login failed
      return res
      .status(401)
      .json({
        title: 'Login failed',
        error: {
          message: 'Username or password invalid'
        }
      })
    }

    this.user = user;

    // user registered, check password
    const password = body.password;
    const hashedPassword = user.password;

    return argon2.verify(hashedPassword, password);
  })
  .then((match) => {
    if (match) {
      // password matches

      return res
      .status(200)
      .json({
        title: 'Login successful',
        obj: {
          _id: this.user._id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: body.email,
          token: jwt.sign({sub: this.user._id}, process.env.JWT_SECRET)
        }
      })
    } else {
      // password does not match

      return res
      .status(401)
      .json({
        title: 'Login failed',
        error: {
          message: 'Username or password invalid'
        }
      });
    }
  })
  .catch((err) => {
    console.log('error during authentication! ', err);
  });
};



module.exports = router;
