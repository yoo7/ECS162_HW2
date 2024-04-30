import startGame from './javascript/game.js'
;(function () {
  const startModal = document.querySelector('#start-game-prompt')
  startModal.style.display = 'block'

  const startButton = document.querySelector('button#start-game')

  function continueGame() {
    startModal.style.display = 'none'
    startGame()
  }

  startButton.addEventListener('click', () => {
    continueGame()

    if (startButton.innerText !== 'Play Again') {
      startButton.innerText = 'Play Again'
    }
  })

  window.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') {
      return
    }

    if (startModal.style.display === 'block') {
      continueGame()
    }
  })
})()
