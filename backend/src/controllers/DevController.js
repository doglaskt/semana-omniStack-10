const axios = require("axios")
const Dev = require("../models/Dev")
const parseStringAsArray = require("../utils/parseStringAsArray")

module.exports = {

  // Listar todos
  async index(req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  // Criar
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body
  
    let dev = await Dev.findOne({github_username})

    if(!dev){
      const apiResponse = await axios.get(`http://api.github.com/users/${github_username}`)
  
      const { name = login, avatar_url, bio } = apiResponse.data
    
      const techsArray = parseStringAsArray(techs)
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })
    }

    return res.json(dev)
  },

  async update(req, res) {
    const github_username = req.params.github_username

    const { name, bio, techs, latitude, longitude } = req.body

    let dev
    let devUp = []

    try {
      dev = await Dev.findOne({github_username})

      dev.name = name
      dev.bio = bio
      dev.techs = parseStringAsArray(techs)
      dev.latitude = latitude
      dev.longitude = longitude

      devUp = await dev.save()

    } catch (error) {
      res.status(404)
      devUp = {'message': 'Dev não encontrado'}
    }

    return res.json(devUp)

  },

  async destroy(req, res) {
    const github_username = req.params.github_username

    let dev = []

    try {
      dev = await Dev.findOneAndDelete({github_username})
      if (!dev){
        res.status(404)
      }
    } catch (e) {
      res.status(500)
    }

    return res.json(dev)
  }

}