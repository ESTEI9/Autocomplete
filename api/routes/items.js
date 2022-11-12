var express = require('express');
var router = express.Router();
var swapi = require('swapi-node');

router.get('/', function(req, res, next) {
  res.json({items: req.query.q}); // sample, would require db for searchable results
});

module.exports = router;