const { default: axios } = require("axios")
const { API } = require("../config/urls")
const ColorThief = require('colorthief');
const rgbToHex = require("../utils/rgbToHex");
const db = require("../config/firebase")

const getPokemons = async (req, cb) => {
    try {
        const page = req.query.page
        const params = {
            limit: 10,
            offset: page === 1 || !page ? 0 : (page - 1) * 10,
        }

        const favorites = []
        await db.collection('favorites').get().then(item => item.docs.forEach(item => favorites.push(item.data())));
        
        const data = await axios.get(`${API}/pokemon`, {params})
        const temp = data.data.results.map(item => axios.get(`${API}/pokemon/${item.name}`));
        
        let list = await Promise.all(temp)

        list = list.map(item => {
            return {
                id: item.data.id,
                name: item.data.name,
                image_url: item.data.sprites.other['official-artwork'].front_default,
                types: item.data.types,
                is_favorited: favorites.filter(fav => fav.id_pokemon === item.data.id).length ? true : false
            }
        })

        const colorList = await Promise.all(list.map(item => ColorThief.getColor(item.image_url)))

        list = colorList.map((item, i) => {
            return {
                ...list[i],
                bg_color: rgbToHex(item),
                bg_color_rgb: item
            }
        })

        cb(true, {
            ...data.data,
            results: list
        })
    } catch (error) {
        cb(false, error)
    }
}

const getPokemon = async (req, cb) => {
    try {
        const name = req.params.name
        const [data, species] = await Promise.all([axios.get(`${API}/pokemon/${name}`), axios.get(`${API}/pokemon-species/${name}`)])
        const bg_color_rgb = await ColorThief.getColor(data.data.sprites.other['official-artwork'].front_default)
        const favorite = await db.collection('favorites').where('id_pokemon', '==', data.data.id).get();
        const is_favorited = favorite.size ? true : false;
        const images = []
        Object.keys(data.data.sprites).forEach(key => {
            if (typeof data.data.sprites[key] === "string") {
                images.push(data.data.sprites[key])
            }
        })
        const pokemon = {
            id: data.data.id,
            name: data.data.name,
            image_url: data.data.sprites.other['official-artwork'].front_default,
            bg_color: rgbToHex(bg_color_rgb),
            bg_color_rgb,
            types: data.data.types,
            about: {
                description: species.data.flavor_text_entries[0].flavor_text,
                height: data.data.height,
                weight: data.data.weight
            },
            abilities: data.data.abilities,
            stats: data.data.stats,
            images,
            is_favorited,
        }
        cb(true, pokemon)
    } catch (error) {
        cb(false, error)
    }
}

const addOrRemoveFavorite = async (req, cb) => {
    try {
        const id = parseInt(req.params.id)
        const data = await db.collection('favorites').where('id_pokemon', '==', id).get();
        const isExist = data.size;
        if (isExist) {
            data.forEach(item => item.ref.delete()
                .then(() => cb(true, {is_favorited: false, id_pokemon: id}))
                .catch(() => cb(false, {is_favorited: false})))
        } else {
            db.collection('favorites').add({id_pokemon: id})
                .then(() => cb(true, {is_favorited: true, id_pokemon: id}))
                .catch(() => cb(false, {is_favorited: false}))
        }
    } catch (error) {
        cb(false, error)
    }
}

const getFavorites = async (req, cb) => {
    try {
        const page = req.query.page
        const params = {
            limit: 10,
            offset: page === 1 || !page ? 0 : (page - 1) * 10,
        }
        let temp = []
        await db.collection('favorites').limit(params.limit).offset(params.offset).get().then(item => item.docs.forEach(item => temp.push(item.data())));
        
        temp = temp.map(item => axios.get(`${API}/pokemon/${item.id_pokemon}`));
        const response = await Promise.all(temp)
        const data = response.map(item => {
            return {
                id: item.data.id,
                name: item.data.name,
                image_url: item.data.sprites.other['official-artwork'].front_default,
                types: item.data.types
            }
        })

        const colorList = await Promise.all(data.map(item => ColorThief.getColor(item.image_url)))

        const list = colorList.map((item, i) => {
            return {
                ...data[i],
                bg_color: rgbToHex(item),
                bg_color_rgb: item
            }
        })

        const count = (await db.collection('favorites').get()).size

        cb(true, {
            ...data.data,
            results: list,
            count,
        })

    } catch (error) {
        cb(false, error)
    }
}

module.exports = {
    getPokemons,
    getPokemon,
    addOrRemoveFavorite,
    getFavorites
}