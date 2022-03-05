const { getPokemons, getPokemon, addOrRemoveFavorite, getFavorites } = require('../services/pokemon')

const pokemons = (req, res) => {
    const page = req.query.page
    getPokemons(page, (ok, data) => {
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
    const name = req.params.name
    getPokemon(name, (ok, data) => {
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
    const id = parseInt(req.params.id)
    addOrRemoveFavorite(id, (ok, data) => {
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
    const page = req.query.page
    getFavorites(page, (ok, data) => {
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