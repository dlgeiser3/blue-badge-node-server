require("dotenv").config();

let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let User = sequelize.import('../models/user');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');


/* *************************
 *** USER SIGNUP ***
************************** */
router.post('/create', function (req, res) {
  User.create({
    email: req.body.user.email,
    password: bcrypt.hashSync(process.env.JWT_SECRET, 10),

  }).then(
    function createSuccess(user) {
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

      res.status(200).json({
        user: user,
        message: 'User successfully created',
        sessionToken: token
      });
    },
    function createError(err) {
      console.log(err);
    }
  );
});

/* *************************
 *** USER LOGIN ***
************************** */

router.post('/login', function (req, res) {
  User.findOne({ where: { email: req.body.user.email } }).then(
    function (user) {
      if (user) {
        bcrypt.compare(process.env.JWT_SECRET, user.password, function (err, matches) {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
            res.status(200).json({
              user: user,
              message: "Successfully Logged In!",
              sessionToken: token
            });
          } else {
            res.status(502).send({ error: "Login failed" });
          }
        });
      } else {
        res.status(500).send({ error: "Failed to authenticate" });
      }
    },
    function (err) {
      res.status(501).send({ error: "Login failed" });
    }
  );
});

module.exports = router;
