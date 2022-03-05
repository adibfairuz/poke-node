var express = require('express');
const { pokemons, pokemon, favorite, favorites } = require('../controllers/pokemon');
var router = express.Router();

router.get('/favorite', favorites);
router.post('/favorite/:id', favorite);
router.get('/', pokemons);
router.get('/:name', pokemon);

module.exports = router;
