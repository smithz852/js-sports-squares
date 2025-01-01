
const router = require("express").Router();
const { SelectedGame } = require('../../models')
require('dotenv').config();

const activeTimers = new Map()






router.get('/userDate/:date/userTimezone/:tzCountry/:tzCity', async (req, res) => {
console.log('FETCHING NFL DATA *******************************')
let formattedDate = req.params.date
let tzCountry = req.params.tzCountry
let tzCity = req.params.tzCity
console.log('fn date param: ', formattedDate)
    let nflAPI = `https://v1.american-football.api-sports.io/games?league=2&date=${formattedDate}&timezone=${tzCountry}/${tzCity}`;
    console.log(nflAPI)

    try {
      const response = await fetch(nflAPI, {
        method: 'GET',
        headers: {
          'x-apisports-key': '2f14287fb764f299801970b51492fe7e',
          'x-rapidapi-host': 'v1.american-football.api-sports.io',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch data from the API' });
    }
  })

  router.get('/:gameID', async (req, res) => {
    console.log('REFETCHING GAME DATA *******************************')
    let gameID = req.params.gameID
        let nflAPI = `https://v1.american-football.api-sports.io/games?id=${gameID}`;
        console.log(nflAPI)
    
        try {
          const response = await fetch(nflAPI, {
            method: 'GET',
            headers: {
              'x-apisports-key': '2f14287fb764f299801970b51492fe7e',
              'x-rapidapi-host': 'v1.american-football.api-sports.io',
            },
          });
      
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
          }
      
          const data = await response.json();
          res.json(data);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Failed to fetch data from the API' });
        }
      })

    router.post('/', async (req,res) => {
      let score_id = req.body.score_id
      try {
        const selectedGame = await SelectedGame.create({
          score_id
        });
        gameRefreshTimer(score_id)
        console.log('selected game ID *********', selectedGame);
        res.status(200).json(selectedGame);
      } catch (err) {
        res.status(400).json(err);
      }
    })

    router.get('/selectedGame/:score_id', async (req, res) => {
      try {
        const selectedGameData = await SelectedGame.findOne();
        res.status(200).json(selectedGameData);
      } catch (err) {
        res.status(500).json(err);
      }
    })

    // timer function
function createTimer(score_id, start) {
  if (activeTimers.has(score_id)) {
      return activeTimers.get(score_id);
  }

  let timeRemaining = ''

  if (start === null) {
    timeRemaining = 600; // 10 minutes
    const timerData = {
        timeRemaining,
        startTime: Date.now(),
        timerInterval: setInterval(() => {
            timeRemaining--;
            if (timeRemaining <= 0) {
                clearInterval(timerData.timerInterval);
                activeTimers.delete(score_id);
            }
        }, 1000)
    };
    activeTimers.set(score_id, timerData);
  console.log('****timerData:', timerData)
  return timerData;
  } else {
    timeRemaining = start;
    console.log(timeRemaining)
    const timerData = {
        timeRemaining,
        startTime: Date.now(),
        timerInterval: setInterval(() => {
            timeRemaining--;
            if (timeRemaining <= 0) {
                clearInterval(timerData.timerInterval);
                activeTimers.delete(score_id);
            }
        }, 1000)
    };
    activeTimers.set(score_id, timerData);
  console.log('****timerData:', timerData)
  return timerData;
  }

  
}

    router.get('/selectedGame/:score_id/timer/:start', async (req, res) => {
      try {
          
        const score_id = req.params.score_id;
        const start = req.params.start;
        console.log('score_id', score_id)
        console.log('start', start)
          let timerData = activeTimers.get(score_id);
  
          // Create new timer if doesn't exist
          if (!timerData && start === null) {
            console.log('no timer data and null')
              timerData = createTimer(score_id, null);
          }
          
          if (!timerData && start !== null) {
            console.log('no timer data and NOT null')
              timerData = createTimer(score_id, start);
          }
  
          // Calculate current time remaining
          const elapsedSeconds = Math.floor((Date.now() - timerData.startTime) / 1000);
          const currentTimeRemaining = Math.max(0, timerData.timeRemaining - elapsedSeconds);
  
          // Format response
          const hours = Math.floor(currentTimeRemaining / 3600);
          const minutes = Math.floor(currentTimeRemaining / 60);
          const seconds = currentTimeRemaining % 60;
          let timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          if (minutes > 59) {
              timeString = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          }
  
          res.json({
              score_id,
              timeRemaining: currentTimeRemaining,
              formattedTime: timeString,
              isActive: currentTimeRemaining > 0
          });
  
      } catch (err) {
          res.status(500).json({
              message: 'Error fetching timer data',
              error: err.message
          });
      }
  });

    router.delete('/selectedGame/:score_id', async (req, res) => {
      try {
        const selectedGameData = await SelectedGame.destroy({
          where: {
            score_id: req.params.score_id
          }
        });
        res.status(200).json(selectedGameData);
      } catch (err) {
        res.status(500).json(err);
      }
    })


  module.exports = router