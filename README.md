# ECS162 HW 2 -- Game Arcade

## OVERVIEW
This website was created for ECS 162: Web Programming. The goal was to apply our new JavaScript knowledge (in combination with our previous HTML and CSS skills) to produce some games.

The games we have available are recreations of the New York Times **Connections** and **Wordle**, which were built from scratch. We also incorporated two open-source games! 

The first open-source game is called **eTypeMo**. We added to its word list, including adding a new difficulty called "insane". We also significantly changed the styling/organization to integrate it with the visuals of our site. Some code was modified to better align with the course-provided code quality guide.

The second open-source game is **Memory**. We added some visual changes like a message pop-up instead of an alert and a fade-out animation when tiles are correctly matched. Furthermore, the game has an added mechanic where you score can decrease from mistakes to raise the stakes and make the game more interesting. Tiles were converted into buttons for keyboard accessibility. Some code was modified to better align with the course-provided code quality guide.

## HOW TO PLAY
### Connections
There are 16 words and 4 categories. Each category contains 4 words that relate to each other under some "theme." The categories will be color-coded based on difficulty. From easiest to hardest, the colors are green, yellow, blue, and purple. The categories can be found in any order (i.e., you don't need to find them in a particular order). 

Click on the words to select them. After selecting 4 words, press "Submit" to check your answer. If your answer is correct, the category will appear. Otherwise, a message will be appear at the top. If only one word is incorrect, the message will say so. If more than one word does not belong, the message will simply say "incorrect". If you make 4 mistakes, the 4 categories will automatically be revealed. You can also shuffle the remaining words, since that might help you see some patterns in the words. Don't worry about accidentally repeating an incorrect guess -- if you've already made that guess, it won't count as a mistake! There are currently 5 puzzles available. A puzzle will be randomly chosen everytime you play the game. Try to play them all!

### Wordle
You have 6 tries to guess what the mystery 5-letter word is. Type your 5-letter guess with the keyboard, or click on the buttons. When you're ready, press "Guess". Letters that are in the word and in the correct position of the word will be highlighted in blue-green.

Letters that are in the word but NOT in the correct position will be highlighted in yellow. Letters that are NOT in the word will be highlighted with gray.

A record of the letter highlighting will be shown at the bottom of the page to help keep track of which letters worked and didn't work. There are currently 32 possible words that will be randomly chosen from when starting the game.

### eTypeMo
After starting the game, a word will appear in the middle of the screen. You can immediately start typing in the word in the text box without having to click on it (mind the timer!). Type the words as fast as you can! If you finish typing within the time limit, a new word will appear, and your score will update.
If you run out of time, the game will end.

There are different difficulties for the words -- easy, moderate, and hard. The difficulty/word will be chosen randomly. As you successfully type more words,
you'll get extra seconds added to your time remaining (depending on the word's difficulty). Try to beat the best score!

### Memory
There are 12 tiles and 6 different kinds of tiles. Click on a tile to reveal what pattern it has. After you click two tiles, you can see if you matched the tiles. If you matched them correctly, your score will increase. If you make a mistake, the tiles will become blank again, and your score will decrease (your score can never be negative). See how high a score you can get!

## FEATURES
We used a clean, aesthetic theme with a limited color palette for a unified, coherent appearance. Minimalistic icons were created in Canva for each game to contribute to this look.

Each page with a game has a "Return to Game Selection" button on each page to redirect you to the home page. You can also click the title "Game Arcade" at the top.

Every page has keyboard accessibility in mind by switching certain interactable elements to buttons.

The audience of this arcade is young adults interested in puzzle-like games and challenges.

## DESIGN PROCESS
For the most part, we worked on separate games to streamline the process.

## CHALLENGES
We faced difficulty dealing with displays (especially with grid and flex boxes) and responsiveness. We utilized `vw` as a measurement and looked into/experimented with the different properties of these elements to get the desired results.

There was also difficulty making animations work as intended. We ended up doing some simpler animations to priortize functionality over visuals.

## LICENSING
This project is under the MIT license. To see the license is more detail, see the `LICENSE` file in the root directory.
