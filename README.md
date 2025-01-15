# <Sports-Squares>

## Description

Version with backend switched to PostgresSQL compatable. For the original version please visit [Here](https://github.com/KyleGru/sports-squares).

Who doesn't like organized gambling? Sports Squares is a fun interactive application that lets you, the user, participate in the sports squares game. The game involves a grid divided into rows and columns, typically 10 by 10, resulting in 100 squares. One team is represented by the rows, and the other team is represented by columns. Squares can be purchased and users can select whatever squares they choose. Once all the squares are sold or when all players have purchased and selected squares to their liking. The game can begin!

Numbers ranging from 0 to 9 are randomly assigned to the rows and columns. Each row and column will have a unique combination of numbers.

At the end of each quarter (first, second, third, and final), the score of the game is matched to the corresponding numbers on the grid. For example, if at the end of the first quarter the home team has 7 points and the away team has 3 points, the square where the row is labeled "7" and the column is labeled "3" is the winning square for that quarter. This process is repeated for each quarter and sometimes for the final score as well.

Participants who have squares corresponding to the last digit of the scores for each quarter or the final score win the prizes. Prizes are typically awarded for each quarter, making multiple opportunities to win throughout the game. The largest prize is allotted for the final score.

## Installation

Download the Github repository. From there do an npm install in the terminal and npm run start to get the server going on a port.
Node.js and Heroku CLI are needed to run locally

## Usage

Navigate to the website to begin by clicking the link below. Once there login or sign up for an account. Once you are logged in choose NFL games to launch the board. 

Select your squares before the sports event begins. Then, use the buttons to generate the outside numbers at random. Once the board is setup, hit Start Game which will disable all buttons, except the reset button, and allow you to choose a game to play. Note, games are generated based on the current day and each day may not have a game available. The winners are then selected each quarter based on the last number of each score for the home and away team, and the square that matches those numbers on the grid which will be blinking green.

![alt text](./Assets/Screenshot%202024-02-12%20205338.png)

Deployed Site via Heroku: [https://sports-sq-fd69cbb2824b.herokuapp.com/](https://football-sports-squares-c041155a91d0.herokuapp.com/)

## Tests

N/A

## Credits

Kyle Gruschow
https://github.com/KyleGru

Zachary Smith
https://github.com/smithz852

Ryan Bedard
https://github.com/ryanjbedard

## License
MIT License

Copyright (c) 2024 ryanjbedard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---   
