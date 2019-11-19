require("dotenv").config();

let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let validateSession = require('../middleware/validate-session');
var Journal = sequelize.import('../models/journal');

// Journal.sync({force:true})

/* *************************
 *** JOURNAL CREATE ***
************************** */
router.post('/create', validateSession, (req, res) => {
  const journalEntry = {
    title: req.body.journal.title,
    date: req.body.journal.date,
    entry: req.body.journal.entry,
    owner: req.user.id
  }
  Journal.create(journalEntry)
    .then(journal => res.status(200).json(journal))
    .catch(err => res.status(500).json({ error: err }))
});

/* *************************
 *** GET ALL ENTRIES ***
************************** */
router.get("/", (req, res) => {
  Journal.findAll()
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({ error: err }))
});

/* *************************
 *** GET ENTRIES BY USER ***
************************** */
router.get("/mine", validateSession, (req, res) => {
  let userid = req.user.id
  Journal.findAll({
    where: { owner: userid }
  })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({ error: err }))
});

/* *************************
 *** GET ENTRIES BY TITLE ***
************************** */
router.get('/:title', function (req, res) {
  let title = req.params.title;

  Journal.findAll({
    where: { title: title }
  })
    .then(
      function findAllSuccess(title) {
        res.json(title);
      },
      function findAllError(err) {
        res.send(500, err.message);
      }
    );
});

/* *************************
 *** JOURNAL UPDATE ***
************************** */
router.put('/update/:id', validateSession, (req, res) => {
  Journal.update(req.body.journal, {
    where: {
      id: req.params.id,
      owner: req.user.id
    },
    returning: true
  })
    .then(journal => res.status(200).json(journal))
    .catch(err => res.status(500).json({ error: err }))
});

/* *************************
 *** JOURNAL DELETE ***
************************** */
router.delete("/delete/:id", validateSession, (req, res) => {
  Journal.destroy({
    where: {
      id: req.params.id,
      owner: req.user.id
    },
  })
    .then(journal => res.status(200).json(journal))
    .catch(err => res.status(500).json({ error: err }))
});

module.exports = router;