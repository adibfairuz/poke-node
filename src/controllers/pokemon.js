const { getPokemons, getPokemon, addOrRemoveFavorite, getFavorites } = require('../services/pokemon')

const pokemons = (req, res) => {
    getPokemons(req, (ok, data) => {
        if (ok) {
            res.json({
                data,
                ok: true
            })
        }else{
            res.json({
                data,
                ok: false
            })
        }
    })
}

const pokemon = (req, res) => {
    getPokemon(req, (ok, data) => {
        if (ok) {
            res.json({
                data,
                ok: true
            })
        }else{
            res.json({
                data,
                ok: false
            })
        }
    })
}

const favorite = (req, res) => {
    addOrRemoveFavorite(req, (ok, data) => {
        if (ok) {
            res.json({
                data,
                ok: true
            })
        }else{
            res.json({
                data,
                ok: false
            })
        }
    })
}

const favorites = (req, res) => {
    getFavorites(req, (ok, data) => {
        if (ok) {
            if (data.results.length) {
                res.json({
                    data,
                    ok: true
                })
            } else {
                res.status(404).json({
                    data,
                    ok: false
                })
                
            }
        }else{
            res.json({
                data,
                ok: false
            })
        }
    })
}

module.exports = {
    pokemons,
    pokemon,
    favorite,
    favorites
};