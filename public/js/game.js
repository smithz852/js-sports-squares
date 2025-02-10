
const globalOddsInfo = {
  userNameArr: [],
  wager: 0
}

let gameStarted = false
let q1HasStarted = false
let q2HasStarted = false
let q3HasStarted = false
let q4HasStarted = false

let countdownDisplay = ''


function refreshFetch(game, globalOddsInfo) {
  let keyData = `${game.teams.home.name}&${game.teams.away.name}`;
  let scoreId = localStorage.getItem(keyData);
  let requestUrl = `/api/nflApiFetch/${scoreId}`
  
    officialWins = []
    //console.log("Refresh ID", scoreId);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //console.log("Nfl API: ", data.response);
        const game = data.response[0]
        console.log('refetched game: ', game)
        //console.log('global odds in refresh: ', globalOddsInfo)
       renderGameInfo(game, globalOddsInfo)
      });
}

function gameInfoByID(scoreId, globalOddsInfo, nflGames) {
  nflGames.forEach((game) => {
    //console.log("Game: ", game)
    if (game.game.id === parseInt(scoreId)) {
      //console.log("selected game: ", game)
      renderGameInfo(game, globalOddsInfo)
      // selectWinner(game);
     }
  })
}

function displayTimer(game) {
  let requestUrl = ''
 
  const timerDescr = document.querySelector(".timerDescr");
  //console.log('glob odds in timer: ',  globalOddsInfo)
  let scoreID = game.game.id
  let gameTime = game.game.date.time
    let start = timeUntilGame(gameTime)
    

  if (game.game.status.short === "NS") {
    timerDescr.textContent = 'Kickof Time'
    
    //console.log('fetch for NS')
    //console.log('start time: ', start)
    requestUrl = `/api/nflApiFetch/selectedGame/${scoreID}/timer/${start}`
  } else if (game.game.status.short === "NS" && start <= 0) {
    timerDescr.textContent = 'Game Opening'
    //console.log('normal fetch')
   requestUrl = `/api/nflApiFetch/selectedGame/${scoreID}/timer/${600}`
  } else {
    timerDescr.textContent = 'Refresh Time'
    //console.log('normal fetch')
   requestUrl = `/api/nflApiFetch/selectedGame/${scoreID}/timer/${601}`
  }



   fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Timer: ", data);
      const secondsLeft = data.timeRemaining
      let timeDelay = secondsLeft * 1000
      if (game.game.status.short === "FT" || game.game.status.short === 'AOT') { 
        startCountdown(0)
        return
      }
      console.log(timeDelay)
      startCountdown(secondsLeft)
      
      setTimeout(() => {
        if (game.game.status.short === "FT" || game.game.status.short === 'AOT') { 
          return
        } else {
          refreshFetch(game, globalOddsInfo);
          return
        }
      }, timeDelay)
    });

}

function formatTimeFromSeconds(totalSeconds) {
  if (totalSeconds <= 0) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format without leading zeros for hours, but keep 2 digits for minutes and seconds
  if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// Example usage with countdown
function startCountdown(startSeconds) {
  let timeRemaining = startSeconds;
  const gamePlay = document.querySelector(".gamePlay");
  
  const timer = setInterval(() => {
      // console.log(formatTimeFromSeconds(timeRemaining));
      countdownDisplay = formatTimeFromSeconds(timeRemaining)
      gamePlay.innerHTML = countdownDisplay;
      if (timeRemaining <= 0) {
        clearInterval(timer);
        return;
    }

      timeRemaining--;
  }, 1000);
}


function timeUntilGame(gameTime) {
  let date = new Date();
  let gameTimeArr = gameTime.split(':')
  let gameTimeHours = parseInt(gameTimeArr[0])
  let gameTimeMinutes = parseInt(gameTimeArr[1])
  let userTimeNow = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
});

console.log('user time now: ', userTimeNow)
const gameTimeSeconds = (gameTimeHours * 3600) + (gameTimeMinutes * 60)

const currentTimeSeconds = (parseInt(userTimeNow.split(':')[0]) * 3600) + (parseInt(userTimeNow.split(':')[1]) * 60)
console.log('seconds: ', currentTimeSeconds)
const secondsUntilGame = gameTimeSeconds - currentTimeSeconds
console.log('until game: ', secondsUntilGame)

return secondsUntilGame

}


function getNflAPI(globalOddsInfo) {
  let requestUrl = '/api/nflApiFetch'
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log("Nfl API: ", data.response);
      const nflGames = data.response
        //console.log(nflGames)
        selectGame(nflGames, globalOddsInfo)
    });
}

function createFirstRow(questionBoxes) {
  const firstRow = document.createElement("tr");
  for (let i = 0; i < questionBoxes; i++) {
    const cell = document.createElement("td");
    if (i === 0) {
      cell.textContent = "Reset";
      cell.classList.add("X-box");
    } else {
      cell.textContent = "?";
      cell.classList.add("question-box");
    }
    firstRow.appendChild(cell);
  }
  return firstRow;
}
// Function to create a single row with question mark box followed by "Open" boxes
function createRow(numBoxes) {
  const row = document.createElement("tr");
  for (let i = 0; i < numBoxes; i++) {
    const cell = document.createElement("td");
    if (i === 0) {
      cell.textContent = "?";
      cell.classList.add("question-box");
    } else {
      cell.textContent = "Open";
      cell.classList.add("open-box");
    }
    row.appendChild(cell);
  }
  return row;
}

// Function to create the entire grid
function createGrid(numRows, numBoxesPerRow) {
  const table = document.getElementById("squaresTable");
  table.innerHTML = "";
  const firstRow = createFirstRow(numBoxesPerRow);
  table.appendChild(firstRow);
  for (let i = 0; i < numRows; i++) {
    const row = createRow(numBoxesPerRow);
    table.appendChild(row);
  }
}

// Call the function to generate the grid with 10 rows and 11 boxes per row
createGrid(10, 11);

let changeUserBtn = document.querySelector(".changeUsernameBtn");
let errorMsg = document.querySelector('.errorMsg')

function changeUsername() {
  errorMsg.classList.add('hide')
  let usernameForm = document.querySelector(".changeUsername");
  let usernameInput = usernameForm.value;
  localStorage.setItem("username", usernameInput);
  handleClick(usernameInput);
}

function handleClick(event) {
  let placeUsername = localStorage.getItem("username");
  if (placeUsername) {
    event.target.textContent = placeUsername;
  } else {
   
    return;
  }
  
}

function clearSelectedOpenBoxes() {
  const openBoxes = document.querySelectorAll(".open-box.selected");
  openBoxes.forEach((box) => {
    box.classList.remove("selected");
  });
}



function selectOpenBox() {
  const openBoxes = document.querySelectorAll(".open-box");
  const userNameArr = globalOddsInfo.userNameArr
  
  errorMsg.classList.add('hide')
  openBoxes.forEach((box) => {
    box.addEventListener("click", (event) => {
      const placeUsername = localStorage.getItem("username");

      if (box.classList.contains('selected')) {
        event.target.style.pointerEvents = "none";
        return
      }

       if (!userNameArr.includes(placeUsername) && placeUsername !== null) {
        userNameArr.push(placeUsername)
        //console.log('userArr', userNameArr)
        playerSquareCount(userNameArr)
       }

      if (placeUsername) {
        event.target.textContent = placeUsername;
        event.target.classList.toggle("selected");
        event.target.style.pointerEvents = "none";
        countSquares(placeUsername)
      } else {
        errorMsg.classList.remove('hide')
        return;
      }

      
      
    });
  });
}

selectOpenBox();

function playerSquareCount(userNameArr) {
const oddsBoard = document.querySelector('#oddsCount')
const boardFiller = document.querySelector('.oddsTitles')

   userNameArr.forEach((user) => {
    if (!document.querySelector(`.${user}`)) {
      const countContainer = document.createElement('div')
      const username = document.createElement('span')
      const userCount = document.createElement('span')
      const wagerAmount = document.createElement('span')
      oddsBoard.appendChild(countContainer)
      countContainer.appendChild(username)
      countContainer.appendChild(userCount)
      countContainer.appendChild(wagerAmount)
      boardFiller.classList.remove('boardFiller')
      username.classList.add(`${user}Tag`)
      userCount.classList.add(user)
      wagerAmount.classList.add(`${user}-wager`)
      countContainer.classList.add('oddsFlex')
      username.textContent = user
    }
    
  })
}

function countSquares(placeUsername) {
  //console.log('user count start', placeUsername)
   const userSelectedSquares = document.querySelector(`.${placeUsername}`)
   let count = 0
   TDs.forEach((sq) => {
    if (sq.textContent === placeUsername) {
      count = count + 1
       userSelectedSquares.textContent = count
    }
   })
   const userNameArr = globalOddsInfo.userNameArr
   const wager = globalOddsInfo.wager
   wagerMultiplier(userNameArr, wager)
}

function wagerMultiplier(userNameArr, wager) {
  //console.log('user arr', userNameArr)
   //console.log('wager', wager)

  userNameArr.forEach((user) => {
    const currentCount = document.querySelector(`.${user}`).textContent
    const wagerTotal = currentCount * wager
    const userWager = document.querySelector(`.${user}-wager`)
    userWager.textContent = `⛃${wagerTotal}`
  })

}

function renderGameInfo(game, globalOddsInfo ) {
  console.log('rendering game info: ', game)
  const homeTeam = document.querySelector(".homeTeam");
  const awayTeam = document.querySelector(".awayTeam");
  const quarter = document.querySelector(".quarter");
  const homeScore = document.querySelector(".homeScore");
  const awayScore = document.querySelector(".awayScore");
  const gameInfo = document.querySelector(".gameInfo");
  const bigHome = document.querySelector(".bigHomeTeam");
  const bigAway = document.querySelector(".bigAwayTeam");
  const imgLogo = document.querySelector('.imgLogo');
  const scoreBoard = document.querySelector('.scoreCard');
  const Q1 = document.querySelector(".Q1Win");
  const Q2 = document.querySelector(".Q2Win");
  const Q3 = document.querySelector(".Q3Win");
  const Q4 = document.querySelector(".Q4Win");
  
  //console.log('game status: ', game.game.status.short)
 
    homeTeam.innerHTML = `<img src="${game.teams.home.logo}" alt="Home Team Logo" class="teamLogo">`;
    awayTeam.innerHTML = `<img src="${game.teams.away.logo}" alt="Home Team Logo" class="teamLogo">`;
    quarter.textContent = `${game.game.status.short}`;
    bigHome.textContent = `${game.teams.home.name}` || '0';
    bigAway.textContent = `${game.teams.away.name}` || '0';
    imgLogo.classList.add('hide')
    scoreBoard.classList.remove('hide')

    if (game.game.status.short === null) {
      quarter.textContent = `${game.game.status.long}`;
    }
    
    if (game.scores.home.total === null || game.scores.away.total === null) {
      homeScore.textContent = `TBD`;
    awayScore.textContent = `TBD`;
    } else {
      homeScore.textContent = `${game.scores.home.total}`;
      awayScore.textContent = `${game.scores.away.total}`;
    }



  //sum scores
  const Q2HomeScore =
  game.scores.home.quarter_1 + game.scores.home.quarter_2;
  const Q2AwayScore =
  game.scores.away.quarter_1 + game.scores.away.quarter_2;
  const Q3HomeScore = Q2HomeScore + game.scores.home.quarter_3;
  const Q3AwayScore = Q2AwayScore + game.scores.away.quarter_3;
  const Q4HomeScore = Q3HomeScore + game.scores.home.quarter_4;
  const Q4AwayScore = Q3AwayScore + game.scores.away.quarter_4;

  if (game.scores.home.quarter_1 !== null) {
    Q1.textContent = `${game.scores.home.quarter_1} | ${game.scores.away.quarter_1}`;
    Q1.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
    if (q1HasStarted) {
      let scoreCheck = {
        homeCheck: game.scores.home.quarter_1,
        awayCheck: game.scores.away.quarter_1,
        quarter: 'q1'
      }
      selectWinner(game, scoreCheck)
    }
  } else {
    Q1.textContent = "TBD";
    Q1.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
  }

  if (game.scores.home.quarter_2 !== null) {
    Q2.textContent = `${Q2HomeScore} | ${Q2AwayScore}`;
    Q2.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
    if (q2HasStarted) {
      let scoreCheck = {
        homeCheck: Q2HomeScore,
        awayCheck: Q2AwayScore,
        quarter: 'q2'
      }
      selectWinner(game, scoreCheck)
    }
  } else {
    Q2.textContent = "TBD";
    Q2.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
  }

  if (game.scores.home.quarter_3 !== null) {
    Q3.textContent = `${Q3HomeScore} | ${Q3AwayScore}`;
    Q3.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
    if (q3HasStarted) {
      let scoreCheck = {
        homeCheck: Q3HomeScore,
        awayCheck: Q3AwayScore,
        quarter: 'q3'
      }
      selectWinner(game, scoreCheck)
    }
  } else {
    Q3.textContent = "TBD";
    Q3.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
  }

  if (game.scores.home.quarter_4 !== null) {
    Q4.textContent = `${Q4HomeScore} | ${Q4AwayScore}`;
    Q4.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
    if (q4HasStarted) {
      let scoreCheck = {
        homeCheck: Q4HomeScore,
        awayCheck: Q4AwayScore,
        quarter: 'q4'
      }
      selectWinner(game, scoreCheck)
    }
  } else {
    Q4.textContent = "TBD";
    Q4.style.cssText = "font-size: 8pt; margin-top: 10%; margin-bottom: 5%;";
  }

  gameInfo.style.cssText =
    "margin-bottom: 0%; display: flex; justify-content: space-around; font-size: 25pt; border-top: solid whitesmoke 5px; border-bottom: solid whitesmoke 5px; height: 150px";

  
  selectWinner(game, 0)
  displayTimer(game)
  saveGameData(globalOddsInfo)
}

function selectGame(nflGames, globalOddsInfo) {
  console.log('nfl games from fetch', nflGames)

    document.getElementById("clearOpenBtn").classList.add('hide');
document.getElementById("clearBtn").classList.add('hide')
document.getElementById("startBtn").classList.add('hide')
document.querySelector('.X-box').classList.add('.xText');
  const gameChoice = document.querySelector(".gameChoices");
  const chooseGameHeader = document.querySelector('.chooseGame')

  gameChoice.classList.add("scoreBtnDiv");

  if (nflGames.length === 0) {
    let noChoices = document.createElement('h4')
    noChoices.textContent = 'No Games Available Today'
    gameChoice.appendChild(noChoices)
    return;
  }

  //console.log("Select Game", nflGames);
  for (var i = 0; i < nflGames.length; i++) {
    let choice = document.createElement("button");
    let progress = nflGames[i].game.status.short
    let gameStatus = `<span>${progress}</span>`
  if (progress !== 'FT')  {
    if (progress === 'NS') {
      progress = 'Upcoming'
      gameStatus = `<span class='upcomingGame'>${progress}</span>`
    } else {
      gameStatus = `<span class='inProgress'>${progress}</span>`
    }
    choice.innerHTML += `${nflGames[i].teams.home.name} vs ${nflGames[i].teams.away.name} - ${gameStatus}`;
    choice.style.cssText = `list-style: none; margin: 2% 20% 10px; background-color: rgb(238, 3, 39);
        color: #fff;
        padding: 5px 5px;
        font-size: 16px;
        border: black solid 2px;
        border-radius: 3px;
        cursor: pointer;
      `;
    gameChoice.appendChild(choice);
    localStorage.setItem(
      `${nflGames[i].teams.home.name}&${nflGames[i].teams.away.name}`,
      `${nflGames[i].game.id}`
    );
    let keyData = `${nflGames[i].teams.home.name}&${nflGames[i].teams.away.name}`;

    choice.onclick = function () {
      gameChoice.classList.add("hide");
      gameChoice.classList.remove("scoreBtnDiv");
      chooseGameHeader.classList.add('hide')
      //console.log("click", keyData);
      let scoreId = localStorage.getItem(keyData);
      localStorage.setItem('selectedGame', scoreId)
      gameInfoByID(scoreId, globalOddsInfo, nflGames);
      //console.log(scoreId);
    };
   } 
  }
}

function startGame() {
  const questionBox = document.querySelectorAll(".question-box");
  let homeBoxArr = [0,1,2,3,4,5,6,7,8,9]
  let awayBoxArr = [0,1,2,3,4,5,6,7,8,9]
    for (var i = 0; i < 20; i++) {
    //console.log(i)
   if (i < 10) {
    let randomHomeArr = homeBoxArr.splice(Math.floor(Math.random() * homeBoxArr.length), 1);
    // awayBoxArr.push(randomHomeArr);
    questionBox[i].textContent = randomHomeArr;
    //console.log(awayBoxArr)
   } else if(11 < i < 20) {
    let randomAwayArr = awayBoxArr.splice(Math.floor(Math.random() * awayBoxArr.length), 1);
    // homeBoxArr.push(randomAwayArr);
    questionBox[i].textContent = randomAwayArr;
    //console.log(homeBoxArr)
   } else {
    return;
   }
  }
}

let chooseGame = document.querySelector('.chooseGame')

function startSquares(globalOddsInfo) {
    startSquaresBtn.classList.add('hide')
    chooseGame.classList.remove('hide')

    gameStarted = true
    if (gameStarted) {
      const multiplierDiv = document.getElementById('multiplierDiv')
      const multiplierHeader = document.querySelector('.multi')
      const userInput = document.querySelector('.userInputDiv')
      multiplierDiv.classList.add('hide')
      multiplierHeader.classList.add('hide')
      userInput.classList.add('hide')
    }
}

function clearNumbers() {
  const questionBox = document.querySelectorAll(".question-box");
  questionBox.forEach((box) => {
    box.textContent = "?";
  });
}

function clearOpen() {
  const openBox = document.querySelectorAll(".open-box");
  openBox.forEach((box) => {
    box.textContent = "Open";
    box.classList.remove("selected");
  });
}

// event listeners
document.getElementById("clearOpenBtn").addEventListener("click", clearOpen);
document.getElementById("clearBtn").addEventListener("click", clearNumbers);
document.getElementById("startBtn").addEventListener("click", startGame);
let startSquaresBtn = document.querySelector('.startSquares')
let resetBtn = document.querySelector('.X-box')
let multiplierBtn = document.querySelector('.wagerBtn')


changeUserBtn.addEventListener("click", function (event) {
  event.preventDefault();
  changeUsername();
});

startSquaresBtn.addEventListener("click", function (event) {
    event.preventDefault()
    startSquares()
    getNflAPI(globalOddsInfo)
})

resetBtn.addEventListener("click", function (event) {
    event.preventDefault()
    clearNumbers()
    clearSelectedOpenBoxes()
    clearOpen()
    q1Winner.innerHTML = '🏆'
    q2Winner.innerHTML = '🏆'
    q3Winner.innerHTML = '🏆'
    q4Winner.innerHTML = '🏆'
    localStorage.clear()
    location.reload();
})

multiplierBtn.addEventListener('click', (event) => {
   event.preventDefault()
   let userWager = document.querySelector('.wagerInput').value
   globalOddsInfo.wager = userWager
   const userNameArr = globalOddsInfo.userNameArr
   const wager = globalOddsInfo.wager
   wagerMultiplier(userNameArr, wager)
})

//Functions for tacking winning squares visually
function selectWinner(game, scoreCheck) {
  let winnerArray = [];
  let homeData = ''
  let awayData = ''
  let isGameStarted = ''

  if (scoreCheck === 0) {
  homeData = JSON.stringify(game.scores.home.total);
  awayData = JSON.stringify(game.scores.away.total);
  isGameStarted = game.game.status.short;
  }

  if (scoreCheck !== 0) {
    homeData = JSON.stringify(scoreCheck.homeCheck);
    awayData = JSON.stringify(scoreCheck.awayCheck);
  }

  if (isGameStarted !== "FT" || "NS") {
    const scoreObject = {
      homeSquareNum: homeData.charAt(homeData.length - 1),
      awaySquareNum: awayData.charAt(awayData.length - 1),
    };
    winnerArray.push(scoreObject);
    console.log("win array", winnerArray);
    console.log("home score parse", homeData.length);
    console.log("away score parse", awayData.length);
    highlightRedSquares(winnerArray, game, scoreCheck);
  }
}

function highlightRedSquares(winnerArray, game, scoreCheck) {
  let homeArray = [];
  let awayArray = [];
  let redSquares = document.querySelectorAll(".question-box");

  document.querySelectorAll('td').forEach((el) => {el.classList.remove('highlightWinner', 'winningSquare')})

  redSquares.forEach((num) => awayArray.push(num));
  //console.log(awayArray);
  let homeSplice = awayArray.splice(0, 10);
  homeArray.push(homeSplice);
  //console.log("homeArray", homeArray);
  //console.log("away compare", winnerArray[0].awaySquareNum);
  //console.log("Home Array: ", homeArray[0][1].innerHTML);
  for (var i = 0; i < awayArray.length; i++) {
    if (winnerArray[0].awaySquareNum === awayArray[i].innerHTML) {
      let winningAwaySquare = awayArray[i];
      let parent = winningAwaySquare.parentNode;
      //console.log(parent);
      let children = parent.children;
      //console.log(children);
      goldColumns(children);
    }
  }

  //console.log("Home Score", winnerArray[0].homeSquareNum);
  homeArray = homeArray[0];
  //console.log("new home array", homeArray);

    for (var s = 0; s < homeArray.length; s++) {
      if (winnerArray[0].homeSquareNum === homeArray[s].innerHTML) {
        let winningHomeSquare = homeArray[s];
        //console.log("Loop Text", winningHomeSquare);
        winningHomeSquare.classList.add("highlightWinner");
        //console.log("i: ", s);
        goldSquares(s, awayArray);
      }
    }

  function goldColumns(children) {
    for (var i = 0; i < children.length; i++) {
      let oneSquare = children[i];
      oneSquare.classList.add("highlightWinner");
    }
  }

  function goldSquares(s, awayArray) {
    //console.log("away", awayArray);
    //console.log("s", s);
    for (var i = 0; i < awayArray.length; i++) {
      let winningAwaySquare = awayArray[i];
      let parent = winningAwaySquare.parentNode;
      let child = parent.childNodes[s + 1];
      if (child.classList.contains("highlightWinner") === false) {
        //console.log(parent.classList.contains("highlightWinner"));
        child.classList.add("highlightWinner");
      } else if (child.classList.contains("highlightWinner") === true) {
        //console.log(parent.classList.contains("highlightWinner"));
        child.classList.add("winningSquare");
      }
    }
    recordWinner(game, scoreCheck);
  }
}

//record winner functions

let officialWins = []

function recordWinner(game, scoreCheck) {
    //console.log('record winner data: ', game);
    
    let allTD = document.querySelectorAll('td')
    allTD.forEach((sq) => {
       if(sq.classList.contains('winningSquare') === true) {
        console.log('*** WINNER ****: ', sq.textContent)
        setTimeout(() => {
          if(scoreCheck !== 0) {
            let quarterCheck = document.querySelector(`.${scoreCheck.quarter}Winner`)
            let sqWinner = sq.textContent
            quarterCheck.innerHTML = sqWinner
          }
        }, 500)
        
        officialWins.push(sq.textContent)
       }
    })
    if (officialWins.length <= 1 ) {
    winnerScoreBoard(officialWins, game);
  } else {
  officialWins.sort()
    for (var i=0; i < officialWins.length; i++) {
        if (officialWins[i] === officialWins[i+1]) {
            //console.log(officialWins.splice(i, i))
            //console.log(officialWins)
            winnerScoreBoard(officialWins, game)
        }
    }
   }
}

    let q1Winner = document.querySelector('.q1Winner')
    let q2Winner = document.querySelector('.q2Winner')
    let q3Winner = document.querySelector('.q3Winner')
    let q4Winner = document.querySelector('.q4Winner')
    

function winnerScoreBoard(officialWins, game) {
    //console.log('scoreboard data: ', game)
    //console.log(officialWins)
   officialWins.forEach((win) => {
let gameStartedID = game.game.id
   
      if(game.game.status.short !== 'NS' && game.scores.away.quarter_2 === null && game.scores.home.quarter_2 === null) {
        q1HasStarted = true
        if (!localStorage.getItem(`${gameStartedID}-q1HasStarted`)) {
          localStorage.setItem(`${gameStartedID}-q1HasStarted`, q1HasStarted)
        }
        q1Winner.innerHTML = ''
        q1Winner.innerHTML += win + '🏆'
        q2Winner.innerHTML = '🏆'
    q3Winner.innerHTML = '🏆'
    q4Winner.innerHTML = '🏆'
      } else if (game.scores.away.quarter_2 !== null && game.scores.home.quarter_2 !== null && game.scores.away.quarter_3 === null && game.scores.home.quarter_3 === null) {
        q2HasStarted = true
        if (!localStorage.getItem(`${gameStartedID}-q2HasStarted`)) {
          localStorage.setItem(`${gameStartedID}-q2HasStarted`, q2HasStarted)
        }
        q2Winner.innerHTML = ''
        q2Winner.innerHTML += win + '🏆'
    q3Winner.innerHTML = '🏆'
    q4Winner.innerHTML = '🏆'
      } else if (game.scores.away.quarter_3 !== null && game.scores.home.quarter_3 !== null && game.scores.away.quarter_4 === null && game.scores.home.quarter_4 === null) {
        q3HasStarted = true
        if (!localStorage.getItem(`${gameStartedID}-q3HasStarted`)) {
          localStorage.setItem(`${gameStartedID}-q3HasStarted`, q3HasStarted)
        }
        q3Winner.innerHTML = ''
        q3Winner.innerHTML += win + '🏆'
    q4Winner.innerHTML = '🏆'
      } else if (game.scores.away.quarter_4 !== null && game.scores.home.quarter_4 !== null) {
        q4HasStarted = true
        if (!localStorage.getItem(`${gameStartedID}-q4HasStarted`)) {
          localStorage.setItem(`${gameStartedID}-q4HasStarted`, q4HasStarted)
        }
        q4Winner.innerHTML = ''
        q4Winner.innerHTML += win + '🏆'
      } else {
        q1Winner.innerHTML = '🏆'
    q2Winner.innerHTML = '🏆'
    q3Winner.innerHTML = '🏆'
    q4Winner.innerHTML = '🏆'
        return;
      }
    })
   officialWins = []
   //console.log(officialWins)
}


//local save and game save functions
let TDs = document.querySelectorAll('td')

function saveGameData(globalOddsInfo) {
  //console.log('saving data')
  const userNameArr = globalOddsInfo.userNameArr

  if (!localStorage.getItem('userNameArr')) {
    localStorage.setItem('userNameArr', JSON.stringify(userNameArr))
  }
  

  userNameArr.forEach((user) => {
    const userSq = document.querySelector(`.${user}`).textContent
    const wagerAmount = document.querySelector(`.${user}-wager`).textContent
    const userTag = document.querySelector(`.${user}Tag`).textContent
    
      //console.log('saving user data')
      localStorage.setItem(`${user}Tag`, userTag)
      localStorage.setItem(`${user} Square`, userSq)
      localStorage.setItem(`${user} Wager`, wagerAmount)
  
  })

   let i = 0
  TDs.forEach((sq) => {
    //console.log('saving TD data')
     i++
     localStorage.setItem(`TR ${i}`, sq.textContent)
  })

  
  //console.log('saving game data')
  localStorage.setItem('Q1 Winner', q1Winner.textContent)
  localStorage.setItem('Q2 Winner', q2Winner.textContent)
  localStorage.setItem('Q3 Winner', q3Winner.textContent)
  localStorage.setItem('Q4 Winner', q4Winner.textContent)
}

function getGameData() {
  const userNameArr = JSON.parse(localStorage.getItem('userNameArr'))
  const oddsBoard = document.querySelector('#oddsCount')
const boardFiller = document.querySelector('.oddsTitles')

if(localStorage.getItem('selectedGame')) {
  let selectedGameID = localStorage.getItem('selectedGame')
  if (localStorage.getItem(`${selectedGameID}-q1HasStarted`)) {
    q1HasStarted = true
  }
  if (localStorage.getItem(`${selectedGameID}-q2HasStarted`)) {
    q2HasStarted = true
  }
  if (localStorage.getItem(`${selectedGameID}-q3HasStarted`)) {
    q3HasStarted = true
  }
  if (localStorage.getItem(`${selectedGameID}-q4HasStarted`)) {
    q4HasStarted = true
  }
}

   //console.log('parsed arr', userNameArr)
    if(!localStorage.getItem(`TR 1`)) {
        q1Winner.innerHTML = '🏆'
    q2Winner.innerHTML = '🏆'
    q3Winner.innerHTML = '🏆'
    q4Winner.innerHTML = '🏆'
        return;
    } else {
    let i = 0
    TDs.forEach((sq) => {
      i++
      sq.textContent = localStorage.getItem(`TR ${i}`)
      if (sq.textContent !== 'Open' && !sq.classList.contains('question-box')) {
        sq.classList.toggle("selected")
      }
    })
     userNameArr.forEach((user) => {

      if (userNameArr.length > 0) {

      const countContainer = document.createElement('div')
      const username = document.createElement('span')
      const userCount = document.createElement('span')
      const wagerAmount = document.createElement('span')
      oddsBoard.appendChild(countContainer)
      countContainer.appendChild(username)
      countContainer.appendChild(userCount)
      countContainer.appendChild(wagerAmount)
      boardFiller.classList.remove('boardFiller')
      username.classList.add(`${user}Tag`)
      userCount.classList.add(user)
      wagerAmount.classList.add(`${user}-wager`)
      countContainer.classList.add('oddsFlex')
      username.textContent = user
      
        //console.log('saving user data')
        username.textContent = localStorage.getItem(`${user}Tag`)
        userCount.textContent = localStorage.getItem(`${user} Square`)
        wagerAmount.textContent = localStorage.getItem(`${user} Wager`)
       }
     })
    q1Winner.textContent = localStorage.getItem('Q1 Winner')
    q2Winner.textContent = localStorage.getItem('Q2 Winner')
    q3Winner.textContent = localStorage.getItem('Q3 Winner')
    q4Winner.textContent = localStorage.getItem('Q4 Winner')
  }
}

getGameData();
