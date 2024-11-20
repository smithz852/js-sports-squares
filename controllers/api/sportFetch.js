
const router = require("express").Router();
const { Games } = require('../../models')
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const gameData = await Games.findAll();
    res.status(200).json(gameData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:score_id', async (req, res) => {

const gameData = req.params.score_id
console.log(gameData);
  let sportsAPI = `https://replay.sportsdata.io/api/v3/nfl/stats/json/boxscorebyscoreidv3/${gameData}?key=124522fa4ec34339b7ce6ec93da9caca`;
  console.log(sportsAPI)
  fetch(sportsAPI).then(function(response) {
    return response.json();
}).then(function(data) {
    res.json(data);
 })
})

router.post('/', async (req, res) => {
  // create a new game by scoreId
  try {
    const gameData = await Games.create({
      score_id: req.body.score_id
    });
    res.status(200).json(gameData);
  } catch (err) {
    res.status(400).json(err);
  }
});
  

module.exports = router