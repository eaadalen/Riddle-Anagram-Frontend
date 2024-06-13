import './long-prompt-view.scss'
import { useState, useEffect } from 'react';
import Sortable from 'sortablejs';

export const LongPromptView = ({ prompt, lettersSolved, sendDataToLP }) => {
  const [finalAnswer, setFinalAnswer] = useState('')
  const [locked, setLocked] = useState(false)
  const [guessesRemaining, setGuessesRemaining] = useState(4)
  const [guessRecord, setGuessRecord] = useState([])

  useEffect(() => {
    if (finalAnswer === prompt.Answer) {
      guessRecord.push(finalAnswer)
      sendDataToLP(guessRecord)
      setLocked(true)
    }
    else {
      setGuessesRemaining(prev => prev - 1)
      if (finalAnswer != '') {
        guessRecord.push(finalAnswer)
      }
      if (guessesRemaining === 1) {
        sendDataToLP(guessRecord)
      }
    }
  }, [finalAnswer])

  useEffect(() => {
    Sortable.create(longPromptAnswer, {});
    window.addEventListener('keyup', event => handleSubmit(event))
  }, [])

  const handleSubmit = (event) => {
    if (event.key === 'Enter') {
      let letters = ''
      document.getElementById('longPromptAnswer').childNodes.forEach((item) => {
        letters = letters + item.textContent
      })
      setFinalAnswer(letters)
    }
  }

  const longPromptArray = (guess, answer) => {  
    let returnValue = []
    for (let i = 0; i < answer.length; i++) {
      if (guess.charAt(i) === '') {
        returnValue.push(['', i])
      }
      else {
        returnValue.push([guess.charAt(i), i])
      }
    }
    return returnValue
  }

  const strikesArray = (strikes) => {  
    let returnValue = []
    for (let i = 0; i < strikes; i++) {
      returnValue.push('⬤')
    }
    return returnValue
  }

  return (
    <div>
      <div className='prompt'>
        {prompt.longPrompt}
      </div>
      {!locked &&
        <div id='longPromptAnswer' className='long-prompt-answer'>
          {longPromptArray(finalAnswer == '' ? lettersSolved : finalAnswer, prompt.Answer).map((letter) => (
            <div key={Math.random()} className='long-prompt-letter'>{letter[0]}</div>
          ))}
        </div>
      }
      {locked &&
        <div id='none' className='long-prompt-answer'>
          {longPromptArray(finalAnswer == '' ? lettersSolved : finalAnswer, prompt.Answer).map((letter) => (
            <div key={Math.random()} className='long-prompt-letter'>{letter[0]}</div>
          ))}
        </div>
      }
      <div className='unscramble'>
        Unscramble the letters above to answer the riddle
      </div>
      <div className='unscramble-bottom'>
        Guesses Remaining
        <div className='guessesRemaining'>
          {strikesArray(guessesRemaining).map((strike) => (
            <div key={Math.random()} className='guess'>{strike}</div>
          ))}
        </div>
      </div>
    </div>
  )
}