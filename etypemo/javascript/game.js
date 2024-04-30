import words from './utils/words.js'

function _getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// get DOM elements
const wordEl = document.querySelector('#word-guess')
const inputEl = document.querySelector('#word-input')
const timeEl = document.querySelector('#time')
const difficultyEl = document.querySelector('#difficulty')
const bestScoreEl = document.querySelector('#best-score')
const wordCountEl = document.querySelector('#word-count')
const modal = document.querySelector('#start-game-prompt')
const modalP = document.querySelector('#start-game-prompt p')

const scores = JSON.parse(localStorage.getItem('scores')) || [0]
const difficulties = ['Easy', 'Moderate', 'Hard']

let interval = null
let timeSeconds = 10
let difficulty = _getRandomFromArray(difficulties)
let wordCount = 0
let wordToGuess

function updateTime() {
  timeEl.innerText = timeSeconds
}

function updateWord() {
  wordEl.innerText = wordToGuess
}

function updateDifficulty() {
  difficultyEl.innerText = 'Difficulty: ' + difficulty
}

function updateWordCount() {
  wordCountEl.innerText = 'Word count: ' + wordCount
}

function resetInterval() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

function reset() {
  wordCount = 0
  timeSeconds = 11
  difficulty = 'Easy'
  updateWordCount()
}

function lose() {
  resetInterval()

  modal.style.display = 'block'
  modalP.innerText = 'Your score is ' + wordCount + '\nPress ENTER to continue'

  inputEl.value = ''

  if (!scores.includes(wordCount)) {
    scores.push(wordCount)
  }

  reset()

  localStorage.setItem(
    'scores',
    JSON.stringify(scores)
  )

}

function startTime() {
  function countdown() {
    timeSeconds--
    updateTime()

    if (timeSeconds <= 0) {
      lose()
    }
  }

  interval = setInterval(countdown, 1000)
}

function nextWord() {
  wordCount++
  updateWordCount()
  resetInterval()

  inputEl.value = ''

  difficulty = _getRandomFromArray(difficulties)

  timeSeconds =
    difficulty === 'Easy'
      ? timeSeconds + 3
      : difficulty === 'Moderate'
      ? timeSeconds + 2
      : timeSeconds + 1

  wordToGuess = _getRandomFromArray(words[difficulty])

  updateDifficulty()
  updateWord()
  startTime()
  updateTime()
}

updateTime()

function startGame() {
  wordToGuess = _getRandomFromArray(words[difficulty])

  bestScoreEl.innerText = 'Best: ' + Math.max(...scores)

  inputEl.value = ''
  inputEl.focus()

  resetInterval()
  updateWord()
  startTime()
  updateDifficulty()
}

inputEl.addEventListener('input', (event) => {
  if (event.target.value.toLowerCase().trim() === wordToGuess.toLowerCase()) {
    nextWord()
  }
})

export default startGame
